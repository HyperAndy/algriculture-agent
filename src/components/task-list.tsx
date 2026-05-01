"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { RiskBadge } from "./risk-badge";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: Date | string;
  status: string;
  field?: { name: string } | null;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [localTasks, setLocalTasks] = useState(tasks);

  async function completeTask(taskId: string) {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, status: "completed" })
    });
    setLocalTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
  }

  return (
    <div className="grid gap-3">
      {localTasks.map((task) => (
        <div key={task.id} className="rounded-lg border border-[#dce5d8] bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{task.title}</h3>
                <RiskBadge level={task.priority} />
                <span className="rounded bg-[#eef4ec] px-2 py-1 text-xs text-[#536156]">{task.status === "completed" ? "已完成" : "待执行"}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#5d6a60]">{task.description}</p>
              <p className="mt-2 text-xs text-[#7a867c]">{task.field?.name ? `${task.field.name} · ` : ""}截止 {new Date(task.dueDate).toLocaleDateString("zh-CN")}</p>
            </div>
            {task.status !== "completed" ? (
              <button onClick={() => completeTask(task.id)} className="inline-flex items-center gap-2 rounded-md bg-[#1f6f49] px-3 py-2 text-sm font-semibold text-white">
                <Check className="h-4 w-4" />
                完成
              </button>
            ) : null}
          </div>
        </div>
      ))}
      {localTasks.length === 0 ? <div className="rounded-lg border border-dashed border-[#b9c8b4] p-8 text-center text-[#637064]">暂无农事任务</div> : null}
    </div>
  );
}
