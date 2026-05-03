# 大田作物 Agent 平台 B 方案重构设计

日期：2026-05-03  
状态：v1 已确认  
适用范围：现有 Next.js MVP 的中等重构

## 1. 设计结论

采用 **B：模块化单体 + 双前端体验**。

本次不做彻底服务化重写。保留现有 Next.js App Router、Prisma、SQLite、`/demo`、`/console` 和主要业务能力，通过重新划分代码边界、前端视觉体系和数据流，把项目从“能跑的 MVP”提升为“可维护、可演示、可继续扩展的产品原型”。

长期保留 C 方案作为二期蓝图：Web、API Service、Agent Worker、Postgres、Queue、对象存储、GIS/IoT/气象/LLM Gateway、多租户和权限体系。

## 2. 重构目标

1. 解决当前样式补丁堆积、组件过大、业务逻辑散落的问题。
2. 让 `/demo` 大屏和 `/console` 后台彻底分离视觉体验。
3. 让 `/demo` 优先读取真实后台数据，并在数据不足或异常时 fallback 到演示数据。
4. 让 `/console` 成为企业级农业 SaaS 后台，支持桌面、平板、移动端完整操作。
5. 为未来接入真实 LLM Agent、气象数据、传感器数据、GIS 地图和正式数据库留下边界。

## 3. 非目标

本阶段不做以下内容：

1. 不拆成多个独立后端服务。
2. 不引入队列、对象存储、多租户、复杂权限系统。
3. 不重写所有业务功能。
4. 不把移动端降级为只读或轻量外勤模式。
5. 不让 `/demo` 继续使用散落在组件里的硬编码数据。

## 4. 目标架构

```text
src/
  app/
    demo/
    console/
    api/

  features/
    dashboard/
    fields/
    observations/
    agent-runs/
    tasks/
    reports/

  domain/
    crops/
    risk/
    agents/
    tasks/

  application/
    dashboard-service.ts
    field-service.ts
    observation-service.ts
    agent-run-service.ts
    task-service.ts
    report-service.ts

  infrastructure/
    prisma/
    repositories/
    agent-providers/
    demo-data/

  design-system/
    big-screen/
    console/
    primitives/
```

### 4.1 App Layer

`src/app` 只负责路由、页面入口、布局组装和 Server/Client 边界。

页面不直接写复杂业务规则，不直接拼大屏数据，不直接访问 Prisma。页面通过 feature 或 application service 获取 ViewModel。

### 4.2 Feature Modules

`features/*` 按业务能力组织：

- `dashboard`：大屏和后台工作台聚合数据。
- `fields`：地块主数据、作物、品种、生育期、风险状态。
- `observations`：天气、土壤、苗情、病虫草害、农事记录。
- `agent-runs`：Agent 编排、步骤、推理结果、运行状态。
- `tasks`：农事任务、优先级、状态流转、批量操作。
- `reports`：报告列表、报告详情、导出、历史归档。

### 4.3 Domain Layer

`domain/*` 承载稳定业务规则：

- 作物枚举和生育期规则。
- 风险等级、风险颜色语义、风险评分规则。
- Agent 输入/输出契约。
- 农事任务生成规则。
- 报告结构和状态枚举。

Domain 不依赖 React、Next.js 或 Prisma。

### 4.4 Application Layer

`application/*` 承载用例服务：

- 创建观测。
- 运行 Agent 分析。
- 生成农事任务。
- 获取后台工作台数据。
- 获取大屏 dashboard ViewModel。
- 生成和查询报告。

这些服务协调 repository、domain rule 和 agent provider。

### 4.5 Infrastructure Layer

`infrastructure/*` 承载外部依赖：

- Prisma repository。
- SQLite 当前实现。
- 未来 Postgres 替换点。
- Mock Agent Provider。
- 未来 LLM Agent Provider。
- Demo fallback 数据。

## 5. `/demo` 数据策略

`/demo` 大屏采用真实数据优先、fallback 演示数据兜底。

```text
Prisma / 后台真实数据
  -> dashboard service 聚合
  -> CommandDashboardViewModel
  -> /demo 大屏展示

如果真实数据缺失或异常：
  -> mergeDemoFallback()
  -> 补齐大屏需要的稳定数据结构
```

### 5.1 三种数据状态

