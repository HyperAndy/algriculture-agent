# Field Crop Agent MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable MVP for an AI-driven field crop stable-yield and disaster-reduction Agent, with both a product demo screen and an operational management console.

**Architecture:** Create a full-stack web app with one shared domain/data layer and two UI surfaces: a public-facing demo dashboard for funding/product presentation, and a management console for real farm technician workflows. The Agent layer starts with deterministic mock agents so the system runs without API keys, while keeping a clean adapter boundary for future LLM integration.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, SQLite, Prisma, mock Agent orchestrator, optional future LLM provider adapter.

---

## Product Scope

### MVP Includes

- Demo screen for funding/product presentation.
- Management console for real daily use.
- Field and crop management for rice, wheat, corn, and soybean.
- Manual data input for weather, soil moisture, crop growth, pest/weed/disease observations, and recent farming actions.
- Multi-Agent decision workflow with visible execution steps.
- Long-chain reasoning style report.
- Farming task generation and task status tracking.
- Farming archive/history records.
- Seed data for four demonstration fields.
- Mock Agent mode that works without network or model keys.

### MVP Excludes

- Real IoT hardware integration.
- Real drone/remote-sensing image processing.
- Full GIS map engine.
- Mini program/mobile app.
- Automatic irrigation device control.
- Production-grade user authentication.
- Real PDF export unless time remains after the core loop works.

---

## User-Facing Surfaces

### 1. Product Demo Screen

Purpose: help reviewers quickly understand project value.

Route: `/demo`

Core blocks:

- Hero metric band: total fields, high-risk fields, pending tasks, latest analysis time.
- Crop distribution: rice, wheat, corn, soybean.
- Risk map substitute: field cards arranged by risk level.
- Agent workflow timeline: multi-source sensing, crop diagnosis, pest warning, water/fertilizer decision, disaster response, farming archive.
- Representative decision report preview.
- Expected benefits: minute-level diagnosis, reduced blind fertilization/pesticide use, stable-yield support, traceable archive.

### 2. Management Console

Purpose: prove the system can be used by farm technicians and managers.

Routes:

- `/console`: operational dashboard.
- `/console/fields`: field list and field creation.
- `/console/fields/[id]`: field detail.
- `/console/fields/[id]/input`: data input.
- `/console/fields/[id]/analysis`: Agent decision center.
- `/console/reports/[id]`: report detail.
- `/console/tasks`: farming tasks.
- `/console/archive`: historical analysis archive.

---

## Domain Model

### Field

- `id`
- `name`
- `location`
- `areaMu`
- `cropType`: `rice | wheat | corn | soybean`
- `variety`
- `growthStage`
- `sowingDate`
- `targetYieldKgPerMu`
- `riskLevel`: `low | medium | high`
- `createdAt`
- `updatedAt`

### FieldObservation

- `id`
- `fieldId`
- `temperatureC`
- `rainfallMm`
- `windLevel`
- `weatherTrend`
- `soilMoisturePercent`
- `soilTemperatureC`
- `soilPh`
- `nitrogenLevel`: `low | normal | high`
- `phosphorusLevel`: `low | normal | high`
- `potassiumLevel`: `low | normal | high`
- `plantHeightCm`
- `leafColor`: `pale | normal | dark`
- `growthStatus`: `weak | normal | vigorous`
- `pestDescription`
- `diseaseDescription`
- `weedDescription`
- `lastIrrigationDate`
- `lastFertilizationDate`
- `lastPesticideDate`
- `notes`
- `createdAt`

### AgentRun

- `id`
- `fieldId`
- `observationId`
- `status`: `pending | running | completed | failed`
- `overallRiskLevel`: `low | medium | high`
- `summary`
- `reasoning`
- `recommendations`
- `createdAt`
- `completedAt`

### AgentStep

- `id`
- `agentRunId`
- `agentName`
- `status`: `pending | running | completed | failed`
- `inputSummary`
- `outputSummary`
- `startedAt`
- `completedAt`

### FarmingTask

- `id`
- `fieldId`
- `agentRunId`
- `title`
- `description`
- `priority`: `low | medium | high`
- `dueDate`
- `status`: `pending | completed | overdue`
- `createdAt`
- `completedAt`

