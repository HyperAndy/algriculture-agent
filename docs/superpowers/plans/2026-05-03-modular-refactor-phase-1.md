# Modular Refactor Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the first clean architecture boundary for the B modular refactor by moving `/demo` data aggregation out of the page and into a tested dashboard ViewModel service with real-data-first and demo-fallback behavior.

**Architecture:** Keep the app as a Next.js modular monolith. Introduce `features/dashboard`, `domain`, and `infrastructure/demo-data` boundaries without rewriting the visual dashboard yet. `/demo` becomes a thin page that calls a server-side dashboard service and passes a stable `CommandDashboardViewModel` to the existing `CommandCenter` component.

**Tech Stack:** Next.js App Router, React, TypeScript, Prisma, SQLite, Vitest, ECharts.

---

## Scope

This plan implements Phase 1 only:

1. Create stable dashboard ViewModel types.
2. Move deterministic demo fallback data out of `command-center.tsx`.
3. Build and test the fallback merge rules.
4. Build and test real Prisma data mapping into the ViewModel.
5. Replace direct Prisma aggregation in `src/app/demo/page.tsx` with a single service call.

This plan does not redesign the large-screen UI, split `command-center.tsx`, rebuild `/console`, or implement mobile UI. Those are separate plans after this architecture boundary lands.

## File Structure

Create:

- `src/domain/risk/risk-level.ts`  
  Defines normalized risk levels and helpers shared by dashboard mapping.

- `src/domain/crops/crop-labels.ts`  
  Defines crop labels and crop colors shared by dashboard ViewModel generation.

- `src/features/dashboard/types.ts`  
  Owns `CommandDashboardViewModel` and nested dashboard types.

- `src/infrastructure/demo-data/command-dashboard-demo.ts`  
  Owns deterministic fallback data for `/demo`.

- `src/features/dashboard/server/format-command-time.ts`  
  Owns command-center time formatting.

- `src/features/dashboard/server/build-command-dashboard-view-model.ts`  
  Pure mapper and fallback merger. Accepts plain records, returns `CommandDashboardViewModel`.

- `src/features/dashboard/server/get-command-dashboard-view-model.ts`  
  Server-side Prisma query service for `/demo`.

- `tests/features/dashboard/build-command-dashboard-view-model.test.ts`  
  Unit tests for real-data-first and fallback behavior.

- `tests/features/dashboard/format-command-time.test.ts`  
  Unit tests for stable timestamp formatting.

Modify:

- `src/app/demo/page.tsx`  
  Replace direct Prisma queries and inline mapping with `getCommandDashboardViewModel()`.

- `src/components/command-center/types.ts`  
  Re-export dashboard ViewModel types from `src/features/dashboard/types.ts` to keep current component imports stable.

---

### Task 1: Add Domain Helpers

**Files:**
- Create: `src/domain/risk/risk-level.ts`
- Create: `src/domain/crops/crop-labels.ts`
- Test indirectly in Task 3

- [ ] **Step 1: Create risk-level helper**

Create `src/domain/risk/risk-level.ts`:

```ts
export const RISK_LEVELS = ["low", "medium", "high"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];
export type RiskLevelInput = RiskLevel | string | null | undefined;

export function normalizeRiskLevel(level: RiskLevelInput): RiskLevel {
  if (level === "high" || level === "medium" || level === "low") {
    return level;
  }

  return "low";
}

export function riskRank(level: RiskLevelInput): number {
  const normalized = normalizeRiskLevel(level);
  if (normalized === "high") return 3;
  if (normalized === "medium") return 2;
  return 1;
}
```

- [ ] **Step 2: Create crop label helper**

Create `src/domain/crops/crop-labels.ts`:

```ts
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
```

- [ ] **Step 3: Run TypeScript build**

Run:

```powershell
npm run build
```

Expected: PASS. No route behavior changes yet.

- [ ] **Step 4: Commit**

```powershell
git add src/domain/risk/risk-level.ts src/domain/crops/crop-labels.ts
git commit -m "refactor: add domain helpers for dashboard"
```

