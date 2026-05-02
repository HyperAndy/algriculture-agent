import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "INVALID_IDS" }, { status: 400 });
    }
    if (action !== "complete" && action !== "pending") {
      return NextResponse.json({ error: "INVALID_ACTION" }, { status: 400 });
    }

    const status = action === "complete" ? "completed" : "pending";
    const result = await prisma.farmingTask.updateMany({
      where: { id: { in: ids } },
      data: {
        status,
        completedAt: action === "complete" ? new Date() : null
      }
    });

    return NextResponse.json({ updated: result.count });
  } catch {
    return NextResponse.json({ error: "BATCH_UPDATE_FAILED" }, { status: 500 });
  }
}
