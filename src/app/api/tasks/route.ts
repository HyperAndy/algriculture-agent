import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tasks = await prisma.farmingTask.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ status: "desc" }, { dueDate: "asc" }],
    include: { field: true }
  });
  return NextResponse.json({ tasks });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!body.taskId || !body.status) {
    return NextResponse.json({ error: "INVALID_TASK_UPDATE" }, { status: 400 });
  }
  const existing = await prisma.farmingTask.findUnique({ where: { id: body.taskId } });
  if (!existing) {
    return NextResponse.json({ error: "TASK_NOT_FOUND" }, { status: 404 });
  }
  const task = await prisma.farmingTask.update({
    where: { id: body.taskId },
    data: {
      status: body.status,
      completedAt: body.status === "completed" ? new Date() : null
    }
  });
  return NextResponse.json({ task });
}
