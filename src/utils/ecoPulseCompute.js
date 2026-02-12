function sortByDate(records) {
  return [...records].sort((a, b) => String(a.date).localeCompare(String(b.date)));
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
  const latest = sorted.at(-1);

  const last7 = sorted.slice(-7);
  const n = last7.length || 1;

  const avgPrecip =
    last7.reduce((sum, r) => sum + Number(r.precipitation || 0), 0) / n;

  const avgTemp =
    last7.reduce((sum, r) => {
      const tmax = Number(r.temperature_max);
      const tmin = Number(r.temperature_min);
      if (!Number.isNaN(tmax) && !Number.isNaN(tmin)) return sum + (tmax + tmin) / 2;
      if (!Number.isNaN(tmax)) return sum + tmax;
      return sum;
    }, 0) / n;

  return {
    floodLabel: latest?.flood_risk_category ?? "--",
    droughtLabel: latest?.drought_risk_category ?? "--",
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
 * ✅ Frontend-generated alerts (from latest record)
 * - Flood High => Flood alert
 * - Drought High => Drought alert
 * - precipitation > 30 => Heavy rain alert
 */
export function computeAlerts(records) {
  if (!records || records.length === 0) return [];

  const sorted = sortByDate(records);
  const latest = sorted.at(-1);

  const alerts = [];

  if (String(latest.flood_risk_category) === "High") {
    alerts.push({
      title: "High Flood Risk",
      description: `${latest.zone_id}: flood risk is HIGH`,
      tone: "rose",
    });
  }

  if (String(latest.drought_risk_category) === "High") {
    alerts.push({
      title: "High Drought Risk",
      description: `${latest.zone_id}: drought risk is HIGH`,
      tone: "amber",
    });
  }

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
