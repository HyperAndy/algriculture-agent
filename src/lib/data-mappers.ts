import { getCropLabel, type CropType } from "@/lib/domain/crops";
import type { FieldInput, ObservationInput } from "@/lib/agents/types";

type FieldRecord = {
  id: string;
  name: string;
  location: string;
  areaMu: number;
  cropType: string;
  variety: string | null;
  growthStage: string;
  targetYieldKgPerMu: number | null;
};

type ObservationRecord = {
  temperatureC: number;
  rainfallMm: number;
  windLevel: string | null;
  weatherTrend: string;
  soilMoisturePercent: number;
  soilTemperatureC: number | null;
  soilPh: number | null;
  nitrogenLevel: string;
  phosphorusLevel: string;
  potassiumLevel: string;
  plantHeightCm: number | null;
  leafColor: string;
  growthStatus: string;
  pestDescription: string | null;
  diseaseDescription: string | null;
  weedDescription: string | null;
  notes: string | null;
};

export function toFieldInput(field: FieldRecord): FieldInput {
  const cropType = field.cropType as CropType;
  return {
    id: field.id,
    name: field.name,
    location: field.location,
    areaMu: field.areaMu,
    cropType,
    cropLabel: getCropLabel(cropType),
    variety: field.variety,
    growthStage: field.growthStage,
    targetYieldKgPerMu: field.targetYieldKgPerMu
  };
}

export function toObservationInput(observation: ObservationRecord): ObservationInput {
  return {
    temperatureC: observation.temperatureC,
    rainfallMm: observation.rainfallMm,
    windLevel: observation.windLevel,
    weatherTrend: observation.weatherTrend,
    soilMoisturePercent: observation.soilMoisturePercent,
    soilTemperatureC: observation.soilTemperatureC,
    soilPh: observation.soilPh,
    nitrogenLevel: observation.nitrogenLevel as "low" | "normal" | "high",
    phosphorusLevel: observation.phosphorusLevel as "low" | "normal" | "high",
    potassiumLevel: observation.potassiumLevel as "low" | "normal" | "high",
    plantHeightCm: observation.plantHeightCm,
    leafColor: observation.leafColor as "pale" | "normal" | "dark",
    growthStatus: observation.growthStatus as "weak" | "normal" | "vigorous",
    pestDescription: observation.pestDescription,
    diseaseDescription: observation.diseaseDescription,
    weedDescription: observation.weedDescription,
    notes: observation.notes
  };
}