1. 真实数据完整：使用真实后台聚合数据，页面可标记为“实时业务数据”。
2. 真实数据部分缺失：真实数据优先，缺失模块用 fallback 演示数据补齐。
3. 真实数据异常：回退到完整演示 ViewModel，同时记录错误日志。

### 5.2 关键边界

大屏组件只消费 `CommandDashboardViewModel`，不直接访问 Prisma，不直接拼业务规则，不直接依赖后台页面组件。

## 6. 双前端视觉体系

### 6.1 `/demo` 大屏

定位：农业指挥中心，服务资金申请、路演和项目展示。

视觉原则：

- 深色农业科技风。
- 中央地图为视觉核心。
- 左右数据塔和底部数据带。
- 多 Agent 决策链明确可见。
- 风险预警、传感器、地图热区、图表具备持续动效。
- 页面必须稳定，不因真实数据缺失出现空白或崩溃。

### 6.2 `/console` 后台

定位：企业级农业 SaaS，服务长期管理和真实业务闭环。

视觉原则：

- 克制、清晰、高密度。
- 避免大屏式科幻装饰。
- 强调表格、筛选、表单、状态、批量操作和报告可读性。
- 支持桌面、平板、移动端完整操作。

### 6.3 共享与隔离

共享：

- 作物枚举。
- 风险等级语义。
- 基础 UI primitive。
- 图标库。
- 格式化工具。
- 数据 ViewModel 类型。

隔离：

- 页面布局系统。
- 主题 token。
- 图表主题。
- 动效策略。
- 大屏地图组件。
- 后台表格和表单样式。

## 7. `/console` 信息架构

后台固定 6 个主模块：

1. 工作台。
2. 地块管理。
3. 观测录入。
4. Agent 分析。
5. 农事任务。
6. 报告归档。

主业务闭环：

```text
地块建档 -> 观测录入 -> Agent 分析 -> 农事任务 + 报告归档 -> 工作台回看
```

### 7.1 工作台

展示全局态势、核心指标、高风险地块、待办任务、近期报告和快捷入口。

### 7.2 地块管理

管理地块主数据、作物类型、品种、面积、生育期、目标产量和风险状态。

### 7.3 观测录入

录入天气、土壤、苗情、病虫草害和农事记录。移动端必须支持分步骤录入和草稿保存。

### 7.4 Agent 分析

采用“分析工作台 + Agent 时间线”结合。

分析前：

- 确认地块。
- 确认最新观测。
- 展示历史风险和农事记录。
- 启动 Agent 分析。

分析中：

- 展示 Agent 运行状态。
- 展示当前步骤。
- 支持失败提示和重试。

分析后：

- 展示 6 个 Agent 时间线。
- 展示风险等级。
- 展示推理摘要。
- 展示农事建议。
- 自动生成任务和报告入口。

### 7.5 农事任务

展示任务列表、优先级、状态、到期时间、批量处理和任务详情。

### 7.6 报告归档

展示历史报告、报告详情、导出入口、搜索和筛选。

## 8. 移动端完整操作设计

移动端采用完整可操作模式，不降级为只读。

移动端必须支持：

- 查看工作台。
- 管理地块。
- 录入观测。
- 启动 Agent 分析。
- 处理农事任务。
- 查看和导出报告。

### 8.1 移动端交互规则

1. 底部导航承载高频入口：工作台、地块、任务、报告。
2. 低频入口进入抽屉或更多菜单。
3. 桌面表格在移动端转为摘要卡片列表。
4. 筛选、排序、批量操作使用 Bottom Sheet。
5. 长表单分步骤：天气、土壤、苗情、病虫草害、农事记录。
6. 表单支持草稿保存和即时校验。
7. Agent 分析上下堆叠，时间线折叠展开。
8. 关键操作按钮固定可达。
9. 长任务必须展示运行中、失败、重试和上次同步时间。

### 8.2 响应式断点

```text
desktop: >= 1200px
tablet: 768px - 1199px
mobile: < 768px
```

桌面端：

- 侧边栏常驻。
- 工作台左右分栏。
- 表格、筛选、批量操作完整展示。

平板端：

- 侧边栏可折叠。
- 工作台上下堆叠。
- 关键操作固定在页面顶部或底部。

移动端：

- 底部导航或抽屉菜单。
- 列表卡片化。
- 表单分步骤。
- 时间线折叠。

## 9. C 方案长期蓝图

C 方案不是当前执行方案，但作为二期方向保留：

