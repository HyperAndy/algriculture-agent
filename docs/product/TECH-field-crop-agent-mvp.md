# AI 驱动的大田作物稳产减灾决策 Agent 技术实现文档

## 1. 技术目标

构建一个可本地运行、可演示、可扩展的全栈 Web MVP，用于验证大田作物多 Agent 农事决策闭环。

系统需要支持：

- 宣传演示大屏。
- 管理后台。
- 地块与作物数据管理。
- 农情观测数据录入。
- 多 Agent 编排分析。
- 长链推理报告生成。
- 农事任务生成。
- 历史档案追溯。
- Mock Agent 与未来 LLM Agent 的切换扩展。

## 2. 技术选型

### 2.1 前端

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react 图标

### 2.2 后端

- Next.js Route Handlers
- Prisma ORM
- SQLite

### 2.3 测试

- Vitest
- 重点覆盖风险评分、Agent 编排、任务生成

### 2.4 AI 层

MVP 使用确定性的 Mock Agent，不依赖外部 API Key。

后续通过统一 Agent Provider 接口接入：

- OpenAI API
- 本地大模型
- 视觉识别模型
- 规则库/专家系统

## 3. 系统架构

```text
Browser
  ├─ /demo 宣传演示大屏
  └─ /console 管理后台
        │
        ▼
Next.js App Router Pages
        │
        ▼
Route Handlers API
        │
        ├─ Field Service
        ├─ Observation Service
        ├─ Agent Orchestrator
        ├─ Task Generator
        └─ Report Service
        │
        ▼
Prisma ORM
        │
        ▼
SQLite Database
```

## 4. 目录结构

```text
.
├─ docs/
│  ├─ product/
│  │  ├─ BRD-field-crop-agent-mvp.md
│  │  ├─ PRD-field-crop-agent-mvp.md
│  │  └─ TECH-field-crop-agent-mvp.md
│  └─ superpowers/
│     └─ plans/
│        └─ 2026-05-01-field-crop-agent-mvp.md
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ app/
│  │  ├─ demo/page.tsx
│  │  ├─ console/
│  │  └─ api/
│  ├─ components/
│  └─ lib/
│     ├─ agents/
│     ├─ domain/
│     └─ db.ts
└─ tests/
   └─ agents/
```

## 5. 数据模型

### 5.1 Field

表示一个生产地块。

字段：

- `id`: string
- `name`: string
- `location`: string
- `areaMu`: number
- `cropType`: enum，`rice | wheat | corn | soybean`
- `variety`: string
- `growthStage`: string
- `sowingDate`: Date
- `targetYieldKgPerMu`: number
- `riskLevel`: enum，`low | medium | high`
- `createdAt`: Date
- `updatedAt`: Date

### 5.2 FieldObservation

表示一次地块观测或数据录入。

字段：

- `id`: string
- `fieldId`: string
- `temperatureC`: number
- `rainfallMm`: number
- `windLevel`: string
- `weatherTrend`: string
- `soilMoisturePercent`: number
- `soilTemperatureC`: number
- `soilPh`: number
- `nitrogenLevel`: enum，`low | normal | high`
- `phosphorusLevel`: enum，`low | normal | high`
- `potassiumLevel`: enum，`low | normal | high`
- `plantHeightCm`: number
- `leafColor`: enum，`pale | normal | dark`
- `growthStatus`: enum，`weak | normal | vigorous`
- `pestDescription`: string
- `diseaseDescription`: string
- `weedDescription`: string
- `lastIrrigationDate`: Date?
- `lastFertilizationDate`: Date?
- `lastPesticideDate`: Date?
- `notes`: string
- `createdAt`: Date

### 5.3 AgentRun

表示一次 Agent 分析。

字段：

- `id`: string
- `fieldId`: string
- `observationId`: string
- `status`: enum，`pending | running | completed | failed`
- `overallRiskLevel`: enum，`low | medium | high`
- `summary`: string
- `reasoning`: string
- `recommendations`: string，JSON 字符串或 Prisma Json
- `createdAt`: Date
- `completedAt`: Date?

### 5.4 AgentStep

表示一次 Agent 分析中的单个 Agent 步骤。

字段：

- `id`: string
- `agentRunId`: string
- `agentName`: string
- `status`: enum，`pending | running | completed | failed`
- `inputSummary`: string
- `outputSummary`: string
- `startedAt`: Date
- `completedAt`: Date?

