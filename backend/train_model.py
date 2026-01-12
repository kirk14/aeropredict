import pandas as pd
import xgboost as xgb
import pickle
import numpy as np

# --- CONFIGURATION ---
TRAIN_FILE = 'train_FD001.txt'
MODEL_FILE = 'rul_model.pkl'

COLS = ['id', 'cycle', 'setting1', 'setting2', 'setting3', 's1', 's2', 's3',
        's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14',
        's15', 's16', 's17', 's18', 's19', 's20', 's21']

# Standard Noise Reduction
DROP_COLS = ['setting3', 's1', 's5', 's6', 's10', 's16', 's18', 's19']

def train():
    print(f">>> 1. Loading Data...")
    df = pd.read_csv(TRAIN_FILE, sep=r'\s+', header=None, index_col=False)
    if df.shape[1] > 26: df = df.iloc[:, :26]
    df.columns = COLS

    print(">>> 2. Engineering Features...")
    max_cycle = df.groupby('id')['cycle'].max().reset_index()
    max_cycle.columns = ['id', 'max']
    df = df.merge(max_cycle, on='id', how='left')
    df['RUL'] = df['max'] - df['cycle']
    df.drop('max', axis=1, inplace=True)

    # CLIP RUL at 125 (Still necessary for global accuracy)
    df['RUL'] = df['RUL'].clip(upper=125)

    features = [c for c in COLS if c not in ['id', 'cycle', 'RUL'] + DROP_COLS]
    X = df[features]
    y = df['RUL']

    print(f">>> 3. Training Aggressive Model...")
    
    # --- AGGRESSIVE CONFIGURATION ---
    # We increase depth to catch "sharp" failure drops like Engine 18
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=300,       # Fewer trees but...
        learning_rate=0.05,     # ...Faster learning to capture variance
        max_depth=6,            # Deeper trees (Key change: 3 -> 6)
        subsample=0.8,          # See more data per tree
        colsample_bytree=0.8,
        n_jobs=-1
    )
    model.fit(X, y)

    print(">>> 4. Saving Model...")
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump({'model': model, 'features': features}, f)
    
    print(f"✅ DONE: Aggressive Model saved to {MODEL_FILE}")

if __name__ == "__main__":
    train()