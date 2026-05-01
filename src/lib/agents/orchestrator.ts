import { maxRisk, riskLabel, scoreBiologicalRisk, scoreDroughtRisk, scoreFloodRisk, scoreGrowthRisk, scoreHeatRisk, scoreNutrientRisk } from "@/lib/domain/risk";
import { buildMockAgentSteps } from "./mock-agents";
import type { AgentRunResult, FieldInput, ObservationInput } from "./types";

export function runMockFieldAnalysis(field: FieldInput, observation: ObservationInput): AgentRunResult {
  const droughtRisk = scoreDroughtRisk(observation);
  const floodRisk = scoreFloodRisk(observation);
  const heatRisk = scoreHeatRisk(observation);
  const biologicalRisk = scoreBiologicalRisk(observation);
  const growthRisk = scoreGrowthRisk(observation);
  const nutrientRisk = scoreNutrientRisk(observation);
  const overallRiskLevel = maxRisk(droughtRisk, floodRisk, heatRisk, biologicalRisk, growthRisk, nutrientRisk);
  const steps = buildMockAgentSteps(field, observation);

  const recommendations = buildRecommendations(field, observation, {
    droughtRisk,
    biologicalRisk,
    nutrientRisk,
    growthRisk
  });

  return {
    overallRiskLevel,
    summary: `${field.name}的${field.cropLabel}处于${field.growthStage}，综合判定为${riskLabel(overallRiskLevel)}。`,
    reasoning: [
      "长链推理：",
      `1. 识别作物与地块：${field.name}，${field.cropLabel}，${field.growthStage}，面积${field.areaMu}亩。`,
      `2. 融合多源数据：温度${observation.temperatureC}℃、降雨${observation.rainfallMm}mm、墒情${observation.soilMoisturePercent}%、天气趋势为“${observation.weatherTrend}”。`,
      `3. 风险判断：干旱${riskLabel(droughtRisk)}，病虫草害${riskLabel(biologicalRisk)}，长势${riskLabel(growthRisk)}，养分${riskLabel(nutrientRisk)}。`,
      `4. 农事排序：优先处理${riskLabel(overallRiskLevel)}对应事项，并安排3天内复查。`
    ].join("\n"),
    recommendations,
    steps
  };
}

function buildRecommendations(
  field: FieldInput,
  observation: ObservationInput,
  risks: { droughtRisk: string; biologicalRisk: string; nutrientRisk: string; growthRisk: string }
) {
  const recommendations: string[] = [];
  if (risks.droughtRisk === "high") {
    recommendations.push(`建议24小时内对${field.name}安排补灌，避开中午高温时段。`);
  } else {
    recommendations.push("保持墒情监测，结合天气窗口安排灌溉。");
  }

  if (risks.biologicalRisk !== "low") {
    recommendations.push(`建议2天内复查病虫草害发生范围，重点核实：${[observation.pestDescription, observation.diseaseDescription, observation.weedDescription].filter(Boolean).join("；")}。`);
  } else {
    recommendations.push("维持常规巡田，继续观察病虫草害变化。");
  }

  if (risks.nutrientRisk !== "low" || risks.growthRisk !== "low") {
    recommendations.push("结合叶色、长势和氮磷钾指标评估追肥方案，高温时段避免追肥作业。");
  } else {
    recommendations.push("当前长势和养分未见明显异常，按常规农事计划管理。");
  }

  recommendations.push(`3天后复查${field.cropLabel}苗情、墒情和病虫草害变化，并更新农事档案。`);
  return recommendations;
}
