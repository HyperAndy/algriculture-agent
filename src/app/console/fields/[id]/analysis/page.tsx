"use client"

import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  PlayCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/console/page-header"
import { RiskBadge } from "@/components/console/risk-badge"

const PIPELINE_NODES = [
  { label: "田间感知", icon: "🌾" },
  { label: "作物诊断", icon: "🔬" },
  { label: "病虫草害预警", icon: "🐛" },
  { label: "水肥决策", icon: "💧" },
  { label: "灾害应对", icon: "⚠️" },
  { label: "农事档案", icon: "📋" },
]

function AgentPipeline({ activeCount }: { activeCount: number }) {
  return (
    <div className="py-6">
      <style>{`
        @keyframes pipeline-glow {
          0% { opacity: 0.25; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pipeline-node {
          opacity: 0.25;
          transform: scale(0.85);
          animation: pipeline-glow 0.5s ease-out forwards;
        }
      `}</style>
      <div className="flex flex-wrap items-start justify-center gap-3 md:gap-6">
        {PIPELINE_NODES.map((node, i) => {
          const completed = i < activeCount
          return (
            <div key={node.label} className="flex items-center gap-0">
              <div
                className="pipeline-node flex flex-col items-center gap-1.5"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-full border-2 text-lg transition-colors ${
                    completed
                      ? "border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-950/50 dark:text-green-400"
                      : "border-muted-foreground/30 bg-muted/50 text-muted-foreground/60"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="size-5 text-green-500" />
                  ) : (
                    node.icon
                  )}
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    completed ? "text-foreground" : "text-muted-foreground/60"
                  }`}
                >
                  {node.label}
                </span>
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <div
                  className={`mx-0.5 h-0.5 w-6 transition-colors ${
                    i < activeCount - 1 ? "bg-green-400" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface StepData {
  id: string
  agentName: string
  status: string
  inputSummary: string
  outputSummary: string
}

interface RunData {
  id: string
  overallRiskLevel: string
  summary: string
  reasoning: string
  recommendations: string
  steps: StepData[]
}

interface ObservationData {
  temperatureC: number
  rainfallMm: number
  soilMoisturePercent: number
  weatherTrend: string
  windLevel: string | null
  growthStatus: string
  leafColor: string
  plantHeightCm: number | null
  soilPh: number | null
  pestDescription: string | null
  diseaseDescription: string | null
  weedDescription: string | null
  createdAt: string
}

interface FieldData {
  name: string
  observations: ObservationData[]
  agentRuns: RunData[]
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [field, setField] = useState<FieldData | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [resultsExpanded, setResultsExpanded] = useState(false)

  const fetchField = useCallback(() => {
    fetch(`/api/fields/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setField(data.field ?? null)
      })
      .catch(() => setField(null))
      .finally(() => setPageLoading(false))
  }, [id])

  useEffect(() => {
    fetchField()
  }, [fetchField])

  async function handleAnalyze() {
    setAnalyzeError("")
    setAnalyzeLoading(true)
    try {
      const res = await fetch(`/api/fields/${id}/analyze`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setAnalyzeError(data.message || "分析失败")
        return
      }
      toast.success("Agent 分析完成")
      fetchField()
      router.refresh()
    } catch {
      setAnalyzeError("网络错误，请重试")
    } finally {
      setAnalyzeLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const latestObservation = field?.observations?.[0] ?? null
  const latestRun = field?.agentRuns?.[0] ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent决策中心"
        description={field?.name ? `${field.name} — 智能分析与决策` : undefined}
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>最新观测摘要</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {latestObservation ? (
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-muted-foreground">温度：</span>
                <span className="font-medium">{latestObservation.temperatureC}℃</span>
              </div>
              <div>
                <span className="text-muted-foreground">降雨：</span>
                <span className="font-medium">{latestObservation.rainfallMm}mm</span>
              </div>
              <div>
                <span className="text-muted-foreground">墒情：</span>
                <span className="font-medium">{latestObservation.soilMoisturePercent}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">天气趋势：</span>
                <span className="font-medium">{latestObservation.weatherTrend}</span>
              </div>
              <div>
                <span className="text-muted-foreground">长势：</span>
                <span className="font-medium">{latestObservation.growthStatus}</span>
              </div>
              <div>
                <span className="text-muted-foreground">叶色：</span>
                <span className="font-medium">{latestObservation.leafColor}</span>
              </div>
              {latestObservation.plantHeightCm != null && (
                <div>
                  <span className="text-muted-foreground">株高：</span>
                  <span className="font-medium">{latestObservation.plantHeightCm}cm</span>
                </div>
              )}
              {latestObservation.soilPh != null && (
                <div>
                  <span className="text-muted-foreground">土壤pH：</span>
                  <span className="font-medium">{latestObservation.soilPh}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              暂无观测数据，请先
              <Link
                href={`/console/fields/${id}/input`}
                className="mx-1 text-primary underline underline-offset-4 hover:no-underline"
              >
                录入观测
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Agent 分析管线</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentPipeline activeCount={latestRun ? PIPELINE_NODES.length : 0} />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={handleAnalyze}
          disabled={analyzeLoading}
          size="lg"
          className="w-full sm:w-auto"
        >
          {analyzeLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <PlayCircle className="size-4" />
              开始Agent分析
            </>
          )}
        </Button>
        {analyzeError && (
          <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {analyzeError}
          </p>
        )}
      </div>

      {latestRun && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>分析结果</span>
                <RiskBadge level={latestRun.overallRiskLevel} />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">摘要</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {latestRun.summary}
                </p>
              </div>

              <div>
                <button
                  className="flex w-full items-center gap-2 text-sm font-semibold"
                  onClick={() => setResultsExpanded(!resultsExpanded)}
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      resultsExpanded ? "rotate-180" : ""
                    }`}
                  />
                  推理过程
                </button>
                {resultsExpanded && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                    {latestRun.reasoning}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold">建议</h3>
                <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {latestRun.recommendations
                    .split("\n")
                    .filter(Boolean)
                    .map((rec, i) => (
                      <li key={i}>{rec.replace(/^[-•*]\s*/, "")}</li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-bold">Agent 执行详情</h3>
          <div className="space-y-3">
            {PIPELINE_NODES.map((node, i) => {
              const step = latestRun.steps?.[i]
              const isExpanded = expandedStep === step?.id
              return (
                <Card key={node.label} size="sm">
                  <button
                    className="w-full text-left"
                    onClick={() => step && setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <CardHeader
                      className={`flex flex-row items-center gap-3 ${
                        step ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-green-50 text-sm dark:bg-green-950/50">
                        {step ? (
                          <CheckCircle2 className="size-4 text-green-500" />
                        ) : (
                          node.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm">
                          {node.label}
                          {step && (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              — {step.agentName}
                            </span>
                          )}
                        </CardTitle>
                        {!step && (
                          <p className="text-xs text-muted-foreground">等待执行</p>
                        )}
                      </div>
                      {step && (
                        <ChevronDown
                          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </CardHeader>
                  </button>
                  {isExpanded && step && (
                    <CardContent className="border-t pt-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          输入
                        </h4>
                        <p className="mt-1 text-sm">{step.inputSummary}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          输出
                        </h4>
                        <p className="mt-1 text-sm">{step.outputSummary}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
