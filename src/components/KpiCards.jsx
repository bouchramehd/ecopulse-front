import { AlertTriangle, Sun, CloudRain, Thermometer } from "lucide-react";

const toneClasses = {
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};

export default function KpiCards({ kpis }) {
  const cards = [
    {
      title: "Flood Risk",
      value: kpis?.floodLabel ?? "--",
      sub: "latest",
      icon: AlertTriangle,
      tone: "rose",
    },
    {
      title: "Drought Risk",
      value: kpis?.droughtLabel ?? "--",
      sub: "latest",
      icon: Sun,
      tone: "amber",
    },
    {
      title: "Avg Precipitation",
      value: kpis?.avgPrecip ?? "--",
      sub: "mm (7 days)",
      icon: CloudRain,
      tone: "sky",
    },
    {
      title: "Avg Temperature",
      value: kpis?.avgTemp ?? "--",
      sub: "°C (7 days)",
      icon: Thermometer,
      tone: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`rounded-2xl border p-4 ${toneClasses[c.tone]}`}>
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="h-9 w-9 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center">
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs opacity-90">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
