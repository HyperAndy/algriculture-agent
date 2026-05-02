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
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: "#666", fontSize: 12 },
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "75%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            scaleSize: 6,
          },
          data: data.map((d) => ({
            name: d.label,
            value: d.area,
            itemStyle: { color: d.color },
          })),
        },
      ],
      graphic: {
        type: "text",
        left: "center",
        top: "38%",
        style: {
          text: `${totalArea}亩`,
          textAlign: "center",
          fill: "#333",
          fontSize: 16,
          fontWeight: "bold",
        },
      },
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
