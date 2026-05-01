import { NextResponse } from "next/server";
import { runAndPersistFieldAnalysis } from "@/lib/agents/analysis-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const report = await runAndPersistFieldAnalysis(id);
    return NextResponse.json({
      reportId: report.id,
      overallRiskLevel: report.overallRiskLevel,
      summary: report.summary,
      taskCount: report.tasks.length
    });
  } catch (error) {
    if (error instanceof Error && error.message === "OBSERVATION_REQUIRED") {
      return NextResponse.json({ error: "OBSERVATION_REQUIRED", message: "请先录入本地块的天气、土壤、苗情和病虫草害信息。" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "FIELD_NOT_FOUND") {
      return NextResponse.json({ error: "FIELD_NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json({ error: "AGENT_RUN_FAILED", message: "Agent 分析失败，请检查观测数据后重试。" }, { status: 500 });
  }
}
