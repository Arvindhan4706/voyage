import sys
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
import __main__

app = FastAPI(title="VoyageAI Price Predictor MLOps Backend")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from train import SimpleLinearRegressor
__main__.SimpleLinearRegressor = SimpleLinearRegressor

# Load model globally on startup
MODEL_PATH = os.path.join(BASE_DIR, "models", "baseline_model_v1.pkl")
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    print(f"Warning: Could not load model from {MODEL_PATH}: {e}")

class PredictionRequest(BaseModel):
    distance_km: float
    days_to_departure: float
    day_of_week: float
    demand_index: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict")
def predict_price(request: PredictionRequest):
    if model is None:
        return {"error": "Model not loaded"}
    
    # Extract features matching the model's training inputs
    X = [[
        request.distance_km,
        request.days_to_departure,
        request.day_of_week,
        request.demand_index
    ]]
    
    # Predict price
    prediction = model.predict(X)[0]
    
    # Return as standard JSON
    return {
        "predicted_price_inr": round(prediction),
        "model_version": "v1.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
