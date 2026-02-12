const toneClass = {
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  slate: "border-slate-700 bg-slate-800 text-slate-100",
};

export default function AlertsPanel({ alerts = [] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Alerts</div>
        <div className="text-xs text-slate-400">
          {alerts.length} active
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-slate-400">No active alerts</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 ${toneClass[a.tone] || toneClass.slate}`}
            >
              <div className="font-semibold text-sm">{a.title}</div>
              <div className="text-xs opacity-90 mt-1">{a.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
