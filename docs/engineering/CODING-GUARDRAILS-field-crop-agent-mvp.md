# 大田作物稳产减灾 Agent 编码前约束与工程说明

## 1. 文档目的

本文档定义 coding 前必须遵守的工程约束、实现边界、目录职责、质量要求和验收规则，避免 MVP 开发过程中范围膨胀、业务规则漂移、页面风格混乱或 Agent 输出不可控。

## 2. 开发优先级

优先级从高到低：

1. 完整闭环可运行：地块 → 观测 → Agent 分析 → 报告 → 任务 → 档案。
2. Mock Agent 稳定输出：无外部 API Key 也能演示。
3. 宣传大屏表达清晰且具备专业指挥中心视觉：评审一眼看懂价值，并感受到项目级大盘质感。
4. 管理后台可真实操作：农技员能完成核心流程。
5. 后续扩展接口清楚：方便接 LLM、天气 API、传感器和视觉模型。

## 3. 范围约束

MVP 必须做：

- Next.js Web 应用。
- `/demo` 政府/项目申报指挥中心风宣传大屏，最终样式以用户提供参考图和 `docs/product/UI-VISUAL-SPEC-field-crop-agent-command-center.md` 为准。
- `/console` 管理后台。
- 四类作物示范地块。
- 手动观测数据录入。
- Mock 多 Agent 分析。
- 长链推理报告。
- 农事任务生成。
- 历史档案。
- 基础单元测试和构建验证。

MVP 禁止做：

- 真实硬件控制。
- 真实无人机/遥感解析。
- 复杂 GIS 地图。
- 小程序或原生 App。
- 生产级权限系统。
- 未经验证的农药剂量推荐。
- 声称保证增产或保证防灾。

## 4. 技术约束

- 使用 Next.js App Router。
- 使用 TypeScript。
- 使用 Prisma + SQLite 作为 MVP 数据层。
- 使用 Tailwind CSS 实现样式。
- 使用 lucide-react 图标。
- Agent 逻辑必须放在 `src/lib/agents/`。
- 风险规则必须放在 `src/lib/domain/risk.ts`。
- 作物枚举和生育期必须放在 `src/lib/domain/crops.ts`。
- UI 组件必须放在 `src/components/`。
- 页面不得直接复制 Agent 规则，必须调用 domain/agent 层。

## 5. 目录职责

```text
src/app/
  页面和 API Route Handler，只负责路由、请求处理和页面组合。

src/components/
  可复用 UI 组件，不包含数据库访问。

src/lib/db.ts
  Prisma client 单例。

src/lib/domain/
  作物枚举、风险评分、业务规则。

src/lib/agents/
  Agent 类型、Mock Agent、编排器、任务生成器。

tests/
  风险规则、Agent 编排、任务生成测试。
```

## 6. 数据约束

- 所有风险等级统一使用 `low | medium | high`。
- 所有作物类型统一使用 `rice | wheat | corn | soybean`。
- 土壤墒情必须是百分比。
- 分析必须基于某个地块和某条观测数据。
- 每次 AgentRun 必须包含 6 个 AgentStep。
- 每次分析至少生成 1 条 FarmingTask。
- 每次分析必须可在 archive 中查看。

## 7. Agent 输出约束

每份报告必须包含：

- 综合风险等级。
- 综合判断摘要。
- 长链推理过程。
- 至少 3 条农事建议。
- 6 个 Agent 步骤摘要。
- 后续复查建议。

Agent 禁止输出：

- 保证性增产承诺。
- 具体农药剂量。
- 替代专家现场判断的绝对结论。
- 与输入数据无关的臆测。

## 8. UI 约束

### 8.1 宣传大屏

- `/demo` 必须采用深色数字农业指挥舱，不允许再使用浅色官网式或普通白底卡片式布局。
- 首屏必须出现项目名称、四类作物、天气、时间、系统状态。
- 页面必须采用顶部状态栏、左侧数据塔、中央田间风险态势地图、右侧 Agent/预警区、底部趋势/任务带的结构。
- 中央田间风险态势地图必须是最大视觉核心。
- 必须展示六 Agent 决策链，并体现节点顺序和流向。
- 必须展示综合态势、作物种植分布、生育期分布、土壤墒情趋势、风险预警、农事任务队列、近期分析结果。
- 不做纯营销落地页，要展示真实系统数据。
- 中文文本必须无乱码。
- 具体视觉、颜色、动效和交互要求以 `docs/product/UI-VISUAL-SPEC-field-crop-agent-command-center.md` 为准。

