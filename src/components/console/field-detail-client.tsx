"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Droplets, Gauge, Leaf, Ruler, Thermometer, AlertTriangle, ClipboardList, BarChart3, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RiskBadge } from "@/components/console/risk-badge"
import { RiskGaugeChart } from "@/components/console/risk-gauge-chart"

interface SerializedObservation {
  id: string
  temperatureC: number
  rainfallMm: number
  soilMoisturePercent: number
  soilPh: number | null
  plantHeightCm: number | null
  leafColor: string
  growthStatus: string
  weatherTrend: string
  createdAt: string
}

interface SerializedAgentRun {
  id: string
  status: string
  overallRiskLevel: string
  summary: string
  reasoning: string
  recommendations: string
  createdAt: string
  steps: { id: string; agentName: string; status: string; inputSummary: string; outputSummary: string }[]
}

interface SerializedTask {
  id: string
  title: string
  description: string
  priority: string
  status: string
  dueDate: string
  completedAt: string | null
}

interface FieldDetail {
  id: string
  name: string
  location: string
  areaMu: number
  cropType: string
  variety: string | null
  growthStage: string
  riskLevel: string
  createdAt: string
  latestObservation: SerializedObservation | null
  latestAgentRun: SerializedAgentRun | null
  tasks: SerializedTask[]
  observationHistory: SerializedObservation[]
}

const priorityLabel: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
}

const priorityColor: Record<string, "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
}

const statusLabel: Record<string, string> = {
  pending: "待处理",
  "in-progress": "进行中",
  completed: "已完成",
  cancelled: "已取消",
}

const cropEmoji: Record<string, string> = {
  水稻: "🌾",
  小麦: "🌾",
  玉米: "🌽",
  大豆: "🫘",
  棉花: "☁️",
  油菜: "🌼",
  马铃薯: "🥔",
  甘蔗: "🎋",
}

