# Command Center Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the `/demo` command-center large screen into focused modules without changing the real-data-first/fallback data contract.

**Architecture:** Keep `src/app/demo/page.tsx` and `CommandDashboardViewModel` as the public boundary. Split `src/components/command-center/command-center.tsx` into small presentational components and pure helpers under `src/components/command-center/`, while introducing `src/design-system/big-screen/` for big-screen visual constants. Do not rebuild `/console` or mobile UI in this phase.

**Tech Stack:** Next.js App Router, React client components, ECharts, Vitest, Prisma-backed ViewModel service from Phase 1.

---

## Scope

In scope:

- Reduce `command-center.tsx` from a 600+ line mixed component to a composition shell.
- Move pure labels, risk normalization wrappers, source labels, formatting helpers, and map layout constants into focused files.
- Move each large screen panel into its own file.
- Keep all class names stable so existing `src/app/globals.css` continues to render the same visual design.
- Preserve `CommandCenter({ data }: { data: CommandCenterData })`.
- Preserve `/demo` real-data-first with demo fallback.
- Add unit tests for pure helpers.
- Run `npm run build` and relevant Vitest tests after each task.

Out of scope:

- Rewriting the visual design.
- Moving the full `.sci-*` CSS out of `globals.css`.
- Rebuilding `/console`.
- Mobile console implementation.
- Changing Prisma schema or API routes.

---

## File Structure

Create or modify:

- `src/design-system/big-screen/theme.ts`  
  Owns command-center crop colors, stable panel source labels, and non-CSS visual constants.

- `src/components/command-center/model.ts`  
  Pure helper functions: `riskValue`, `formatCommandDate`, `priorityLabel`, `riskLabel`, `parseRecommendations`, `cleanText`, `dataSourceLabel`, `normalizeCommandFields`.

- `src/components/command-center/map-layout.ts`  
  Static map zones, sensor points, and `hatchPath`.

- `src/components/command-center/echart.tsx`  
  Client ECharts wrapper.

- `src/components/command-center/panel-title.tsx`  
  Shared panel title component.

- `src/components/command-center/top-bar.tsx`  
  Header and live clock.

- `src/components/command-center/situation-metrics-panel.tsx`  
  Comprehensive situation metrics panel.

- `src/components/command-center/crop-distribution-panel.tsx`  
  Crop donut and legend.

- `src/components/command-center/growth-stage-panel.tsx`  
  Growth stage stacked bars.

- `src/components/command-center/field-risk-map.tsx`  
  Central map panel.

- `src/components/command-center/agent-decision-chain.tsx`  
  Multi-agent chain panel.

- `src/components/command-center/risk-warning-panel.tsx`  
  Risk warning cards.

- `src/components/command-center/soil-moisture-trend.tsx`  
  Soil moisture trend chart.

- `src/components/command-center/command-task-queue.tsx`  
  Farming task queue.

- `src/components/command-center/recent-analysis-panel.tsx`  
  Recent analysis list.

- `src/components/command-center/command-center.tsx`  
  Becomes a composition shell only.

- `tests/components/command-center/model.test.ts`  
  Unit tests for helper behavior.

---

## Task 1: Extract Pure Model Helpers

**Files:**

- Create: `src/design-system/big-screen/theme.ts`
- Create: `src/components/command-center/model.ts`
- Test: `tests/components/command-center/model.test.ts`
- Modify: `src/components/command-center/command-center.tsx`

- [ ] **Step 1: Add failing helper tests**