---

### Task 2: Define Dashboard ViewModel Types

**Files:**
- Create: `src/features/dashboard/types.ts`
- Modify: `src/components/command-center/types.ts`

- [ ] **Step 1: Create dashboard ViewModel types**

Create `src/features/dashboard/types.ts`:

```ts
import type { RiskLevel } from "@/domain/risk/risk-level";

export type DemoRiskLevel = RiskLevel | string;

export interface CommandDashboardField {
  id: string;
  name: string;
  location: string;
  areaMu: number;
  cropType: string;
  variety: string | null;
  growthStage: string;
  riskLevel: DemoRiskLevel;
}

export interface CommandDashboardTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  fieldId: string;
  fieldName: string;
}

export interface CommandDashboardAgentStep {
  id: string;
  agentName: string;
  status: string;
  inputSummary: string;
  outputSummary: string;
}

export interface CommandDashboardLatestRun {
  id: string;
  fieldId: string;
  fieldName: string;
  overallRiskLevel: DemoRiskLevel;
  summary: string;
  recommendations: string;
  createdAt: string;
  steps: CommandDashboardAgentStep[];
}

export interface CommandDashboardSource {
  mode: "real" | "mixed" | "demo";
  fallbackReasons: string[];
}

export interface CommandDashboardViewModel {
  generatedAt: string;
  formattedTime: string;
  fields: CommandDashboardField[];
  tasks: CommandDashboardTask[];
  latestRun: CommandDashboardLatestRun | null;
  source: CommandDashboardSource;
}
```

- [ ] **Step 2: Re-export existing command-center type names**

Replace `src/components/command-center/types.ts` with:

```ts
export type {
  DemoRiskLevel,
  CommandDashboardField as CommandField,
  CommandDashboardTask as CommandTask,
  CommandDashboardAgentStep as CommandAgentStep,
  CommandDashboardLatestRun as CommandLatestRun,
  CommandDashboardViewModel as CommandCenterData
} from "@/features/dashboard/types";
```

- [ ] **Step 3: Run TypeScript build**

Run:

```powershell
npm run build
```

Expected: PASS. `CommandCenter` keeps compiling because its existing type names are re-exported.

- [ ] **Step 4: Commit**

```powershell
git add src/features/dashboard/types.ts src/components/command-center/types.ts
git commit -m "refactor: define command dashboard view model"
```

---

### Task 3: Add Demo Fallback Data

**Files:**
- Create: `src/infrastructure/demo-data/command-dashboard-demo.ts`
- Test: `tests/features/dashboard/build-command-dashboard-view-model.test.ts`

- [ ] **Step 1: Create deterministic fallback data**

Create `src/infrastructure/demo-data/command-dashboard-demo.ts`:

