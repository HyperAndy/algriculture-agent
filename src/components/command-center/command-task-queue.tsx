import { ChevronRight, Droplets, ScanLine, Sprout, Zap } from "lucide-react";
import { cleanText, formatCommandDate, priorityLabel } from "./model";
import type { CommandTask } from "./types";

export function CommandTaskQueue({ tasks, generatedAt }: { tasks: CommandTask[]; generatedAt: string }) {
  const rows = (tasks.length ? tasks : fallbackTasks(generatedAt)).slice(0, 4);
  return (
    <div className="sci-task-table">
      <div className="sci-task-head">
        <span>任务类型</span><span>任务描述</span><span>涉及地块</span><span>建议时间</span><span>优先级</span><span>状态</span><span />
      </div>
      {rows.map((task, index) => (
        <div className="sci-task-row" key={task.id}>
          <span className="task-kind" title={cleanText(task.title, ["灌溉", "追肥", "病虫防治", "除草"][index] ?? "农事")}>{taskIcon(index)}{cleanText(task.title, ["灌溉", "追肥", "病虫防治", "除草"][index] ?? "农事")}</span>
          <span title={cleanText(task.description, ["3号地块玉米灌溉建议", "1号地块小麦追肥建议", "2号地块稻飞虱防治", "4号地块大豆除草建议"][index] ?? "稳产处置建议")}>{cleanText(task.description, ["3号地块玉米灌溉建议", "1号地块小麦追肥建议", "2号地块稻飞虱防治", "4号地块大豆除草建议"][index] ?? "稳产处置建议")}</span>
          <span title={cleanText(task.fieldName, `${index + 1}号地块`)}>{cleanText(task.fieldName, `${index + 1}号地块`)}</span>
          <span>{formatCommandDate(task.dueDate)}</span>
          <span className={`prio ${task.priority}`}>{priorityLabel(task.priority)}</span>
          <span className="task-state">待执行</span>
          <ChevronRight size={14} />
        </div>
      ))}
    </div>
  );
}

function taskIcon(index: number) {
  const icons = [<Droplets key="water" size={15} />, <ScanLine key="scan" size={15} />, <Zap key="zap" size={15} />, <Sprout key="sprout" size={15} />];
  return <i>{icons[index % icons.length]}</i>;
}

function fallbackTasks(dueDate: string): CommandTask[] {
  return [
    { id: "t1", title: "灌溉", description: "3号地块玉米灌溉建议", priority: "high", status: "pending", dueDate, fieldId: "field_corn_001", fieldName: "3号地块" },
    { id: "t2", title: "追肥", description: "1号地块小麦追肥建议", priority: "high", status: "pending", dueDate, fieldId: "field_wheat_001", fieldName: "1号地块" },
    { id: "t3", title: "病虫防治", description: "2号地块稻飞虱防治", priority: "medium", status: "pending", dueDate, fieldId: "field_rice_001", fieldName: "2号地块" },
    { id: "t4", title: "除草", description: "4号地块大豆除草建议", priority: "low", status: "pending", dueDate, fieldId: "field_soybean_001", fieldName: "4号地块" }
  ];
}
