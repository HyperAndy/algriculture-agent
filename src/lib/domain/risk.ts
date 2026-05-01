export type RiskLevel = "low" | "medium" | "high";

const RISK_SCORE: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3
};

export function maxRisk(...levels: RiskLevel[]): RiskLevel {
  return levels.reduce<RiskLevel>((highest, current) => (RISK_SCORE[current] > RISK_SCORE[highest] ? current : highest), "low");
}

export function riskLabel(level: RiskLevel) {
  return level === "high" ? "高风险" : level === "medium" ? "中风险" : "低风险";
}

export function scoreDroughtRisk(input: {
  soilMoisturePercent: number;
  temperatureC: number;
  rainfallMm: number;
  weatherTrend?: string | null;
}): RiskLevel {
  const trend = input.weatherTrend ?? "";
  if (input.soilMoisturePercent < 40 && input.temperatureC >= 32) return "high";
  if (input.soilMoisturePercent < 45 && /高温少雨|持续少雨/.test(trend)) return "high";
  if (input.soilMoisturePercent < 50) return "medium";
  if (/少雨|持续高温/.test(trend)) return "medium";
  return "low";
}

export function scoreFloodRisk(input: { rainfallMm: number; weatherTrend?: string | null }): RiskLevel {
  const trend = input.weatherTrend ?? "";
  if (input.rainfallMm >= 80 || /暴雨|强降雨/.test(trend)) return "high";
  if (input.rainfallMm >= 30 || /连续降雨/.test(trend)) return "medium";
  return "low";
}

export function scoreHeatRisk(input: { temperatureC: number }): RiskLevel {
  if (input.temperatureC >= 35) return "high";
  if (input.temperatureC >= 32) return "medium";
  return "low";
}

export function scoreBiologicalRisk(input: {
  pestDescription?: string | null;
  diseaseDescription?: string | null;
  weedDescription?: string | null;
}): RiskLevel {
  const text = [input.pestDescription, input.diseaseDescription, input.weedDescription].filter(Boolean).join(" ");
  if (!text.trim()) return "low";
  if (/严重|大量|扩散|病斑|虫口|成片/.test(text)) return "high";
  return "medium";
}

export function scoreGrowthRisk(input: { leafColor: "pale" | "normal" | "dark"; growthStatus: "weak" | "normal" | "vigorous" }): RiskLevel {
  if (input.leafColor === "pale" && input.growthStatus === "weak") return "high";
  if (input.leafColor === "pale" || input.growthStatus === "weak") return "medium";
  return "low";
}

export function scoreNutrientRisk(input: {
  nitrogenLevel: "low" | "normal" | "high";
  phosphorusLevel: "low" | "normal" | "high";
  potassiumLevel: "low" | "normal" | "high";
}): RiskLevel {
  const values = [input.nitrogenLevel, input.phosphorusLevel, input.potassiumLevel];
  const lows = values.filter((value) => value === "low").length;
  if (lows >= 2) return "high";
  if (lows === 1 || values.some((value) => value === "high")) return "medium";
  return "low";
}