### 5.5 FarmingTask

表示 Agent 分析后生成的农事任务。

字段：

- `id`: string
- `fieldId`: string
- `agentRunId`: string
- `title`: string
- `description`: string
- `priority`: enum，`low | medium | high`
- `dueDate`: Date
- `status`: enum，`pending | completed | overdue`
- `createdAt`: Date
- `completedAt`: Date?

## 6. API 设计

### 6.1 地块

#### GET `/api/fields`

返回地块列表。

响应：

```json
{
  "fields": [
    {
      "id": "field_1",
      "name": "东北玉米示范田",
      "cropType": "corn",
      "growthStage": "拔节期",
      "riskLevel": "medium"
    }
  ]
}
```

#### POST `/api/fields`

创建地块。

请求：

```json
{
  "name": "江淮水稻示范田",
  "location": "安徽省示范区",
  "areaMu": 120,
  "cropType": "rice",
  "variety": "示范品种",
  "growthStage": "分蘖期",
  "sowingDate": "2026-04-10",
  "targetYieldKgPerMu": 650
}
```

#### GET `/api/fields/[id]`

返回地块详情、最新观测、最新报告和任务摘要。

### 6.2 观测数据

#### GET `/api/fields/[id]/observations`

返回地块观测历史。

#### POST `/api/fields/[id]/observations`

创建观测数据。

请求：

```json
{
  "temperatureC": 34,
  "rainfallMm": 0,
  "windLevel": "3级",
  "weatherTrend": "未来5天高温少雨",
  "soilMoisturePercent": 38,
  "soilTemperatureC": 27,
  "soilPh": 6.8,
  "nitrogenLevel": "normal",
  "phosphorusLevel": "normal",
  "potassiumLevel": "low",
  "plantHeightCm": 65,
  "leafColor": "pale",
  "growthStatus": "weak",
  "pestDescription": "少量虫咬叶片",
  "diseaseDescription": "",
  "weedDescription": "田间有零星杂草",
  "notes": "部分叶片午后卷曲"
}
```

### 6.3 Agent 分析

#### POST `/api/fields/[id]/analyze`

使用该地块最新观测数据发起分析。

处理流程：

1. 查询地块。
2. 查询最新观测数据。
3. 调用 `runFieldAnalysis(fieldId, observationId)`。
4. 保存 AgentRun 和 AgentStep。
5. 调用 `generateTasksFromAgentRun(agentRunId)`。
6. 返回报告 ID 和摘要。

响应：

```json
{
  "reportId": "run_1",
  "overallRiskLevel": "high",
  "summary": "东北玉米示范田处于拔节期，当前墒情偏低且未来持续高温少雨，存在中高等级干旱风险。",
  "taskCount": 3
}
```

### 6.4 报告

#### GET `/api/reports/[id]`

返回报告详情、Agent 步骤和关联任务。

### 6.5 任务

#### GET `/api/tasks`

返回任务列表，可通过 query 按状态过滤。

#### PATCH `/api/tasks`

更新任务状态。

请求：

```json
{
  "taskId": "task_1",
  "status": "completed"
}
```

## 7. Agent 编排设计

### 7.1 Agent 类型

```ts
export type AgentName =
  | "田间感知Agent"
  | "作物诊断Agent"
  | "病虫草害预警Agent"
  | "水肥决策Agent"
  | "灾害应对Agent"
  | "农事档案Agent";
```

### 7.2 输出结构

```ts
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

### 7.3 固定执行顺序

```text
田间感知 Agent
→ 作物诊断 Agent
→ 病虫草害预警 Agent
→ 水肥决策 Agent
→ 灾害应对 Agent
→ 农事档案 Agent
```

### 7.4 Mock Agent 规则

MVP 使用规则驱动，保证稳定演示。

干旱风险：

- 墒情 `< 40%` 且温度 `>= 32℃`：高风险。
- 墒情 `< 50%` 或未来天气包含“高温少雨”：中风险。
- 其他：低风险。

病虫草害风险：

- 病虫草害描述中包含“严重、大量、扩散、病斑、虫口”：高风险。
- 任一描述不为空：中风险。
- 全部为空：低风险。

长势风险：

- 叶色 `pale` 或长势 `weak`：中风险。
- 两者同时出现：高风险。
- 其他：低风险。

综合风险取最高风险等级。

### 7.5 长链推理模板

报告推理应包含：

```text
1. 作物与地块识别：
   当前地块为 {field.name}，作物为 {cropLabel}，处于 {growthStage}。

