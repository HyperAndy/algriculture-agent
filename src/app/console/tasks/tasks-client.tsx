"use client"

import { useState, useMemo } from "react"
import { Clover, List, Columns2, Check } from "lucide-react"
import { PageHeader } from "@/components/console/page-header"
import { FilterBar } from "@/components/console/filter-bar"
import { TaskCard } from "@/components/console/task-card"
import { EmptyState } from "@/components/console/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  description: string
  priority: string
  status: string
  dueDate: string
  completedAt: string | null
  fieldName: string
}

const statusLabel: Record<string, string> = {
  pending: "待执行",
  "in-progress": "进行中",
  completed: "已完成",
}

export function TasksClient({ tasks }: { tasks: Task[] }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
      return true
    })
  }, [tasks, statusFilter, priorityFilter])

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="农事任务" />
        <EmptyState
          icon={<Clover className="size-8" />}
          title="暂无农事任务"
          description="当前没有农事任务记录"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="农事任务" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="pending">待执行</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <FilterBar
            filters={[
              {
                label: "优先级",
                key: "priority",
                options: [
                  { label: "高", value: "high" },
                  { label: "中", value: "medium" },
                  { label: "低", value: "low" },
                ],
              },
            ]}
            onFilterChange={(key, value) => {
              if (key === "priority") setPriorityFilter(value || "all")
            }}
          />

          <div className="flex items-center rounded-lg border p-0.5">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("list")}
            >
              <List className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("kanban")}
            >
              <Columns2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<Clover className="size-8" />}
          title="暂无匹配任务"
          description="尝试调整筛选条件"
        />
      ) : viewMode === "list" ? (
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {(["pending", "in-progress", "completed"] as const).map((columnStatus) => {
            const columnTasks = filteredTasks.filter((t) => t.status === columnStatus)
            return (
              <div key={columnStatus} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {statusLabel[columnStatus]}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                {columnTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    暂无任务
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div key={task.id}>
                        {columnStatus === "completed" && (
                          <div className="mb-1 flex items-center gap-1.5 text-xs text-green-600">
                            <Check className="size-3" />
                            <span>
                              {task.completedAt
                                ? new Date(task.completedAt).toLocaleDateString("zh-CN", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>
                        )}
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
