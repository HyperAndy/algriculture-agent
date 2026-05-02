"use client"

import type { ReactNode } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCountUp } from "@/components/console/use-count-up"
import { cn } from "@/lib/utils"

export function StatCard({
  icon,
  label,
  value,
  unit,
  trend,
  trendLabel,
  variant = "default",
}: {
  icon: ReactNode
  label: string
  value: number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  variant?: "default" | "danger"
}) {
  const animated = useCountUp(value)

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : trend === "neutral" ? Minus : null

  return (
    <Card
      className={cn(
        "opacity-0 animate-fade-in",
        variant === "danger" && "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
      )}
    >
      <CardHeader className="flex-row items-center gap-2 pb-2">
        <div className={cn("flex size-8 items-center justify-center rounded-lg bg-muted", variant === "danger" && "bg-red-100 dark:bg-red-900/40")}>
          {icon}
        </div>
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums">{animated.toLocaleString()}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {trend && trendLabel && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {TrendIcon && (
              <TrendIcon
                className={cn(
                  "size-3",
                  trend === "up" && "text-red-500",
                  trend === "down" && "text-green-500",
                  trend === "neutral" && "text-muted-foreground"
                )}
              />
            )}
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
