"use client"

import { useRef, useEffect } from "react"
import * as echarts from "echarts"

const zoneColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
}

const pointerAngle: Record<string, number> = {
  low: -45,
  medium: 0,
  high: 45,
}

export function RiskGaugeChart({ level = "low" }: { level?: "low" | "medium" | "high" }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const instance = echarts.init(chartRef.current, undefined, {
      width: 200,
      height: 120,
    })
    instanceRef.current = instance

    instance.setOption({
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          center: ["50%", "75%"],
          radius: "100%",
          min: -60,
          max: 60,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              width: 8,
              color: [
                [0.25, "#22c55e"],
                [0.5, "#f59e0b"],
                [0.75, "#ef4444"],
                [1, "#ef4444"],
              ],
            },
          },
          pointer: {
            length: "60%",
            width: 4,
            itemStyle: {
              color: zoneColors[level],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { show: false },
          data: [{ value: pointerAngle[level] }],
        },
      ],
    })

    const handleResize = () => {
      instance.resize({ width: 200, height: 120 })
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      instance.dispose()
    }
  }, [level])

  return (
    <div className="flex items-center justify-center">
      <div ref={chartRef} style={{ width: 200, height: 120 }} suppressHydrationWarning />
    </div>
  )
}
