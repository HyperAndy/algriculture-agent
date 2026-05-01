import { describe, expect, test } from "vitest";
import { runMockFieldAnalysis } from "@/lib/agents/orchestrator";
import { cornField, dryCornObservation } from "./test-fixtures";

describe("mock field analysis orchestrator", () => {
  test("runs six agents and returns a structured Chinese report", () => {
    const result = runMockFieldAnalysis(cornField, dryCornObservation);

    expect(result.steps).toHaveLength(6);
    expect(result.summary).toContain("玉米");
    expect(result.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(["low", "medium", "high"]).toContain(result.overallRiskLevel);
    expect(result.reasoning).toContain("长链推理");
  });
});
