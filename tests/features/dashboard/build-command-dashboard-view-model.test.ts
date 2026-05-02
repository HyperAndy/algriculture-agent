import { describe, expect, it } from "vitest";
import { buildCommandDashboardViewModel } from "@/features/dashboard/server/build-command-dashboard-view-model";

const now = new Date("2026-05-03T01:02:03+08:00");

describe("buildCommandDashboardViewModel", () => {
  it("uses mixed mode when real fields exist and tasks fall back", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [
        {
          id: "field_1",
          name: "真实玉米田",
          location: "吉林省",
          areaMu: 100,
          cropType: "corn",
          variety: "耐密玉米",
          growthStage: "拔节期",
          riskLevel: "high",
        },
        {
          id: "field_2",
          name: "真实水稻田",
          location: "安徽省",
          areaMu: 90,
          cropType: "rice",
          variety: "优质稻",
          growthStage: "分蘖期",
          riskLevel: "low",
        },
        {
          id: "field_3",
          name: "真实小麦田",
          location: "河南省",
          areaMu: 80,
          cropType: "wheat",
          variety: "强筋小麦",
          growthStage: "灌浆期",
          riskLevel: "medium",
        },
        {
          id: "field_4",
          name: "真实大豆田",
          location: "黑龙江省",
          areaMu: 70,
          cropType: "soybean",
          variety: "高蛋白大豆",
          growthStage: "开花期",
          riskLevel: "low",
        },
      ],
      tasks: [],
      latestRun: null,
    });

    expect(vm.source.mode).toBe("mixed");
    expect(vm.fields).toHaveLength(4);
    expect(vm.fields[0]?.name).toBe("真实玉米田");
    expect(vm.tasks.length).toBeGreaterThan(0);
    expect(vm.source.fallbackReasons).toContain("tasks missing");
  });

  it("uses demo mode when real fields are missing", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [],
      tasks: [],
      latestRun: null,
    });

    expect(vm.source.mode).toBe("demo");
    expect(vm.fields).toHaveLength(4);
    expect(vm.fields[0]?.name).toBe("江淮水稻示范田");
    expect(vm.source.fallbackReasons).toContain("fields missing");
  });

  it("uses full demo data when fields are missing even if tasks and runs are supplied", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [],
      tasks: [
        {
          id: "real_task",
          title: "真实任务",
          description: "不应混入字段缺失的大屏模型",
          priority: "high",
          status: "pending",
          dueDate: now.toISOString(),
          fieldId: "missing_field",
          fieldName: "缺失地块",
        },
      ],
      latestRun: {
        id: "real_run",
        fieldId: "missing_field",
        fieldName: "缺失地块",
        overallRiskLevel: "high",
        summary: "不应混入字段缺失的大屏模型",
        recommendations: "[]",
        createdAt: now.toISOString(),
        steps: [],
      },
    });

    expect(vm.source.mode).toBe("demo");
    expect(vm.fields[0]?.id).toBe("demo_field_rice");
    expect(vm.tasks[0]?.id).toBe("demo_task_irrigation");
    expect(vm.latestRun?.id).toBe("demo_agent_run");
    expect(vm.source.fallbackReasons).toEqual(["fields missing"]);
  });

  it("uses mixed mode when tasks or latest run are missing", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [
        {
          id: "field_1",
          name: "真实玉米田",
          location: "吉林省",
          areaMu: 100,
          cropType: "corn",
          variety: null,
          growthStage: "拔节期",
          riskLevel: "high",
        },
      ],
      tasks: [],
      latestRun: null,
    });

    expect(vm.source.mode).toBe("mixed");
    expect(vm.fields[0]?.name).toBe("真实玉米田");
    expect(vm.tasks.length).toBeGreaterThan(0);
    expect(vm.latestRun?.id).toBe("demo_agent_run");
    expect(vm.source.fallbackReasons).toEqual(["tasks missing", "latest run missing"]);
  });
});
