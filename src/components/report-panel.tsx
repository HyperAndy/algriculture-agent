import { RiskBadge } from "./risk-badge";
import { AgentTimeline } from "./agent-timeline";

export function ReportPanel({
  report,
  recommendations
}: {
  report: {
    overallRiskLevel: string;
    summary: string;
    reasoning: string;
    steps?: { agentName: string; outputSummary: string }[];
  };
  recommendations: string[];
}) {
  return (
    <section className="rounded-lg border border-[#dce5d8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">诊断报告</h2>
        <RiskBadge level={report.overallRiskLevel} />
      </div>
      <p className="mt-3 text-[#4f5d52]">{report.summary}</p>
      <div className="mt-5 rounded-lg bg-[#f6f8f3] p-4">
        <h3 className="font-semibold">长链推理</h3>
        <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4f5d52]">{report.reasoning}</pre>
      </div>
      <div className="mt-5">
        <h3 className="font-semibold">农事建议</h3>
        <ul className="mt-2 grid gap-2">
          {recommendations.map((item) => (
            <li key={item} className="rounded border border-[#dce5d8] bg-[#fbfcfa] p-3 text-sm leading-6">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {report.steps ? (
        <div className="mt-5">
          <h3 className="mb-3 font-semibold">Agent步骤</h3>
          <AgentTimeline steps={report.steps} />
        </div>
      ) : null}
    </section>
  );
}
