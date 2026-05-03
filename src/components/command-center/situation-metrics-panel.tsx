import { AlertTriangle, ClipboardList, Map, ScanLine } from "lucide-react";
import { clsx } from "clsx";

export function SituationMetricsPanel({
  fieldsCount,
  totalArea,
  highRisk,
  pendingTasks
}: {
  fieldsCount: number;
  totalArea: number;
  highRisk: number;
  pendingTasks: number;
}) {
  const items = [
    { icon: <Map size={32} />, label: "管理地块", value: fieldsCount, unit: "块" },
    { icon: <ScanLine size={32} />, label: "覆盖面积", value: totalArea, unit: "亩" },
    { icon: <AlertTriangle size={32} />, label: "高风险地块", value: highRisk, unit: "块", danger: true },
    { icon: <ClipboardList size={32} />, label: "待办农事", value: pendingTasks, unit: "项" }
  ];

  return (
    <div className="sci-metrics">
      {items.map((item) => (
        <div className={clsx("sci-metric", item.danger && "is-danger")} key={item.label}>
          <span className="sci-metric-icon">{item.icon}</span>
          <span className="sci-metric-label" title={item.label}>{item.label}</span>
          <strong>{item.value}</strong>
          <em>{item.unit}</em>
        </div>
      ))}
    </div>
  );
}