2. 多源数据融合：
   当前温度 {temperatureC}℃，降雨量 {rainfallMm}mm，土壤墒情 {soilMoisturePercent}%。

3. 主要风险判断：
   系统识别到 {riskFactors}，综合风险为 {overallRiskLevel}。

4. 农事措施推理：
   结合生育期、未来天气和土壤状态，优先建议 {primaryAction}。

5. 后续观察：
   建议在 {followUpDays} 天内复查苗情、墒情和病虫草害变化。
```

## 8. 任务生成规则

### 8.1 灌溉任务

触发条件：

- 综合风险为 high，且墒情 `< 45%`。
- 或推理文本包含“干旱”“缺水”“高温少雨”。

生成任务：

- 标题：`安排补灌`
- 优先级：high
- 截止日期：当天或次日

### 8.2 病虫草害巡查任务

触发条件：

- 任一病虫草害描述不为空。
- 或生物风险为 medium/high。

生成任务：

- 标题：`开展病虫草害复查`
- 优先级：medium/high
- 截止日期：2 天内

### 8.3 追肥/营养任务

触发条件：

- 氮磷钾任一为 low。
- 叶色 pale 或长势 weak。

生成任务：

- 标题：`评估追肥方案`
- 优先级：medium
- 截止日期：3 天内

### 8.4 固定复查任务

每次 Agent 分析完成后生成：

- 标题：`复查地块状态`
- 优先级：low/medium
- 截止日期：3 天后

## 9. 前端实现细节

### 9.1 视觉原则

- `/demo` 的最终视觉以 `docs/product/UI-VISUAL-SPEC-field-crop-agent-command-center.md` 为准，采用政府/项目申报指挥中心风。它必须是深色数字农业大屏，而不是浅色 SaaS 首页或普通卡片式宣传页。
- `/demo` 使用深蓝黑/墨绿黑背景、农业绿、科技青、麦穗黄、风险橙红。
- `/demo` 采用 16:9 大屏布局：顶部状态栏、左侧数据塔、中央田间风险态势地图、右侧 Agent 和预警区、底部趋势与任务带。
- `/demo` 中央地图是最大视觉核心，必须展示地块边界、风险热区、传感器点位、图层按钮和风险图例。
- `/demo` 必须有实际动效和交互，不能做静态截图式大屏。
- `/console` 继续保持企业级农业 SaaS 管理后台风格，强调密度、可扫描性和操作效率。
- 卡片圆角不超过 8px。
- 中文文本必须无乱码。

### 9.2 共享组件

- `AppShell`: 管理后台导航和布局。
- `StatCard`: 指标卡。
- `RiskBadge`: 风险等级。
- `AgentTimeline`: Agent 执行流程。
- `ReportPanel`: 报告展示。
- `FieldCard`: 地块摘要。
- `TaskList`: 任务列表和状态操作。

### 9.4 大屏专用组件

为 `/demo` 新增或拆分以下组件，避免单文件堆叠：

- `CommandCenterShell`: 大屏背景、顶部状态栏和整体 16:9 布局。
- `TopStatusBar`: 天气、湿度、风向、时间、系统状态。
- `SituationMetricsPanel`: 综合态势指标条和数字计数动画。
- `CropDistributionDonut`: 作物种植分布环图。
- `GrowthStageBars`: 生育期分布堆叠条。
- `FieldRiskMap`: 中央田间风险态势地图。
- `LayerToggleRail`: 图层、气象、土壤、病虫、灾害、实景按钮。
- `AgentDecisionChain`: 多 Agent 决策链节点、箭头和 hover 摘要。
- `RiskWarningPanel`: 风险预警卡片和地图联动。
- `SoilMoistureTrend`: 土壤墒情趋势折线图。
- `CommandTaskQueue`: 农事任务队列表格。
- `RecentAnalysisTicker`: 近期分析自动滚动列表。

### 9.5 动效实现要求

动效优先使用 CSS keyframes 和 React state 实现，避免引入大型动画库。必要时可使用轻量 SVG 动画。

必须实现：

- 数字计数：使用 `requestAnimationFrame` 或小型 hook。
- 高风险地块脉冲：CSS `box-shadow` / SVG opacity scale。
- 传感器信号波纹：CSS pseudo elements 或 SVG circles。
- Agent 节点顺序点亮：CSS animation delay。
- 箭头流光：linear-gradient background-position 或 SVG stroke-dashoffset。
- 环形图绘制：SVG `stroke-dasharray` 和 `stroke-dashoffset`。
- 折线图绘制：SVG path `stroke-dasharray`。
- 预警边框脉冲：CSS border/glow animation。
- 近期分析自动滚动：CSS transform animation，hover 暂停。

必须支持：

- `prefers-reduced-motion: reduce` 降低或关闭循环动画。
- 动画不得造成布局位移。
- 动画不得遮挡文字。
- 动画不得依赖真实定时数据才能显示。

### 9.6 页面数据策略

- 静态演示大屏可使用服务端组件直接读取 Prisma。
- 管理后台表单和按钮可使用客户端组件调用 API。
- 分析动作使用 `POST /api/fields/[id]/analyze`。

## 10. 错误处理

### 10.1 数据缺失

如果地块没有观测数据，分析按钮应提示：

```text
请先录入本地块的天气、土壤、苗情和病虫草害信息。
```

### 10.2 分析失败

如果 Agent 编排失败，应返回：

```json
{
  "error": "AGENT_RUN_FAILED",
  "message": "Agent 分析失败，请检查观测数据后重试。"
}
```

### 10.3 任务更新失败

如果任务不存在，应返回 404。

## 11. 测试策略

### 11.1 单元测试

重点测试：

- 风险评分。
- 综合风险取最大值。
- Agent 输出结构。
- 任务生成规则。

### 11.2 集成测试

MVP 可先以手动集成验证为主：

1. 运行数据库种子。
2. 打开地块详情。
3. 创建观测数据。
4. 发起 Agent 分析。
5. 查看报告。
6. 查看任务。
7. 查看档案。

### 11.3 大屏视觉与交互验证

实现 `/demo` 后必须进行浏览器验证：

1. 打开 `http://localhost:3000/demo`。
2. 检查 1440px 及以上桌面视口下无文字重叠。
3. 检查中央田间风险态势地图为最大视觉核心。
4. 检查高风险地块脉冲、传感器波纹、Agent 顺序点亮、箭头流光、图表绘制、数字计数、预警边框脉冲、近期分析滚动至少 8 类动效可见。
5. 检查地块选择、图层按钮、风险预警点击、Agent hover、图表 tooltip 至少 5 类交互可用。
6. 检查中文无乱码。
7. 检查 `prefers-reduced-motion` 下页面仍可读、可操作。

