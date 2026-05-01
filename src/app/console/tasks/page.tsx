import { AppShell } from "@/components/app-shell";
import { TaskList } from "@/components/task-list";
import { prisma } from "@/lib/db";

export default async function TasksPage() {
  const tasks = await prisma.farmingTask.findMany({ orderBy: { dueDate: "asc" }, include: { field: true } });
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Tasks</p>
        <h1 className="mt-2 text-3xl font-bold">农事任务</h1>
        <p className="mt-2 text-[#637064]">跟踪Agent建议是否真正落到执行。</p>
      </div>
      <TaskList tasks={tasks} />
    </AppShell>
  );
}
