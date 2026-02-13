import pandas as pd
import requests
import json
import os
import time



# Charger le CSV avec toutes les villes / zones
zones = pd.read_csv("zones_world_major.csv")

# Liste pour stocker toutes les données
weather_data = []

# Boucle sur chaque zone pour récupérer les données météo
for index, row in zones.iterrows():
    zone_id = row['zone_id']
    lat = row['latitude']
    lon = row['longitude']

    url = (
    "https://api.open-meteo.com/v1/forecast"
    f"?latitude={lat}&longitude={lon}"
    "&daily=precipitation_sum,temperature_2m_max,temperature_2m_min"
    "&forecast_days=7"
    "&timezone=auto"
    )

    try:
        response = requests.get(url)
        data = response.json()

        # Ajouter les informations de la zone
        weather_data.append({
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "weather": data
        })

        print(f"[OK] Données météo récupérées pour {zone_id}")

    except Exception as e:
        print(f"[ERREUR] Impossible de récupérer les données pour {zone_id}: {e}")

    # Petite pause pour éviter de saturer l'API
    time.sleep(0.5)

# Sauvegarder toutes les données dans un JSON global
with open("weather_all_world.json", "w") as f:
    json.dump(weather_data, f, indent=2)

print("✅ Ingestion météo terminée pour toutes les zones.")
