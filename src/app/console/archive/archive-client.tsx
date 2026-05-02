"use client"

import { useState, useMemo } from "react"
import { FileText, Search, Sprout } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/console/page-header"
import { Pagination } from "@/components/console/pagination"
import { EmptyState } from "@/components/console/empty-state"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RiskBadge } from "@/components/console/risk-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type AgentRun = {
  id: string
  fieldName: string
  cropType: string
  overallRiskLevel: string
  summary: string
  createdAt: string
  stepCount: number
}

export function ArchiveClient({
  agentRuns,
  page,
  totalPages,
}: {
  agentRuns: AgentRun[]
  page: number
  totalPages: number
}) {
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")

  const filtered = useMemo(() => {
    return agentRuns.filter((run) => {
      if (riskFilter !== "all" && run.overallRiskLevel !== riskFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !run.fieldName.toLowerCase().includes(q) &&
          !run.summary.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [agentRuns, search, riskFilter])

  if (agentRuns.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="农事档案" />
        <EmptyState
          icon={<FileText className="size-8" />}
          title="暂无农事档案"
          description="还没有诊断记录"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="农事档案" />

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索田块或摘要..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full sm:w-56 pl-7 text-sm"
          />
        </div>
        <Select
          value={riskFilter}
          onValueChange={(v) => setRiskFilter(v === "__all__" ? "all" : (v ?? "all"))}
        >
          <SelectTrigger size="sm" className="w-32">
            <span className="text-muted-foreground">风险:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">全部</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-8" />}
          title="暂无匹配记录"
          description="尝试调整筛选条件"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((run) => (
            <Link key={run.id} href={`/console/reports/${run.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sprout className="size-3.5" />
                        <span>
                          {run.fieldName} / {run.cropType}
                        </span>
                        <span className="mx-1 opacity-40">|</span>
                        <span>
                          {new Date(run.createdAt).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {run.summary}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {run.stepCount} 步
                      </Badge>
                      <RiskBadge level={run.overallRiskLevel} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} baseUrl="/console/archive" />
    </div>
  )
}
