# AI-Powered Field Crop Risk Mitigation Decision Agent

An intelligent agricultural decision-making system for **rice, wheat, corn, and soybean** field crops. Leverages multi-agent collaboration to analyze field observation data, automatically generate risk assessments, long-chain reasoning reports, and farming task schedules to assist decision-making.

## Product Modes

Two interfaces built on the same data and agent capabilities:

| Entry | Description |
|-------|-------------|
| `/demo` — Dashboard | A sci-fi command center for presentations and reviews, providing macro-level overviews of field status, risk distribution, and agent activity with ECharts visualizations |
| `/console` — Admin | A modern admin panel for agricultural technicians, featuring shadcn/ui components, ⌘K global search, task kanban, PDF report export, and light/dark mode |

## Core Capabilities

- **Field Management** — Create and edit field plots, register crop types, varieties, growth stages, target yields; searchable grid with crop/risk/growth filters
- **Observation Input** — Step-wizard form for field metrics: temperature, rainfall, soil parameters, plant status, pest/disease/weed descriptions; one-click demo data fill
- **Multi-Agent Analysis** — Six specialized agents run sequentially in a pipeline with animated flow visualization, covering sensing, diagnosis, alerting, water/fertilizer, disaster response, and archival
- **Long-Chain Reasoning Reports** — Structured, collapsible reasoning sections with full traceability and PDF export (`window.print()`)
- **Farming Task Scheduling** — Kanban board and list views with status/priority filtering, directly generated from analysis results
- **Historical Archive** — Searchable and paginated archive with risk/crop/date filters
- **Global Search** — `Ctrl+K` command palette searching across fields, reports, and tasks
- **Dark Mode** — Light default with system-aware dark mode toggle, persisted via localStorage

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Component Library | shadcn/ui (new-york v4) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4 |
| Charts | ECharts 5 |
| Icons | Lucide React |
| ORM | Prisma 6 |
| Database | SQLite (local file) |
| Theme | next-themes |
| Toast | sonner |
| Testing | Vitest 2 |

## Project Structure

```
├── prisma/
│   ├── schema.prisma              # Data model definitions
│   └── seed.ts                    # Seed data
├── scripts/
│   └── init_sqlite.py             # SQLite initialization script
├── src/
│   ├── app/
│   │   ├── api/                   # RESTful API routes (11 endpoints)
│   │   ├── console/               # Admin panel (layout + 8 pages + loading states)
│   │   │   ├── layout.tsx         # Sidebar + header + command palette shell
│   │   │   ├── archive/           # Archive with search, filter, pagination
│   │   │   ├── fields/            # Field list, detail (tabs), input (wizard), analysis (pipeline)
│   │   │   ├── reports/           # Report detail with structured reasoning + PDF export
│   │   │   └── tasks/             # Kanban board + list view with filters
│   │   ├── demo/                  # Sci-fi command center dashboard
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives (21 components)
│   │   ├── console/               # Console-specific components (16 components)
│   │   │   ├── app-sidebar.tsx    # Collapsible dark sidebar with localStorage persistence
│   │   │   ├── command-palette.tsx   # ⌘K global search dialog
│   │   │   ├── stat-card.tsx      # Animated count-up stat card
│   │   │   ├── field-card.tsx     # Field card with growth progress bar
│   │   │   ├── task-card.tsx      # Task card with priority/status
│   │   │   ├── risk-area-chart.tsx   # ECharts risk trend area chart
│   │   │   ├── crop-donut-chart.tsx  # ECharts crop distribution donut
│   │   │   ├── risk-gauge-chart.tsx  # ECharts risk gauge
│   │   │   ├── filter-bar.tsx     # Reusable filter bar
│   │   │   └── ...
│   │   └── command-center/        # Demo dashboard sci-fi components
│   ├── lib/
│   │   ├── agents/                # Agent core logic
│   │   ├── domain/                # Domain models (crops, risk)
│   │   ├── db.ts                  # Prisma client
│   │   └── utils.ts               # cn() utility
│   ├── hooks/
│   │   └── use-mobile.ts          # Mobile detection hook
│   └── app/globals.css            # Theme variables + animations + print styles
├── tests/                         # Unit tests
└── components.json                # shadcn/ui configuration
```

## Local Development

### Prerequisites

- Node.js >= 18
- Python 3 (required for SQLite initialization)

### Setup & Launch

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Start development server
npm run dev
```

Access:

- Home: `http://localhost:3000`
- Demo Dashboard: `http://localhost:3000/demo`
- Admin Panel: `http://localhost:3000/console`

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
| GET | `/api/fields/[id]/observations` | List observation history |
| POST | `/api/fields/[id]/analyze` | Trigger agent analysis |
| GET | `/api/reports/[id]` | Get analysis report |
| GET | `/api/reports/[id]/export` | Export report data for PDF |
| GET | `/api/tasks` | Get farming task list |
| PATCH | `/api/tasks/batch` | Batch update task status |
| GET | `/api/search?q=` | Global search (fields, reports, tasks) |
| GET | `/api/archive?q=&risk=&crop=&from=&to=&page=&limit=` | Archive search with pagination |

## Data Model

Core entities: **Field** → **FieldObservation** → **AgentRun** → **AgentStep** → **FarmingTask**

Analyses are linked to specific fields and observations via AgentRun. Each AgentRun contains multiple AgentSteps (corresponding to the six agents), and generates FarmingTask records.
