import Link from "next/link"
import { prisma } from "@/lib/db"
import { FieldDetailClient } from "@/components/console/field-detail-client"

export default async function FieldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      observations: { orderBy: { createdAt: "desc" }, take: 1 },
      agentRuns: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { steps: true },
      },
      tasks: { orderBy: [{ priority: "asc" }, { dueDate: "asc" }] },
    },
  })

  const observationHistory = await prisma.fieldObservation.findMany({
    where: { fieldId: id },
    orderBy: { createdAt: "desc" },
    take: 7,
  })

  if (!field) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold">地块不存在</h1>
        <p className="text-muted-foreground">
          未找到该地块，或已被删除。
        </p>
        <Link
          href="/console/fields"
          className="inline-block text-sm text-primary underline underline-offset-4 hover:no-underline"
        >
          返回地块列表
        </Link>
      </div>
    )
  }

  const serializeObs = (o: (typeof field.observations)[number]) =>
    o == null
      ? null
      : {
          id: o.id,
          temperatureC: o.temperatureC,
          rainfallMm: o.rainfallMm,
          soilMoisturePercent: o.soilMoisturePercent,
          soilPh: o.soilPh,
          plantHeightCm: o.plantHeightCm,
          leafColor: o.leafColor,
          growthStatus: o.growthStatus,
          weatherTrend: o.weatherTrend,
          createdAt: o.createdAt.toISOString(),
        }

  const run = field.agentRuns[0]

  const serialized = {
    id: field.id,
    name: field.name,
    location: field.location,
    areaMu: field.areaMu,
    cropType: field.cropType,
    variety: field.variety,
    growthStage: field.growthStage,
    riskLevel: field.riskLevel,
    createdAt: field.createdAt.toISOString(),
    latestObservation: serializeObs(field.observations[0]),
    latestAgentRun: run
      ? {
          id: run.id,
          status: run.status,
          overallRiskLevel: run.overallRiskLevel,
          summary: run.summary,
          reasoning: run.reasoning,
          recommendations: run.recommendations,
          createdAt: run.createdAt.toISOString(),
          steps: run.steps.map((s) => ({
            id: s.id,
            agentName: s.agentName,
            status: s.status,
            inputSummary: s.inputSummary,
            outputSummary: s.outputSummary,
          })),
        }
      : null,
    tasks: field.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
    })),
    observationHistory: observationHistory.map((o) => ({
      id: o.id,
      temperatureC: o.temperatureC,
      rainfallMm: o.rainfallMm,
      soilMoisturePercent: o.soilMoisturePercent,
      soilPh: o.soilPh,
      plantHeightCm: o.plantHeightCm,
      leafColor: o.leafColor,
      growthStatus: o.growthStatus,
      weatherTrend: o.weatherTrend,
      createdAt: o.createdAt.toISOString(),
    })),
  }

  return <FieldDetailClient field={serialized} />
}
