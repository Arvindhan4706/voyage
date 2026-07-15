from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os

app = FastAPI(title="VoyageAI Price Predictor MLOps Backend")

# We define a dummy regressor class here so pickle can load it
import math
class SimpleLinearRegressor:
    def __init__(self):
        self.weights = []
        self.bias = 0
        self.features = []

    def predict(self, X):
        X_norm = [[(x - m)/s for x, m, s in zip(row, self.means, self.stds)] for row in X]
        return [sum(w * x for w, x in zip(self.weights, row)) + self.bias for row in X_norm]

# Load model globally on startup
MODEL_PATH = "models/baseline_model_v1.pkl"
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    print(f"Warning: Could not load model: {e}")

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
