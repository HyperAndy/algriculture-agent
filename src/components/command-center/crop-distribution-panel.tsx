import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { COMMAND_CROP_COLORS } from "@/design-system/big-screen/theme";
import { CROP_LABELS } from "@/domain/crops/crop-labels";
import { EChart } from "./echart";
import type { CommandField } from "./types";

export function CropDistributionPanel({ fields, totalArea }: { fields: CommandField[]; totalArea: number }) {
  const option = useMemo<EChartsOption>(() => {
    const data = fields.map((field) => ({
      name: CROP_LABELS[field.cropType] ?? field.cropType,
      value: field.areaMu,
      itemStyle: { color: COMMAND_CROP_COLORS[field.cropType] ?? "#7ee787" }
    }));

    return {
      animationDuration: 1200,
      series: [
        {
          type: "pie",
          radius: ["54%", "82%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          label: { show: false },
          labelLine: { show: false },
          itemStyle: { borderColor: "#06232b", borderWidth: 2 },
          data
        }
      ]
    };
  }, [fields]);

  return (
    <div className="sci-donut-wrap">
      <div className="sci-donut-visual">
        <EChart option={option} className="sci-donut-chart" />
        <div className="sci-donut-total"><span>总面积</span><b>{Math.round(totalArea)}亩</b></div>
      </div>
      <div className="sci-crop-legend">
        {fields.map((field) => {
          const percent = totalArea ? ((field.areaMu / totalArea) * 100).toFixed(1) : "0.0";
          return (
            <div key={field.id}>
              <i style={{ background: COMMAND_CROP_COLORS[field.cropType] }} />
              <span>{CROP_LABELS[field.cropType]}</span>
              <b>{Math.round(field.areaMu)}</b>
              <em>({percent}%)</em>
            </div>
          );
        })}
      </div>
    </div>
  );
}
