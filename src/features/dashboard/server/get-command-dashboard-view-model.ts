import { prisma } from "@/lib/db";
import { buildCommandDashboardViewModel } from "./build-command-dashboard-view-model";
import type {
  CommandDashboardField,
  CommandDashboardLatestRun,
  CommandDashboardTask,
} from "@/features/dashboard/types";

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export async function getCommandDashboardViewModel(now = new Date()) {
  try {
    const [fieldRecords, taskRecords, latestRunRecord] = await Promise.all([
      prisma.field.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.farmingTask.findMany({
        where: { status: "pending" },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
        include: { field: true },
      }),
      prisma.agentRun.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          steps: { orderBy: { startedAt: "asc" } },
          field: true,
        },
      }),
    ]);

    const fields: CommandDashboardField[] = fieldRecords.map((field) => ({
      id: field.id,
      name: field.name,
      location: field.location,
      areaMu: field.areaMu,
      cropType: field.cropType,
      variety: field.variety,
      growthStage: field.growthStage,
      riskLevel: field.riskLevel,
    }));

    const tasks: CommandDashboardTask[] = [...taskRecords]
      .sort((a, b) => {
        const priorityDiff = (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);
        if (priorityDiff !== 0) return priorityDiff;

        return a.dueDate.getTime() - b.dueDate.getTime();
      })
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString(),
        fieldId: task.fieldId,
        fieldName: task.field.name,
      }));

    const latestRun: CommandDashboardLatestRun | null = latestRunRecord
      ? {
          id: latestRunRecord.id,
          fieldId: latestRunRecord.fieldId,
          fieldName: latestRunRecord.field.name,
          overallRiskLevel: latestRunRecord.overallRiskLevel,
          summary: latestRunRecord.summary,
          recommendations: latestRunRecord.recommendations,
          createdAt: latestRunRecord.createdAt.toISOString(),
          steps: latestRunRecord.steps.map((step) => ({
            id: step.id,
            agentName: step.agentName,
            status: step.status,
            inputSummary: step.inputSummary,
            outputSummary: step.outputSummary,
          })),
        }
      : null;

    return buildCommandDashboardViewModel({ now, fields, tasks, latestRun });
  } catch {
    return buildCommandDashboardViewModel({
      now,
      fields: [],
      tasks: [],
      latestRun: null,
    });
  }
}
