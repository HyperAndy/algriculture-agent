"use client"

import { useRef, useEffect } from "react"
import * as echarts from "echarts"

interface CropDonutData {
  crop: string
  label: string
  area: number
  color: string
}

export function CropDonutChart({ data }: { data: CropDonutData[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  const totalArea = data.reduce((sum, d) => sum + d.area, 0)

  useEffect(() => {
    if (!chartRef.current) return

    const instance = echarts.init(chartRef.current)
    instanceRef.current = instance

    instance.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} 亩 ({d}%)",
        textStyle: { color: "#333" },
      },
      legend: {
        bottom: 0,
        itemGap: 16,
        itemWidth: 10,
        itemHeight: 10,
        itemBorderRadius: 2,
        textStyle: { color: "#6b7280", fontSize: 12, padding: [0, 0, 0, 4] },
      },
      series: [
        {
          type: "pie",
          radius: ["52%", "78%"],
          center: ["50%", "44%"],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 3,
            borderRadius: 4,
          },
          label: { show: false },
          emphasis: {
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 12,
              shadowColor: "rgba(0,0,0,0.15)",
            },
          },
          data: data.map((d) => ({
            name: d.label,
            value: d.area,
            itemStyle: { color: d.color },
          })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "34%",
          style: {
            text: "总面积",
            textAlign: "center",
            fill: "#9ca3af",
            fontSize: 12,
          },
        },
        {
          type: "text",
          left: "center",
          top: "42%",
          style: {
            text: `${totalArea}亩`,
            textAlign: "center",
            fill: "#111827",
            fontSize: 18,
            fontWeight: "bold",
          },
        },
      ],
    })

    const handleResize = () => instance.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      instance.dispose()
    }
  }, [data, totalArea])

  return <div ref={chartRef} className="h-72 w-full" suppressHydrationWarning />
}
