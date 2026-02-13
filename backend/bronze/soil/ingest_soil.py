import pandas as pd
import requests
import os
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# =========================
# CONFIGURATION
# =========================
ZONES_PATH = "../weather/zones_world_major.csv"
OUTPUT_PATH = "soil_data_world.csv"
SOIL_DEPTH = "0-5cm"

# =========================
# SESSION HTTP ROBUSTE
# =========================
session = requests.Session()
retry = Retry(
    total=3,
    backoff_factor=2,
    status_forcelist=[429, 500, 502, 503, 504]
)
adapter = HTTPAdapter(max_retries=retry)
session.mount("https://", adapter)

# =========================
# FONCTION EXTRACTION SOL
# =========================
def get_soil_value(data, soil_name):
    layers = data.get("properties", {}).get("layers", [])
    
    for layer in layers:
        if layer.get("name") == soil_name:
            for depth in layer.get("depths", []):
                mean = depth.get("values", {}).get("mean")
                if mean is not None:
                    return mean
    return None

# =========================
# INGESTION
# =========================
zones = pd.read_csv(ZONES_PATH)
soil_list = []

for _, row in zones.iterrows():
    zone_id = row["zone_id"]
    lat = row["latitude"]
    lon = row["longitude"]

    url = (
        "https://rest.isric.org/soilgrids/v2.0/properties/query"
        f"?lat={lat}&lon={lon}"
    )
    # Valeurs fallback réalistes (%)
    DEFAULT_CLAY = 30
    DEFAULT_SAND = 40
    DEFAULT_SILT = 30
    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        clay = get_soil_value(data, "clay") or DEFAULT_CLAY
        sand = get_soil_value(data, "sand") or DEFAULT_SAND
        silt = get_soil_value(data, "silt") or DEFAULT_SILT

        if clay is None or sand is None or silt is None:
            raise ValueError("Valeurs sol manquantes")

        # Conversion g/kg → %
        clay_pct = clay / 10
        sand_pct = sand / 10
        silt_pct = silt / 10

        # Classification USDA simplifiée
        if clay_pct >= 40:
            soil_type = "Clay"
        elif sand_pct >= 70:
            soil_type = "Sand"
        elif silt_pct >= 50:
            soil_type = "Silt"
        elif 27 <= clay_pct < 40:
            soil_type = "Clay Loam"
        elif 52 <= sand_pct < 70:
            soil_type = "Sandy Loam"
        else:
            soil_type = "Loam"

        # Capacité de rétention d’eau (approximation réaliste)
        water_capacity = (
            clay_pct * 0.6 +
            silt_pct * 0.3 +
            sand_pct * 0.1
        )

        soil_list.append({
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "clay_gkg": clay,
            "sand_gkg": sand,
            "silt_gkg": silt,
            "soil_type": soil_type,
            "water_capacity": round(water_capacity, 2)
        })

        print(f"[OK] {zone_id}")

    except Exception as e:
        print(f"[ERREUR] {zone_id} : {e}")
        soil_list.append({
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "clay_gkg": None,
            "sand_gkg": None,
            "silt_gkg": None,
            "soil_type": "Unknown",
            "water_capacity": None
        })

    time.sleep(1)

# =========================
# SAUVEGARDE
# =========================
soil_df = pd.DataFrame(soil_list)
soil_df.to_csv(OUTPUT_PATH, index=False)

print("✅ Ingestion Soil terminée avec succès")
