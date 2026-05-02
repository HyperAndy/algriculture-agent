import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 100);

    const observations = await prisma.fieldObservation.findMany({
      where: { fieldId: id },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: { field: true }
    });

    const hasMore = observations.length > limit;
    const data = observations.slice(0, limit);
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return NextResponse.json({ observations: data, nextCursor });
  } catch {
    return NextResponse.json({ error: "OBSERVATIONS_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const soilMoisturePercent = Number(body.soilMoisturePercent);
  const rainfallMm = Number(body.rainfallMm);
  if (Number.isNaN(soilMoisturePercent) || soilMoisturePercent < 0 || soilMoisturePercent > 100) {
    return NextResponse.json({ error: "INVALID_SOIL_MOISTURE", message: "土壤墒情必须在0-100之间。" }, { status: 400 });
  }
  if (Number.isNaN(rainfallMm) || rainfallMm < 0) {
    return NextResponse.json({ error: "INVALID_RAINFALL", message: "降雨量不能小于0。" }, { status: 400 });
  }

  const field = await prisma.field.findUnique({ where: { id } });
  if (!field) {
    return NextResponse.json({ error: "FIELD_NOT_FOUND" }, { status: 404 });
  }

  const observation = await prisma.fieldObservation.create({
    data: {
      fieldId: id,
      temperatureC: Number(body.temperatureC),
      rainfallMm,
      windLevel: body.windLevel || null,
      weatherTrend: body.weatherTrend || "天气趋势未填写",
      soilMoisturePercent,
      soilTemperatureC: body.soilTemperatureC ? Number(body.soilTemperatureC) : null,
      soilPh: body.soilPh ? Number(body.soilPh) : null,
      nitrogenLevel: body.nitrogenLevel || "normal",
      phosphorusLevel: body.phosphorusLevel || "normal",
      potassiumLevel: body.potassiumLevel || "normal",
      plantHeightCm: body.plantHeightCm ? Number(body.plantHeightCm) : null,
      leafColor: body.leafColor || "normal",
      growthStatus: body.growthStatus || "normal",
      pestDescription: body.pestDescription || "",
      diseaseDescription: body.diseaseDescription || "",
      weedDescription: body.weedDescription || "",
      lastIrrigationDate: body.lastIrrigationDate ? new Date(body.lastIrrigationDate) : null,
      lastFertilizationDate: body.lastFertilizationDate ? new Date(body.lastFertilizationDate) : null,
      lastPesticideDate: body.lastPesticideDate ? new Date(body.lastPesticideDate) : null,
      notes: body.notes || ""
    }
  });

  return NextResponse.json({ observation }, { status: 201 });
}
