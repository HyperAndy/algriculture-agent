import { AlertTriangle } from "lucide-react";
import { riskLabel } from "./model";
import type { CommandField } from "./types";

export function RiskWarningPanel({ fields }: { fields: CommandField[] }) {
  const corn = fields.find((field) => field.cropType === "corn") ?? fields[0];
  const wheat = fields.find((field) => field.cropType === "wheat") ?? fields[1] ?? fields[0];
  const alerts = [
    { level: "high" as const, title: "玉米拔节期干旱风险", field: corn, time: "09:40", area: 128 },
    { level: "medium" as const, title: "小麦灌浆期干热风风险", field: wheat, time: "08:30", area: 96 }
  ];

  return (
    <div className="sci-alert-list">
      {alerts.map((alert) => (
        <article className={`sci-alert ${alert.level}`} key={alert.title}>
          <AlertTriangle size={19} />
          <div>
            <h3 title={alert.title}>{alert.title}<em>{riskLabel(alert.level)}</em></h3>
            <p title={`涉及地块：${alert.field?.name ?? "示范田"}`}>涉及地块：{alert.field?.name ?? "示范田"}</p>
            <p title={`预警时间：2025-05-20 ${alert.time}`}>预警时间：2025-05-20 {alert.time}</p>
            <p title={`影响面积：${alert.area} 亩`}>影响面积：{alert.area} 亩</p>
          </div>
          <button>查看详情</button>
        </article>
      ))}
    </div>
  );
}
