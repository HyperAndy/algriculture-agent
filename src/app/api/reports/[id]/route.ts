import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseRecommendations } from "@/lib/agents/analysis-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await prisma.agentRun.findUnique({
    where: { id },
    include: { field: true, observation: true, steps: true, tasks: true }
  });
  if (!report) {
    return NextResponse.json({ error: "REPORT_NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ report: { ...report, recommendationsList: parseRecommendations(report.recommendations) } });
}