Create `tests/components/command-center/model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  dataSourceLabel,
  formatCommandDate,
  normalizeCommandFields,
  parseRecommendations,
  priorityLabel,
  riskLabel,
  riskValue,
} from "@/components/command-center/model";
import type { CommandField } from "@/components/command-center/types";

describe("command-center model helpers", () => {
  it("normalizes risk and labels priorities", () => {
    expect(riskValue("high")).toBe("high");
    expect(riskValue("unknown")).toBe("low");
    expect(priorityLabel("high")).toBe("高");
    expect(priorityLabel("medium")).toBe("中");
    expect(priorityLabel("low")).toBe("低");
    expect(riskLabel("high")).toBe("高风险");
  });

  it("formats command dates as MM-DD HH:mm", () => {
    expect(formatCommandDate("2026-05-03T04:05:06.000Z")).toMatch(/05-03 \d{2}:05/);
  });

  it("parses recommendation JSON and plain text", () => {
    expect(parseRecommendations(JSON.stringify(["及时灌溉", "加强监测"]))).toEqual(["及时灌溉", "加强监测"]);
    expect(parseRecommendations("及时灌溉;加强监测")).toEqual(["及时灌溉", "加强监测"]);
  });

  it("labels data source modes", () => {
    expect(dataSourceLabel("real")).toBe("实时业务数据");
    expect(dataSourceLabel("mixed")).toBe("真实数据 + 演示补齐");
    expect(dataSourceLabel("demo")).toBe("演示数据");
  });

  it("normalizes missing fields with stable demo fields", () => {
    const fields = normalizeCommandFields([]);
    expect(fields).toHaveLength(4);
    expect(fields.map((field) => field.cropType)).toEqual(["rice", "wheat", "corn", "soybean"]);
  });

  it("keeps valid real field values when normalizing", () => {
    const input: CommandField[] = [
      {
        id: "field_real",
        name: "真实玉米田",
        location: "东北示范区",
        areaMu: 88,
        cropType: "corn",
        variety: null,
        growthStage: "拔节期",
        riskLevel: "high",
      },
    ];

    const fields = normalizeCommandFields(input);
    expect(fields[2]?.name).toBe("真实玉米田");
    expect(fields[2]?.areaMu).toBe(88);
    expect(fields[2]?.riskLevel).toBe("high");
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```powershell
npm test -- tests/components/command-center/model.test.ts
```

Expected: fail because `model.ts` does not exist.

- [ ] **Step 3: Add big-screen theme constants**

Create `src/design-system/big-screen/theme.ts`:

```ts
export const COMMAND_CROP_COLORS: Record<string, string> = {
  rice: "#42c7ff",
  wheat: "#f4c648",
  corn: "#9adb60",
  soybean: "#44c876",
};

export const COMMAND_SOURCE_LABELS = {
  real: "实时业务数据",
  mixed: "真实数据 + 演示补齐",
  demo: "演示数据",
} as const;
```

- [ ] **Step 4: Add pure model helpers**

Create `src/components/command-center/model.ts` with exported helpers. Import `CROP_LABELS` from `@/domain/crops/crop-labels`, `normalizeRiskLevel` from `@/domain/risk/risk-level`, `createCommandDashboardDemoData` from `@/infrastructure/demo-data/command-dashboard-demo`, and `COMMAND_SOURCE_LABELS` from `@/design-system/big-screen/theme`.

Key behavior:

```ts
export function riskValue(level: DemoRiskLevel): "low" | "medium" | "high" {
  return normalizeRiskLevel(level);
}

export function priorityLabel(priority: string) {
  if (priority === "high") return "高";
  if (priority === "medium") return "中";
  return "低";
}