---

## File Structure

- Create: `package.json`  
  Project scripts and dependencies.

- Create: `next.config.ts`  
  Next.js configuration.

- Create: `tsconfig.json`  
  TypeScript configuration.

- Create: `tailwind.config.ts`  
  Tailwind theme and content paths.

- Create: `postcss.config.js`  
  Tailwind/PostCSS setup.

- Create: `prisma/schema.prisma`  
  SQLite schema for fields, observations, agent runs, steps, and farming tasks.

- Create: `prisma/seed.ts`  
  Seed fields and sample observations.

- Create: `src/app/layout.tsx`  
  Root layout.

- Create: `src/app/page.tsx`  
  Redirect or landing entry to demo/console.

- Create: `src/app/demo/page.tsx`  
  Product demo screen.

- Create: `src/app/console/page.tsx`  
  Management dashboard.

- Create: `src/app/console/fields/page.tsx`  
  Field list and creation entry.

- Create: `src/app/console/fields/[id]/page.tsx`  
  Field detail page.

- Create: `src/app/console/fields/[id]/input/page.tsx`  
  Observation input page.

- Create: `src/app/console/fields/[id]/analysis/page.tsx`  
  Agent decision center.

- Create: `src/app/console/reports/[id]/page.tsx`  
  Report detail page.

- Create: `src/app/console/tasks/page.tsx`  
  Task management page.

- Create: `src/app/console/archive/page.tsx`  
  Historical report archive.

- Create: `src/app/api/fields/route.ts`  
  Field list and create API.

- Create: `src/app/api/fields/[id]/route.ts`  
  Field detail API.

- Create: `src/app/api/fields/[id]/observations/route.ts`  
  Observation create/list API.

- Create: `src/app/api/fields/[id]/analyze/route.ts`  
  Agent run API.

- Create: `src/app/api/reports/[id]/route.ts`  
  Report detail API.

- Create: `src/app/api/tasks/route.ts`  
  Task list/update API.

- Create: `src/lib/db.ts`  
  Prisma client singleton.

- Create: `src/lib/domain/crops.ts`  
  Crop constants, growth stages, labels.

- Create: `src/lib/domain/risk.ts`  
  Shared risk scoring helpers.

- Create: `src/lib/agents/types.ts`  
  Agent input/output interfaces.

- Create: `src/lib/agents/orchestrator.ts`  
  Runs all agents in sequence and persists results.

- Create: `src/lib/agents/mock-agents.ts`  
  Deterministic MVP Agent implementations.

- Create: `src/lib/agents/task-generator.ts`  
  Converts report recommendations into farming tasks.

- Create: `src/components/app-shell.tsx`  
  Shared navigation layout for console.

- Create: `src/components/stat-card.tsx`  
  Reusable metric card.

- Create: `src/components/risk-badge.tsx`  
  Shared risk badge.

- Create: `src/components/agent-timeline.tsx`  
  Visualizes Agent steps.

- Create: `src/components/report-panel.tsx`  
  Displays report summary, reasoning, and recommendations.

- Create: `src/components/field-card.tsx`  
  Displays field summary.

- Create: `src/components/task-list.tsx`  
  Displays and updates farming tasks.

- Create: `tests/agents/risk.test.ts`  
  Unit tests for risk scoring.

- Create: `tests/agents/orchestrator.test.ts`  
  Unit tests for Agent orchestration output shape.

- Create: `tests/agents/task-generator.test.ts`  
  Unit tests for task generation.

---

## Implementation Tasks

### Task 1: Bootstrap Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create package scripts and dependencies**

Use these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

Install dependencies:

```bash
npm install next react react-dom @prisma/client lucide-react clsx
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer prisma tsx vitest
```

- [ ] **Step 2: Add root layout**

`src/app/layout.tsx` should set Chinese metadata and import `globals.css`.

- [ ] **Step 3: Add root entry page**

`src/app/page.tsx` should link to `/demo` and `/console` so the two surfaces are obvious.

- [ ] **Step 4: Run build check**

Run:

```bash
npm run build
```

