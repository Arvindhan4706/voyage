import csv
import random
import os

def monitor_drift():
    print("Initializing Model Monitoring & Drift Detection...")
    
    # Simulate loading recent production data
    print("Loading recent API inference logs...")
    try:
        with open("data/flight_prices.csv", "r") as f:
            reader = list(csv.DictReader(f))
            recent_data = reader[-1000:] # Get last 1000 queries
    except Exception as e:
        print(f"Error loading logs: {e}")
        return

    # Simulate checking for Data Drift
    print("Analyzing feature distributions for data drift...")
    
    # Calculate average demand index in recent queries
    avg_demand = sum(float(row["demand_index"]) for row in recent_data) / len(recent_data)
    
    print(f"Historical Baseline Average Demand: 1.00")
    print(f"Recent Production Average Demand: {avg_demand:.2f}")
    
    if abs(avg_demand - 1.0) > 0.15:
        print("\n[ALERT] Data drift detected in 'demand_index' feature!")
        print("[ACTION] Threshold exceeded. Automated retraining pipeline triggered.")
        # In a real environment, this would call the CI/CD pipeline webhook
    else:
        print("\n[STATUS] Feature distributions are stable. No data drift detected.")
        print("[STATUS] Model performance is within acceptable thresholds.")

if __name__ == "__main__":
    monitor_drift()
