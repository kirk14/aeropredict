# AeroPredict - Predictive Maintenance for Jet Engines

AeroPredict is a cutting-edge predictive maintenance application powered by Deep Learning. It utilizes a Temporal Convolutional Network (TCN) to predict the Remaining Useful Life (RUL) of NASA CMAPSS Turbofan Jet Engines, helping engineers monitor engine health and prevent failures.

## 🚀 Features

- **Deep Learning Model**: Uses a trained TCN model (`rul_model.h5`) for accurate RUL predictions.
- **Real-time Analysis**: Simulates live engine data streams using NASA CMAPSS test datasets.
- **Health Monitoring**: Calculates dynamic health scores and categorizes engine status (Healthy, Warning, Critical).
- **Interactive Dashboard**: Modern React frontend with 3D visualizations and real-time data plotting.
- **Safety Buffers**: Implements safety factors to ensure conservative and reliable predictions for maintenance scheduling.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D & Animation**: Three.js (@react-three/fiber), Spline, Framer Motion
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **ML/AI**: TensorFlow/Keras, Scikit-learn
- **Data Processing**: Pandas, NumPy
- **Server**: Uvicorn

## 📦 Project Structure

```
├── backend/            # FastAPI backend, ML models, and data
│   ├── main.py         # API entry point
│   ├── rul_model.h5    # Trained Deep Learning model
│   ├── scaler.pkl      # Data scaler
│   └── ...
├── frontend/           # React frontend application
│   ├── src/            # Source code
│   └── ...
└── ...
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1️⃣ Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the backend server:

```bash
python main.py
# Server running at http://0.0.0.0:8000
```

### 2️⃣ Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
# Frontend running at http://localhost:5173 (usually)
```

## 🧠 Model & Data

The application currently supports the **FD001** dataset from the NASA CMAPSS collection, simulating conditions for High-Pressure Compressors (HPC) degradation.

- **Input Window**: Last 60 cycles of sensor data.
- **Sensors Used**: 14 key sensors (s2, s3, s4, s7, s8, s9, s11, s12, s13, s14, s15, s17, s20, s21).

## ☁️ Deployment

The project includes configuration for deployment on **Vercel** (`vercel.json`). Ensure both frontend and backend build commands are properly configured in your Vercel project settings.
