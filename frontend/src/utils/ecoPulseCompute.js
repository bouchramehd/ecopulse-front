function sortByDate(records) {
  return [...records].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );
}

export function computeCityKpis(records) {
  if (!records || records.length === 0) {
    return {
      floodLabel: "--",
      droughtLabel: "--",
      avgPrecip: "--",
      avgTemp: "--",
    };
  }

  const sorted = sortByDate(records);
  const last7 = sorted.slice(-7);
  const n = last7.length || 1;

  // --- Moyenne précipitations ---
  const avgPrecip =
    last7.reduce((sum, r) => sum + Number(r.precipitation || 0), 0) / n;

  // --- Moyenne température ---
  const avgTemp =
    last7.reduce((sum, r) => {
      const tmax = Number(r.temperature_max);
      const tmin = Number(r.temperature_min);

      if (!Number.isNaN(tmax) && !Number.isNaN(tmin)) {
        return sum + (tmax + tmin) / 2;
      }
      if (!Number.isNaN(tmax)) {
        return sum + tmax;
      }
      return sum;
    }, 0) / n;

  // --- Moyenne flood risk ---
  const avgFloodRisk =
    last7.reduce((sum, r) => sum + Number(r.flood_risk || 0), 0) / n;

  // --- Catégorisation cohérente Flood/Drought ---
  let floodLabel = "--";
  let droughtLabel = "--";

  if (avgFloodRisk >= 0.66) {
    floodLabel = "High";
    droughtLabel = "Low";
  } else if (avgFloodRisk >= 0.33) {
    floodLabel = "Medium";
    droughtLabel = "Medium";
  } else {
    floodLabel = "Low";
    droughtLabel = "High";
  }

  return {
    floodLabel,
    droughtLabel,
    avgPrecip: avgPrecip.toFixed(1),
    avgTemp: avgTemp.toFixed(1),
  };
}

export function computeRainChart(records) {
  if (!records || records.length === 0) return [];

  const sorted = sortByDate(records);
  const last7 = sorted.slice(-7);

  return last7.map((r) => ({
    day: String(r.date).slice(5, 10), // MM-DD
    mm: Number(Number(r.precipitation || 0).toFixed(2)),
  }));
}

export function computeMapPoint(records) {
  if (!records || records.length === 0) return null;

  const sorted = sortByDate(records);
  const latest = sorted.at(-1);

  return {
    lat: Number(latest.latitude),
    lng: Number(latest.longitude),
    label: latest.zone_id,
  };
}

/**
 * ✅ Frontend-generated alerts (cohérentes avec les KPIs)
 */
export function computeAlerts(records) {
  if (!records || records.length === 0) return [];

  const sorted = sortByDate(records);
  const last7 = sorted.slice(-7);
  const n = last7.length || 1;

  // --- Moyenne FloodRisk sur 7 jours pour cohérence ---
  const avgFloodRisk =
    last7.reduce((sum, r) => sum + Number(r.flood_risk || 0), 0) / n;

  let alerts = [];

  // Flood / Drought alert cohérente
  if (avgFloodRisk >= 0.66) {
    alerts.push({
      title: "High Flood Risk",
      description: `${sorted.at(-1).zone_id}: flood risk is HIGH`,
      tone: "rose",
    });
  } else if (avgFloodRisk < 0.33) {
    alerts.push({
      title: "High Drought Risk",
      description: `${sorted.at(-1).zone_id}: drought risk is HIGH`,
      tone: "amber",
    });
  }

  // Pluie intense (indépendant)
  const latest = sorted.at(-1);
  const precip = Number(latest.precipitation || 0);
  if (precip > 30) {
    alerts.push({
      title: "Heavy Rainfall",
      description: `${latest.zone_id}: ${precip} mm precipitation`,
      tone: "sky",
    });
  }

  return alerts;
}