```ts
import type { CommandDashboardViewModel } from "@/features/dashboard/types";

export function createCommandDashboardDemoData(now: Date): CommandDashboardViewModel {
  const generatedAt = now.toISOString();

  return {
    generatedAt,
    formattedTime: "",
    source: {
      mode: "demo",
      fallbackReasons: ["demo fallback data loaded"]
    },
    fields: [
      {
        id: "demo_field_rice",
        name: "江淮水稻示范田",
        location: "安徽省江淮示范区",
        areaMu: 210,
        cropType: "rice",
        variety: "优质稻",
        growthStage: "分蘖期",
        riskLevel: "low"
      },
      {
        id: "demo_field_wheat",
        name: "黄淮麦田示范区",
        location: "河南省黄淮示范区",
        areaMu: 180,
        cropType: "wheat",
        variety: "强筋小麦",
        growthStage: "灌浆期",
        riskLevel: "medium"
      },
      {
        id: "demo_field_corn",
        name: "东北玉米示范田",
        location: "吉林省黑土示范区",
        areaMu: 200,
        cropType: "corn",
        variety: "耐密玉米",
        growthStage: "拔节期",
        riskLevel: "high"
      },
      {
        id: "demo_field_soybean",
        name: "黑土地大豆示范田",
        location: "黑龙江省示范区",
        areaMu: 120,
        cropType: "soybean",
        variety: "高蛋白大豆",
        growthStage: "开花期",
        riskLevel: "low"
      }
    ],
    tasks: [
      {
        id: "demo_task_irrigation",
        title: "灌溉",
        description: "东北玉米示范田拔节期灌溉建议",
        priority: "high",
        status: "pending",
        dueDate: generatedAt,
        fieldId: "demo_field_corn",
        fieldName: "东北玉米示范田"
      },
      {
        id: "demo_task_fertilizer",
        title: "追肥",
        description: "黄淮麦田示范区叶面补磷钾肥",
        priority: "medium",
        status: "pending",
        dueDate: generatedAt,
        fieldId: "demo_field_wheat",
        fieldName: "黄淮麦田示范区"
      }
    ],
    latestRun: {
      id: "demo_agent_run",
      fieldId: "demo_field_corn",
      fieldName: "东北玉米示范田",
      overallRiskLevel: "high",
      summary: "基于天气预测、土壤墒情和拔节期需水特征，东北玉米示范田存在干旱风险。",
      recommendations: JSON.stringify(["24小时内安排灌溉", "避开中午高温时段", "加强墒情监测"]),
      createdAt: generatedAt,
      steps: [
        {
          id: "demo_step_1",
          agentName: "田间感知 Agent",
          status: "completed",
          inputSummary: "读取地块、天气、土壤和苗情数据。",
          outputSummary: "识别玉米处于拔节期，近期降雨不足。"
        },
        {
          id: "demo_step_2",
          agentName: "作物诊断 Agent",
          status: "completed",
          inputSummary: "分析生育期和作物长势。",
          outputSummary: "判断当前水分约束会影响拔节期生长。"
        },
        {
          id: "demo_step_3",
          agentName: "风险预警 Agent",
          status: "completed",
          inputSummary: "综合天气和土壤墒情。",
          outputSummary: "生成高风险干旱预警。"
        },
        {
          id: "demo_step_4",
          agentName: "水肥决策 Agent",
          status: "completed",
          inputSummary: "匹配灌溉窗口和水肥策略。",
          outputSummary: "建议24小时内完成灌溉。"
        },
        {
          id: "demo_step_5",
          agentName: "灾害应对 Agent",
          status: "completed",
          inputSummary: "评估高温干旱应急措施。",
          outputSummary: "建议避开中午高温作业。"
        },
        {
          id: "demo_step_6",
          agentName: "农事档案 Agent",
          status: "completed",
          inputSummary: "沉淀分析结果。",
          outputSummary: "生成任务和可追溯报告。"
        }
      ]
    }
  };
}
```

- [ ] **Step 2: Run TypeScript build**

Run:

```powershell
npm run build
```

Expected: PASS. The new demo data module compiles.

- [ ] **Step 3: Commit**

```powershell
git add src/infrastructure/demo-data/command-dashboard-demo.ts
git commit -m "refactor: add command dashboard demo fallback"
```

---

### Task 4: Add Time Formatting and ViewModel Builder

**Files:**
- Create: `src/features/dashboard/server/format-command-time.ts`
- Create: `src/features/dashboard/server/build-command-dashboard-view-model.ts`
- Test: `tests/features/dashboard/format-command-time.test.ts`
- Test: `tests/features/dashboard/build-command-dashboard-view-model.test.ts`

- [ ] **Step 1: Add time formatter test**

Create `tests/features/dashboard/format-command-time.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatCommandTime } from "@/features/dashboard/server/format-command-time";

describe("formatCommandTime", () => {
  it("formats local command-center timestamps", () => {
    const date = new Date("2026-05-03T01:02:03+08:00");

    expect(formatCommandTime(date)).toBe("2026-05-03 01:02:03");
  });
});
```

- [ ] **Step 2: Run formatter test and verify failure**

Run:

