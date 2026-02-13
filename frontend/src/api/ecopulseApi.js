import { api } from "./client";

export async function fetchZones() {
  const res = await api.get("/zones");
  return res.data?.zones ?? [];
}

export async function fetchZoneRisk(zoneId) {
  const res = await api.get(`/risk/${zoneId}`);
  return res.data ?? [];
}

export async function fetchTopFlood(n = 5) {
  const res = await api.get("/top_flood", { params: { n } });
  return res.data ?? [];
}

export async function fetchTopDrought(n = 5) {
  const res = await api.get("/top_drought", { params: { n } });
  return res.data ?? [];
}
