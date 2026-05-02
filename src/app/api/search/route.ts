import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q) {
      return NextResponse.json({ error: "QUERY_REQUIRED" }, { status: 400 });
    }

    const [fields, reports, tasks] = await Promise.all([
      prisma.field.findMany({
        where: { name: { contains: q } },
        select: { id: true, name: true },
        take: 20
      }),
      prisma.agentRun.findMany({
        where: { summary: { contains: q } },
        select: { id: true, summary: true, field: { select: { name: true } } },
        take: 20
      }),
      prisma.farmingTask.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } }
          ]
        },
        select: { id: true, title: true, description: true },
        take: 20
      })
    ]);

    return NextResponse.json({
      fields: fields.map((f) => ({
        id: f.id,
        type: "field",
        title: f.name,
        subtitle: "",
        href: `/fields/${f.id}`
      })),
      reports: reports.map((r) => ({
        id: r.id,
        type: "report",
        title: r.field.name,
        subtitle: r.summary,
        href: `/reports/${r.id}`
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        type: "task",
        title: t.title,
        subtitle: t.description,
        href: `/tasks/${t.id}`
      }))
    });
  } catch {
    return NextResponse.json({ error: "SEARCH_FAILED" }, { status: 500 });
  }
}
