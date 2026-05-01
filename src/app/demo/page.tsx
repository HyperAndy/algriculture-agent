import { prisma } from "@/lib/db";
import { CommandCenter } from "@/components/command-center/command-center";
import type { CommandCenterData } from "@/components/command-center/types";

export default async function DemoPage() {
  const [fields, tasks, latestRun] = await Promise.all([
    prisma.field.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.farmingTask.findMany({
      where: { status: "pending" },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      include: { field: true }
    }),
    prisma.agentRun.findFirst({
      orderBy: { createdAt: "desc" },
      include: { steps: { orderBy: { startedAt: "asc" } }, field: true }
    })
  ]);

  const data: CommandCenterData = {
    fields: fields.map((field) => ({
      id: field.id,
      name: field.name,
      location: field.location,
      areaMu: field.areaMu,
      cropType: field.cropType,
      variety: field.variety,
      growthStage: field.growthStage,
      riskLevel: field.riskLevel
    })),
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.toISOString(),
      fieldId: task.fieldId,
      fieldName: task.field.name
    })),
    latestRun: latestRun
      ? {
          id: latestRun.id,
          fieldId: latestRun.fieldId,
          fieldName: latestRun.field.name,
          overallRiskLevel: latestRun.overallRiskLevel,
          summary: latestRun.summary,
          recommendations: latestRun.recommendations,
          createdAt: latestRun.createdAt.toISOString(),
          steps: latestRun.steps.map((step) => ({
            id: step.id,
            agentName: step.agentName,
            status: step.status,
            inputSummary: step.inputSummary,
            outputSummary: step.outputSummary
          }))
        }
      : null
  };

  return <CommandCenter data={data} />;
}
