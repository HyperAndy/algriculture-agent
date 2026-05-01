"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CloudRain,
  CloudSun,
  Droplets,
  FileText,
  Layers,
  Leaf,
  Map,
  Menu,
  RadioTower,
  ScanLine,
  Sprout,
  ThermometerSun,
  Tractor,
  Waves,
  Wheat,
  Wind
} from "lucide-react";
import { clsx } from "clsx";
import { useCountUp } from "./use-count-up";
import type { CommandAgentStep, CommandCenterData, CommandField, CommandTask, DemoRiskLevel } from "./types";

const CROP_LABELS: Record<string, string> = {
  rice: "水稻",
  wheat: "小麦",
  corn: "玉米",
  soybean: "大豆"
};

const CROP_COLORS: Record<string, string> = {
  rice: "#33d6ff",
  wheat: "#f5c84c",
  corn: "#7ee787",
  soybean: "#9fe870"
};

const FIELD_SHAPES = [
  { points: "78,320 312,266 392,438 114,508", labelX: 236, labelY: 394, sensorX: 220, sensorY: 338 },
  { points: "110,142 354,96 422,238 174,286", labelX: 258, labelY: 204, sensorX: 304, sensorY: 248 },
  { points: "400,90 662,116 604,292 386,238", labelX: 520, labelY: 190, sensorX: 574, sensorY: 210 },
  { points: "426,332 624,304 704,482 448,528", labelX: 574, labelY: 432, sensorX: 640, sensorY: 382 }
];

const FALLBACK_FIELDS: CommandField[] = [
  { id: "field_rice_001", name: "江淮水稻示范田", location: "安徽省江淮示范区", areaMu: 210, cropType: "rice", variety: "示范品种", growthStage: "分蘖期", riskLevel: "low" },
  { id: "field_wheat_001", name: "黄淮麦田示范区", location: "河南省黄淮示范区", areaMu: 180, cropType: "wheat", variety: "示范品种", growthStage: "灌浆期", riskLevel: "medium" },
  { id: "field_corn_001", name: "东北玉米示范田", location: "吉林省黑土示范区", areaMu: 200, cropType: "corn", variety: "示范品种", growthStage: "拔节期", riskLevel: "high" },
  { id: "field_soybean_001", name: "黑土地大豆示范田", location: "黑龙江省示范区", areaMu: 120, cropType: "soybean", variety: "示范品种", growthStage: "开花期", riskLevel: "low" }
];

function normalizeFields(fields: CommandField[]) {
  const source = fields.length ? fields : FALLBACK_FIELDS;
  return source.map((field, index) => {
    const fallback = FALLBACK_FIELDS.find((item) => item.cropType === field.cropType) ?? FALLBACK_FIELDS[index % FALLBACK_FIELDS.length];
    return {
      ...field,
      name: isMojibake(field.name) ? fallback.name : field.name,
      location: isMojibake(field.location) ? fallback.location : field.location,
      growthStage: isMojibake(field.growthStage) ? fallback.growthStage : field.growthStage,
      areaMu: field.areaMu || fallback.areaMu,
      cropType: field.cropType || fallback.cropType
    };
  });
}

function isMojibake(value: string | null | undefined) {
  if (!value) return false;
  return /[�]|[鐨銆€绋浣鏅涓鍦]/.test(value);
}

function riskValue(level: DemoRiskLevel): "low" | "medium" | "high" {
  return level === "high" || level === "medium" || level === "low" ? level : "low";
}

function riskLabel(level: DemoRiskLevel) {
  const risk = riskValue(level);
  if (risk === "high") return "高风险";
  if (risk === "medium") return "中风险";
  return "低风险";
}

