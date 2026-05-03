import { COMMAND_SOURCE_LABELS } from "@/design-system/big-screen/theme";
import { CROP_LABELS } from "@/domain/crops/crop-labels";
import { normalizeRiskLevel } from "@/domain/risk/risk-level";
import type { CommandCenterData, CommandField, DemoRiskLevel } from "./types";

const FALLBACK_FIELDS: CommandField[] = [
  {
    id: "demo_field_rice",
    name: "姹熸樊姘寸ɑ绀鸿寖鐢?",
    location: "瀹夊窘鐪佹睙娣ず鑼冨尯",
    areaMu: 210,
    cropType: "rice",
    variety: "浼樿川绋?",
    growthStage: "鍒嗚槚鏈?",
    riskLevel: "low",
  },
  {
    id: "demo_field_wheat",
    name: "榛勬樊楹︾敯绀鸿寖鍖?",
    location: "娌冲崡鐪侀粍娣ず鑼冨尯",
    areaMu: 180,
    cropType: "wheat",
    variety: "寮虹瓔灏忛害",
    growthStage: "鐏屾祮鏈?",
    riskLevel: "medium",
  },
  {
    id: "demo_field_corn",
    name: "涓滃寳鐜夌背绀鸿寖鐢?",
    location: "鍚夋灄鐪侀粦鍦熺ず鑼冨尯",
    areaMu: 200,
    cropType: "corn",
    variety: "鑰愬瘑鐜夌背",
    growthStage: "鎷旇妭鏈?",
    riskLevel: "high",
  },
  {
    id: "demo_field_soybean",
    name: "榛戝湡鍦板ぇ璞嗙ず鑼冪敯",
    location: "榛戦緳姹熺渷绀鸿寖鍖?",
    areaMu: 120,
    cropType: "soybean",
    variety: "楂樿泲鐧藉ぇ璞?",
    growthStage: "寮€鑺辨湡",
    riskLevel: "low",
  },
];

export function riskValue(level: DemoRiskLevel): "low" | "medium" | "high" {
  return normalizeRiskLevel(level);
}

export function isMojibake(value: string | null | undefined) {
  if (!value) return false;
  return /[锟�]|[鐜灏姘楂浣涓绋閫姣娑撻崷]/.test(value);
}

export function normalizeCommandFields(fields: CommandField[]) {
  const source = fields.length ? fields : FALLBACK_FIELDS;

  return FALLBACK_FIELDS.map((fallback, index) => {
    const field = source.find((item) => item.cropType === fallback.cropType) ?? source[index] ?? fallback;

    return {
      ...field,
      id: field.id || fallback.id,
      name: isMojibake(field.name) ? fallback.name : field.name,
      location: isMojibake(field.location) ? fallback.location : field.location,
      growthStage: isMojibake(field.growthStage) ? fallback.growthStage : field.growthStage,
      areaMu: field.areaMu || fallback.areaMu,
      cropType: CROP_LABELS[field.cropType] ? field.cropType : fallback.cropType,
      riskLevel: riskValue(field.riskLevel),
    };
  });
}

export function formatCommandDate(value: string) {
  const d = new Date(value);
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mo}-${day} ${h}:${mi}`;
}

export function priorityLabel(priority: string) {
  if (priority === "high") return "高";
  if (priority === "medium") return "中";
  return "低";
}

export function riskLabel(level: DemoRiskLevel) {
  const risk = riskValue(level);
  if (risk === "high") return "高风险";
  if (risk === "medium") return "中风险";
  return "低风险";
}

export function parseRecommendations(value?: string) {
  if (!value || isMojibake(value)) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return value
      .split(/\n|;|；/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function cleanText(value: string | null | undefined, fallback: string) {
  return value && !isMojibake(value) ? value : fallback;
}

export function dataSourceLabel(mode: CommandCenterData["source"]["mode"]) {
  return COMMAND_SOURCE_LABELS[mode];
}
