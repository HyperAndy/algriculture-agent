"use client"

import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "高", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400" },
  medium: { label: "中", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" },
  low: { label: "低", className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "待处理", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "in-progress": { label: "进行中", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  completed: { label: "已完成", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
}

export function TaskCard({
  task,
  onComplete,
}: {
  task: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    dueDate: string
    fieldName: string
  }
  onComplete?: () => void
}) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.low
  const status = statusConfig[task.status] ?? { label: task.status, className: "" }
  const formattedDate = new Date(task.dueDate).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{task.title}</CardTitle>
          <Badge variant="outline" className={cn("shrink-0 text-xs", priority.className)}>
            {priority.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          <span>{task.fieldName}</span>
          <Calendar className="ml-2 size-3" />
          <span>{formattedDate}</span>
          <Badge variant="outline" className={cn("ml-auto text-xs", status.className)}>
            {status.label}
          </Badge>
        </div>
        {task.status === "pending" && onComplete && (
          <Button variant="outline" size="xs" className="w-full" onMouseDown={onComplete}>
            标记完成
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