export function dataSourceLabel(mode: CommandCenterData["source"]["mode"]) {
  return COMMAND_SOURCE_LABELS[mode];
}
```

Also move the current `isMojibake`, `formatDate`, `riskLabel`, `parseRecommendations`, `cleanText`, and `normalizeFields` logic into this file. Rename `formatDate` to `formatCommandDate` and `normalizeFields` to `normalizeCommandFields`. Use `createCommandDashboardDemoData(new Date("2026-05-20T02:25:36.000Z")).fields` for fallback fields.

- [ ] **Step 5: Update `command-center.tsx` imports**

Remove local definitions for:

- `CROP_LABELS`
- `CROP_COLORS`
- `FALLBACK_FIELDS`
- `riskValue`
- `isMojibake`
- `normalizeFields`
- `formatDate`
- `priorityLabel`
- `riskLabel`
- `parseRecommendations`
- `cleanText`

Import replacements:

```ts
import { CROP_LABELS } from "@/domain/crops/crop-labels";
import { COMMAND_CROP_COLORS } from "@/design-system/big-screen/theme";
import {
  cleanText,
  dataSourceLabel,
  formatCommandDate,
  normalizeCommandFields,
  parseRecommendations,
  priorityLabel,
  riskLabel,
  riskValue,
} from "./model";
```

Replace `CROP_COLORS` usages with `COMMAND_CROP_COLORS`, `normalizeFields` with `normalizeCommandFields`, `formatDate` with `formatCommandDate`, and inline source label logic with `dataSourceLabel(data.source.mode)`.

- [ ] **Step 6: Run focused tests and build**

Run:

```powershell
npm test -- tests/components/command-center/model.test.ts
npm run build
```

Expected: tests and build pass.

- [ ] **Step 7: Commit**

```powershell
git add src/design-system/big-screen/theme.ts src/components/command-center/model.ts src/components/command-center/command-center.tsx tests/components/command-center/model.test.ts
git commit -m "refactor: extract command center model helpers"
```

---

## Task 2: Extract Shared Rendering Primitives

**Files:**

- Create: `src/components/command-center/echart.tsx`
- Create: `src/components/command-center/panel-title.tsx`
- Create: `src/components/command-center/top-bar.tsx`
- Modify: `src/components/command-center/command-center.tsx`

- [ ] **Step 1: Move `EChart`**

Create `echart.tsx` with the existing `EChart` implementation. Keep the component client-safe and dispose charts in cleanup.

- [ ] **Step 2: Move `PanelTitle`**

Create `panel-title.tsx`:

```tsx
import type { ReactNode } from "react";

export function PanelTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="sci-panel-title">
      {icon ? <span>{icon}</span> : null}
      <h2>{title}</h2>
    </div>
  );
}
```

- [ ] **Step 3: Move `TopBar`**

Create `top-bar.tsx` with the existing `TopBar` implementation. Keep the signature:

```ts
export function TopBar({
  initialNow,
  formattedTime,
  dataSourceText,
}: {
  initialNow: string;
  formattedTime: string;
  dataSourceText: string;
})
```

- [ ] **Step 4: Update shell imports**

Import `TopBar` and `PanelTitle` in `command-center.tsx`. Remove local `EChart`, `PanelTitle`, and `TopBar` definitions only after imports compile.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run build
```

Expected: build passes.

- [ ] **Step 6: Commit**

```powershell
git add src/components/command-center/echart.tsx src/components/command-center/panel-title.tsx src/components/command-center/top-bar.tsx src/components/command-center/command-center.tsx
git commit -m "refactor: extract command center primitives"
```

---

## Task 3: Extract Left-Side Panels

**Files:**

- Create: `src/components/command-center/situation-metrics-panel.tsx`
- Create: `src/components/command-center/crop-distribution-panel.tsx`
- Create: `src/components/command-center/growth-stage-panel.tsx`
- Modify: `src/components/command-center/command-center.tsx`

- [ ] **Step 1: Move `MetricGrid` into `SituationMetricsPanel`**

Create a component with props:

```ts
export function SituationMetricsPanel({
  fieldsCount,
  totalArea,
  highRisk,
  pendingTasks,
}: {
  fieldsCount: number;
  totalArea: number;
  highRisk: number;
  pendingTasks: number;
})
```

It should render the existing `MetricGrid` markup and keep current class names.

- [ ] **Step 2: Move `CropDonut`**

Create `CropDistributionPanel` with props:

```ts
export function CropDistributionPanel({
  fields,
  totalArea,
}: {
  fields: CommandField[];
  totalArea: number;
})
```

