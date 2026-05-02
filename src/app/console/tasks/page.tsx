import { prisma } from "@/lib/db"
import { TasksClient } from "./tasks-client"

export default async function TasksPage() {
  const tasks = await prisma.farmingTask.findMany({
    include: {
      field: { select: { name: true } },
    },
  })

  const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 }

  const sorted = [...tasks].sort((a, b) => {
    const pa = priorityMap[a.priority] ?? 0
    const pb = priorityMap[b.priority] ?? 0
    if (pa !== pb) return pb - pa
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const mappedTasks = sorted.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate.toISOString(),
    completedAt: t.completedAt?.toISOString() ?? null,
    fieldName: t.field.name,
  }))

  return <TasksClient tasks={mappedTasks} />
}
