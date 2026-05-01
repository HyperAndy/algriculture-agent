import type { FieldInput, ObservationInput } from "@/lib/agents/types";

export const cornField: FieldInput = {
  id: "field_corn_001",
  name: "东北玉米示范田",
  location: "吉林省示范区",
  areaMu: 120,
  cropType: "corn",
  cropLabel: "玉米",
  variety: "示范品种",
  growthStage: "拔节期",
  targetYieldKgPerMu: 650
};

export const dryCornObservation: ObservationInput = {
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
};