Use `EChart`, `CROP_LABELS`, and `COMMAND_CROP_COLORS`.

- [ ] **Step 3: Move `GrowthBars`**

Create `GrowthStagePanel` with props:

```ts
export function GrowthStagePanel({ fields }: { fields: CommandField[] })
```

Keep stage labels and stacked bar markup stable.

- [ ] **Step 4: Replace shell sections**

In `command-center.tsx`, render these components inside the existing left panel sections. Remove local `MetricGrid`, `CropDonut`, and `GrowthBars`.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run build
```

Expected: build passes.

- [ ] **Step 6: Commit**

```powershell
git add src/components/command-center/situation-metrics-panel.tsx src/components/command-center/crop-distribution-panel.tsx src/components/command-center/growth-stage-panel.tsx src/components/command-center/command-center.tsx
git commit -m "refactor: extract command center left panels"
```

---

## Task 4: Extract Central Map Panel

**Files:**

- Create: `src/components/command-center/map-layout.ts`
- Create: `src/components/command-center/field-risk-map.tsx`
- Modify: `src/components/command-center/command-center.tsx`

- [ ] **Step 1: Move map constants**

Create `map-layout.ts` with `MAP_ZONES`, `SENSOR_POINTS`, and `hatchPath(points: string)`.

- [ ] **Step 2: Move `RiskMap` into `FieldRiskMap`**

Create:

```ts
export function FieldRiskMap()
```

Move the existing map JSX, active layer state, and layer buttons. Import constants from `map-layout.ts`.

- [ ] **Step 3: Replace shell map body**

In `command-center.tsx`, replace `<RiskMap />` with `<FieldRiskMap />` and remove local `RiskMap`, `MAP_ZONES`, `SENSOR_POINTS`, and `hatchPath`.

- [ ] **Step 4: Verify**

Run:

```powershell
npm run build
```

Expected: build passes.

- [ ] **Step 5: Commit**

```powershell
git add src/components/command-center/map-layout.ts src/components/command-center/field-risk-map.tsx src/components/command-center/command-center.tsx
git commit -m "refactor: extract command center risk map"
```

---

## Task 5: Extract Right and Bottom Panels

**Files:**

- Create: `src/components/command-center/agent-decision-chain.tsx`
- Create: `src/components/command-center/risk-warning-panel.tsx`
- Create: `src/components/command-center/soil-moisture-trend.tsx`
- Create: `src/components/command-center/command-task-queue.tsx`
- Create: `src/components/command-center/recent-analysis-panel.tsx`
- Modify: `src/components/command-center/command-center.tsx`

- [ ] **Step 1: Move `AgentChain`**

Create:

```ts
export function AgentDecisionChain({ steps }: { steps: CommandAgentStep[] })
```

Preserve tooltip `title` attributes and node class names.

- [ ] **Step 2: Move `RiskAlerts`**

Create:

```ts
export function RiskWarningPanel({ fields }: { fields: CommandField[] })
```

Use `riskLabel` from `model.ts`.

- [ ] **Step 3: Move `SoilChart`**

Create:

```ts
export function SoilMoistureTrend({ fields }: { fields: CommandField[] })
```

Use `EChart`, `CROP_LABELS`, and `COMMAND_CROP_COLORS`.

- [ ] **Step 4: Move `TaskTable` and helpers**

Create:

```ts
export function CommandTaskQueue({
  tasks,
  generatedAt,
}: {
  tasks: CommandTask[];
  generatedAt: string;
})
```

Move `taskIcon` and `fallbackTasks` into this file.

- [ ] **Step 5: Move `AnalysisList`**

Create:

```ts
export function RecentAnalysisPanel({
  latestSummary,
  createdAt,
  fieldName,
  recommendations,
}: {
  latestSummary?: string;
  createdAt?: string;
  fieldName?: string;
  recommendations: string[];
})
```

- [ ] **Step 6: Replace shell usage**

Update `command-center.tsx` to render these extracted components and remove local implementations.

- [ ] **Step 7: Verify**

Run:

```powershell
npm run build
```

Expected: build passes.

- [ ] **Step 8: Commit**

```powershell
git add src/components/command-center/agent-decision-chain.tsx src/components/command-center/risk-warning-panel.tsx src/components/command-center/soil-moisture-trend.tsx src/components/command-center/command-task-queue.tsx src/components/command-center/recent-analysis-panel.tsx src/components/command-center/command-center.tsx
git commit -m "refactor: extract command center operational panels"
```

---

## Task 6: Final Cleanup and Verification

**Files:**

- Modify: `src/components/command-center/command-center.tsx`
- Optional modify: files extracted in previous tasks if imports are unused

- [ ] **Step 1: Check shell size and responsibilities**

Run:

```powershell
(Get-Content -Encoding UTF8 src\components\command-center\command-center.tsx).Length
```

Expected: under 220 lines.

- [ ] **Step 2: Search for duplicated fallback field data in `command-center.tsx`**

Run:

```powershell
rg "FALLBACK_FIELDS|demo_field|createCommandDashboardDemoData|MAP_ZONES|SENSOR_POINTS" src/components/command-center/command-center.tsx
```

Expected: no matches.

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm test
npm run build
```

