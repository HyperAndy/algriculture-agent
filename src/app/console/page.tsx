import Link from "next/link";
import { AlertTriangle, ClipboardList, MapPinned, ScanLine } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FieldCard } from "@/components/field-card";
import { StatCard } from "@/components/stat-card";
import { TaskList } from "@/components/task-list";
import { prisma } from "@/lib/db";

export default async function ConsolePage() {
  const [fields, tasks, runs] = await Promise.all([
    prisma.field.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.farmingTask.findMany({ where: { status: "pending" }, take: 5, orderBy: { dueDate: "asc" }, include: { field: true } }),
    prisma.agentRun.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { field: true } })
  ]);
  return (
    <AppShell>
      <Header title="农事工作台" subtitle="查看风险态势、待办任务和近期Agent分析。" />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="地块总数" value={fields.length} icon={<MapPinned />} />
        <StatCard label="高风险地块" value={fields.filter((field) => field.riskLevel === "high").length} icon={<AlertTriangle />} />
        <StatCard label="待执行任务" value={tasks.length} icon={<ClipboardList />} />
        <StatCard label="近期分析" value={runs.length} icon={<ScanLine />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">地块概况</h2>
            <Link href="/console/fields" className="text-sm font-semibold text-[#1f6f49]">查看全部</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => <FieldCard key={field.id} field={field} />)}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">今日待办</h2>
          <TaskList tasks={tasks} />
        </section>
      </div>
    </AppShell>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-[#1f6f49]">Management Console</p>
      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-[#637064]">{subtitle}</p>
    </div>
  );
}
