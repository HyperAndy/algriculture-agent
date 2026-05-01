import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ReportPanel } from "@/components/report-panel";
import { RiskBadge } from "@/components/risk-badge";
import { TaskList } from "@/components/task-list";
import { parseRecommendations } from "@/lib/agents/analysis-service";
import { getCropLabel, type CropType } from "@/lib/domain/crops";
import { prisma } from "@/lib/db";

export default async function FieldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      observations: { orderBy: { createdAt: "desc" }, take: 1 },
      agentRuns: { orderBy: { createdAt: "desc" }, take: 1, include: { steps: true, tasks: true } },
      tasks: { orderBy: { dueDate: "asc" }, include: { field: true } }
    }
  });
  if (!field) return <AppShell><div>地块不存在</div></AppShell>;
  const latestRun = field.agentRuns[0];
  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1f6f49]">Field Detail</p>
          <h1 className="mt-2 text-3xl font-bold">{field.name}</h1>
          <p className="mt-2 text-[#637064]">{field.location} · {getCropLabel(field.cropType as CropType)} · {field.growthStage} · {field.areaMu}亩</p>
        </div>
        <RiskBadge level={field.riskLevel} />
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href={`/console/fields/${field.id}/input`} className="rounded-md bg-[#1f6f49] px-4 py-2 font-semibold text-white">录入观测</Link>
        <Link href={`/console/fields/${field.id}/analysis`} className="rounded-md border border-[#b9c8b4] px-4 py-2 font-semibold">Agent分析</Link>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-[#dce5d8] bg-white p-5">
          <h2 className="text-xl font-bold">最新观测</h2>
          {field.observations[0] ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Metric label="温度" value={`${field.observations[0].temperatureC}℃`} />
              <Metric label="墒情" value={`${field.observations[0].soilMoisturePercent}%`} />
              <Metric label="天气趋势" value={field.observations[0].weatherTrend} />
            </div>
          ) : <p className="mt-3 text-[#637064]">暂无观测数据，请先录入。</p>}
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">关联任务</h2>
          <TaskList tasks={field.tasks} />
        </section>
      </div>
      {latestRun ? (
        <div className="mt-6">
          <ReportPanel report={latestRun} recommendations={parseRecommendations(latestRun.recommendations)} />
        </div>
      ) : null}
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f6f8f3] p-4">
      <p className="text-sm text-[#637064]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
