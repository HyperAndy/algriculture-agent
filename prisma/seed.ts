import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.farmingTask.deleteMany();
  await prisma.agentStep.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.fieldObservation.deleteMany();
  await prisma.field.deleteMany();

  const fields = [
    {
      id: "field_rice_001",
      name: "江淮水稻示范田",
      location: "安徽省江淮示范区",
      areaMu: 150,
      cropType: "rice",
      variety: "示范品种",
      growthStage: "分蘖期",
      sowingDate: new Date("2026-04-10"),
      targetYieldKgPerMu: 650,
      riskLevel: "medium"
    },
    {
      id: "field_wheat_001",
      name: "黄淮麦田示范区",
      location: "河南省黄淮示范区",
      areaMu: 220,
      cropType: "wheat",
      variety: "示范品种",
      growthStage: "灌浆期",
      sowingDate: new Date("2025-10-18"),
      targetYieldKgPerMu: 560,
      riskLevel: "high"
    },
    {
      id: "field_corn_001",
      name: "东北玉米示范田",
      location: "吉林省黑土示范区",
      areaMu: 180,
      cropType: "corn",
      variety: "示范品种",
      growthStage: "拔节期",
      sowingDate: new Date("2026-04-25"),
      targetYieldKgPerMu: 720,
      riskLevel: "medium"
    },
    {
      id: "field_soybean_001",
      name: "黑土地大豆示范田",
      location: "黑龙江省示范区",
      areaMu: 160,
      cropType: "soybean",
      variety: "示范品种",
      growthStage: "开花期",
      sowingDate: new Date("2026-04-28"),
      targetYieldKgPerMu: 230,
      riskLevel: "medium"
    }
  ];

  for (const field of fields) {
    await prisma.field.create({ data: field });
  }

  await prisma.fieldObservation.createMany({
    data: [
      {
        fieldId: "field_corn_001",
        temperatureC: 34,
        rainfallMm: 0,
        windLevel: "3级",
        weatherTrend: "未来5天高温少雨",
        soilMoisturePercent: 38,
        soilTemperatureC: 27,
        soilPh: 6.8,
        nitrogenLevel: "normal",
        phosphorusLevel: "normal",
        potassiumLevel: "low",
        plantHeightCm: 65,
        leafColor: "pale",
        growthStatus: "weak",
        pestDescription: "少量虫咬叶片",
        diseaseDescription: "",
        weedDescription: "田间有零星杂草",
        notes: "部分叶片午后卷曲"
      },
      {
        fieldId: "field_wheat_001",
        temperatureC: 35,
        rainfallMm: 0,
        windLevel: "4级",
        weatherTrend: "灌浆期持续高温少雨",
        soilMoisturePercent: 42,
        soilTemperatureC: 25,
        soilPh: 7.1,
        nitrogenLevel: "normal",
        phosphorusLevel: "normal",
        potassiumLevel: "normal",
        plantHeightCm: 78,
        leafColor: "normal",
        growthStatus: "normal",
        pestDescription: "",
        diseaseDescription: "",
        weedDescription: "",
        notes: "需关注干热风风险"
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
