import { riskLabel, scoreBiologicalRisk, scoreDroughtRisk, scoreFloodRisk, scoreGrowthRisk, scoreHeatRisk, scoreNutrientRisk } from "@/lib/domain/risk";
import type { AgentStepResult, FieldInput, ObservationInput } from "./types";

export function buildMockAgentSteps(field: FieldInput, observation: ObservationInput): AgentStepResult[] {
  const droughtRisk = scoreDroughtRisk(observation);
  const floodRisk = scoreFloodRisk(observation);
  const heatRisk = scoreHeatRisk(observation);
  const biologicalRisk = scoreBiologicalRisk(observation);
  const growthRisk = scoreGrowthRisk(observation);
  const nutrientRisk = scoreNutrientRisk(observation);
  const biologicalText = [observation.pestDescription, observation.diseaseDescription, observation.weedDescription].filter(Boolean).join("；") || "未发现明显病虫草害描述";

  return [
    {
      agentName: "田间感知Agent",
      inputSummary: `${field.name}，${field.cropLabel}${field.growthStage}，天气趋势：${observation.weatherTrend}`,
      outputSummary: `已整理温度${observation.temperatureC}℃、降雨${observation.rainfallMm}mm、墒情${observation.soilMoisturePercent}%和田间描述。`,
      signals: [
        observation.soilMoisturePercent < 45 ? "墒情偏低" : "墒情基本可用",
        observation.temperatureC >= 32 ? "高温信号" : "温度平稳",
        biologicalText
      ]
    },
    {
      agentName: "作物诊断Agent",
      inputSummary: `${field.cropLabel}${field.growthStage}，叶色${observation.leafColor}，长势${observation.growthStatus}`,
      outputSummary: `当前处于${field.growthStage}，长势风险为${riskLabel(growthRisk)}，养分风险为${riskLabel(nutrientRisk)}。`,
      riskLevel: growthRisk
    },
    {
      agentName: "病虫草害预警Agent",
      inputSummary: biologicalText,
      outputSummary: `病虫草害综合风险为${riskLabel(biologicalRisk)}，建议结合巡田确认发生范围。`,
      riskLevel: biologicalRisk
    },
    {
      agentName: "水肥决策Agent",
      inputSummary: `墒情${observation.soilMoisturePercent}%，氮磷钾：${observation.nitrogenLevel}/${observation.phosphorusLevel}/${observation.potassiumLevel}`,
      outputSummary: droughtRisk === "high" ? "建议24小时内安排补灌，追肥应避开高温时段。" : "建议继续监测墒情，并根据天气窗口安排水肥管理。",
      riskLevel: droughtRisk
    },
    {
      agentName: "灾害应对Agent",
      inputSummary: `天气趋势：${observation.weatherTrend}，风力：${observation.windLevel || "未填"}`,
      outputSummary: `干旱${riskLabel(droughtRisk)}，涝渍${riskLabel(floodRisk)}，高温${riskLabel(heatRisk)}；优先处置最高风险项。`,
      riskLevel: droughtRisk
    },
    {
      agentName: "农事档案Agent",
      inputSummary: `${field.name}本次诊断数据、风险和建议`,
      outputSummary: "已形成可追溯农事档案，可用于后续复查、项目验收和生产追溯。",
      signals: ["归档分析结果", "生成后续任务", "保留复查依据"]
    }
  ];
}
