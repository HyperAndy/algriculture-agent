import type { AgentRunResult, FarmingTaskDraft, FieldInput, ObservationInput } from "./types";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function generateTaskDrafts(field: FieldInput, observation: ObservationInput, report: AgentRunResult, now = new Date()): FarmingTaskDraft[] {
  const tasks: FarmingTaskDraft[] = [];
  const text = `${report.reasoning}\n${report.recommendations.join("\n")}`;

  if (report.overallRiskLevel === "high" && (observation.soilMoisturePercent < 45 || /干旱|缺水|高温少雨/.test(text))) {
    tasks.push({
      title: "安排补灌",
      description: `${field.name}墒情${observation.soilMoisturePercent}%，请结合水源条件安排补灌并避开高温时段。`,
      priority: "high",
      dueDate: addDays(now, 1)
    });
  }

  if ([observation.pestDescription, observation.diseaseDescription, observation.weedDescription].some((value) => value && value.trim())) {
    tasks.push({
      title: "开展病虫草害复查",
      description: "复查病虫草害发生范围，记录照片和扩散趋势，必要时联系农技员确认防治方案。",
      priority: report.overallRiskLevel === "high" ? "high" : "medium",
      dueDate: addDays(now, 2)
    });
  }

  if ([observation.nitrogenLevel, observation.phosphorusLevel, observation.potassiumLevel].some((value) => value === "low") || observation.leafColor === "pale" || observation.growthStatus === "weak") {
    tasks.push({
      title: "评估追肥方案",
      description: "结合叶色、长势和养分指标评估追肥，避免在高温时段作业。",
      priority: "medium",
      dueDate: addDays(now, 3)
    });
  }

  tasks.push({
    title: "复查地块状态",
    description: `复查${field.cropLabel}${field.growthStage}的苗情、墒情和病虫草害变化，并更新农事档案。`,
    priority: report.overallRiskLevel === "low" ? "low" : "medium",
    dueDate: addDays(now, 3)
  });

  return tasks;
}
