import { CROP_LABELS } from "@/domain/crops/crop-labels";
import type { CommandField } from "./types";

export function GrowthStagePanel({ fields }: { fields: CommandField[] }) {
  const stages = [
    { label: "播种期", color: "#2ec46b", values: [10, 5, 8, 12] },
    { label: "苗期", color: "#34a865", values: [20, 15, 20, 18] },
    { label: "拔节期", color: "#2cc16f", values: [30, 25, 35, 30] },
    { label: "孕穗期", color: "#f1c137", values: [25, 35, 25, 20] },
    { label: "灌浆期", color: "#3d88d8", values: [15, 20, 12, 20] }
  ];

  return (
    <div className="sci-growth-bars">
      {fields.map((field, fieldIndex) => (
        <div className="sci-growth-row" key={field.id}>
          <span>{CROP_LABELS[field.cropType]}</span>
          <div>
            {stages.map((stage) => (
              <i key={stage.label} title={`${CROP_LABELS[field.cropType]} ${stage.label}: ${stage.values[fieldIndex] ?? 10}%`} style={{ width: `${stage.values[fieldIndex] ?? 10}%`, background: stage.color }}>{stage.values[fieldIndex] ?? 10}%</i>
            ))}
          </div>
        </div>
      ))}
      <div className="sci-growth-axis"><span>0%</span><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span></div>
      <div className="sci-growth-legend">
        {stages.map((stage) => <span key={stage.label}><i style={{ background: stage.color }} />{stage.label}</span>)}
      </div>
    </div>
  );
}
