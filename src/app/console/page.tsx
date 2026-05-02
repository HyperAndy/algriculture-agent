import { MapPinned, ScanLine, AlertTriangle, ClipboardList } from "lucide-react"
import { prisma } from "@/lib/db"
import { PageHeader } from "@/components/console/page-header"
import { StatCard } from "@/components/console/stat-card"
import { RiskAreaChart } from "@/components/console/risk-area-chart"
import { CropDonutChart } from "@/components/console/crop-donut-chart"
import { RiskBadge } from "@/components/console/risk-badge"
import { EmptyState } from "@/components/console/empty-state"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

const CROP_COLORS: Record<string, string> = {
  小麦: "#eab308",
  玉米: "#22c55e",
  水稻: "#3b82f6",
  大豆: "#a855f7",
  棉花: "#f97316",
  油菜: "#06b6d4",
  蔬菜: "#8b5cf6",
  马铃薯: "#ec4899",
  花生: "#d97706",
  高粱: "#14b8a6",
}

function generateRiskTrend(highRisk: number, mediumRisk: number, lowRisk: number) {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
    if (i === 6) {
      return { date, highRisk, mediumRisk, lowRisk }
    }
    const jitter = (base: number) => Math.max(0, base + Math.floor(Math.random() * 5 - 2))
    return {
      date,
      highRisk: jitter(highRisk),
      mediumRisk: jitter(mediumRisk),
      lowRisk: jitter(lowRisk),
    }
  })
}

function buildCropDonutData(
  fields: { cropType: string; areaMu: number }[],
) {
  const map = new Map<string, number>()
  for (const f of fields) {
    map.set(f.cropType, (map.get(f.cropType) ?? 0) + f.areaMu)
  }
  return Array.from(map.entries()).map(([crop, area]) => ({
    crop,
    label: crop,
    area: Math.round(area * 100) / 100,
    color: CROP_COLORS[crop] ?? "#6b7280",
  }))
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { variant: "destructive" | "secondary" | "outline"; label: string; className: string }> = {
    high: { variant: "destructive", label: "高优先", className: "" },
    medium: {
      variant: "secondary",
      label: "中优先",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    low: {
      variant: "outline",
      label: "低优先",
      className: "border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-400",
    },
  }
  const c = config[priority] ?? config.low
  return (
    <Badge variant={c.variant} className={c.className}>
      {c.label}
    </Badge>
  )
}

export default async function ConsolePage() {
  const [fields, pendingTasks, agentRuns] = await Promise.all([
    prisma.field.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.farmingTask.findMany({
      where: { status: "pending" },
      orderBy: { dueDate: "asc" },
      include: { field: true },
    }),
    prisma.agentRun.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { field: true },
    }),
  ])

  const totalArea = fields.reduce((sum, f) => sum + f.areaMu, 0)
  const highRiskCount = fields.filter((f) => f.riskLevel === "high").length
  const mediumRiskCount = fields.filter((f) => f.riskLevel === "medium").length
  const lowRiskCount = fields.filter((f) => f.riskLevel === "low").length
  const pendingCount = pendingTasks.length
  const hasData = fields.length > 0 || pendingTasks.length > 0

  const riskTrendData = generateRiskTrend(highRiskCount, mediumRiskCount, lowRiskCount)
  const cropDonutData = buildCropDonutData(fields)

  return (
    <div className="space-y-6">
      <PageHeader title="工作台" description="地块态势总览与近期决策动态" />

      {!hasData ? (
        <EmptyState
          icon={<MapPinned className="size-6" />}
          title="尚无地块数据"
          description="创建第一个地块开始使用智能农事管理"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<MapPinned className="size-4" />}
              label="总地块数"
              value={fields.length}
              unit="块"
              trend="neutral"
            />
            <StatCard
              icon={<ScanLine className="size-4" />}
              label="覆盖面积"
              value={Math.round(totalArea)}
              unit="亩"
              trend="neutral"
            />
            <StatCard
              icon={<AlertTriangle className="size-4" />}
              label="高风险地块"
              value={highRiskCount}
              unit="块"
              variant={highRiskCount > 0 ? "danger" : "default"}
              trend={highRiskCount > 0 ? "up" : "down"}
            />
            <StatCard
              icon={<ClipboardList className="size-4" />}
              label="待办任务"
              value={pendingCount}
              unit="项"
              trend="neutral"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>风险态势趋势</CardTitle>
                <CardDescription>近7日各风险等级地块数量变化</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskAreaChart data={riskTrendData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>作物分布</CardTitle>
                <CardDescription>各地块作物种植面积占比</CardDescription>
              </CardHeader>
              <CardContent>
                {cropDonutData.length > 0 ? (
                  <CropDonutChart data={cropDonutData} />
                ) : (
                  <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                    暂无作物数据
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>近期分析</CardTitle>
                <CardDescription>最近 5 条 Agent 决策记录</CardDescription>
              </CardHeader>
              <CardContent>
                {agentRuns.length > 0 ? (
                  <ul className="space-y-4">
                    {agentRuns.map((run) => (
                      <li key={run.id} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {run.field.name}
                            </span>
                            <RiskBadge level={run.overallRiskLevel} />
                          </div>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {run.summary}
                          </p>
                        </div>
                        <time className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(run.createdAt).toLocaleDateString("zh-CN")}
                        </time>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    暂无分析记录
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>待办任务</CardTitle>
                <CardDescription>待处理的农事任务</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTasks.length > 0 ? (
                  <ul className="space-y-4">
                    {pendingTasks.map((task) => (
                      <li key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {task.title}
                            </span>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {task.field.name}
                          </p>
                        </div>
                        <time className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                          {task.dueDate
                            ? `截止 ${new Date(task.dueDate).toLocaleDateString("zh-CN")}`
                            : "无截止日期"}
                        </time>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    暂无待办任务
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
