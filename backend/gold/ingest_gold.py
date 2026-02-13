import pandas as pd
import os

# =========================
# CONFIGURATION
# =========================
SILVER_PATH = "../silver/silver_data_world.csv"
GOLD_OUTPUT_PATH = "gold_daily_risk.csv"

# =========================
# 1️⃣ Charger Silver
# =========================
silver_df = pd.read_csv(SILVER_PATH)
silver_df["date"] = pd.to_datetime(silver_df["date"])

# =========================
# 2️⃣ Ajouter semaine (facultatif)
# =========================
silver_df["week_number"] = 1  # toute la semaine = semaine 1

# =========================
# 3️⃣ Fonction pour catégoriser les risques
# =========================
def categorize_risk(value):
    if value >= 0.7:
        return "High"
    elif value >= 0.3:
        return "Medium"
    else:
        return "Low"

silver_df["flood_risk_category"] = silver_df["flood_risk"].apply(categorize_risk)
silver_df["drought_risk_category"] = silver_df["drought_risk"].apply(categorize_risk)

# =========================
# 4️⃣ Préparer Gold quotidien
# =========================
gold_daily = silver_df[[
    "zone_id",
    "latitude",
    "longitude",
    "date",
    "precipitation",
    "temperature_max",
    "temperature_min",
    "flood_risk",
    "flood_risk_category",
    "drought_risk",
    "drought_risk_category",
    "week_number"
]]

# =========================
# 5️⃣ Sauvegarde Gold
# =========================
gold_daily.to_csv(GOLD_OUTPUT_PATH, index=False)

print(f"✅ Gold quotidien avec catégories de risque créé : {GOLD_OUTPUT_PATH}")
