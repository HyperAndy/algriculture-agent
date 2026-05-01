import type { ReactNode } from "react";

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#dce5d8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#637064]">{label}</p>
        {icon ? <div className="text-[#1f6f49]">{icon}</div> : null}
      </div>
      <div className="mt-2 text-3xl font-bold text-[#17231b]">{value}</div>
      {hint ? <p className="mt-1 text-xs text-[#6d7a70]">{hint}</p> : null}
    </div>
  );
}
