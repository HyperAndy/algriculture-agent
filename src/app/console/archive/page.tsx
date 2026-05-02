import { prisma } from "@/lib/db"
import { ArchiveClient } from "./archive-client"

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1)
  const pageSize = 20

  const [agentRuns, total] = await Promise.all([
    prisma.agentRun.findMany({
      include: {
        field: { select: { name: true, cropType: true } },
        _count: { select: { steps: true } },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.agentRun.count(),
  ])

  const mapped = agentRuns.map((r) => ({
    id: r.id,
    fieldName: r.field.name,
    cropType: r.field.cropType,
    overallRiskLevel: r.overallRiskLevel,
    summary: r.summary,
    createdAt: r.createdAt.toISOString(),
    stepCount: r._count.steps,
  }))

  return (
    <ArchiveClient
      agentRuns={mapped}
      page={page}
      totalPages={Math.ceil(total / pageSize)}
    />
  )
}
