# AI 驱动的大田作物稳产减灾决策 Agent

面向**水稻、小麦、玉米、大豆**四种大田作物的智能农事决策系统。通过多 Agent 协作分析田间观测数据，自动生成风险评估、长链推理报告和农事任务调度，提供决策辅助。

## 产品形态

同一套数据和 Agent 能力，对外提供两类产品表面：

| 入口 | 说明 |
|------|------|
| `/demo` — 宣传演示大屏 | 面向评审和展示的指挥中心，宏观概览地块状态、风险分布和 Agent 运行总览 |
| `/console` — 管理后台 | 面向农技员的操作入口，支持地块管理、观测录入、分析报告、任务调度和历史档案 |

## 核心能力

- **地块管理** — 创建和编辑大田地块，登记作物类型、品种、生长阶段、目标产量等基础信息
- **观测录入** — 田间指标采集：气温、降雨、土壤参数（湿度/温度/pH/NPK）、植株状态、病虫草害描述
- **多 Agent 协作分析** — 六个专项 Agent 流水线依次推理，覆盖感知、诊断、预警、水肥、灾害、档案
- **长链推理报告** — Agent 运行过程完整可追溯，包含每一步的输入摘要、输出结论和风险信号
- **农事任务调度** — 根据分析结果自动生成农事任务，支持优先级排序和状态追踪
- **历史档案** — 所有 Agent 运行记录和报告可检索、可回溯

## 六个专项 Agent

| Agent | 职责 |
|-------|------|
| 田间感知 Agent | 汇总气象、土壤、植株多源观测数据，生成地块状态快照 |
| 作物诊断 Agent | 评估当前生长阶段与预期偏差，识别缺素、徒长等异常 |
| 病虫草害预警 Agent | 分析病虫害和草害描述，输出风险等级和防治窗口建议 |
| 水肥决策 Agent | 结合作物需求和土壤参数，给出灌溉和施肥推荐量 |
| 灾害应对 Agent | 识别高低温、干旱、渍涝等灾害风险，生成应急应对方案 |
| 农事档案 Agent | 汇总历史分析和农事操作，输出可追溯的决策档案 |

> MVP 阶段 Agent 使用 Mock 规则引擎模拟，推理逻辑定义在 `src/lib/agents/mock-agents.ts`，Agent 流水线编排见 `src/lib/agents/orchestrator.ts`。

## 技术栈

| 类别 | 技术选型 |
|------|----------|
| 框架 | Next.js 15 (App Router) |
| UI 库 | React 19 |
| 语言 | TypeScript 5.7 |
| 样式 | Tailwind CSS 4 |
| 图标 | Lucide React |
| ORM | Prisma 6 |
| 数据库 | SQLite (本地文件) |
| 测试 | Vitest 2 |
| 工具链 | tsx, postcss, autoprefixer |

## 项目结构

```
├── prisma/
│   ├── schema.prisma          # 数据模型定义
│   └── seed.ts                # 种子数据
├── scripts/
│   └── init_sqlite.py         # SQLite 数据库初始化脚本
├── src/
│   ├── app/
│   │   ├── api/               # RESTful API 路由
│   │   ├── console/           # 管理后台页面
│   │   ├── demo/              # 宣传大屏
│   │   └── page.tsx           # 首页入口
│   ├── components/
│   │   ├── agent-timeline.tsx   # Agent 运行时间线
│   │   ├── analyze-button.tsx   # 触发分析按钮
│   │   ├── app-shell.tsx        # 应用外壳
│   │   ├── command-center/      # 指挥中心大屏组件
│   │   ├── field-card.tsx       # 地块卡片
│   │   ├── observation-form.tsx # 观测录入表单
│   │   ├── report-panel.tsx     # 分析报告面板
│   │   ├── risk-badge.tsx       # 风险等级标签
│   │   ├── stat-card.tsx        # 统计卡片
│   │   └── task-list.tsx        # 农事任务列表
│   ├── lib/
│   │   ├── agents/              # Agent 核心逻辑
│   │   │   ├── analysis-service.ts   # 分析服务
│   │   │   ├── mock-agents.ts        # Mock Agent 规则
│   │   │   ├── orchestrator.ts       # Agent 流水线编排
│   │   │   ├── task-generator.ts     # 任务生成器
│   │   │   └── types.ts              # 类型定义
│   │   ├── domain/
│   │   │   ├── crops.ts         # 作物领域模型
│   │   │   └── risk.ts          # 风险等级模型
│   │   ├── data-mappers.ts      # 数据映射器
│   │   └── db.ts                # 数据库客户端
│   └── app/globals.css          # 全局样式
├── tests/                       # 单元测试
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

## 本地运行

### 环境要求

- Node.js >= 18
- Python 3（SQLite 初始化脚本依赖）

### 安装与启动

```bash
# 安装依赖
npm install

# 初始化数据库（创建表结构 + 生成 Prisma Client + 写入种子数据）
npm run db:init

# 启动开发服务器
npm run dev
```

访问地址：

- 首页：`http://localhost:3000`
- 宣传大屏：`http://localhost:3000/demo`
- 管理后台：`http://localhost:3000/console`

### 数据库初始化说明

`npm run db:init` 调用 Python 脚本直接写入 SQLite 表结构，不依赖 Prisma schema engine，适用于 schema engine 不兼容当前环境的场景。

也可以使用标准的 Prisma 初始化方式：

```bash
npm run db:push
npm run db:seed
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Next.js 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run test` | 运行单元测试 |
| `npm run test:watch` | 监视模式运行测试 |
| `npm run db:init` | 一键初始化数据库 |
| `npm run db:push` | Prisma 推送 schema 到数据库 |
| `npm run db:seed` | 写入种子数据 |

## API 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/fields` | 地块列表 / 创建地块 |
| GET/PUT/DELETE | `/api/fields/[id]` | 地块详情 / 更新 / 删除 |
| POST | `/api/fields/[id]/observations` | 提交田间观测 |
| POST | `/api/fields/[id]/analyze` | 触发 Agent 分析 |
| GET | `/api/reports/[id]` | 获取分析报告 |
| GET | `/api/tasks` | 获取农事任务列表 |

## 数据模型

核心实体：**Field（地块）** → **FieldObservation（田间观测）** → **AgentRun（Agent 运行记录）** → **AgentStep（Agent 步骤）**

分析任务通过 AgentRun 关联到具体地块和观测记录，每个 AgentRun 包含多个 AgentStep（对应六个 Agent 的运行步骤），并生成 **FarmingTask（农事任务）**。

详细 schema 定义见 `prisma/schema.prisma`。