```powershell
npm test -- tests/features/dashboard/format-command-time.test.ts
```

Expected: FAIL because `format-command-time.ts` does not exist.

- [ ] **Step 3: Implement time formatter**

Create `src/features/dashboard/server/format-command-time.ts`:

```ts
export function formatCommandTime(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");

  return `${y}-${mo}-${day} ${h}:${mi}:${s}`;
}
```

- [ ] **Step 4: Add ViewModel builder tests**

Create `tests/features/dashboard/build-command-dashboard-view-model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildCommandDashboardViewModel } from "@/features/dashboard/server/build-command-dashboard-view-model";

const now = new Date("2026-05-03T01:02:03+08:00");

describe("buildCommandDashboardViewModel", () => {
  it("uses real field data when enough records exist", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [
        {
          id: "field_1",
          name: "真实玉米田",
          location: "吉林省",
          areaMu: 100,
          cropType: "corn",
          variety: "耐密玉米",
          growthStage: "拔节期",
          riskLevel: "high"
        },
        {
          id: "field_2",
          name: "真实水稻田",
          location: "安徽省",
          areaMu: 90,
          cropType: "rice",
          variety: "优质稻",
          growthStage: "分蘖期",
          riskLevel: "low"
        },
        {
          id: "field_3",
          name: "真实小麦田",
          location: "河南省",
          areaMu: 80,
          cropType: "wheat",
          variety: "强筋小麦",
          growthStage: "灌浆期",
          riskLevel: "medium"
        },
        {
          id: "field_4",
          name: "真实大豆田",
          location: "黑龙江省",
          areaMu: 70,
          cropType: "soybean",
          variety: "高蛋白大豆",
          growthStage: "开花期",
          riskLevel: "low"
        }
      ],
      tasks: [],
      latestRun: null
    });

    expect(vm.source.mode).toBe("real");
    expect(vm.fields).toHaveLength(4);
    expect(vm.fields[0]?.name).toBe("真实玉米田");
    expect(vm.tasks.length).toBeGreaterThan(0);
    expect(vm.source.fallbackReasons).toContain("tasks missing");
  });

  it("uses demo mode when real fields are missing", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [],
      tasks: [],
      latestRun: null
    });

    expect(vm.source.mode).toBe("demo");
    expect(vm.fields).toHaveLength(4);
    expect(vm.fields[0]?.name).toBe("江淮水稻示范田");
    expect(vm.source.fallbackReasons).toContain("fields missing");
  });

  it("uses mixed mode when tasks or latest run are missing", () => {
    const vm = buildCommandDashboardViewModel({
      now,
      fields: [
        {
          id: "field_1",
          name: "真实玉米田",
          location: "吉林省",
          areaMu: 100,
          cropType: "corn",
          variety: null,
          growthStage: "拔节期",
          riskLevel: "high"
        }
      ],
      tasks: [],
      latestRun: null
    });

    expect(vm.source.mode).toBe("mixed");
    expect(vm.fields[0]?.name).toBe("真实玉米田");
    expect(vm.tasks.length).toBeGreaterThan(0);
    expect(vm.latestRun?.id).toBe("demo_agent_run");
    expect(vm.source.fallbackReasons).toEqual(["tasks missing", "latest run missing"]);
  });
});
```

- [ ] **Step 5: Run ViewModel builder test and verify failure**

Run:

```powershell
npm test -- tests/features/dashboard/build-command-dashboard-view-model.test.ts
```

Expected: FAIL because `build-command-dashboard-view-model.ts` does not exist.

- [ ] **Step 6: Implement ViewModel builder**

Create `src/features/dashboard/server/build-command-dashboard-view-model.ts`:

