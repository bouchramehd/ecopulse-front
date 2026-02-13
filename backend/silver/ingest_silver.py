import pandas as pd
import json
import os
from datetime import datetime

# =========================
# CONFIGURATION
# =========================
BRONZE_WEATHER_PATH = "../bronze/weather/weather_all_world.json"
BRONZE_SOIL_PATH = "../bronze/soil/soil_data_world.csv"
SILVER_OUTPUT_PATH = "silver_data_world.csv"

# ----------------------
# 1️⃣ Charger Weather
# ----------------------
with open(BRONZE_WEATHER_PATH, "r") as f:
    weather_data = json.load(f)

weather_list = []

for zone in weather_data:
    zone_id = zone.get("zone_id")
    lat = zone.get("latitude")
    lon = zone.get("longitude")
    
    daily = zone.get("weather", {}).get("daily", {})
    times = daily.get("time", [])
    precipitation = daily.get("precipitation_sum", [])
    temp_max = daily.get("temperature_2m_max", [])
    temp_min = daily.get("temperature_2m_min", [])
    
    # Boucle sur les jours
    for i in range(len(times)):
        weather_list.append({
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "date": times[i],
            "precipitation": precipitation[i] if i < len(precipitation) else 0,
            "temperature_max": temp_max[i] if i < len(temp_max) else None,
            "temperature_min": temp_min[i] if i < len(temp_min) else None
        })

weather_df = pd.DataFrame(weather_list)

# Conversion date
weather_df["date"] = pd.to_datetime(weather_df["date"])

# ----------------------
# 2️⃣ Charger Soil
# ----------------------
soil_df = pd.read_csv(BRONZE_SOIL_PATH)
soil_df.fillna({
    "clay": 30,
    "sand": 40,
    "silt": 30,
    "soil_type": "Loam",
    "water_capacity": 35
}, inplace=True)

# ----------------------
# 3️⃣ Jointure Weather + Soil
# ----------------------
silver_df = pd.merge(weather_df, soil_df, on=["zone_id", "latitude", "longitude"], how="left")

# ----------------------
# 4️⃣ Création indicateurs simples
# ----------------------
silver_df["flood_risk"] = silver_df["precipitation"] / (silver_df["water_capacity"] + 0.1)
silver_df["flood_risk"] = silver_df["flood_risk"].apply(lambda x: min(x, 1.0))

silver_df["drought_risk"] = 1 - (silver_df["precipitation"] / (silver_df["water_capacity"] + 0.1))
silver_df["drought_risk"] = silver_df["drought_risk"].apply(lambda x: max(x, 0.0))

# ----------------------
# 5️⃣ Sauvegarde Silver
# ----------------------
silver_df.to_csv(SILVER_OUTPUT_PATH, index=False)
print(f"✅ Silver layer créé : {SILVER_OUTPUT_PATH}")
