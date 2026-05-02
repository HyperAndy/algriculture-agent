export const CROP_LABELS: Record<string, string> = {
  rice: "水稻",
  wheat: "小麦",
  corn: "玉米",
  soybean: "大豆"
};

export const CROP_COLORS: Record<string, string> = {
  rice: "#42c7ff",
  wheat: "#f4c648",
  corn: "#9adb60",
  soybean: "#44c876"
};

export function cropLabel(cropType: string): string {
  return CROP_LABELS[cropType] ?? cropType;
}
