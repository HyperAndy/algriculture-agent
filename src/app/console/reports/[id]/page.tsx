import Link from "next/link"
import { ArrowLeft, Printer, Sprout, Calendar, Eye, Check, ChevronDown } from "lucide-react"
import { prisma } from "@/lib/db"
import { PageHeader } from "@/components/console/page-header"
import { RiskBadge } from "@/components/console/risk-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

function parseSections(raw: string): { title: string; content: string }[] {
  const parts = raw.split(/\n(?=\d+\.\s)/)
  return parts.map((part) => {
    const match = part.match(/^(\d+)\.\s*(.+?)\n([\s\S]*)/)
    if (match) {
      return { title: match[2].trim(), content: match[3].trim() }
    }
    const lines = part.split("\n")
    const firstLine = lines[0].replace(/^\d+\.\s*/, "").trim()
    return { title: firstLine, content: lines.slice(1).join("\n").trim() }
  })
}

function parseRecommendations(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map((r) => String(r))
    return []
  } catch {
    return raw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const agentRun = await prisma.agentRun.findUnique({
    where: { id },
    include: {
      field: true,
      observation: true,
      steps: { orderBy: { startedAt: "asc" } },
      tasks: true,
    },
  })

  if (!agentRun) {
    return (
      <div className="space-y-6">
        <PageHeader title="诊断报告" />
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-lg font-medium text-muted-foreground">报告不存在</p>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/console/archive" />}
          >
            <ArrowLeft className="size-3.5" />
            返回档案
          </Button>
        </div>
      </div>
    )
  }

  const reasoningSections = agentRun.reasoning ? parseSections(agentRun.reasoning) : []
  const recommendations = parseRecommendations(agentRun.recommendations)

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="print-only hidden" data-slot="print-header">
        <h1 className="text-center text-lg font-bold">
          AI驱动的大田作物稳产减灾决策Agent - 诊断报告
        </h1>
        <hr className="my-3" />
      </div>

      <PageHeader
        title="诊断报告"
        actions={
          <div className="flex items-center gap-2">
            <RiskBadge level={agentRun.overallRiskLevel} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="no-print"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">打印</span>
            </Button>
          </div>
        }
      />

      <Card size="sm">
        <CardContent>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Sprout className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">田块:</span>
              <span className="font-medium">{agentRun.field.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">作物:</span>
              <span className="font-medium">{agentRun.field.cropType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">诊断日期:</span>
              <span className="font-medium">
                {new Date(agentRun.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {agentRun.observation && (
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">观测日期:</span>
                <span className="font-medium">
                  {new Date(agentRun.observation.createdAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">综合判断</h2>
        <Card size="sm">
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {agentRun.summary || "暂无综合判断"}
            </p>
          </CardContent>
        </Card>
      </div>

      {reasoningSections.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">推理过程</h2>
          <div className="space-y-2">
            {reasoningSections.map((section, idx) => (
              <Collapsible key={idx} defaultOpen={idx < 3}>
                <Card size="sm">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {idx + 1}
                      </Badge>
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[panel-open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t px-4 py-3">
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">诊断建议</h2>
          <Card size="sm">
            <CardContent>
              <ol className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {agentRun.steps.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Agent执行步骤</h2>
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-2 w-px bg-green-200 dark:bg-green-800" />
            <div className="space-y-4">
              {agentRun.steps.map((step, idx) => (
                <div key={step.id} className="relative flex gap-4 pl-10">
                  <div className="absolute left-0 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-green-200 bg-background dark:border-green-800">
                    <Check className="size-3.5 text-green-600" />
                  </div>
                  <Card size="sm" className="flex-1">
                    <CardContent>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Step {idx + 1}
                        </Badge>
                        <span className="text-sm font-medium">{step.agentName}</span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {step.inputSummary && (
                          <div>
                            <span className="text-xs font-medium text-foreground/70">输入:</span>
                            <p className="mt-0.5">{step.inputSummary}</p>
                          </div>
                        )}
                        {step.outputSummary && (
                          <div>
                            <span className="text-xs font-medium text-foreground/70">输出:</span>
                            <p className="mt-0.5">{step.outputSummary}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {agentRun.tasks.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">关联任务</h2>
          <div className="divide-y rounded-lg border">
            {agentRun.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 px-4 py-3">
                <span className="min-w-0 flex-1 text-sm font-medium truncate">
                  {task.title}
                </span>
                <Badge
                  variant="outline"
                  className={
                    task.priority === "high"
                      ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                      : task.priority === "medium"
                        ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                        : "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                  }
                >
                  {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    task.status === "completed"
                      ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                      : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                  }
                >
                  {task.status === "completed" ? "已完成" : "待执行"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.dueDate).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="no-print">
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/console/archive" />}
        >
          <ArrowLeft className="size-3.5" />
          返回档案
        </Button>
      </div>
    </div>
  )
}
