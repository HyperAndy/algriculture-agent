export const CROP_LABELS = {
  rice: "水稻",
  wheat: "小麦",
  corn: "玉米",
  soybean: "大豆"
} as const;

export type CropType = keyof typeof CROP_LABELS;

export const GROWTH_STAGES: Record<CropType, string[]> = {
  rice: ["返青期", "分蘖期", "拔节孕穗期", "抽穗扬花期", "灌浆期"],
  wheat: ["返青期", "拔节期", "抽穗期", "灌浆期", "成熟期"],
  corn: ["苗期", "拔节期", "大喇叭口期", "抽雄吐丝期", "灌浆期"],
  soybean: ["苗期", "分枝期", "开花期", "结荚期", "鼓粒期"]
};

export function getCropLabel(cropType: CropType) {
  return CROP_LABELS[cropType];
}
