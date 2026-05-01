import { prisma } from "@/lib/db";
import { toFieldInput, toObservationInput } from "@/lib/data-mappers";
import { runMockFieldAnalysis } from "./orchestrator";
import { generateTaskDrafts } from "./task-generator";

export async function runAndPersistFieldAnalysis(fieldId: string) {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: {
      observations: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!field) {
    throw new Error("FIELD_NOT_FOUND");
  }

  const observation = field.observations[0];
  if (!observation) {
    throw new Error("OBSERVATION_REQUIRED");
  }

  const fieldInput = toFieldInput(field);
  const observationInput = toObservationInput(observation);
  const result = runMockFieldAnalysis(fieldInput, observationInput);

  const run = await prisma.agentRun.create({
    data: {
      fieldId: field.id,
      observationId: observation.id,
      status: "completed",
      overallRiskLevel: result.overallRiskLevel,
      summary: result.summary,
      reasoning: result.reasoning,
      recommendations: JSON.stringify(result.recommendations),
      completedAt: new Date(),
      steps: {
        create: result.steps.map((step) => ({
          agentName: step.agentName,
          status: "completed",
          inputSummary: step.inputSummary,
          outputSummary: step.outputSummary,
          completedAt: new Date()
        }))
      }
    },
    include: { steps: true }
  });

  const taskDrafts = generateTaskDrafts(fieldInput, observationInput, result);
  await prisma.farmingTask.createMany({
    data: taskDrafts.map((task) => ({
      fieldId: field.id,
      agentRunId: run.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: "pending"
    }))
  });

  await prisma.field.update({
    where: { id: field.id },
    data: { riskLevel: result.overallRiskLevel }
  });

  return prisma.agentRun.findUniqueOrThrow({
    where: { id: run.id },
    include: {
      steps: true,
      tasks: true,
      field: true,
      observation: true
    }
  });
}

export function parseRecommendations(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
