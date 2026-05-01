import { clsx } from "clsx";
import type { RiskLevel } from "@/lib/domain/risk";

const LABELS: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险"
};

export function RiskBadge({ level }: { level: RiskLevel | string }) {
  const risk = (["low", "medium", "high"].includes(level) ? level : "low") as RiskLevel;
  return (
    <span
      className={clsx(
        "inline-flex rounded px-2 py-1 text-xs font-semibold",
        risk === "low" && "bg-emerald-100 text-emerald-800",
        risk === "medium" && "bg-amber-100 text-amber-800",
        risk === "high" && "bg-red-100 text-red-800"
      )}
    >
      {LABELS[risk]}
    </span>
  );
}
