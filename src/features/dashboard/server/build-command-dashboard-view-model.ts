import type {
  CommandDashboardField,
  CommandDashboardLatestRun,
  CommandDashboardTask,
  CommandDashboardViewModel,
} from "@/features/dashboard/types";
import { createCommandDashboardDemoData } from "@/infrastructure/demo-data/command-dashboard-demo";
import { formatCommandTime } from "./format-command-time";

export interface CommandDashboardInput {
  now: Date;
  fields: CommandDashboardField[];
  tasks: CommandDashboardTask[];
  latestRun: CommandDashboardLatestRun | null;
}

export function buildCommandDashboardViewModel(
  input: CommandDashboardInput,
): CommandDashboardViewModel {
  const demo = createCommandDashboardDemoData(input.now);
  const fallbackReasons: string[] = [];

  const hasFields = input.fields.length > 0;
  if (!hasFields) {
    return {
      ...demo,
      formattedTime: formatCommandTime(input.now),
      source: {
        mode: "demo",
        fallbackReasons: ["fields missing"],
      },
    };
  }

  const fields = hasFields ? input.fields : demo.fields;

  const hasTasks = input.tasks.length > 0;
  const tasks = hasTasks ? input.tasks : demo.tasks;
  if (!hasTasks) fallbackReasons.push("tasks missing");

  const hasLatestRun = input.latestRun !== null;
  const latestRun = hasLatestRun ? input.latestRun : demo.latestRun;
  if (!hasLatestRun) fallbackReasons.push("latest run missing");

  let mode: CommandDashboardViewModel["source"]["mode"] = "real";
  if (fallbackReasons.length > 0) {
    mode = "mixed";
  }

  return {
    generatedAt: input.now.toISOString(),
    formattedTime: formatCommandTime(input.now),
    fields,
    tasks,
    latestRun,
    source: {
      mode,
      fallbackReasons,
    },
  };
}
