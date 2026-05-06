import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fieldFindMany: vi.fn(),
  farmingTaskFindMany: vi.fn(),
  agentRunFindFirst: vi.fn(),
  buildCommandDashboardViewModel: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    field: { findMany: mocks.fieldFindMany },
    farmingTask: { findMany: mocks.farmingTaskFindMany },
    agentRun: { findFirst: mocks.agentRunFindFirst },
  },
}));

vi.mock("@/features/dashboard/server/build-command-dashboard-view-model", () => ({
  buildCommandDashboardViewModel: mocks.buildCommandDashboardViewModel,
}));

describe("getCommandDashboardViewModel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("loads Prisma dashboard data, sorts tasks by priority rank, and delegates ViewModel building", async () => {
    const now = new Date("2026-05-03T01:02:03.000Z");
    const earlyDueDate = new Date("2026-05-04T00:00:00.000Z");
    const lateDueDate = new Date("2026-05-05T00:00:00.000Z");
    const runCreatedAt = new Date("2026-05-03T02:00:00.000Z");
    const expectedViewModel = { generatedAt: now.toISOString() };

    mocks.fieldFindMany.mockResolvedValue([
      {
        id: "field_1",
        name: "North Field",
        location: "Jilin",
        areaMu: 100,
        cropType: "corn",
        variety: null,
        growthStage: "jointing",
        riskLevel: "high",
      },
    ]);
    mocks.farmingTaskFindMany.mockResolvedValue([
      {
        id: "task_low",
        title: "Weed",
        description: "Remove weeds",
        priority: "low",
        status: "pending",
        dueDate: earlyDueDate,
        fieldId: "field_1",
        field: { name: "North Field" },
      },
      {
        id: "task_high",
        title: "Irrigate",
        description: "Add water",
        priority: "high",
        status: "pending",
        dueDate: lateDueDate,
        fieldId: "field_1",
        field: { name: "North Field" },
      },
      {
        id: "task_medium",
        title: "Check pests",
        description: "Inspect pest pressure",
        priority: "medium",
        status: "pending",
        dueDate: earlyDueDate,
        fieldId: "field_1",
        field: { name: "North Field" },
      },
    ]);
    mocks.agentRunFindFirst.mockResolvedValue({
      id: "run_1",
      fieldId: "field_1",
      field: { name: "North Field" },
      overallRiskLevel: "medium",
      summary: "Crop stress detected",
      recommendations: "[]",
      createdAt: runCreatedAt,
      steps: [
        {
          id: "step_1",
          agentName: "Weather Agent",
          status: "completed",
          inputSummary: "Weather input",
          outputSummary: "Weather output",
        },
      ],
    });
    mocks.buildCommandDashboardViewModel.mockReturnValue(expectedViewModel);

    const { getCommandDashboardViewModel } = await import(
      "@/features/dashboard/server/get-command-dashboard-view-model"
    );

    await expect(getCommandDashboardViewModel(now)).resolves.toBe(expectedViewModel);

    expect(mocks.fieldFindMany).toHaveBeenCalledWith({ orderBy: { createdAt: "asc" } });
    expect(mocks.farmingTaskFindMany).toHaveBeenCalledWith({
      where: { status: "pending" },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
      include: { field: true },
    });
    expect(mocks.agentRunFindFirst).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      include: {
        steps: { orderBy: { startedAt: "asc" } },
        field: true,
      },
    });
    expect(mocks.buildCommandDashboardViewModel).toHaveBeenCalledWith({
      now,
      fields: [
        {
          id: "field_1",
          name: "North Field",
          location: "Jilin",
          areaMu: 100,
          cropType: "corn",
          variety: null,
          growthStage: "jointing",
          riskLevel: "high",
        },
      ],
      tasks: [
        {
          id: "task_high",
          title: "Irrigate",
          description: "Add water",
          priority: "high",
          status: "pending",
          dueDate: lateDueDate.toISOString(),
          fieldId: "field_1",
          fieldName: "North Field",
        },
        {
          id: "task_medium",
          title: "Check pests",
          description: "Inspect pest pressure",
          priority: "medium",
          status: "pending",
          dueDate: earlyDueDate.toISOString(),
          fieldId: "field_1",
          fieldName: "North Field",
        },
        {
          id: "task_low",
          title: "Weed",
          description: "Remove weeds",
          priority: "low",
          status: "pending",
          dueDate: earlyDueDate.toISOString(),
          fieldId: "field_1",
          fieldName: "North Field",
        },
      ],
      latestRun: {
        id: "run_1",
        fieldId: "field_1",
        fieldName: "North Field",
        overallRiskLevel: "medium",
        summary: "Crop stress detected",
        recommendations: "[]",
        createdAt: runCreatedAt.toISOString(),
        steps: [
          {
            id: "step_1",
            agentName: "Weather Agent",
            status: "completed",
            inputSummary: "Weather input",
            outputSummary: "Weather output",
          },
        ],
      },
    });
  });

  it("falls back to demo input when Prisma is unavailable", async () => {
    const now = new Date("2026-05-03T01:02:03.000Z");
    const expectedViewModel = { generatedAt: now.toISOString(), source: { mode: "demo" } };

    mocks.fieldFindMany.mockRejectedValue(new Error("database unavailable"));
    mocks.farmingTaskFindMany.mockResolvedValue([]);
    mocks.agentRunFindFirst.mockResolvedValue(null);
    mocks.buildCommandDashboardViewModel.mockReturnValue(expectedViewModel);

    const { getCommandDashboardViewModel } = await import(
      "@/features/dashboard/server/get-command-dashboard-view-model"
    );

    await expect(getCommandDashboardViewModel(now)).resolves.toBe(expectedViewModel);
    expect(mocks.buildCommandDashboardViewModel).toHaveBeenCalledWith({
      now,
      fields: [],
      tasks: [],
      latestRun: null,
    });
  });
});