```text
Next Web
  -> API Service
  -> Agent Worker
  -> Queue
  -> Postgres
  -> Object Store
  -> GIS / IoT / Weather / LLM Gateway
```

服务边界：

- Web 负责页面、交互和前端状态。
- API Service 负责权限、业务聚合、数据写入和报表查询。
- Agent Worker 负责长链推理、异步分析、任务生成和重试。
- 数据层迁移到 Postgres，并预留多租户、审计和权限模型。

当前不直接执行 C，因为它会引入部署、队列、鉴权、服务通信等额外复杂度，影响资金申请阶段的可演示质量。

## 10. 实施阶段

当前实施状态：

- Phase 1 已完成：`/demo` 已改为通过 dashboard ViewModel service 读取真实后台数据，并在缺失时 fallback 到演示数据。
- Phase 2 已完成：`command-center.tsx` 已拆成大屏组合壳和独立面板组件，保留原有视觉 class、动效和数据契约。
- 当前分支：`modular-refactor-design`。
- 当前未进入 Phase 3/4：后台 SaaS 化和移动端完整操作仍是后续阶段。

### Phase 1：结构与边界

- 建立 `features/*`、`domain/*`、`application/*`、`infrastructure/*`、`design-system/*`。
- 抽出 dashboard ViewModel。
- 抽出 demo fallback 数据。
- 大屏组件改为只消费 ViewModel。
- 已落地文件包括：
  - `src/features/dashboard/types.ts`
  - `src/features/dashboard/server/get-command-dashboard-view-model.ts`
  - `src/features/dashboard/server/build-command-dashboard-view-model.ts`
  - `src/features/dashboard/server/format-command-time.ts`
  - `src/infrastructure/demo-data/command-dashboard-demo.ts`
  - `src/domain/risk/risk-level.ts`
  - `src/domain/crops/crop-labels.ts`

### Phase 2：大屏重整

- 拆分 `command-center.tsx`。
- 建立 `design-system/big-screen`。
- 保留真实数据 + fallback。
- 补齐大屏模块级测试和视觉验收清单。
- 已落地拆分：
  - `src/components/command-center/command-center.tsx` 现在只负责页面组合。
  - `src/components/command-center/model.ts` 承载大屏纯 helper。
  - `src/components/command-center/top-bar.tsx`、`panel-title.tsx`、`echart.tsx` 承载共享渲染原语。
  - `situation-metrics-panel.tsx`、`crop-distribution-panel.tsx`、`growth-stage-panel.tsx` 承载左侧面板。
  - `field-risk-map.tsx`、`map-layout.ts` 承载中央地图和地图静态布局。
  - `agent-decision-chain.tsx`、`risk-warning-panel.tsx`、`soil-moisture-trend.tsx`、`command-task-queue.tsx`、`recent-analysis-panel.tsx` 承载右侧和底部业务面板。
  - `src/design-system/big-screen/theme.ts` 承载大屏主题常量。

### Phase 3：后台 SaaS 化

- 建立 `design-system/console`。
- 重整工作台、地块、观测、Agent 分析、任务、报告。
- 引入桌面/平板/移动端响应式规则。

### Phase 4：移动端完整操作

- 底部导航。
- 卡片化列表。
- Bottom Sheet 筛选。
- 分步骤观测录入。
- 移动端 Agent 分析工作台。

### Phase 5：验证与文档

- 补充单元测试。
- 补充 ViewModel fallback 测试。
- 补充响应式验收清单。
- 更新 PRD、技术文档和演示脚本。

## 11. 验收标准

1. `/demo` 在真实数据完整、数据部分缺失、数据异常三种情况下都能稳定渲染。
2. `/demo` 不直接依赖 Prisma 或散落的硬编码业务数据。
3. `/console` 6 个主模块信息架构清晰。
4. Agent 分析页同时支持工作台操作和时间线追溯。
5. 移动端可完整完成核心业务闭环。
6. 大屏和后台主题、布局、动效不互相污染。
7. 核心业务规则可以在不启动 React 的情况下测试。
8. 新目录结构能支撑后续接入真实 LLM Agent Provider。

## 12. 参考

- Material Design Navigation Bar: https://m3.material.io/components/navigation-bar/overview
- Material Design Bottom Sheets: https://m3.material.io/components/bottom-sheets/overview
- Material Design Lists: https://m3.material.io/components/lists/overview
- Ant Design Mobile: https://mobile.ant.design/
- Ant Design Navigation: https://ant.design/docs/spec/navigation