Expected: Next.js builds successfully.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js src/app
git commit -m "chore: bootstrap field crop agent app"
```

### Task 2: Add Database Schema and Seed Data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/domain/crops.ts`

- [ ] **Step 1: Define Prisma models**

Create models for `Field`, `FieldObservation`, `AgentRun`, `AgentStep`, and `FarmingTask` using the domain model above. Use SQLite as the datasource.

- [ ] **Step 2: Add crop constants**

Create crop labels and growth stages:

```ts
export const CROP_LABELS = {
  rice: "水稻",
  wheat: "小麦",
  corn: "玉米",
  soybean: "大豆",
} as const;

export const GROWTH_STAGES = {
  rice: ["返青期", "分蘖期", "拔节孕穗期", "抽穗扬花期", "灌浆期"],
  wheat: ["返青期", "拔节期", "抽穗期", "灌浆期", "成熟期"],
  corn: ["苗期", "拔节期", "大喇叭口期", "抽雄吐丝期", "灌浆期"],
  soybean: ["苗期", "分枝期", "开花期", "结荚期", "鼓粒期"],
} as const;
```

- [ ] **Step 3: Seed four demonstration fields**

Seed one field for each crop:

- 水稻：江淮水稻示范田，分蘖期，中等风险。
- 小麦：黄淮麦田示范区，灌浆期，高温干热风风险。
- 玉米：东北玉米示范田，拔节期，墒情偏低。
- 大豆：黑土地大豆示范田，开花期，病虫害中等风险。

- [ ] **Step 4: Push schema and seed database**

Run:

```bash
npm run db:push
npm run db:seed
```

Expected: SQLite database is created and contains four fields.

- [ ] **Step 5: Commit**

```bash
git add prisma src/lib/db.ts src/lib/domain/crops.ts
git commit -m "feat: add field crop data model"
```

### Task 3: Implement Risk Scoring

**Files:**
- Create: `src/lib/domain/risk.ts`
- Test: `tests/agents/risk.test.ts`

- [ ] **Step 1: Write failing risk tests**

Test these cases:

- Low soil moisture plus high temperature returns high drought risk.
- Normal moisture and normal growth returns low risk.
- Disease or pest description increases biological risk.

- [ ] **Step 2: Implement risk helpers**

Create helpers:

```ts
export type RiskLevel = "low" | "medium" | "high";

export function scoreDroughtRisk(input: {
  soilMoisturePercent: number;
  temperatureC: number;
  rainfallMm: number;
}): RiskLevel;

export function scoreBiologicalRisk(input: {
  pestDescription?: string | null;
  diseaseDescription?: string | null;
  weedDescription?: string | null;
}): RiskLevel;

export function maxRisk(...levels: RiskLevel[]): RiskLevel;
```

- [ ] **Step 3: Run tests**

Run:

```bash
npm test -- tests/agents/risk.test.ts
```

Expected: all risk tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/domain/risk.ts tests/agents/risk.test.ts
git commit -m "feat: add agricultural risk scoring"
```

### Task 4: Build Mock Multi-Agent Orchestrator

**Files:**
- Create: `src/lib/agents/types.ts`
- Create: `src/lib/agents/mock-agents.ts`
- Create: `src/lib/agents/orchestrator.ts`
- Test: `tests/agents/orchestrator.test.ts`

- [ ] **Step 1: Define Agent interfaces**

Create:

```ts
export type AgentName =
  | "田间感知Agent"
  | "作物诊断Agent"
  | "病虫草害预警Agent"
  | "水肥决策Agent"
  | "灾害应对Agent"
  | "农事档案Agent";

export interface AgentStepResult {
  agentName: AgentName;
  inputSummary: string;
  outputSummary: string;
}

