import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RiskBadge } from "@/components/risk-badge";
import { prisma } from "@/lib/db";

export default async function ArchivePage() {
  const runs = await prisma.agentRun.findMany({ orderBy: { createdAt: "desc" }, include: { field: true } });
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1f6f49]">Archive</p>
        <h1 className="mt-2 text-3xl font-bold">农事档案</h1>
        <p className="mt-2 text-[#637064]">每次Agent分析都会沉淀为可追溯档案。</p>
      </div>
      <div className="grid gap-3">
        {runs.map((run) => (
          <Link key={run.id} href={`/console/reports/${run.id}`} className="rounded-lg border border-[#dce5d8] bg-white p-4 hover:border-[#1f6f49]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{run.field.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#536156]">{run.summary}</p>
                <p className="mt-2 text-xs text-[#7a867c]">{run.createdAt.toLocaleString("zh-CN")}</p>
              </div>
              <RiskBadge level={run.overallRiskLevel} />
            </div>
          </Link>
        ))}
        {runs.length === 0 ? <div className="rounded-lg border border-dashed border-[#b9c8b4] p-8 text-center text-[#637064]">暂无分析档案</div> : null}
      </div>
    </AppShell>
  );
}