```ts
import type {
  CommandDashboardField,
  CommandDashboardLatestRun,
  CommandDashboardTask,
  CommandDashboardViewModel
} from "@/features/dashboard/types";
import { createCommandDashboardDemoData } from "@/infrastructure/demo-data/command-dashboard-demo";
import { formatCommandTime } from "./format-command-time";

export interface CommandDashboardInput {
  now: Date;
  fields: CommandDashboardField[];
  tasks: CommandDashboardTask[];
  latestRun: CommandDashboardLatestRun | null;
}

export function buildCommandDashboardViewModel(input: CommandDashboardInput): CommandDashboardViewModel {
  const demo = createCommandDashboardDemoData(input.now);
  const fallbackReasons: string[] = [];

  const hasFields = input.fields.length > 0;
  const fields = hasFields ? input.fields : demo.fields;
  if (!hasFields) fallbackReasons.push("fields missing");

  const hasTasks = input.tasks.length > 0;
  const tasks = hasTasks ? input.tasks : demo.tasks;
  if (!hasTasks) fallbackReasons.push("tasks missing");

  const hasLatestRun = input.latestRun !== null;
  const latestRun = hasLatestRun ? input.latestRun : demo.latestRun;
  if (!hasLatestRun) fallbackReasons.push("latest run missing");

  let mode: CommandDashboardViewModel["source"]["mode"] = "real";
  if (!hasFields) {
    mode = "demo";
  } else if (fallbackReasons.length > 0) {
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
      fallbackReasons
    }
  };
}
```

- [ ] **Step 7: Run tests**

Run:

```powershell
npm test -- tests/features/dashboard/format-command-time.test.ts tests/features/dashboard/build-command-dashboard-view-model.test.ts
```

Expected: PASS for the two new test files.

- [ ] **Step 8: Run full test suite**

Run:

```powershell
npm test
```

Expected: PASS for all existing and new tests.

- [ ] **Step 9: Commit**

```powershell
git add src/features/dashboard/server/format-command-time.ts src/features/dashboard/server/build-command-dashboard-view-model.ts tests/features/dashboard/format-command-time.test.ts tests/features/dashboard/build-command-dashboard-view-model.test.ts
git commit -m "test: cover command dashboard fallback view model"
```

---

### Task 5: Add Prisma Dashboard Service

**Files:**
- Create: `src/features/dashboard/server/get-command-dashboard-view-model.ts`
- Modify: `src/app/demo/page.tsx`

- [ ] **Step 1: Implement server service**

Create `src/features/dashboard/server/get-command-dashboard-view-model.ts`:

```ts
import { prisma } from "@/lib/db";
import type { CommandDashboardLatestRun, CommandDashboardTask } from "@/features/dashboard/types";
import { buildCommandDashboardViewModel } from "./build-command-dashboard-view-model";

function mapTask(task: {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date;
  fieldId: string;
  field: { name: string };
}): CommandDashboardTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate.toISOString(),
    fieldId: task.fieldId,
    fieldName: task.field.name
  };
}

function mapLatestRun(run: {
  id: string;
  fieldId: string;
  overallRiskLevel: string;
  summary: string;
  recommendations: string;
  createdAt: Date;
  field: { name: string };
  steps: Array<{
    id: string;
    agentName: string;
    status: string;
    inputSummary: string;
    outputSummary: string;
  }>;
} | null): CommandDashboardLatestRun | null {
  if (!run) return null;

  return {
    id: run.id,
    fieldId: run.fieldId,
    fieldName: run.field.name,
    overallRiskLevel: run.overallRiskLevel,
    summary: run.summary,
    recommendations: run.recommendations,
    createdAt: run.createdAt.toISOString(),
    steps: run.steps.map((step) => ({
      id: step.id,
      agentName: step.agentName,
      status: step.status,
      inputSummary: step.inputSummary,
      outputSummary: step.outputSummary
    }))
  };
}

export async function getCommandDashboardViewModel(now = new Date()) {
  const [fields, tasks, latestRun] = await Promise.all([
    prisma.field.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.farmingTask.findMany({
      where: { status: "pending" },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      include: { field: true }
    }),
    prisma.agentRun.findFirst({
      orderBy: { createdAt: "desc" },
      include: { steps: { orderBy: { startedAt: "asc" } }, field: true }
    })
  ]);

  return buildCommandDashboardViewModel({
    now,
    fields: fields.map((field) => ({
      id: field.id,
      name: field.name,
      location: field.location,
      areaMu: field.areaMu,
      cropType: field.cropType,
      variety: field.variety,
      growthStage: field.growthStage,
      riskLevel: field.riskLevel
    })),
    tasks: tasks.map(mapTask),
    latestRun: mapLatestRun(latestRun)
  });
}
```