export interface AgentRunResult {
  overallRiskLevel: "low" | "medium" | "high";
  summary: string;
  reasoning: string;
  recommendations: string[];
  steps: AgentStepResult[];
}
```

- [ ] **Step 2: Implement deterministic mock agents**

Each mock agent should return Chinese output and use the field crop, growth stage, weather, soil, and pest data.

- [ ] **Step 3: Implement orchestrator**

`runFieldAnalysis(fieldId: string, observationId: string)` should:

1. Load field and observation.
2. Run mock agents in the fixed order.
3. Persist `AgentRun`.
4. Persist six `AgentStep` records.
5. Return the completed report.

- [ ] **Step 4: Test output shape**

Assert:

- One run contains six steps.
- Summary mentions the crop label.
- Recommendations has at least three items.
- Risk level is one of low, medium, high.

- [ ] **Step 5: Run tests**

Run:

```bash
npm test -- tests/agents/orchestrator.test.ts
```

Expected: orchestrator tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/agents tests/agents/orchestrator.test.ts
git commit -m "feat: add mock multi-agent analysis"
```

### Task 5: Generate Farming Tasks From Reports

**Files:**
- Create: `src/lib/agents/task-generator.ts`
- Test: `tests/agents/task-generator.test.ts`

- [ ] **Step 1: Write failing task generation tests**

Test:

- High drought risk creates irrigation task.
- Pest/disease risk creates field inspection or treatment task.
- Every analysis creates a follow-up observation task.

- [ ] **Step 2: Implement generator**

Create `generateTasksFromAgentRun(agentRunId: string)` that persists farming tasks with due dates and priorities.

- [ ] **Step 3: Run tests**

Run:

```bash
npm test -- tests/agents/task-generator.test.ts
```

Expected: task generation tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/agents/task-generator.ts tests/agents/task-generator.test.ts
git commit -m "feat: generate farming tasks from agent reports"
```

### Task 6: Add API Routes

**Files:**
- Create: `src/app/api/fields/route.ts`
- Create: `src/app/api/fields/[id]/route.ts`
- Create: `src/app/api/fields/[id]/observations/route.ts`
- Create: `src/app/api/fields/[id]/analyze/route.ts`
- Create: `src/app/api/reports/[id]/route.ts`
- Create: `src/app/api/tasks/route.ts`

- [ ] **Step 1: Implement fields API**

Support:

- `GET /api/fields`
- `POST /api/fields`
- `GET /api/fields/[id]`

- [ ] **Step 2: Implement observations API**

Support:

- `GET /api/fields/[id]/observations`
- `POST /api/fields/[id]/observations`

- [ ] **Step 3: Implement analysis API**

Support:

- `POST /api/fields/[id]/analyze`

This route should use the latest observation for the field, run the orchestrator, generate farming tasks, and return the report.

- [ ] **Step 4: Implement reports and tasks APIs**

Support:

- `GET /api/reports/[id]`
- `GET /api/tasks`
- `PATCH /api/tasks`

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: all route handlers compile.

- [ ] **Step 6: Commit**

```bash
git add src/app/api
git commit -m "feat: add field crop agent APIs"
```

### Task 7: Build Shared UI Components

**Files:**
- Create: `src/components/app-shell.tsx`
- Create: `src/components/stat-card.tsx`
- Create: `src/components/risk-badge.tsx`
- Create: `src/components/agent-timeline.tsx`
- Create: `src/components/report-panel.tsx`
- Create: `src/components/field-card.tsx`
- Create: `src/components/task-list.tsx`

- [ ] **Step 1: Implement visual system**

Use a restrained agriculture + technology palette:

- Background: off-white or very light green-gray.
- Primary: deep field green.
- Accent: wheat gold and sky blue.
- Risk: green, amber, red.
- Cards: radius 8px or less.

- [ ] **Step 2: Implement risk badge**

Labels:

- `low`: 低风险
- `medium`: 中风险
- `high`: 高风险

- [ ] **Step 3: Implement agent timeline**

Show six fixed Agent stages with completed/running states.

- [ ] **Step 4: Implement report panel**

Sections:

- 综合判断
- 长链推理
- 农事建议
- 后续观察指标

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: all components compile.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "feat: add shared product UI components"
```

### Task 8: Build Product Demo Screen

**Files:**
- Create: `src/app/demo/page.tsx`

- [ ] **Step 1: Load fields, latest reports, and tasks**

Use server-side data fetching through Prisma.

- [ ] **Step 2: Build first-viewport presentation**

Include:

