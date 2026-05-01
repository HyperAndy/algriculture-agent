import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GROWTH_STAGES, type CropType } from "@/lib/domain/crops";

export async function GET() {
  const fields = await prisma.field.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      observations: { orderBy: { createdAt: "desc" }, take: 1 },
      agentRuns: { orderBy: { createdAt: "desc" }, take: 1 },
      tasks: { where: { status: "pending" } }
    }
  });
  return NextResponse.json({ fields });
}

export async function POST(request: Request) {
  const body = await request.json();
  const cropType = body.cropType as CropType;
  if (!body.name || !body.location || !cropType || !GROWTH_STAGES[cropType]?.includes(body.growthStage)) {
    return NextResponse.json({ error: "INVALID_FIELD", message: "地块名称、位置、作物和生育期必须填写正确。" }, { status: 400 });
  }
  if (Number(body.areaMu) <= 0) {
    return NextResponse.json({ error: "INVALID_AREA", message: "地块面积必须大于0。" }, { status: 400 });
  }

  const field = await prisma.field.create({
    data: {
      id: `field_${Date.now()}`,
      name: body.name,
      location: body.location,
      areaMu: Number(body.areaMu),
      cropType,
      variety: body.variety || "示范品种",
      growthStage: body.growthStage,
      sowingDate: body.sowingDate ? new Date(body.sowingDate) : new Date(),
      targetYieldKgPerMu: body.targetYieldKgPerMu ? Number(body.targetYieldKgPerMu) : null,
      riskLevel: "low"
    }
  });
  return NextResponse.json({ field }, { status: 201 });
}