Expected: all tests and build pass.

- [ ] **Step 4: Commit final cleanup if needed**

If files changed:

```powershell
git add src/components/command-center
git commit -m "refactor: finalize command center module split"
```

- [ ] **Step 5: Push**

```powershell
git push origin modular-refactor-design
```

Expected: remote branch updated.

---

## Acceptance Criteria

- `/demo` still consumes only `CommandDashboardViewModel`.
- `/demo` still builds with real data, mixed fallback, and demo fallback.
- `command-center.tsx` is a composition shell, not the owner of every panel implementation.
- No panel extraction changes public routes or Prisma queries.
- Existing `.sci-*` class names are preserved.
- Unit tests cover pure command-center helper behavior.
- `npm test` and `npm run build` pass.

---

## Implementation Result

Status: completed on branch `modular-refactor-design`.

Completed commits:

- `516a65e refactor: extract command center model helpers`
- `f18f46c refactor: extract command center primitives`
- `1c6f91e refactor: extract command center left panels`
- `bf4250d refactor: extract command center risk map`
- `77adfcb refactor: extract command center operational panels`

Final structure:

- `src/components/command-center/command-center.tsx` is now a 98-line composition shell.
- Shared primitives:
  - `src/components/command-center/echart.tsx`
  - `src/components/command-center/panel-title.tsx`
  - `src/components/command-center/top-bar.tsx`
- Pure helper/model layer:
  - `src/components/command-center/model.ts`
  - `src/components/command-center/map-layout.ts`
  - `src/design-system/big-screen/theme.ts`
- Extracted panels:
  - `src/components/command-center/situation-metrics-panel.tsx`
  - `src/components/command-center/crop-distribution-panel.tsx`
  - `src/components/command-center/growth-stage-panel.tsx`
  - `src/components/command-center/field-risk-map.tsx`
  - `src/components/command-center/agent-decision-chain.tsx`
  - `src/components/command-center/risk-warning-panel.tsx`
  - `src/components/command-center/soil-moisture-trend.tsx`
  - `src/components/command-center/command-task-queue.tsx`
  - `src/components/command-center/recent-analysis-panel.tsx`

Verification:

- `npm test` passed: 7 test files, 19 tests.
- `npm run build` passed.
- Remote branch pushed: `origin/modular-refactor-design`.

Notes:

- This phase intentionally did not change `/console`, Prisma schema, API routes, or `.sci-*` CSS.
- Existing visual class names were preserved to avoid accidental dashboard visual drift.
- The next implementation phase should focus on Phase 3: `/console` SaaS design-system and responsive layout refactor.
