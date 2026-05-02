# AI 驱动的大田作物稳产减灾决策 Agent

面向**水稻、小麦、玉米、大豆**四种大田作物的智能农事决策系统。通过多 Agent 协作分析田间观测数据，自动生成风险评估、长链推理报告和农事任务调度，提供决策辅助。

## 产品形态

同一套数据和 Agent 能力，对外提供两类产品表面：

| 入口 | 说明 |
|------|------|
| `/demo` — 宣传演示大屏 | 科幻指挥中心风格，面向评审和展示，包含 ECharts 可视化图表和动画流水线 |
| `/console` — 管理后台 | 基于 shadcn/ui 的现代化管理面板，支持 ⌘K 全局搜索、任务看板、PDF 报告导出、深色模式 |

## 核心能力

- **地块管理** — 创建和编辑地块，支持按作物/风险/生育期筛选，带生长进度条的可搜索网格视图
- **观测录入** — 分步表单向导，支持一键填入示范值，实时校验
- **多 Agent 协作分析** — 六个 Agent 动画流水线，依次执行感知、诊断、预警、水肥、灾害、档案
- **长链推理报告** — 结构化可折叠推理章节，完整可追溯，支持 PDF 导出
- **农事任务调度** — 看板/列表双视图，状态和优先级筛选，从分析结果自动生成
- **历史档案** — 可按地块名/风险/作物/时间范围搜索，支持分页
- **全局搜索** — `Ctrl+K` 命令面板，跨地块、报告、任务搜索并跳转
- **深色模式** — 默认浅色，支持系统跟随和手动切换，localStorage 持久化

## 技术栈

| 类别 | 技术选型 |
|------|----------|
| 框架 | Next.js 15 (App Router) |
| UI 库 | React 19 |
| 组件库 | shadcn/ui (new-york v4) |
| 语言 | TypeScript 5.7 |
| 样式 | Tailwind CSS 4 |
| 图表 | ECharts 5 |
| 图标 | Lucide React |
| ORM | Prisma 6 |
| 数据库 | SQLite (本地文件) |
| 主题 | next-themes |
| 提示 | sonner |
| 测试 | Vitest 2 |

## 项目结构

```
├── prisma/
│   ├── schema.prisma              # 数据模型定义
│   └── seed.ts                    # 种子数据
├── scripts/
│   └── init_sqlite.py             # SQLite 初始化脚本
├── src/
│   ├── app/
│   │   ├── api/                   # RESTful API（11 个端点）
│   │   ├── console/               # 管理后台（布局 + 8 页面 + loading 态）
│   │   │   ├── layout.tsx         # 侧边栏 + 顶栏 + 命令面板外壳
│   │   │   ├── archive/           # 档案：搜索 + 筛选 + 分页
│   │   │   ├── fields/            # 地块列表、详情（Tab）、录入（向导）、分析（流水线）
│   │   │   ├── reports/           # 报告详情：结构化推理 + PDF 导出
│   │   │   └── tasks/             # 看板 + 列表双视图 + 筛选
│   │   ├── demo/                  # 科幻指挥中心大屏
│   │   └── page.tsx               # 首页入口
│   ├── components/
│   │   ├── ui/                    # shadcn/ui 基础组件（21 个）
│   │   ├── console/               # Console 专用组件（16 个）
│   │   │   ├── app-sidebar.tsx    # 可折叠深色侧边栏（localStorage 持久化）
│   │   │   ├── command-palette.tsx   # ⌘K 全局搜索对话框
│   │   │   ├── stat-card.tsx      # 数字跳动统计卡片
│   │   │   ├── field-card.tsx     # 地块卡片（生长进度条）
│   │   │   ├── task-card.tsx      # 任务卡片（优先级/状态）
│   │   │   ├── risk-area-chart.tsx   # ECharts 风险趋势面积图
│   │   │   ├── crop-donut-chart.tsx  # ECharts 作物分布环形图
│   │   │   ├── risk-gauge-chart.tsx  # ECharts 风险仪表盘
│   │   │   └── ...
│   │   └── command-center/        # Demo 大屏科幻组件
│   ├── lib/
│   │   ├── agents/                # Agent 核心逻辑
│   │   ├── domain/                # 领域模型（作物、风险）
│   │   ├── db.ts                  # Prisma 客户端
│   │   └── utils.ts               # cn() 工具函数
│   ├── hooks/
│   │   └── use-mobile.ts          # 移动端检测
│   └── app/globals.css            # 主题变量 + 动画 + 打印样式
├── tests/                         # 单元测试
└── components.json                # shadcn/ui 配置
```

## 本地运行

### 环境要求

- Node.js >= 18
- Python 3（SQLite 初始化脚本依赖）

### 安装与启动

```bash
# 安装依赖
npm install

# 初始化数据库
npm run db:init

# 启动开发服务器
npm run dev
```

访问地址：

- 首页：`http://localhost:3000`
- 宣传大屏：`http://localhost:3000/demo`
- 管理后台：`http://localhost:3000/console`

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
| GET | `/api/fields/[id]/observations` | 获取观测历史 |
| POST | `/api/fields/[id]/analyze` | 触发 Agent 分析 |
| GET | `/api/reports/[id]` | 获取分析报告 |
| GET | `/api/reports/[id]/export` | 导出报告数据（PDF 用） |
| GET | `/api/tasks` | 获取农事任务列表 |
| PATCH | `/api/tasks/batch` | 批量更新任务状态 |
| GET | `/api/search?q=` | 全局搜索（地块、报告、任务） |
| GET | `/api/archive?q=&risk=&crop=&from=&to=&page=&limit=` | 档案条件搜索+分页 |

## 数据模型

核心实体：**Field（地块）** → **FieldObservation（田间观测）** → **AgentRun（Agent 运行记录）** → **AgentStep（Agent 步骤）** → **FarmingTask（农事任务）**

分析任务通过 AgentRun 关联到具体地块和观测记录，每个 AgentRun 包含多个 AgentStep（对应六个 Agent 的运行步骤），并生成 FarmingTask 记录。
