import type { CropType } from "@/lib/domain/crops";
import type { RiskLevel } from "@/lib/domain/risk";

export type AgentName =
  | "田间感知Agent"
  | "作物诊断Agent"
  | "病虫草害预警Agent"
  | "水肥决策Agent"
  | "灾害应对Agent"
  | "农事档案Agent";

export interface FieldInput {
  id: string;
  name: string;
  location: string;
  areaMu: number;
  cropType: CropType;
  cropLabel: string;
  variety?: string | null;
  growthStage: string;
  targetYieldKgPerMu?: number | null;
}

export interface ObservationInput {
  temperatureC: number;
  rainfallMm: number;
  windLevel?: string | null;
  weatherTrend: string;
  soilMoisturePercent: number;
  soilTemperatureC?: number | null;
  soilPh?: number | null;
  nitrogenLevel: "low" | "normal" | "high";
  phosphorusLevel: "low" | "normal" | "high";
  potassiumLevel: "low" | "normal" | "high";
  plantHeightCm?: number | null;
  leafColor: "pale" | "normal" | "dark";
  growthStatus: "weak" | "normal" | "vigorous";
  pestDescription?: string | null;
  diseaseDescription?: string | null;
  weedDescription?: string | null;
  notes?: string | null;
}

export interface AgentStepResult {
  agentName: AgentName;
  inputSummary: string;
  outputSummary: string;
  riskLevel?: RiskLevel;
  signals?: string[];
}

export interface AgentRunResult {
  overallRiskLevel: RiskLevel;
  summary: string;
  reasoning: string;
  recommendations: string[];
  steps: AgentStepResult[];
}

export interface FarmingTaskDraft {
  title: string;
  description: string;
  priority: RiskLevel;
  dueDate: Date;
}
