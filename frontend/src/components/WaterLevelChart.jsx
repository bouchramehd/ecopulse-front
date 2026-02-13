import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { day: "Tue", level: 58 },
  { day: "Wed", level: 57 },
  { day: "Thu", level: 64 },
  { day: "Fri", level: 75 },
  { day: "Sat", level: 65 },
  { day: "Sun", level: 56 },
  { day: "Mon", level: 63 },
];

export default function WaterLevelChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Water Level Trend</div>
        <div className="text-xs text-slate-400">Water level (cm)</div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
            <XAxis dataKey="day" stroke="rgba(148,163,184,0.6)" />
            <YAxis stroke="rgba(148,163,184,0.6)" />
            <Tooltip
              contentStyle={{
                background: "rgba(2,6,23,0.95)",
                border: "1px solid rgba(51,65,85,0.8)",
              }}
            />
            <ReferenceLine y={70} strokeDasharray="6 6" stroke="rgba(244,63,94,0.85)" />
            <Line
              type="monotone"
              dataKey="level"
              stroke="rgba(96,165,250,0.95)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Red dashed line = critical threshold
      </div>
    </div>
  );
}
