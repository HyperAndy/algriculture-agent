import { CROP_COLORS } from "@/domain/crops/crop-labels";

export const COMMAND_CROP_COLORS = CROP_COLORS;

export const COMMAND_SOURCE_LABELS = {
  real: "实时业务数据",
  mixed: "真实数据 + 演示补齐",
  demo: "演示数据",
} as const;
