import { CheckCircle2 } from "lucide-react";

const AGENTS = ["田间感知Agent", "作物诊断Agent", "病虫草害预警Agent", "水肥决策Agent", "灾害应对Agent", "农事档案Agent"];

export function AgentTimeline({ steps }: { steps?: { agentName: string; outputSummary: string }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {AGENTS.map((agent, index) => {
        const step = steps?.find((item) => item.agentName === agent);
        return (
          <div key={agent} className="rounded-lg border border-[#dce5d8] bg-white p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1f6f49]" />
              <span className="text-xs font-semibold text-[#6d7a70]">STEP {index + 1}</span>
            </div>
            <h3 className="mt-2 font-semibold">{agent}</h3>
            <p className="mt-2 text-sm leading-6 text-[#5d6a60]">{step?.outputSummary ?? defaultCopy(agent)}</p>
          </div>
        );
      })}
    </div>
  );
}

function defaultCopy(agent: string) {
  if (agent.includes("感知")) return "整理地块、天气、土壤、苗情和农事记录。";
  if (agent.includes("诊断")) return "判断生育期、长势和缺水缺肥风险。";
  if (agent.includes("病虫")) return "识别病虫草害风险并安排复查建议。";
  if (agent.includes("水肥")) return "生成灌溉、追肥、控旺和排水建议。";
  if (agent.includes("灾害")) return "识别干旱、高温、暴雨、倒伏等风险。";
  return "沉淀报告、任务和可追溯农事档案。";
}