- [ ] **Step 2: Replace `/demo` page aggregation**

Replace `src/app/demo/page.tsx` with:

```tsx
import { CommandCenter } from "@/components/command-center/command-center";
import { getCommandDashboardViewModel } from "@/features/dashboard/server/get-command-dashboard-view-model";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const data = await getCommandDashboardViewModel();

  return <CommandCenter data={data} />;
}
```

- [ ] **Step 3: Run build**

Run:

```powershell
npm run build
```

Expected: PASS. `/demo` compiles with the new service.

- [ ] **Step 4: Run tests**

Run:

```powershell
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/dashboard/server/get-command-dashboard-view-model.ts src/app/demo/page.tsx
git commit -m "refactor: load demo dashboard through service"
```

---

### Task 6: Add Source Metadata Display Contract

**Files:**
- Modify: `src/components/command-center/command-center.tsx`
- Test: Covered by build

- [ ] **Step 1: Add non-invasive source marker**

In `src/components/command-center/command-center.tsx`, inside `CommandCenter`, add this derived value after `pendingTasks`:

```ts
  const dataSourceText =
    data.source.mode === "real"
      ? "实时业务数据"
      : data.source.mode === "mixed"
        ? "真实数据 + 演示补齐"
        : "演示数据";
```

Then in the top-right area of the returned markup, pass `dataSourceText` into `TopBar`:

```tsx
<TopBar initialNow={data.generatedAt} formattedTime={data.formattedTime} dataSourceText={dataSourceText} />
```

Update the `TopBar` signature:

```ts
function TopBar({
  initialNow,
  formattedTime,
  dataSourceText
}: {
  initialNow: string;
  formattedTime: string;
  dataSourceText: string;
}) {
```

Add the source marker to `.sci-top-right` after the status span:

```tsx
<span className="sci-data-source">{dataSourceText}</span>
```

- [ ] **Step 2: Add CSS for source marker**

Append to `src/app/globals.css` near the existing `.sci-online` or final dashboard overrides:

```css
.sci-data-source {
  color: #f5c84c;
  font-size: clamp(10px, 0.7vw, 12px);
  white-space: nowrap;
}
```

- [ ] **Step 3: Run build**

Run:

```powershell
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add src/components/command-center/command-center.tsx src/app/globals.css
git commit -m "feat: show dashboard data source"
```

---

### Task 7: Final Verification and Push

**Files:**
- No new files

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm run build
npm test
```

Expected:

- `npm run build`: PASS.
- `npm test`: PASS.

- [ ] **Step 2: Check branch status**

Run:

```powershell
git status --short --branch
```

Expected:

```text
## modular-refactor-design...origin/modular-refactor-design [ahead N]
```

Only `.superpowers/` may remain untracked. It must not be staged.

- [ ] **Step 3: Push current branch**

Run:

```powershell
git push origin modular-refactor-design
```

Expected: remote branch updates. `master` remains unchanged.

---

## Self-Review

Spec coverage:

- B modular monolith boundary: covered by Tasks 1, 2, 4, and 5.
- `/demo` real-data-first with fallback: covered by Tasks 3, 4, and 5.
- ViewModel-only large-screen consumption: covered by Tasks 2 and 5.
- Source visibility for real/mixed/demo data: covered by Task 6.
- Tests for fallback behavior: covered by Task 4.

Out of scope for this plan:

- Splitting `command-center.tsx` into subcomponents.
- Rebuilding `/console` SaaS visual system.
- Mobile complete operation UI.
- C service-oriented architecture.

These belong to follow-up plans after Phase 1 lands.

