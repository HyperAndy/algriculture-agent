"use client"

import { useRef, useEffect } from "react"
import * as echarts from "echarts"

interface RiskAreaData {
  date: string
  highRisk: number
  mediumRisk: number
  lowRisk: number
}

export function RiskAreaChart({ data }: { data: RiskAreaData[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const instance = echarts.init(chartRef.current)
    instanceRef.current = instance

    instance.setOption({
      tooltip: {
        trigger: "axis",
        textStyle: { color: "#333" },
      },
      legend: {
        bottom: 0,
        data: ["高风险", "中风险", "低风险"],
        textStyle: { color: "#666", fontSize: 12 },
      },
      grid: {
        left: 8,
        right: 8,
        top: 8,
        bottom: 32,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((d) => d.date),
        axisLine: { lineStyle: { color: "#d1d5db" } },
        axisLabel: { fontSize: 11, color: "#6b7280" },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#e5e7eb", type: "dashed" } },
        axisLabel: { fontSize: 11, color: "#6b7280" },
      },
      series: [
        {
          name: "高风险",
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(239,68,68,0.25)" },
          lineStyle: { color: "#ef4444", width: 2 },
          itemStyle: { color: "#ef4444" },
          data: data.map((d) => d.highRisk),
        },
        {
          name: "中风险",
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(245,158,11,0.25)" },
          lineStyle: { color: "#f59e0b", width: 2 },
          itemStyle: { color: "#f59e0b" },
          data: data.map((d) => d.mediumRisk),
        },
        {
          name: "低风险",
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(34,197,94,0.25)" },
          lineStyle: { color: "#22c55e", width: 2 },
          itemStyle: { color: "#22c55e" },
          data: data.map((d) => d.lowRisk),
        },
      ],
    })

    const handleResize = () => instance.resize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      instance.dispose()
    }
  }, [data])

  return <div ref={chartRef} className="h-72 w-full" suppressHydrationWarning />
}