export function FieldDetailClient({ field }: { field: FieldDetail }) {
  const [expandedRun, setExpandedRun] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cropEmoji[field.cropType] ?? "🌱"}</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{field.name}</h1>
            <p className="text-sm text-muted-foreground">{field.location}</p>
          </div>
          <RiskBadge level={field.riskLevel} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href={`/console/fields/${field.id}/input`}>
            <Button variant="default">录入观测</Button>
          </Link>
          <Link href={`/console/fields/${field.id}/analysis`}>
            <Button variant="outline">Agent分析</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{field.cropType}</Badge>
        {field.variety && <Badge variant="outline">{field.variety}</Badge>}
        <Badge variant="secondary">{field.growthStage}</Badge>
        <Badge variant="outline">{field.areaMu} 亩</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="size-3.5" />
            概览
          </TabsTrigger>
          <TabsTrigger value="observations">
            <ClipboardList className="size-3.5" />
            观测
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Gauge className="size-3.5" />
            分析
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="size-3.5" />
            任务
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <Card>
              <CardHeader>
                <CardTitle>最新观测</CardTitle>
              </CardHeader>
              <CardContent>
                {field.latestObservation ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MiniMetric icon={<Thermometer className="size-4" />} label="温度" value={`${field.latestObservation.temperatureC}℃`} />
                    <MiniMetric icon={<Droplets className="size-4" />} label="降雨" value={`${field.latestObservation.rainfallMm}mm`} />
                    <MiniMetric icon={<Droplets className="size-4" />} label="墒情" value={`${field.latestObservation.soilMoisturePercent}%`} />
                    <MiniMetric icon={<Gauge className="size-4" />} label="土壤pH" value={field.latestObservation.soilPh?.toString() ?? "-"} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无观测数据</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>风险仪表</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2">
                <RiskGaugeChart level={field.riskLevel as "low" | "medium" | "high"} />
                <p className="text-sm text-muted-foreground">当前风险：{field.riskLevel === "low" ? "低" : field.riskLevel === "medium" ? "中" : "高"}</p>
              </CardContent>
            </Card>
          </div>

          {field.observationHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>土壤趋势（最近 {field.observationHistory.length} 次观测）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {field.observationHistory.map((obs) => (
                    <div key={obs.id} className="rounded-lg border px-3 py-2 text-center text-xs">
                      <p className="text-muted-foreground">{new Date(obs.createdAt).toLocaleDateString("zh-CN")}</p>
                      <p className="mt-1 font-semibold">
                        {obs.soilMoisturePercent}% / pH {obs.soilPh ?? "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="observations" className="mt-6 space-y-4">
          {field.observationHistory.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <ClipboardList className="mx-auto mb-2 size-8 opacity-50" />
              <p>暂无观测记录</p>
              <Link href={`/console/fields/${field.id}/input`} className="mt-2 inline-block text-primary underline underline-offset-4">
                立即录入
              </Link>
            </div>
          ) : (
            field.observationHistory.map((obs) => (
              <Card key={obs.id} size="sm">
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <Calendar className="mr-1 inline size-3.5 text-muted-foreground" />
                      {new Date(obs.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {obs.weatherTrend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-4">
                    <span><Thermometer className="mr-0.5 inline size-3" />{obs.temperatureC}℃</span>
                    <span><Droplets className="mr-0.5 inline size-3" />{obs.rainfallMm}mm</span>
                    <span><Droplets className="mr-0.5 inline size-3" />墒情 {obs.soilMoisturePercent}%</span>
                    {obs.plantHeightCm != null && <span><Ruler className="mr-0.5 inline size-3" />{obs.plantHeightCm}cm</span>}
                    <span><Leaf className="mr-0.5 inline size-3" />{obs.leafColor}</span>
                    <span>{obs.growthStatus}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analysis" className="mt-6 space-y-4">
          {!field.latestAgentRun ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Gauge className="mx-auto mb-2 size-8 opacity-50" />
              <p>暂无分析记录</p>
              <Link href={`/console/fields/${field.id}/analysis`} className="mt-2 inline-block text-primary underline underline-offset-4">
                运行Agent分析
              </Link>
            </div>
          ) : (
            <Card>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedRun(expandedRun === field.latestAgentRun!.id ? null : field.latestAgentRun!.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {new Date(field.latestAgentRun.createdAt).toLocaleDateString("zh-CN")} 分析报告
                  </CardTitle>
                  <RiskBadge level={field.latestAgentRun.overallRiskLevel} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">摘要</p>
                  <p className="mt-1 text-sm">{field.latestAgentRun.summary}</p>
                </div>
                {expandedRun === field.latestAgentRun.id && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">推理</p>
                      <p className="mt-1 text-sm">{field.latestAgentRun.reasoning}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">建议</p>
                      <p className="mt-1 text-sm">{field.latestAgentRun.recommendations}</p>
                    </div>
                    {field.latestAgentRun.steps.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Agent步骤</p>
                        <div className="mt-2 space-y-2">
                          {field.latestAgentRun.steps.map((step) => (
                            <div key={step.id} className="rounded-lg border px-3 py-2 text-xs">
                              <p className="font-medium">{step.agentName}</p>
                              <p className="text-muted-foreground">输入: {step.inputSummary}</p>
                              <p className="text-muted-foreground">输出: {step.outputSummary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-6 space-y-4">
          {field.tasks.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <ListTodo className="mx-auto mb-2 size-8 opacity-50" />
              <p>暂无任务</p>
            </div>
          ) : (
            <ul className="divide-y rounded-lg border">
              {field.tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    <Badge variant={priorityColor[task.priority] ?? "secondary"} className="text-xs">
                      {priorityLabel[task.priority] ?? task.priority}
                    </Badge>
                    <Badge variant={task.status === "completed" ? "outline" : "secondary"} className="text-xs">
                      {statusLabel[task.status] ?? task.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}
