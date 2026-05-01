import { AnalyzeButton } from "@/components/analyze-button";
import { AgentTimeline } from "@/components/agent-timeline";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/db";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await prisma.field.findUnique({
    where: { id },
    include: { observations: { orderBy: { createdAt: "desc" }, take: 1 }, agentRuns: { orderBy: { createdAt: "desc" }, take: 1, include: { steps: true } } }
  });
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Agent Decision Center</p>
        <h1 className="mt-2 text-3xl font-bold">{field?.name ?? "地块"} Agent决策中心</h1>
        <p className="mt-2 text-[#637064]">系统会按固定顺序运行六个Agent，并生成风险判断、长链推理和农事任务。</p>
      </div>
      <div className="mb-6 rounded-lg border border-[#dce5d8] bg-white p-5">
        <h2 className="text-xl font-bold">最新观测摘要</h2>
        {field?.observations[0] ? (
          <p className="mt-2 text-[#536156]">温度 {field.observations[0].temperatureC}℃，墒情 {field.observations[0].soilMoisturePercent}%，天气趋势：{field.observations[0].weatherTrend}</p>
        ) : <p className="mt-2 text-[#536156]">暂无观测数据，请先录入。</p>}
        <div className="mt-4"><AnalyzeButton fieldId={id} /></div>
      </div>
      <AgentTimeline steps={field?.agentRuns[0]?.steps} />
    </AppShell>
  );
}
