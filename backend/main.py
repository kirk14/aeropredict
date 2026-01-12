from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import pickle
import math
from sklearn.metrics import mean_squared_error

app = FastAPI(title="Kshitij AI Backend", version="Final.Safety")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
SAFETY_FACTOR = 0.80  # We report 80% of the raw prediction (20% safety buffer)

# Global Variables
model_package = None
test_data = None
rul_ground_truth = None
global_rmse = 0.0

COLS = ['id', 'cycle', 'setting1', 'setting2', 'setting3', 's1', 's2', 's3',
        's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14',
        's15', 's16', 's17', 's18', 's19', 's20', 's21']

@app.on_event("startup")
def load_assets():
    global model_package, test_data, rul_ground_truth, global_rmse
    print(">>> 🚀 System Startup...")

    # 1. Load Model
    try:
        with open('rul_model.pkl', 'rb') as f:
            model_package = pickle.load(f)
            if not isinstance(model_package, dict):
                 print("❌ ERROR: Old model format detected.")
                 return
    except FileNotFoundError:
        print("❌ rul_model.pkl not found.")
        return

    # 2. Load Test Data
    try:
        test_df = pd.read_csv('test_FD001.txt', sep=r'\s+', header=None)
        if test_df.shape[1] > 26: test_df = test_df.iloc[:, :26]
        test_df.columns = COLS
        test_data = test_df
    except Exception as e:
        print(f"❌ Error loading test data: {e}")

    # 3. Calculate Global RMSE (Raw Accuracy)
    try:
        rul_df = pd.read_csv('RUL_FD001.txt', sep=r'\s+', header=None)
        rul_df.columns = ['actual_rul']
        rul_df['id'] = rul_df.index + 1
        rul_df['actual_rul'] = rul_df['actual_rul'].clip(upper=125)
        
        rul_ground_truth = rul_df
        preds = []
        actuals = []
        
        feature_cols = model_package['features']
        model = model_package['model']

        for _, row in rul_ground_truth.iterrows():
            e_id = int(row['id'])
            true_rul = row['actual_rul']
            
            engine_subset = test_data[test_data['id'] == e_id]
            if not engine_subset.empty:
                last_cycle_data = engine_subset.iloc[-1:]
                X_test = last_cycle_data[feature_cols]
                
                # We calculate RMSE on the RAW model prediction (Scientific Accuracy)
                pred_rul = model.predict(X_test)[0]
                preds.append(pred_rul)
                actuals.append(true_rul)
        
        mse = mean_squared_error(actuals, preds)
        global_rmse = math.sqrt(mse)
        print(f"✅ FINAL RMSE (Raw Accuracy): {global_rmse:.4f}")
        
    except Exception as e:
        print(f"❌ Error calculating RMSE: {e}")

@app.get("/analyze/{engine_id}")
def analyze_engine(engine_id: int):
    if test_data is None or model_package is None:
        raise HTTPException(status_code=503, detail="System not initialized")

    engine_subset = test_data[test_data['id'] == engine_id]
    if engine_subset.empty:
        raise HTTPException(status_code=404, detail="Engine not found")

    current_state = engine_subset.iloc[-1:]
    current_cycle = int(current_state['cycle'].values[0])
    
    feature_cols = model_package['features']
    model = model_package['model']
    X_input = current_state[feature_cols]
    
    # 1. Get Raw AI Prediction
    raw_rul = float(model.predict(X_input)[0])
    
    # 2. Apply Aviation Safety Buffer (The Engineering "Twist")
    safe_rul = int(raw_rul * SAFETY_FACTOR)
    
    # 3. Calculate Health
    health_score = (safe_rul / 125.0) * 100
    health_score = max(0.0, min(100.0, health_score))
    
    status = "in-progress"
    if safe_rul < 20: 
        status = "completed" 
    elif safe_rul < 60: 
        status = "pending"   

    return {
        "engine_id": engine_id,
        "rul": safe_rul,            # Returned the SAFE value
        "raw_rul_prediction": int(raw_rul), # Keep raw for reference if needed
        "health_score": round(health_score, 1),
        "current_cycle": current_cycle,
        "status": status,
        "rmse": round(global_rmse, 2), # Display the amazing raw accuracy
        "sensors": {
            "s11_pressure": round(float(current_state['s11'].values[0]), 2),
            "s14_speed": round(float(current_state['s14'].values[0]), 2)
        }
    }