- Project name: `AI驱动的大田作物稳产减灾决策Agent`
- Subtitle: `面向水稻、小麦、玉米、大豆的精准农事管理系统`
- Key metrics.
- Hint of the workflow section below the fold.

- [ ] **Step 3: Build workflow and value sections**

Show:

- Multi-source sensing.
- Six-Agent collaboration.
- Long-chain reasoning.
- Farming task closure.
- Archive and traceability.

- [ ] **Step 4: Run visual check**

Start dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/demo
```

Check desktop and mobile widths. Ensure text does not overlap and cards remain readable.

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/page.tsx
git commit -m "feat: add funding demo screen"
```

### Task 8A: Upgrade Product Demo To Command Center Big Screen

**Files:**
- Modify: `src/app/demo/page.tsx`
- Create/Modify: `src/components/command-center/*.tsx`
- Modify: `src/app/globals.css`
- Reference: `docs/product/UI-VISUAL-SPEC-field-crop-agent-command-center.md`

- [ ] **Step 1: Replace the current `/demo` visual direction**

Implement `/demo` as a government/project-application command-center big screen matching the user-provided reference image. The page must use a dark digital agriculture style, not the earlier light marketing/dashboard layout.

Required structure:

```text
Top status bar
Left metrics tower
Center field risk situation map
Right multi-Agent decision chain and warning panel
Bottom soil moisture trend, task queue, recent analysis
```

- [ ] **Step 2: Build command-center components**

Create focused components:

```text
src/components/command-center/top-status-bar.tsx
src/components/command-center/situation-metrics-panel.tsx
src/components/command-center/crop-distribution-donut.tsx
src/components/command-center/growth-stage-bars.tsx
src/components/command-center/field-risk-map.tsx
src/components/command-center/agent-decision-chain.tsx
src/components/command-center/risk-warning-panel.tsx
src/components/command-center/soil-moisture-trend.tsx
src/components/command-center/command-task-queue.tsx
src/components/command-center/recent-analysis-ticker.tsx
```

- [ ] **Step 3: Implement mandatory animation**

At minimum, implement:

- KPI number count-up.
- High-risk field pulse.
- Sensor signal ripple.
- Sequential Agent node activation.
- Agent arrow flow animation.
- Donut chart draw animation.
- Line chart draw animation.
- Warning card border pulse.
- Recent analysis auto-scroll.

Use CSS keyframes, SVG animation, and React state. Respect `prefers-reduced-motion`.

- [ ] **Step 4: Implement mandatory interaction**

At minimum, implement:

- Click a field to select and highlight it.
- Click layer buttons to toggle active state.
- Click a warning card to highlight the related field.
- Hover Agent nodes to show output summaries.
- Hover chart points to show tooltip.
- Hover task rows to highlight.

- [ ] **Step 5: Fix all Chinese text**

Ensure `/demo` and shared command-center components contain no mojibake or garbled Chinese text.

- [ ] **Step 6: Verify visually in browser**

Open:

```text
http://localhost:3000/demo
```

Expected:

- The page visually matches the government/project command-center reference image.
- Central field risk map is the largest visual focus.
- Left/right/bottom panels are data-dense but readable.
- At least 8 animations are visible.
- At least 5 interactions work.
- No obvious overlap at 1440px and 1920px desktop widths.

