import csv
import random
import os

def generate_flight_data(num_samples=10000):
    random.seed(42)
    os.makedirs("data", exist_ok=True)
    
    cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Goa", "Pune"]
    
    with open("data/flight_prices.csv", "w", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["source", "destination", "distance_km", "days_to_departure", "day_of_week", "demand_index", "price_inr"])
        
        for _ in range(num_samples):
            source = random.choice(cities)
            destination = random.choice([c for c in cities if c != source])
            
            distance_km = round(random.uniform(200, 3000), 2)
            days_to_departure = int(random.expovariate(1/30))
            days_to_departure = min(days_to_departure, 180)
            
            day_of_week = random.randint(0, 6)
            demand_index = round(min(max(random.gauss(1.0, 0.2), 0.5), 2.0), 2)
            
            rate_per_km = 4.5
            base_price = distance_km * rate_per_km
            
            dow_modifier = 1.0
            if day_of_week in [0, 6]: dow_modifier = 1.25
            if day_of_week in [2, 3]: dow_modifier = 0.90
            
            advance_modifier = 1.0
            if days_to_departure < 7: advance_modifier = 1.5
            elif days_to_departure < 21: advance_modifier = 1.2
            elif days_to_departure > 60: advance_modifier = 0.85
            
            noise = random.gauss(0, 1000)
            
            price_inr = base_price * dow_modifier * advance_modifier * demand_index + noise
            price_inr = max(round(price_inr), 2000)
            
            writer.writerow([source, destination, distance_km, days_to_departure, day_of_week, demand_index, price_inr])

    print(f"Generated {num_samples} samples and saved to data/flight_prices.csv")

if __name__ == "__main__":
    generate_flight_data()
