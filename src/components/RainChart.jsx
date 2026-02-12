import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RainChart({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Rainfall Intensity</div>
        <div className="text-xs text-slate-400">Last 7 days (mm)</div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
            <XAxis dataKey="day" stroke="rgba(148,163,184,0.6)" />
            <YAxis stroke="rgba(148,163,184,0.6)" />
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(51,65,85,0.8)",
              }}
            />
            <Bar dataKey="mm" fill="rgba(34,211,238,0.75)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
