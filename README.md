# AI-Powered Field Crop Risk Mitigation Decision Agent

An intelligent agricultural decision-making system for **rice, wheat, corn, and soybean** field crops. Leverages multi-agent collaboration to analyze field observation data, automatically generate risk assessments, long-chain reasoning reports, and farming task schedules to assist decision-making.

## Product Modes

Two interfaces built on the same data and agent capabilities:

| Entry | Description |
|-------|-------------|
| `/demo` — Dashboard | A command center for presentations and reviews, providing macro-level overviews of field status, risk distribution, and agent activity |
| `/console` — Admin | An operations interface for agricultural technicians, supporting field management, observation input, analysis reports, task scheduling, and historical archives |

## Core Capabilities

- **Field Management** — Create and edit field plots, register crop types, varieties, growth stages, target yields, and other basic information
- **Observation Input** — Field metrics collection: temperature, rainfall, soil parameters (moisture/temperature/pH/NPK), plant status, pest/disease/weed descriptions
- **Multi-Agent Analysis** — Six specialized agents run sequentially in a pipeline, covering sensing, diagnosis, pest/disease warning, water/fertilizer, disaster response, and archival
- **Long-Chain Reasoning Reports** — Full traceability of agent execution, including input summaries, output conclusions, and risk signals for each step
- **Farming Task Scheduling** — Automatically generate farming tasks based on analysis results, supporting priority sorting and status tracking
- **Historical Archive** — All agent run records and reports are searchable and traceable

## Six Specialized Agents

| Agent | Responsibility |
|-------|---------------|
| Field Sensing Agent | Aggregates multi-source observation data (weather, soil, plant) to generate field status snapshots |
| Crop Diagnosis Agent | Evaluates growth stage alignment with expectations, identifies nutrient deficiencies, excessive growth, and other anomalies |
| Pest/Disease/Weed Alert Agent | Analyzes pest, disease, and weed descriptions, outputs risk levels and intervention window recommendations |
| Water & Fertilizer Decision Agent | Combines crop requirements and soil parameters to recommend irrigation and fertilization amounts |
| Disaster Response Agent | Identifies risks from temperature extremes, drought, waterlogging, and generates emergency response plans |
| Farming Archive Agent | Summarizes historical analyses and farming operations, outputting traceable decision archives |

> During the MVP phase, agents use a mock rule engine for simulation. Reasoning logic is defined in `src/lib/agents/mock-agents.ts`, and the agent pipeline orchestration is in `src/lib/agents/orchestrator.ts`.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| ORM | Prisma 6 |
| Database | SQLite (local file) |
| Testing | Vitest 2 |
| Tooling | tsx, postcss, autoprefixer |

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Data model definitions
│   └── seed.ts                # Seed data
├── scripts/
│   └── init_sqlite.py         # SQLite database initialization script
├── src/
│   ├── app/
│   │   ├── api/               # RESTful API routes
│   │   ├── console/           # Admin panel pages
│   │   ├── demo/              # Dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── agent-timeline.tsx   # Agent execution timeline
│   │   ├── analyze-button.tsx   # Trigger analysis button
│   │   ├── app-shell.tsx        # Application shell
│   │   ├── command-center/      # Command center dashboard components
│   │   ├── field-card.tsx       # Field plot card
│   │   ├── observation-form.tsx # Observation input form
│   │   ├── report-panel.tsx     # Analysis report panel
│   │   ├── risk-badge.tsx       # Risk level badge
│   │   ├── stat-card.tsx        # Statistics card
│   │   └── task-list.tsx        # Farming task list
│   ├── lib/
│   │   ├── agents/              # Agent core logic
│   │   │   ├── analysis-service.ts   # Analysis service
│   │   │   ├── mock-agents.ts        # Mock agent rules
│   │   │   ├── orchestrator.ts       # Agent pipeline orchestration
│   │   │   ├── task-generator.ts     # Task generator
│   │   │   └── types.ts              # Type definitions
│   │   ├── domain/
│   │   │   ├── crops.ts         # Crop domain model
│   │   │   └── risk.ts          # Risk level model
│   │   ├── data-mappers.ts      # Data mappers
│   │   └── db.ts                # Database client
│   └── app/globals.css          # Global styles
├── tests/                       # Unit tests
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

## Local Development

### Prerequisites

- Node.js >= 18
- Python 3 (required for SQLite initialization script)

### Setup & Launch

```bash
# Install dependencies
npm install

# Initialize database (create tables + generate Prisma Client + seed data)
npm run db:init

# Start development server
npm run dev
```

Access:

- Home: `http://localhost:3000`
- Dashboard: `http://localhost:3000/demo`
- Admin Panel: `http://localhost:3000/console`

### Database Initialization Notes

`npm run db:init` uses a Python script to directly write SQLite table structures, bypassing Prisma schema engine. Use this when the schema engine is incompatible with your environment.

You may also use the standard Prisma workflow:

```bash
npm run db:push
npm run db:seed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:init` | One-command database initialization |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Write seed data |

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/fields` | List fields / Create field |
| GET/PUT/DELETE | `/api/fields/[id]` | Field detail / Update / Delete |
| POST | `/api/fields/[id]/observations` | Submit field observation |
| POST | `/api/fields/[id]/analyze` | Trigger agent analysis |
| GET | `/api/reports/[id]` | Get analysis report |
| GET | `/api/tasks` | Get farming task list |

## Data Model

Core entities: **Field** → **FieldObservation** → **AgentRun** → **AgentStep**

An analyses are linked to specific fields and observations via AgentRun. Each AgentRun contains multiple AgentSteps (corresponding to the six agents), and generates **FarmingTask** records.

See `prisma/schema.prisma` for the full schema definition.