### 11.4 构建验证

每次完成主要功能后运行：

```bash
npm run build
npm test
```

## 12. 本地运行步骤

### 12.1 安装依赖

```bash
npm install
```

### 12.2 初始化数据库

```bash
npm run db:push
npm run db:seed
```

### 12.3 启动开发环境

```bash
npm run dev
```

访问：

```text
http://localhost:3000/demo
http://localhost:3000/console
```

## 13. 部署建议

MVP 可优先部署到 Vercel 或普通 Node.js 服务器。

如果部署到 Vercel，需要注意 SQLite 持久化限制。生产环境建议替换为：

- PostgreSQL
- MySQL
- Neon Postgres
- Supabase Postgres

## 14. 扩展设计

### 14.1 LLM Provider Adapter

后续新增：

```ts
export interface AgentProvider {
  runStep(input: AgentStepInput): Promise<AgentStepResult>;
}
```

实现：

- `MockAgentProvider`
- `OpenAIAgentProvider`
- `LocalModelAgentProvider`

### 14.2 视觉识别

后续可为田间图片新增：

- 图片上传。
- 作物叶片病斑识别。
- 虫害识别。
- 苗情长势评分。

### 14.3 真实数据接入

可接入：

- 天气 API。
- 土壤墒情传感器。
- 虫情灯。
- 无人机巡田结果。
- 遥感植被指数。

## 15. 技术验收标准

- `npm run build` 成功。
- `npm test` 成功。
- 数据库可 seed 四类作物示范地块。
- `/demo` 展示宣传大屏。
- `/demo` 符合政府/项目申报指挥中心风，接近用户提供的参考图。
- `/demo` 至少包含 8 类可见动效和 5 类交互。
- `/console` 展示管理后台。
- 可录入观测数据。
- 可生成 AgentRun。
- 每个 AgentRun 包含 6 个 AgentStep。
- 可生成 FarmingTask。
- 可查看历史档案。
