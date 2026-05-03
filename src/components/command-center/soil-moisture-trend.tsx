import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { COMMAND_CROP_COLORS } from "@/design-system/big-screen/theme";
import { CROP_LABELS } from "@/domain/crops/crop-labels";
import { EChart } from "./echart";
import type { CommandField } from "./types";

export function SoilMoistureTrend({ fields }: { fields: CommandField[] }) {
  const days = ["05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20"];
  const option = useMemo<EChartsOption>(() => ({
    animationDuration: 1300,
    grid: { left: 34, right: 12, top: 28, bottom: 42 },
    tooltip: { trigger: "axis", backgroundColor: "rgba(3,17,21,.96)", borderColor: "#2fb8c2", textStyle: { color: "#d8f3e8" } },
    xAxis: { type: "category", data: days, axisLine: { lineStyle: { color: "rgba(170,220,210,.32)" } }, axisTick: { show: false }, axisLabel: { color: "#a7c5bd", fontSize: 10 } },
    yAxis: { type: "value", min: 0, max: 100, splitLine: { lineStyle: { color: "rgba(170,220,210,.14)" } }, axisLabel: { color: "#a7c5bd", fontSize: 10 } },
    series: fields.map((field, index) => ({
      name: `${index + 1}号地块（${CROP_LABELS[field.cropType]}）`,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      lineStyle: { width: 2.5 },
      itemStyle: { color: COMMAND_CROP_COLORS[field.cropType] },
      data: days.map((_, day) => Math.round(72 - index * 7 + Math.sin(day + index) * 7 - day * (index === 2 ? 2.8 : 0.7)))
    })),
    legend: { bottom: 0, left: 30, textStyle: { color: "#b8d7ce", fontSize: 11 }, itemWidth: 18, itemHeight: 4 }
  }), [fields]);

  return (
    <div className="sci-soil-wrap">
      <div className="sci-soil-tools">
        <span>土壤含水率（%）</span>
        <button>近7天</button>
        <button>近30天</button>
      </div>
      <EChart option={option} className="sci-soil-chart" />
    </div>
  );
}
