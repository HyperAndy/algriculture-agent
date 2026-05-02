import { Badge } from "@/components/ui/badge"

const riskConfig: Record<string, { variant: "outline" | "secondary" | "destructive"; label: string; className: string }> = {
  low: {
    variant: "outline",
    label: "低风险",
    className: "border-green-400 text-green-700 dark:border-green-600 dark:text-green-400",
  },
  medium: {
    variant: "secondary",
    label: "中风险",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  high: {
    variant: "destructive",
    label: "高风险",
    className: "",
  },
}

export function RiskBadge({ level }: { level: string }) {
  const config = riskConfig[level] ?? riskConfig.low

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
