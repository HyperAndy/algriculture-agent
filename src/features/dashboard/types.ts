import type { RiskLevel } from "@/domain/risk/risk-level";

export type DemoRiskLevel = RiskLevel | string;

export interface CommandDashboardField {
  id: string;
  name: string;
  location: string;
  areaMu: number;
  cropType: string;
  variety: string | null;
  growthStage: string;
  riskLevel: DemoRiskLevel;
}

export interface CommandDashboardTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  fieldId: string;
  fieldName: string;
}

export interface CommandDashboardAgentStep {
  id: string;
  agentName: string;
  status: string;
  inputSummary: string;
  outputSummary: string;
}

export interface CommandDashboardLatestRun {
  id: string;
  fieldId: string;
  fieldName: string;
  overallRiskLevel: DemoRiskLevel;
  summary: string;
  recommendations: string;
  createdAt: string;
  steps: CommandDashboardAgentStep[];
}

export interface CommandDashboardSource {
  mode: "real" | "mixed" | "demo";
  fallbackReasons: string[];
}

export interface CommandDashboardViewModel {
  generatedAt: string;
  formattedTime: string;
  fields: CommandDashboardField[];
  tasks: CommandDashboardTask[];
  latestRun: CommandDashboardLatestRun | null;
  source: CommandDashboardSource;
}
