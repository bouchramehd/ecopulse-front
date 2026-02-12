import { useEffect, useMemo, useState } from "react";

import KpiCards from "../components/KpiCards";
import RainChart from "../components/RainChart";
import RiskMap from "../components/RiskMap";
import AlertsPanel from "../components/AlertsPanel";

import { fetchZones, fetchZoneRisk } from "../api/ecopulseApi";
import {
  computeCityKpis,
  computeRainChart,
  computeMapPoint,
  computeAlerts,
} from "../utils/ecoPulseCompute";

export default function Dashboard() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [records, setRecords] = useState([]);

  // Load zones once
  useEffect(() => {
    fetchZones()
      .then((z) => {
        setZones(z);
        if (z.length > 0) setSelectedZone(z[0]);
      })
      .catch(console.error);
  }, []);

  // Load selected city data
  useEffect(() => {
    if (!selectedZone) return;

    fetchZoneRisk(selectedZone)
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, [selectedZone]);

  // Derived from backend
  const kpis = useMemo(() => computeCityKpis(records), [records]);
  const rainData = useMemo(() => computeRainChart(records), [records]);
  const mapPoint = useMemo(() => computeMapPoint(records), [records]);
  const alerts = useMemo(() => computeAlerts(records), [records]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 p-4 flex justify-between">
        <h1 className="text-lg font-semibold">EcoPulse</h1>

        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded px-3 py-1"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <KpiCards kpis={kpis} />
        <AlertsPanel alerts={alerts} />
        <RainChart data={rainData} />
        <RiskMap point={mapPoint} />
      </main>
    </div>
  );
}
