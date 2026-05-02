export type DemoRiskLevel = "low" | "medium" | "high" | string;

export interface CommandField {
  id: string;
  name: string;
  location: string;
  areaMu: number;
  cropType: string;
  variety: string | null;
  growthStage: string;
  riskLevel: DemoRiskLevel;
}

export interface CommandTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  fieldId: string;
  fieldName: string;
}

export interface CommandAgentStep {
  id: string;
  agentName: string;
  status: string;
  inputSummary: string;
  outputSummary: string;
}

export interface CommandLatestRun {
  id: string;
  fieldId: string;
  fieldName: string;
  overallRiskLevel: DemoRiskLevel;
  summary: string;
  recommendations: string;
  createdAt: string;
  steps: CommandAgentStep[];
}

export interface CommandCenterData {
  generatedAt: string;
  formattedTime: string;
  fields: CommandField[];
  tasks: CommandTask[];
  latestRun: CommandLatestRun | null;
}
