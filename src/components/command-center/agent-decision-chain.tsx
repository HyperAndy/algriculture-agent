import { CloudRain, FileText, Leaf, Sprout, Waves, Wheat } from "lucide-react";
import { isMojibake } from "./model";
import type { CommandAgentStep } from "./types";

export function AgentDecisionChain({ steps }: { steps: CommandAgentStep[] }) {
  const agents = [
    { name: "田间感知", desc: "多源数据采集", icon: <Sprout size={30} /> },
    { name: "作物诊断", desc: "长链推理分析", icon: <Leaf size={30} /> },
    { name: "风险预警", desc: "地块级预警", icon: <Wheat size={30} /> },
    { name: "水肥决策", desc: "精准水肥建议", icon: <Waves size={30} /> },
    { name: "灾害应对", desc: "应急处置方案", icon: <CloudRain size={30} /> },
    { name: "农事档案", desc: "全过程追溯", icon: <FileText size={30} /> }
  ].map((agent, index) => {
    const step = steps[index];
    return {
      ...agent,
      name: step?.agentName && !isMojibake(step.agentName) ? step.agentName.replace("Agent", "") : agent.name,
      desc: step?.outputSummary && !isMojibake(step.outputSummary) ? step.outputSummary : agent.desc
    };
  });

  return (
    <div className="sci-agent-chain">
      {agents.map((agent, index) => (
        <div className={`sci-agent-node agent-node-${index + 1}`} key={agent.name}>
          <span>{agent.icon}</span>
          <b title={agent.name}>{agent.name}</b>
          <small title={agent.desc}>{agent.desc}</small>
        </div>
      ))}
    </div>
  );
}
