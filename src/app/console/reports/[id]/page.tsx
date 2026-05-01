import { AppShell } from "@/components/app-shell";
import { ReportPanel } from "@/components/report-panel";
import { TaskList } from "@/components/task-list";
import { parseRecommendations } from "@/lib/agents/analysis-service";
import { prisma } from "@/lib/db";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await prisma.agentRun.findUnique({
    where: { id },
    include: { field: true, steps: true, tasks: { include: { field: true } } }
  });
  if (!report) return <AppShell><div>报告不存在</div></AppShell>;
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Agent Report</p>
        <h1 className="mt-2 text-3xl font-bold">{report.field.name} 诊断报告</h1>
        <p className="mt-2 text-[#637064]">生成时间：{report.createdAt.toLocaleString("zh-CN")}</p>
      </div>
      <ReportPanel report={report} recommendations={parseRecommendations(report.recommendations)} />
      <section className="mt-6">
        <h2 className="mb-3 text-xl font-bold">自动生成的农事任务</h2>
        <TaskList tasks={report.tasks} />
      </section>
    </AppShell>
  );
}
