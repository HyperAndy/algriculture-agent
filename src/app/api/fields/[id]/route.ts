import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      observations: { orderBy: { createdAt: "desc" }, take: 5 },
      agentRuns: { orderBy: { createdAt: "desc" }, take: 5, include: { steps: true, tasks: true } },
      tasks: { orderBy: { dueDate: "asc" } }
    }
  });
  if (!field) {
    return NextResponse.json({ error: "FIELD_NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ field });
}
