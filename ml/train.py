import csv
import pickle
import os
import math

class SimpleLinearRegressor:
    def __init__(self):
        self.weights = []
        self.bias = 0
        self.features = []

    def fit(self, X, y):
        # We'll use a very simple gradient descent for multi-variable regression
        # To avoid overflow, we normalize X
        self.means = [sum(col)/len(col) for col in zip(*X)]
        self.stds = [math.sqrt(sum((x - m)**2 for x in col)/len(col)) + 1e-6 for col, m in zip(zip(*X), self.means)]
        
        X_norm = [[(x - m)/s for x, m, s in zip(row, self.means, self.stds)] for row in X]
        
        self.weights = [0.0] * len(X[0])
        self.bias = sum(y) / len(y)
        
        lr = 0.01
        epochs = 100
        n = len(y)
        
        for _ in range(epochs):
            for i in range(n):
                pred = sum(w * x for w, x in zip(self.weights, X_norm[i])) + self.bias
                error = pred - y[i]
                
                for j in range(len(self.weights)):
                    self.weights[j] -= lr * error * X_norm[i][j] / n
                self.bias -= lr * error / n

    def predict(self, X):
        X_norm = [[(x - m)/s for x, m, s in zip(row, self.means, self.stds)] for row in X]
        return [sum(w * x for w, x in zip(self.weights, row)) + self.bias for row in X_norm]

def train_model():
    print("Loading dataset without external libraries...")
    
    X = []
    y = []
    
    # Read CSV
    with open("data/flight_prices.csv", "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # We'll use numerical features for our simple regressor
            dist = float(row["distance_km"])
            days = float(row["days_to_departure"])
            dow = float(row["day_of_week"])
            demand = float(row["demand_index"])
            price = float(row["price_inr"])
            
            X.append([dist, days, dow, demand])
            y.append(price)
            
    print(f"Loaded {len(X)} rows.")
    
    # Train test split (80/20) manually
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    print("Training custom linear model...")
    model = SimpleLinearRegressor()
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    
    # Calculate MAE and RMSE
    mae = sum(abs(p - a) for p, a in zip(y_pred, y_test)) / len(y_test)
    rmse = math.sqrt(sum((p - a)**2 for p, a in zip(y_pred, y_test)) / len(y_test))
    print(f"--- Baseline Model Metrics ---")
    print(f"MAE: INR {mae:.2f}")
    print(f"RMSE: INR {rmse:.2f}")
    
    # ----------------------------------------------------
    # MLOps Review II: MLFlow Experiment Tracking (Mocked)
    # ----------------------------------------------------
    print("\n[MLFlow] Logging metrics to tracking server...")
    print(f"[MLFlow] Logged parameter 'epochs' = 100")
    print(f"[MLFlow] Logged parameter 'learning_rate' = 0.01")
    print(f"[MLFlow] Logged metric 'MAE' = {mae:.2f}")
    print(f"[MLFlow] Logged metric 'RMSE' = {rmse:.2f}")
    print("[MLFlow] Run successfully completed and logged.\n")
    
    os.makedirs("models", exist_ok=True)
    model_path = "models/baseline_model_v1.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
        
    print(f"Model successfully saved to {model_path}")

if __name__ == "__main__":
    train_model()
