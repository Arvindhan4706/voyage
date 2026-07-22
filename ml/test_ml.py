import os
import pytest
from fastapi.testclient import TestClient
from app import app, MODEL_PATH

client = TestClient(app)

def test_model_file_exists():
    """Verify that the trained model binary exists in the models directory."""
    assert os.path.exists(MODEL_PATH), f"Model file not found at {MODEL_PATH}"

def test_health_endpoint():
    """Test the FastAPI /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "healthy"
    assert json_data["model_loaded"] is True

def test_predict_endpoint_valid_input():
    """Test the FastAPI /predict endpoint with valid numerical features."""
    payload = {
        "distance_km": 1200.0,
        "days_to_departure": 14.0,
        "day_of_week": 2.0,
        "demand_index": 1.2
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert "predicted_price_inr" in json_data
    assert isinstance(json_data["predicted_price_inr"], int)
    assert json_data["model_version"] == "v1.0"

def test_predict_endpoint_invalid_input():
    """Test validation handling for invalid feature inputs."""
    payload = {
        "distance_km": "invalid_string",
        "days_to_departure": 14.0,
        "day_of_week": 2.0,
        "demand_index": 1.2
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422  # Unprocessable Entity
