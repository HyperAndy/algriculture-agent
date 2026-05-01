# AI驱动的大田作物稳产减灾决策Agent MVP

面向水稻、小麦、玉米、大豆的大田作物智能农事决策系统。MVP 包含宣传演示大屏和管理后台，支持地块管理、观测录入、Mock 多 Agent 分析、长链推理报告、农事任务和历史档案。

## 本地运行

```bash
npm install --cache C:\tmp\npm-cache
npm run db:init
npm run dev
```

访问：

- `http://localhost:3000/demo`
- `http://localhost:3000/console`

## 验证

```bash
npm test
npm run build
```

## 说明

项目保留 `npm run db:push` 用于标准 Prisma 初始化。如果当前机器的 Prisma schema engine 无法执行，可直接使用 `npm run db:init`，该脚本会用 SQLite 标准库创建本地表结构、生成 Prisma Client 并写入示范数据。