### 8.1.1 宣传大屏动效硬约束

`/demo` 必须包含可见动效，不允许交付静态截图式页面。

至少实现：

- 指标数字计数动画。
- 高风险地块脉冲。
- 传感器点位信号波纹。
- Agent 节点顺序点亮。
- Agent 箭头流光。
- 环形图绘制动画。
- 折线图绘制动画。
- 高风险预警边框脉冲。
- 近期分析自动滚动。

动效必须尊重 `prefers-reduced-motion`，不能造成布局抖动或遮挡文字。

### 8.1.2 宣传大屏交互硬约束

至少实现：

- 地块点击选择并高亮。
- 图层按钮激活状态切换。
- 风险预警点击联动地图地块。
- Agent 节点 hover 展示摘要。
- 图表 hover tooltip。
- 任务行 hover 高亮。

### 8.2 管理后台

- 优先信息密度和可操作性。
- 页面结构应清晰、克制、适合农技员使用。
- 表单字段按天气、土壤、苗情、病虫草害、农事记录分组。
- 不使用过度装饰。
- 卡片圆角不超过 8px。
- 移动端不得出现文字重叠。

## 9. 错误处理约束

- 无观测数据时禁止分析，并提示先录入数据。
- 不存在的地块、报告、任务返回 404 或友好错误。
- 非法数值输入返回 400。
- Agent 分析失败时不得生成半截报告。
- 任务状态更新失败时不得静默吞错。

## 10. 测试约束

最低测试要求：

- 风险评分单元测试。
- 综合风险合并测试。
- Agent 编排输出结构测试。
- 任务生成测试。
- `npm run build` 必须通过。
- `/demo` 大屏视觉和交互需进行浏览器验证。

关键断言：

- 高温低墒情触发高干旱风险。
- 病虫害描述触发生物风险。
- 每次分析生成 6 个 AgentStep。
- 每次分析至少生成 3 条建议。
- 每次分析至少生成 1 条任务。

## 11. 提交和变更约束

- 每个任务完成后应运行相关测试。
- 不混入无关重构。
- 不删除现有文档和计划。
- 不把真实 API Key 写入代码。
- 不引入大型依赖来解决小问题。
- 不把 Mock Agent 和未来 LLM Provider 强耦合。

## 12. 实现顺序

建议严格按以下顺序：

1. 项目初始化。
2. Prisma schema 和 seed。
3. 作物枚举和风险规则。
4. Mock Agent 与 orchestrator。
5. 任务生成器。
6. API routes。
7. 共享 UI 组件。
8. `/demo`。
9. `/console` 地块和数据录入。
10. Agent 决策中心和报告。
11. 任务和档案。
12. 端到端验证和演示脚本。

## 13. 开发前阅读顺序

1. `docs/product/PRD-field-crop-agent-mvp.md`
2. `docs/product/TECH-field-crop-agent-mvp.md`
3. `docs/product/DATA-DICTIONARY-field-crop-agent-mvp.md`
4. `docs/product/AGENT-SPEC-field-crop-agent-mvp.md`
5. `docs/product/RISK-RULES-field-crop-agent-mvp.md`
6. `docs/engineering/CODING-GUARDRAILS-field-crop-agent-mvp.md`
7. `docs/superpowers/plans/2026-05-01-field-crop-agent-mvp.md`

## 14. 完成定义

只有同时满足以下条件，才能认为 MVP coding 完成：

- `/demo` 可用于 3 分钟路演。
- `/demo` 符合用户提供参考图的政府/项目申报指挥中心风。
- `/demo` 至少包含 8 类可见动效和 5 类可操作交互。
- `/console` 可完成核心业务流程。
- 数据库包含四类作物示范数据。
- Agent 分析可稳定生成报告。
- 任务和档案可追溯。
- 单元测试通过。
- 生产构建通过。
- 文档中的 MVP 验收清单全部通过。
