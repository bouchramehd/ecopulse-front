# 🌍 EcoPulse – Environmental Risk Monitoring Dashboard

EcoPulse is a Big Data environmental monitoring application designed to analyze climate-related risks such as floods and droughts.

The system integrates heterogeneous environmental data and produces analytical indicators to support decision-making and proactive risk management.

---

## 🏗 Architecture

EcoPulse follows a modern data architecture:

### 🔹 Bronze Layer (Raw Data)
- CSV files (precipitation, temperature, soil data)
- JSON weather alerts
- Sensor logs
- Relational database data

### 🔹 Silver Layer (Processing)
- Data cleaning
- Data harmonization
- Enrichment using Spark

### 🔹 Gold Layer (Analytics)
- Flood risk calculation
- Drought risk calculation
- Aggregated daily indicators
- Risk categorization (Low / Medium / High)

---

## ⚙️ Backend – FastAPI

The backend exposes REST endpoints:

- `GET /zones` → List available zones
- `GET /risk/{zone_id}` → Full daily risk data for a zone
- `GET /top_flood?n=5` → Top zones by flood risk
- `GET /top_drought?n=5` → Top zones by drought risk

### ▶ Run Backend

```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 9000
API available at:

http://127.0.0.1:9000
Swagger documentation:

http://127.0.0.1:9000/docs
🎨 Frontend – React + Tailwind + Recharts + Leaflet
The frontend dashboard provides:

Dynamic KPI cards

Rainfall chart (last 7 days)

Interactive map (Leaflet)

Dynamic alerts (derived from latest risk data)

Zone selector dropdown

All components update automatically when changing the selected city.

▶ Run Frontend
npm install
npm run dev
Frontend available at:

http://localhost:5173
📊 Key Features
Real-time risk visualization

Flood & drought categorization

Rainfall monitoring

Geographical risk mapping

Frontend-generated smart alerts

Clean city-based data flow

Fully dynamic UI (no fake data)

🛠 Technologies Used
Backend
FastAPI

Pandas

Uvicorn

Frontend
React (Vite)

TailwindCSS

Recharts

React-Leaflet

Axios

🚀 Future Improvements
Add real-time streaming ingestion

Add water level indicators

Add authentication

Deploy to cloud (Docker + CI/CD)