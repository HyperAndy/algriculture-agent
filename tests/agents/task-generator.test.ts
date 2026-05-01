import { describe, expect, test } from "vitest";
import { generateTaskDrafts } from "@/lib/agents/task-generator";
import { runMockFieldAnalysis } from "@/lib/agents/orchestrator";
import { cornField, dryCornObservation } from "./test-fixtures";

describe("farming task generation", () => {
  test("creates irrigation, pest review, nutrient, and follow-up tasks from a dry corn report", () => {
    const report = runMockFieldAnalysis(cornField, dryCornObservation);
    const tasks = generateTaskDrafts(cornField, dryCornObservation, report, new Date("2026-05-01T00:00:00.000Z"));

    expect(tasks.some((task) => task.title === "安排补灌")).toBe(true);
    expect(tasks.some((task) => task.title === "开展病虫草害复查")).toBe(true);
    expect(tasks.some((task) => task.title === "评估追肥方案")).toBe(true);
    expect(tasks.some((task) => task.title === "复查地块状态")).toBe(true);
  });
});
