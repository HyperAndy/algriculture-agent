type MapRiskLevel = "high" | "medium" | "low";

interface MapZone {
  crop: string;
  risk: MapRiskLevel;
  label: string;
  points: string;
  labelX: number;
  labelY: number;
  iconX: number;
  iconY: number;
}

export const MAP_ZONES = [
  { crop: "wheat", risk: "medium", label: "小麦", points: "178,180 372,136 430,252 216,284", labelX: 282, labelY: 226, iconX: 278, iconY: 208 },
  { crop: "corn", risk: "low", label: "玉米", points: "405,124 656,156 610,306 386,250", labelX: 530, labelY: 218, iconX: 582, iconY: 226 },
  { crop: "rice", risk: "low", label: "水稻", points: "122,344 374,300 430,428 112,506", labelX: 260, labelY: 418, iconX: 214, iconY: 390 },
  { crop: "soybean", risk: "low", label: "大豆", points: "446,368 618,336 706,476 462,528", labelX: 592, labelY: 452, iconX: 650, iconY: 408 },
  { crop: "corn", risk: "high", label: "", points: "406,314 560,296 612,394 424,418", labelX: 504, labelY: 360, iconX: 532, iconY: 354 }
] as const satisfies readonly MapZone[];

export const SENSOR_POINTS = [
  [242, 164], [514, 204], [314, 386], [614, 404], [124, 374], [692, 294], [718, 214], [620, 122], [356, 304], [196, 250]
] as const satisfies readonly (readonly [number, number])[];

export function hatchPath(points: string) {
  const [first] = points.split(" ");
  const [x, y] = first.split(",").map(Number);
  return `M${x + 18} ${y + 18}h220 M${x + 34} ${y + 52}h250 M${x + 18} ${y + 88}h230 M${x + 42} ${y + 124}h190`;
}
