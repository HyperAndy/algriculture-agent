export const RISK_LEVELS = ["low", "medium", "high"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];
export type RiskLevelInput = RiskLevel | string | null | undefined;

export function normalizeRiskLevel(level: RiskLevelInput): RiskLevel {
  if (level === "high" || level === "medium" || level === "low") {
    return level;
  }

  return "low";
}

export function riskRank(level: RiskLevelInput): number {
  const normalized = normalizeRiskLevel(level);
  if (normalized === "high") return 3;
  if (normalized === "medium") return 2;
  return 1;
}
