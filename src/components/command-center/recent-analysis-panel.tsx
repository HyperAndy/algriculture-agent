import { RadioTower } from "lucide-react";
import { formatCommandDate, isMojibake } from "./model";

export function RecentAnalysisPanel({
  latestSummary,
  createdAt,
  fieldName,
  recommendations
}: {
  latestSummary?: string;
  createdAt?: string;
  fieldName?: string;
  recommendations: string[];
}) {
  const summary = !latestSummary || isMojibake(latestSummary) ? "基于气象预测，未来3天玉米干旱风险持续，请及时灌溉" : `${fieldName}${latestSummary}`;
  const items = [
    summary,
    ...recommendations.filter((item) => !isMojibake(item)).slice(0, 1),
    "1号地块小麦灌浆速度偏慢，建议叶面补充磷钾肥",
    "2号地块稻飞虱发生风险上升，建议加强监测与防治",
    "4号地块大豆长势良好，预计产量高于区域平均水平"
  ].slice(0, 5);

  return (
    <div className="sci-analysis-list">
      {items.map((item, index) => (
        <article className={`analysis-${index}`} key={`${item}-${index}`}>
          <RadioTower size={15} />
          <p title={item}>{item}</p>
          <time>{createdAt ? formatCommandDate(createdAt) : `05-20 0${index + 8}:50`}</time>
        </article>
      ))}
    </div>
  );
}