- [ ] **Step 7: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/app/demo/page.tsx src/components/command-center src/app/globals.css docs/product/UI-VISUAL-SPEC-field-crop-agent-command-center.md
git commit -m "feat: upgrade demo to command center big screen"
```

### Task 9: Build Management Console Dashboard and Field Pages

**Files:**
- Create: `src/app/console/page.tsx`
- Create: `src/app/console/fields/page.tsx`
- Create: `src/app/console/fields/[id]/page.tsx`
- Create: `src/app/console/fields/[id]/input/page.tsx`

- [ ] **Step 1: Build console dashboard**

Show:

- Total fields.
- High-risk fields.
- Pending tasks.
- Latest analysis.
- Recent risk cards.

- [ ] **Step 2: Build field list**

Show field cards with crop, area, growth stage, risk, and actions.

- [ ] **Step 3: Build field detail**

Show:

- Field profile.
- Latest observation.
- Latest report.
- Entry buttons for input and analysis.

- [ ] **Step 4: Build observation input form**

Support manual input for weather, soil, crop growth, pest/disease/weed descriptions, and recent farming actions.

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: console and field pages compile.

- [ ] **Step 6: Commit**

```bash
git add src/app/console
git commit -m "feat: add field management console"
```

### Task 10: Build Agent Decision Center and Reports

**Files:**
- Create: `src/app/console/fields/[id]/analysis/page.tsx`
- Create: `src/app/console/reports/[id]/page.tsx`

- [ ] **Step 1: Build analysis page**

Show:

- Field context.
- Latest observation.
- Start analysis button.
- Six-Agent workflow timeline.
- Generated report after completion.

- [ ] **Step 2: Connect analysis action**

On click, call:

```text
POST /api/fields/[id]/analyze
```

Then navigate to the generated report.

- [ ] **Step 3: Build report detail page**

Show:

- Risk level.
- Summary.
- Long-chain reasoning.
- Recommendations.
- Agent step outputs.
- Generated farming tasks.

- [ ] **Step 4: Run end-to-end manual test**

Flow:

1. Open `/console/fields`.
2. Select the corn demo field.
3. Add observation with low soil moisture and high temperature.
4. Start analysis.
5. Confirm a high or medium-high drought risk report appears.
6. Confirm tasks are generated.

- [ ] **Step 5: Commit**

```bash
git add src/app/console/fields src/app/console/reports
git commit -m "feat: add agent decision center"
```

### Task 11: Build Task and Archive Pages

**Files:**
- Create: `src/app/console/tasks/page.tsx`
- Create: `src/app/console/archive/page.tsx`

- [ ] **Step 1: Build task page**

Show tasks grouped by status:

- 待执行
- 已完成
- 已逾期

Allow marking pending tasks as completed.

- [ ] **Step 2: Build archive page**

Show historical Agent runs with:

- Field name.
- Crop type.
- Risk level.
- Created time.
- Summary.
- Link to report detail.

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: task and archive pages compile.

- [ ] **Step 4: Commit**

```bash
git add src/app/console/tasks src/app/console/archive
git commit -m "feat: add farming tasks and archive"
```

### Task 12: Final MVP Verification

**Files:**
- Modify only if verification reveals bugs.

- [ ] **Step 1: Run unit tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Run seeded demo**

Run:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open:

```text
http://localhost:3000/demo
http://localhost:3000/console
```

Expected:

- Demo screen communicates project value in the first viewport.
- Console shows seeded fields.
- Field input works.
- Agent analysis creates report.
- Report creates farming tasks.
- Archive shows historical analysis.

- [ ] **Step 4: Document demo script**

Create `docs/demo-script.md` with a 3-minute demonstration script:

1. Open product demo screen.
2. Explain pain points and six-Agent workflow.
3. Enter console.
4. Select corn field.
5. Add low moisture/high temperature observation.
6. Run Agent analysis.
7. Show report, tasks, and archive.

- [ ] **Step 5: Commit**

```bash
git add docs/demo-script.md
git commit -m "docs: add mvp demo script"
```

---

## Implementation Order

1. Bootstrap app.
2. Add database and seed data.
3. Implement risk logic.
4. Implement mock multi-Agent orchestrator.
5. Implement task generation.
6. Add APIs.
7. Build shared UI.
8. Build product demo screen.
9. Build management console.
10. Build decision center and reports.
11. Build task/archive pages.
12. Verify full MVP and write demo script.

---

## Future Extensions

- LLM provider adapter for richer natural-language reports.
- Vision model for leaf disease and pest image recognition.
- Weather API integration.
- IoT sensor integration.
- GIS map layer.
- PDF export for reports.
- Role-based login for farm managers, technicians, and reviewers.
- Mobile-friendly field technician workflow.

---

## Self-Review

- Spec coverage: The plan covers both required surfaces, field/crop management, data input, multi-Agent workflow, long-chain report, tasks, and archive.
- Placeholder scan: No task relies on undefined future work for the MVP. Future integrations are explicitly out of MVP scope.
- Type consistency: Risk levels, crop types, Agent names, and task statuses are defined once and reused across the plan.
