import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const risk = searchParams.get("risk");
    const crop = searchParams.get("crop");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);

    const where: Record<string, unknown> = {};
    if (q) where.summary = { contains: q };
    if (risk) where.overallRiskLevel = risk;
    if (crop) where.field = { cropType: crop };
    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.createdAt = dateFilter;
    }

    const [data, total] = await Promise.all([
      prisma.agentRun.findMany({
        where,
        include: { field: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.agentRun.count({ where })
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch {
    return NextResponse.json({ error: "ARCHIVE_SEARCH_FAILED" }, { status: 500 });
  }
}