function priorityLabel(priority: string) {
  if (priority === "high") return "高";
  if (priority === "medium") return "中";
  return "低";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function parseRecommendations(value?: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch {
    return value
      .split(/\n|；|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function CommandCenter({ data }: { data: CommandCenterData }) {
  const fields = useMemo(() => normalizeFields(data.fields), [data.fields]);
  const [selectedFieldId, setSelectedFieldId] = useState(fields.find((field) => riskValue(field.riskLevel) === "high")?.id ?? fields[0]?.id);
  const [activeLayer, setActiveLayer] = useState("图层");

  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? fields[0];
  const recommendations = parseRecommendations(data.latestRun?.recommendations);
  const alerts = useMemo(() => buildAlerts(fields, data.latestRun?.fieldId), [fields, data.latestRun?.fieldId]);
  const totals = useMemo(() => {
    const area = fields.reduce((sum, field) => sum + field.areaMu, 0);
    const pendingTasks = data.tasks.filter((task) => task.status === "pending").length || 4;
    return {
      area,
      highRisk: fields.filter((field) => riskValue(field.riskLevel) === "high").length,
      pendingTasks
    };
  }, [data.tasks, fields]);

  return (
    <main className="command-screen">
      <TopStatusBar />

      <section className="command-layout" aria-label="大田作物稳产减灾指挥中心">
        <aside className="command-left">
          <Panel title="综合态势" icon={<Activity size={16} />}>
            <SituationMetrics fields={fields} area={totals.area} highRisk={totals.highRisk} pendingTasks={totals.pendingTasks} />
          </Panel>

          <Panel title="作物种植分布（亩）" icon={<Sprout size={16} />}>
            <CropDistribution fields={fields} totalArea={totals.area} />
          </Panel>

          <Panel title="生育期分布" icon={<Wheat size={16} />}>
            <GrowthStageBars fields={fields} />
          </Panel>
        </aside>

        <section className="command-center-stage">
          <FieldRiskMap
            fields={fields}
            selectedFieldId={selectedField?.id}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            onSelectField={setSelectedFieldId}
          />
          <SelectedFieldSummary field={selectedField} latestSummary={cleanSummary(data.latestRun?.summary, selectedField)} />
        </section>

        <aside className="command-right">
          <Panel title="多Agent决策链" icon={<Bot size={16} />}>
            <AgentChain steps={data.latestRun?.steps ?? []} />
          </Panel>

          <Panel title="风险预警" icon={<AlertTriangle size={16} />}>
            <RiskAlerts alerts={alerts} onSelectField={setSelectedFieldId} />
          </Panel>
        </aside>
      </section>

      <section className="command-bottom">
        <Panel title="土壤墒情趋势" icon={<Droplets size={16} />}>
          <SoilMoistureTrend fields={fields} />
        </Panel>

        <Panel title="农事任务队列" icon={<ClipboardList size={16} />}>
          <TaskQueue tasks={data.tasks} />
        </Panel>

        <Panel title="近期分析结果" icon={<FileText size={16} />}>
          <RecentAnalysis
            latestSummary={cleanSummary(data.latestRun?.summary, selectedField)}
            createdAt={data.latestRun?.createdAt}
            fieldName={selectedField?.name}
            recommendations={recommendations}
          />
        </Panel>
      </section>
    </main>
  );
}

function cleanSummary(summary: string | undefined, field?: CommandField) {
  if (!summary || isMojibake(summary)) {
    return field
      ? `${field.name}处于${field.growthStage}，系统识别到地块级稳产风险，建议结合天气窗口安排复查与农事处置。`
      : "系统已完成多源农情分析，形成风险预警、农事建议和任务闭环。";
  }
  return summary;
}

function TopStatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeText = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  return (
    <header className="command-top">
      <div className="command-weather">
        <span><CloudSun size={16} /> 26°C</span>
        <span>多云转晴</span>
        <span><Droplets size={16} /> 湿度 68%</span>
        <span><Wind size={16} /> 东南风 2级</span>
      </div>

      <div className="command-title">
        <h1>AI驱动的大田作物稳产减灾决策平台</h1>
        <p>水稻 <b>|</b> 小麦 <b>|</b> 玉米 <b>|</b> 大豆</p>
      </div>

      <div className="command-system">
        <span>{timeText}</span>
        <span className="system-normal"><CheckCircle2 size={16} /> 系统正常</span>
        <Menu size={18} />
      </div>
    </header>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="command-panel">
      <div className="command-panel-title">
        <span>{icon}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SituationMetrics({ fields, area, highRisk, pendingTasks }: { fields: CommandField[]; area: number; highRisk: number; pendingTasks: number }) {
  const metrics = [
    { label: "管理地块", value: fields.length, unit: "块", icon: <Map size={20} />, risk: false },
    { label: "覆盖面积", value: Math.round(area), unit: "亩", icon: <ScanLine size={20} />, risk: false },
    { label: "高风险地块", value: highRisk, unit: "块", icon: <AlertTriangle size={20} />, risk: true },
    { label: "待办农事", value: pendingTasks, unit: "项", icon: <ClipboardList size={20} />, risk: false }
  ];

  return (
    <div className="command-metrics">
      {metrics.map((metric, index) => (
        <MetricRow key={metric.label} {...metric} delay={index * 90} />
      ))}
    </div>
  );
}

function MetricRow({ label, value, unit, icon, risk, delay }: { label: string; value: number; unit: string; icon: ReactNode; risk: boolean; delay: number }) {
  const count = useCountUp(value);
  return (
    <div className="command-metric-row" style={{ animationDelay: `${delay}ms` }}>
      <span className="metric-icon">{icon}</span>
      <span className="metric-label">{label}</span>
      <strong className={risk ? "is-risk" : ""}>{count}</strong>
      <em>{unit}</em>
    </div>
  );
}

function CropDistribution({ fields, totalArea }: { fields: CommandField[]; totalArea: number }) {
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const crops = Object.keys(CROP_LABELS).map((crop) => ({
    crop,
    area: fields.filter((field) => field.cropType === crop).reduce((sum, field) => sum + field.areaMu, 0)
  }));

  return (
    <div className="crop-distribution">
      <svg className="donut-chart" viewBox="0 0 120 120" role="img" aria-label="作物种植分布">
        <circle cx="60" cy="60" r={radius} className="donut-track" />
        {crops.map(({ crop, area }) => {
          const dash = totalArea ? (area / totalArea) * circumference : 0;
          const segment = (
            <circle
              key={crop}
              cx="60"
              cy="60"
              r={radius}
              className={clsx("donut-segment", hoveredCrop === crop && "is-hovered")}
              stroke={CROP_COLORS[crop]}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              onMouseEnter={() => setHoveredCrop(crop)}
              onMouseLeave={() => setHoveredCrop(null)}
            />
          );
          offset += dash;
          return segment;
        })}
        <text x="60" y="56" textAnchor="middle" className="donut-number">{Math.round(totalArea)}</text>
        <text x="60" y="72" textAnchor="middle" className="donut-text">总面积/亩</text>
      </svg>

      <div className="crop-legend">
        {crops.map(({ crop, area }) => (
          <button
            key={crop}
            className={clsx("crop-legend-row", hoveredCrop === crop && "is-hovered")}
            onMouseEnter={() => setHoveredCrop(crop)}
            onMouseLeave={() => setHoveredCrop(null)}
          >
            <span style={{ background: CROP_COLORS[crop] }} />
            <b>{CROP_LABELS[crop]}</b>
            <em>{Math.round(area)}亩</em>
            <small>{totalArea ? ((area / totalArea) * 100).toFixed(1) : "0.0"}%</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function GrowthStageBars({ fields }: { fields: CommandField[] }) {
  const stages = ["播种期", "苗期", "拔节期", "孕穗期", "灌浆期", "成熟期"];
  return (
    <div className="growth-bars">
      {fields.map((field, fieldIndex) => (
        <div className="growth-row" key={field.id}>
          <div className="growth-label">
            <span>{CROP_LABELS[field.cropType] ?? field.cropType}</span>
            <em>{field.growthStage}</em>
          </div>
          <div className="growth-track">
            {stages.map((stage, stageIndex) => (
              <span
                key={stage}
                className={stageIndex <= fieldIndex + 1 ? "is-active" : ""}
                style={{ animationDelay: `${stageIndex * 80}ms` }}
                title={`${stage}: ${stageIndex <= fieldIndex + 1 ? "已进入" : "待进入"}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldRiskMap({
  fields,
  selectedFieldId,
  activeLayer,
  onLayerChange,
  onSelectField
}: {
  fields: CommandField[];
  selectedFieldId: string | undefined;
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  onSelectField: (id: string) => void;
}) {
  const layers = ["图层", "气象", "土壤", "病虫", "灾害", "实景"];
  const sensors = [
    { x: 242, y: 162, label: "气象站" },
    { x: 510, y: 205, label: "墒情站" },
    { x: 310, y: 384, label: "虫情站" },
    { x: 612, y: 402, label: "苗情点" }
  ];

  return (
    <section className="risk-map-panel">
      <div className="risk-map-header">
        <div>
          <span>Field Risk Situation</span>
          <h2>田间风险态势地图</h2>
        </div>
        <div className="risk-map-legend">
          <i className="low" />低风险
          <i className="medium" />中风险
          <i className="high" />高风险
        </div>
      </div>

      <div className="risk-map-canvas">
        <div className="map-weather-card">
          <span><CloudSun size={16} /> 26°C</span>
          <span><Droplets size={16} /> 湿度 68%</span>
          <span><Wind size={16} /> 风速 2.3m/s</span>
          <span><CloudRain size={16} /> 降雨 0mm</span>
        </div>

        <div className="map-layer-rail">
          {layers.map((layer) => (
            <button key={layer} className={activeLayer === layer ? "is-active" : ""} onClick={() => onLayerChange(layer)}>
              <Layers size={14} />
              {layer}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 760 560" className="field-map" role="img" aria-label="地块风险分布图">
          <defs>
            <linearGradient id="fieldGrid" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#2b6e38" />
              <stop offset="100%" stopColor="#0d3b2e" />
            </linearGradient>
            <filter id="mapGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="760" height="560" rx="18" className="map-base" />
          <path d="M28 486 C168 390 180 82 432 56 C604 38 736 186 724 494" className="map-contour" />
          <path d="M82 82 L718 508 M38 212 L670 68 M122 520 L706 128" className="map-grid-lines" />

          {fields.slice(0, 4).map((field, index) => {
            const shape = FIELD_SHAPES[index % FIELD_SHAPES.length];
            const risk = riskValue(field.riskLevel);
            const selected = selectedFieldId === field.id;
            return (
              <g
                key={field.id}
                className={clsx("field-zone", risk, selected && "is-selected")}
                onClick={() => onSelectField(field.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectField(field.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`选择${field.name}`}
              >
                <polygon points={shape.points} filter={selected ? "url(#mapGlow)" : undefined} />
                {risk === "high" ? (
                  <>
                    <polygon points={shape.points} className="field-risk-pulse" />
                    <g className="field-warning-icon" transform={`translate(${shape.labelX + 78} ${shape.labelY - 30})`}>
                      <circle r="22" />
                      <path d="M0 -13 L14 12 H-14 Z" />
                      <line x1="0" y1="-4" x2="0" y2="5" />
                      <circle cx="0" cy="10" r="1.8" />
                    </g>
                  </>
                ) : null}
                <text x={shape.labelX} y={shape.labelY}>{CROP_LABELS[field.cropType] ?? field.cropType}</text>
              </g>
            );
          })}

          {sensors.map((sensor) => (
            <g className="sensor-node" key={sensor.label}>
              <circle cx={sensor.x} cy={sensor.y} r="22" className="sensor-wave" />
              <circle cx={sensor.x} cy={sensor.y} r="5" />
              <text x={sensor.x + 12} y={sensor.y - 10}>{sensor.label}</text>
            </g>
          ))}
        </svg>

        <div className="map-scale"><span /> 200m</div>
      </div>
    </section>
  );
}

function SelectedFieldSummary({ field, latestSummary }: { field?: CommandField; latestSummary?: string }) {
  if (!field) return null;
  return (
    <div className="selected-field-summary">
      <div>
        <span>当前选中地块</span>
        <strong>{field.name}</strong>
      </div>
      <p>{CROP_LABELS[field.cropType] ?? field.cropType} · {field.growthStage} · {Math.round(field.areaMu)}亩 · {riskLabel(field.riskLevel)}</p>
      <em>{latestSummary}</em>
    </div>
  );
}

function AgentChain({ steps }: { steps: CommandAgentStep[] }) {
  const fallback = [
    { name: "田间感知", summary: "多源数据采集", icon: <Sprout size={22} /> },
    { name: "作物诊断", summary: "长链推理分析", icon: <Leaf size={22} /> },
    { name: "风险预警", summary: "地块级预警", icon: <Wheat size={22} /> },
    { name: "水肥决策", summary: "精准水肥建议", icon: <Waves size={22} /> },
    { name: "灾害应对", summary: "应急处置方案", icon: <CloudRain size={22} /> },
    { name: "农事档案", summary: "全过程追溯", icon: <FileText size={22} /> }
  ];
  const display = fallback.map((item, index) => {
    const step = steps[index];
    return {
      ...item,
      name: step?.agentName ? step.agentName.replace("Agent", "") : item.name,
      input: step?.inputSummary && !isMojibake(step.inputSummary) ? step.inputSummary : "地块、天气、土壤、苗情、病虫草害和农事记录",
      summary: step?.outputSummary && !isMojibake(step.outputSummary) ? step.outputSummary : item.summary
    };
  });

  return (
    <div className="agent-chain">
      {display.map((agent, index) => (
        <div className="agent-chain-node" key={agent.name} style={{ animationDelay: `${index * 240}ms` }}>
          <span className="agent-node-icon">{agent.icon}</span>
          <b>{agent.name}</b>
          <small>{agent.summary}</small>
          <div className="agent-node-tooltip">
            <strong>输入</strong>
            <p>{agent.input}</p>
            <strong>输出</strong>
            <p>{agent.summary}</p>
          </div>
          {index < display.length - 1 ? <ChevronRight className="agent-flow-arrow" size={18} /> : null}
        </div>
      ))}
    </div>
  );
}

function RiskAlerts({ alerts, onSelectField }: { alerts: ReturnType<typeof buildAlerts>; onSelectField: (id: string) => void }) {
  return (
    <div className="risk-alert-list">
      {alerts.map((alert, index) => (
        <button
          key={alert.title}
          className={clsx("risk-alert-card", alert.level)}
          onClick={() => onSelectField(alert.fieldId)}
          style={{ animationDelay: `${index * 140}ms` }}
        >
          <AlertTriangle size={18} />
          <span>
            <b>{alert.title}</b>
            <small>涉及地块：{alert.fieldName}</small>
            <small>预警时间：{alert.time} · 影响面积：{alert.area}亩</small>
          </span>
          <em>{riskLabel(alert.level)}</em>
          <strong>查看详情</strong>
        </button>
      ))}
    </div>
  );
}

function SoilMoistureTrend({ fields }: { fields: CommandField[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const days = ["05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20"];
  const lines = fields.slice(0, 4).map((field, index) => {
    const base = 72 - index * 5 - (riskValue(field.riskLevel) === "high" ? 18 : 0);
    return {
      field,
      points: days.map((_, day) => Math.max(28, Math.min(86, base + Math.sin(day + index) * 5 - day * (index === 2 ? 2.6 : 0.8))))
    };
  });

  const toPoint = (value: number, index: number) => `${38 + index * 51},${138 - value * 1.28}`;

  return (
    <div className="trend-chart-wrap">
      <svg viewBox="0 0 380 156" className="soil-line-chart" onMouseLeave={() => setTooltip(null)}>
        {[25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1="30" x2="362" y1={138 - tick * 1.28} y2={138 - tick * 1.28} />
            <text x="2" y={142 - tick * 1.28}>{tick}</text>
          </g>
        ))}
        {days.map((day, index) => (
          <text key={day} x={29 + index * 51} y="150">{day}</text>
        ))}
        {lines.map((line) => (
          <g key={line.field.id}>
            <polyline points={line.points.map(toPoint).join(" ")} stroke={CROP_COLORS[line.field.cropType] ?? "#7ee787"} />
            {line.points.map((value, index) => {
              const [x, y] = toPoint(value, index).split(",").map(Number);
              return (
                <circle
                  key={`${line.field.id}-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  onMouseEnter={() => setTooltip({ x, y, text: `${days[index]} ${line.field.name}：${Math.round(value)}%` })}
                />
              );
            })}
          </g>
        ))}
      </svg>
      {tooltip ? <div className="chart-tooltip" style={{ left: tooltip.x + 8, top: tooltip.y - 8 }}>{tooltip.text}</div> : null}
      <div className="trend-legend">
        {lines.map((line) => (
          <span key={line.field.id}><i style={{ background: CROP_COLORS[line.field.cropType] }} />{CROP_LABELS[line.field.cropType]}</span>
        ))}
      </div>
    </div>
  );
}

function TaskQueue({ tasks }: { tasks: CommandTask[] }) {
  const displayTasks = (tasks.length ? tasks : fallbackTasks()).slice(0, 5);
  return (
    <div className="command-task-table">
      <div className="task-table-head">
        <span>任务类型</span>
        <span>任务描述</span>
        <span>涉及地块</span>
        <span>建议时间</span>
        <span>优先级</span>
        <span>状态</span>
      </div>
      {displayTasks.map((task) => (
        <div className="task-table-row" key={task.id}>
          <span>{cleanTaskText(task.title, "灌溉")}</span>
          <span>{cleanTaskText(task.description, "地块稳产处置建议")}</span>
          <span>{cleanTaskText(task.fieldName, "东北玉米示范田")}</span>
          <span>{formatDate(task.dueDate)}</span>
          <span className={clsx("priority-pill", task.priority)}>{priorityLabel(task.priority)}</span>
          <span className="task-status">待执行</span>
        </div>
      ))}
    </div>
  );
}

function RecentAnalysis({
  latestSummary,
  createdAt,
  fieldName,
  recommendations
}: {
  latestSummary?: string;
  createdAt?: string;
  fieldName?: string;
  recommendations: string[];
}) {
  const items = [
    latestSummary ? `${fieldName}：${latestSummary}` : "基于气象预测，未来3天玉米干旱风险持续，请及时灌溉。",
    ...recommendations.filter((item) => !isMojibake(item)).slice(0, 3),
    "1号地块小麦灌浆速度偏慢，建议叶面补充磷钾肥。",
    "2号地块稻飞虱发生风险上升，建议加强监测与防治。",
    "4号地块大豆长势良好，预计产量高于区域平均水平。"
  ];

  return (
    <div className="analysis-ticker">
      <div>
        {[...items, ...items].map((item, index) => (
          <article key={`${item}-${index}`}>
            <RadioTower size={16} />
            <p>{item}</p>
            <time>{createdAt ? formatDate(createdAt) : "05-20 10:25"}</time>
          </article>
        ))}
      </div>
    </div>
  );
}

function buildAlerts(fields: CommandField[], latestFieldId?: string) {
  const high = fields.find((field) => riskValue(field.riskLevel) === "high") ?? fields.find((field) => field.cropType === "corn") ?? fields[0];
  const medium = fields.find((field) => riskValue(field.riskLevel) === "medium" && field.id !== high?.id) ?? fields.find((field) => field.cropType === "wheat") ?? fields[1] ?? fields[0];

  return [
    {
      title: `${CROP_LABELS[high?.cropType ?? "corn"] ?? "玉米"}${high?.growthStage ?? "拔节期"}干旱风险`,
      level: "high" as const,
      fieldId: high?.id ?? latestFieldId ?? "",
      fieldName: high?.name ?? "东北玉米示范田",
      time: "10:18",
      area: Math.round(high?.areaMu ?? 200)
    },
    {
      title: `${CROP_LABELS[medium?.cropType ?? "wheat"] ?? "小麦"}灌浆期干热风风险`,
      level: "medium" as const,
      fieldId: medium?.id ?? "",
      fieldName: medium?.name ?? "黄淮麦田示范区",
      time: "09:42",
      area: Math.round(medium?.areaMu ?? 180)
    }
  ];
}

function cleanTaskText(value: string, fallback: string) {
  return isMojibake(value) ? fallback : value;
}

function fallbackTasks(): CommandTask[] {
  const now = new Date().toISOString();
  return [
    { id: "t1", title: "灌溉", description: "3号地块玉米灌溉建议", priority: "high", status: "pending", dueDate: now, fieldId: "field_corn_001", fieldName: "东北玉米示范田" },
    { id: "t2", title: "追肥", description: "1号地块小麦追肥建议", priority: "high", status: "pending", dueDate: now, fieldId: "field_wheat_001", fieldName: "黄淮麦田示范区" },
    { id: "t3", title: "病虫防治", description: "2号地块稻飞虱防治", priority: "medium", status: "pending", dueDate: now, fieldId: "field_rice_001", fieldName: "江淮水稻示范田" },
    { id: "t4", title: "除草", description: "4号地块大豆除草建议", priority: "low", status: "pending", dueDate: now, fieldId: "field_soybean_001", fieldName: "黑土地大豆示范田" }
  ];
}
