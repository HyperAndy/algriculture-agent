"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CloudRain,
  CloudSun,
  Droplets,
  FileText,
  Layers,
  Leaf,
  RadioTower,
  ScanLine,
  Sprout,
  Tractor,
  Waves,
  Wheat,
  Wind,
  Zap
} from "lucide-react";
import { COMMAND_CROP_COLORS } from "@/design-system/big-screen/theme";
import { CROP_LABELS } from "@/domain/crops/crop-labels";
import type { CommandAgentStep, CommandCenterData, CommandField, CommandTask } from "./types";
import {
  cleanText,
  dataSourceLabel,
  formatCommandDate,
  isMojibake,
  normalizeCommandFields,
  parseRecommendations,
  priorityLabel,
  riskLabel,
  riskValue,
} from "./model";
import { EChart } from "./echart";
import { PanelTitle } from "./panel-title";
import { TopBar } from "./top-bar";
import { SituationMetricsPanel } from "./situation-metrics-panel";
import { CropDistributionPanel } from "./crop-distribution-panel";
import { GrowthStagePanel } from "./growth-stage-panel";

const MAP_ZONES = [
  { crop: "wheat", risk: "medium", label: "小麦", points: "178,180 372,136 430,252 216,284", labelX: 282, labelY: 226, iconX: 278, iconY: 208 },
  { crop: "corn", risk: "low", label: "玉米", points: "405,124 656,156 610,306 386,250", labelX: 530, labelY: 218, iconX: 582, iconY: 226 },
  { crop: "rice", risk: "low", label: "水稻", points: "122,344 374,300 430,428 112,506", labelX: 260, labelY: 418, iconX: 214, iconY: 390 },
  { crop: "soybean", risk: "low", label: "大豆", points: "446,368 618,336 706,476 462,528", labelX: 592, labelY: 452, iconX: 650, iconY: 408 },
  { crop: "corn", risk: "high", label: "", points: "406,314 560,296 612,394 424,418", labelX: 504, labelY: 360, iconX: 532, iconY: 354 }
];

const SENSOR_POINTS = [
  [242, 164], [514, 204], [314, 386], [614, 404], [124, 374], [692, 294], [718, 214], [620, 122], [356, 304], [196, 250]
];

export function CommandCenter({ data }: { data: CommandCenterData }) {
  const fields = useMemo(() => normalizeCommandFields(data.fields), [data.fields]);
  const recommendations = parseRecommendations(data.latestRun?.recommendations);
  const totalArea = fields.reduce((sum, field) => sum + field.areaMu, 0);
  const highRisk = fields.filter((field) => riskValue(field.riskLevel) === "high").length || 1;
  const pendingTasks = data.tasks.filter((task) => task.status === "pending").length || 4;
  const dataSourceText = dataSourceLabel(data.source.mode);

  return (
    <main className="sci-screen">
      <div className="sci-board">
        <TopBar formattedTime={data.formattedTime} dataSourceText={dataSourceText} />

        <section className="sci-panel sci-situation">
          <PanelTitle icon={<Tractor size={18} />} title="综合态势" />
          <SituationMetricsPanel fieldsCount={fields.length} totalArea={totalArea} highRisk={highRisk} pendingTasks={pendingTasks} />
        </section>

        <section className="sci-panel sci-crop">
          <PanelTitle icon={<Sprout size={18} />} title="作物种植分布（亩）" />
          <CropDistributionPanel fields={fields} totalArea={totalArea} />
        </section>

        <section className="sci-panel sci-growth">
          <PanelTitle icon={<Wheat size={18} />} title="生育期分布" />
          <GrowthStagePanel fields={fields} />
        </section>

        <section className="sci-panel sci-map">
          <PanelTitle title="田间风险态势地图" />
          <RiskMap />
        </section>

        <section className="sci-panel sci-agent">
          <PanelTitle icon={<Bot size={18} />} title="多Agent决策链" />
          <AgentChain steps={data.latestRun?.steps ?? []} />
        </section>

        <section className="sci-panel sci-alerts">
          <PanelTitle icon={<AlertTriangle size={18} />} title="风险预警" />
          <RiskAlerts fields={fields} />
        </section>

        <section className="sci-panel sci-soil">
          <PanelTitle icon={<Droplets size={18} />} title="土壤墒情趋势" />
          <SoilChart fields={fields} />
        </section>

        <section className="sci-panel sci-tasks">
          <PanelTitle icon={<ClipboardList size={18} />} title="农事任务队列" />
          <TaskTable tasks={data.tasks} generatedAt={data.generatedAt} />
        </section>

        <section className="sci-panel sci-analysis">
          <PanelTitle icon={<FileText size={18} />} title="近期分析结果" />
          <AnalysisList
            fieldName={fields.find((field) => riskValue(field.riskLevel) === "high")?.name ?? fields[0]?.name}
            latestSummary={data.latestRun?.summary}
            createdAt={data.latestRun?.createdAt}
            recommendations={recommendations}
          />
        </section>
      </div>
    </main>
  );
}

function RiskMap() {
  const [activeLayer, setActiveLayer] = useState("图层");
  const layers = ["图层", "气象", "土壤", "病虫", "灾害", "实景"];

  return (
    <div className="sci-map-box">
      <div className="sci-map-texture">
        <span className="road r1" />
        <span className="road r2" />
        <span className="road r3" />
        <span className="signal s1" />
        <span className="signal s2" />
        <span className="radar-orbit orbit-a" />
        <span className="radar-orbit orbit-b" />
        <span className="map-scanline" />
      </div>

      <div className="sci-map-weather">
        <span><CloudSun size={18} /> 26℃</span>
        <span><Droplets size={18} /> 湿度 68%</span>
        <span><Wind size={18} /> 风速 2.3m/s</span>
        <span><CloudRain size={18} /> 降雨量 0mm</span>
      </div>

      <div className="sci-map-legend">
        <b>风险等级</b>
        <span><i className="high" />高风险</span>
        <span><i className="medium" />中风险</span>
        <span><i className="low" />低风险</span>
        <span><i className="safe" />安全</span>
        <hr />
        <small>气象站</small>
        <small>墒情站</small>
        <small>虫情站</small>
      </div>

      <div className="sci-layer-rail">
        {layers.map((layer) => (
          <button key={layer} className={activeLayer === layer ? "is-active" : ""} onClick={() => setActiveLayer(layer)}>
            <Layers size={15} />
            {layer}
          </button>
        ))}
      </div>

      <svg className="sci-map-svg" viewBox="0 0 760 560" aria-label="田间风险态势地图">
        <defs>
          <filter id="sciGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="map-boundary" d="M38 470 C152 382 194 84 432 56 C604 38 734 186 724 494" />
        <path className="map-grid" d="M86 86 L718 510 M38 212 L674 68 M122 520 L706 128 M36 392 L708 246" />
        {MAP_ZONES.map((zone) => (
          <g className={`map-zone ${zone.risk}`} key={`${zone.crop}-${zone.points}`}>
            <polygon points={zone.points} />
            <path d={hatchPath(zone.points)} />
            {zone.risk === "high" ? (
              <g className="risk-badge" transform={`translate(${zone.iconX} ${zone.iconY})`} filter="url(#sciGlow)">
                <circle r="24" />
                <path d="M0 -14 L15 12 H-15 Z" />
                <line x1="0" y1="-5" x2="0" y2="5" />
                <circle cx="0" cy="10" r="2" />
              </g>
            ) : null}
            {zone.label ? (
              <g className="crop-tag" transform={`translate(${zone.labelX} ${zone.labelY})`}>
                <rect x="-44" y="-22" width="88" height="38" rx="18" />
                <text>{zone.label}</text>
              </g>
            ) : null}
          </g>
        ))}
        {SENSOR_POINTS.map(([x, y], index) => (
          <g className="sensor" key={`${x}-${y}`}>
            <circle className="sensor-pulse" cx={x} cy={y} r="22" />
            <path d={`M${x - 7} ${y + 6}h14v18h-14z`} />
            <path d={`M${x - 9} ${y - 5}c5-5 13-5 18 0M${x - 5} ${y - 1}c3-3 7-3 10 0`} />
            {index < 4 ? <text x={x + 12} y={y - 10}>监测点</text> : null}
          </g>
        ))}
      </svg>
      <div className="sci-scale"><span>0</span><i /><span>50</span><span>100</span><span>200m</span></div>
    </div>
  );
}

function hatchPath(points: string) {
  const [first] = points.split(" ");
  const [x, y] = first.split(",").map(Number);
  return `M${x + 18} ${y + 18}h220 M${x + 34} ${y + 52}h250 M${x + 18} ${y + 88}h230 M${x + 42} ${y + 124}h190`;
}

function AgentChain({ steps }: { steps: CommandAgentStep[] }) {
  const agents = [
    { name: "田间感知", desc: "多源数据采集", icon: <Sprout size={30} /> },
    { name: "作物诊断", desc: "长链推理分析", icon: <Leaf size={30} /> },
    { name: "风险预警", desc: "地块级预警", icon: <Wheat size={30} /> },
    { name: "水肥决策", desc: "精准水肥建议", icon: <Waves size={30} /> },
    { name: "灾害应对", desc: "应急处置方案", icon: <CloudRain size={30} /> },
    { name: "农事档案", desc: "全过程追溯", icon: <FileText size={30} /> }
  ].map((agent, index) => {
    const step = steps[index];
    return {
      ...agent,
      name: step?.agentName && !isMojibake(step.agentName) ? step.agentName.replace("Agent", "") : agent.name,
      desc: step?.outputSummary && !isMojibake(step.outputSummary) ? step.outputSummary : agent.desc
    };
  });

  return (
    <div className="sci-agent-chain">
      {agents.map((agent, index) => (
        <div className={`sci-agent-node agent-node-${index + 1}`} key={agent.name}>
          <span>{agent.icon}</span>
          <b title={agent.name}>{agent.name}</b>
          <small title={agent.desc}>{agent.desc}</small>
        </div>
      ))}
    </div>
  );
}

function RiskAlerts({ fields }: { fields: CommandField[] }) {
  const corn = fields.find((field) => field.cropType === "corn") ?? fields[0];
  const wheat = fields.find((field) => field.cropType === "wheat") ?? fields[1] ?? fields[0];
  const alerts = [
    { level: "high" as const, title: "玉米拔节期干旱风险", field: corn, time: "09:40", area: 128 },
    { level: "medium" as const, title: "小麦灌浆期干热风风险", field: wheat, time: "08:30", area: 96 }
  ];

  return (
    <div className="sci-alert-list">
      {alerts.map((alert) => (
        <article className={`sci-alert ${alert.level}`} key={alert.title}>
          <AlertTriangle size={19} />
          <div>
            <h3 title={alert.title}>{alert.title}<em>{riskLabel(alert.level)}</em></h3>
            <p title={`涉及地块：${alert.field?.name ?? "示范田"}`}>涉及地块：{alert.field?.name ?? "示范田"}</p>
            <p title={`预警时间：2025-05-20 ${alert.time}`}>预警时间：2025-05-20 {alert.time}</p>
            <p title={`影响面积：${alert.area} 亩`}>影响面积：{alert.area} 亩</p>
          </div>
          <button>查看详情</button>
        </article>
      ))}
    </div>
  );
}

function SoilChart({ fields }: { fields: CommandField[] }) {
  const days = ["05-14", "05-15", "05-16", "05-17", "05-18", "05-19", "05-20"];
  const option = useMemo<EChartsOption>(() => ({
    animationDuration: 1300,
    grid: { left: 34, right: 12, top: 28, bottom: 42 },
    tooltip: { trigger: "axis", backgroundColor: "rgba(3,17,21,.96)", borderColor: "#2fb8c2", textStyle: { color: "#d8f3e8" } },
    xAxis: { type: "category", data: days, axisLine: { lineStyle: { color: "rgba(170,220,210,.32)" } }, axisTick: { show: false }, axisLabel: { color: "#a7c5bd", fontSize: 10 } },
    yAxis: { type: "value", min: 0, max: 100, splitLine: { lineStyle: { color: "rgba(170,220,210,.14)" } }, axisLabel: { color: "#a7c5bd", fontSize: 10 } },
    series: fields.map((field, index) => ({
      name: `${index + 1}号地块（${CROP_LABELS[field.cropType]}）`,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      lineStyle: { width: 2.5 },
      itemStyle: { color: COMMAND_CROP_COLORS[field.cropType] },
      data: days.map((_, day) => Math.round(72 - index * 7 + Math.sin(day + index) * 7 - day * (index === 2 ? 2.8 : 0.7)))
    })),
    legend: { bottom: 0, left: 30, textStyle: { color: "#b8d7ce", fontSize: 11 }, itemWidth: 18, itemHeight: 4 }
  }), [fields]);

  return (
    <div className="sci-soil-wrap">
      <div className="sci-soil-tools">
        <span>土壤含水率（%）</span>
        <button>近7天</button>
        <button>近30天</button>
      </div>
      <EChart option={option} className="sci-soil-chart" />
    </div>
  );
}

function TaskTable({ tasks, generatedAt }: { tasks: CommandTask[]; generatedAt: string }) {
  const rows = (tasks.length ? tasks : fallbackTasks(generatedAt)).slice(0, 4);
  return (
    <div className="sci-task-table">
      <div className="sci-task-head">
        <span>任务类型</span><span>任务描述</span><span>涉及地块</span><span>建议时间</span><span>优先级</span><span>状态</span><span />
      </div>
      {rows.map((task, index) => (
        <div className="sci-task-row" key={task.id}>
          <span className="task-kind" title={cleanText(task.title, ["灌溉", "追肥", "病虫防治", "除草"][index] ?? "农事")}>{taskIcon(index)}{cleanText(task.title, ["灌溉", "追肥", "病虫防治", "除草"][index] ?? "农事")}</span>
          <span title={cleanText(task.description, ["3号地块玉米灌溉建议", "1号地块小麦追肥建议", "2号地块稻飞虱防治", "4号地块大豆除草建议"][index] ?? "稳产处置建议")}>{cleanText(task.description, ["3号地块玉米灌溉建议", "1号地块小麦追肥建议", "2号地块稻飞虱防治", "4号地块大豆除草建议"][index] ?? "稳产处置建议")}</span>
          <span title={cleanText(task.fieldName, `${index + 1}号地块`)}>{cleanText(task.fieldName, `${index + 1}号地块`)}</span>
          <span>{formatCommandDate(task.dueDate)}</span>
          <span className={`prio ${task.priority}`}>{priorityLabel(task.priority)}</span>
          <span className="task-state">待执行</span>
          <ChevronRight size={14} />
        </div>
      ))}
    </div>
  );
}

function taskIcon(index: number) {
  const icons = [<Droplets key="water" size={15} />, <ScanLine key="scan" size={15} />, <Zap key="zap" size={15} />, <Sprout key="sprout" size={15} />];
  return <i>{icons[index % icons.length]}</i>;
}

function AnalysisList({ latestSummary, createdAt, fieldName, recommendations }: { latestSummary?: string; createdAt?: string; fieldName?: string; recommendations: string[] }) {
  const summary = !latestSummary || isMojibake(latestSummary) ? "基于气象预测，未来3天玉米干旱风险持续，请及时灌溉" : `${fieldName}${latestSummary}`;
  const items = [
    summary,
    ...recommendations.filter((item) => !isMojibake(item)).slice(0, 1),
    "1号地块小麦灌浆速度偏慢，建议叶面补充磷钾肥",
    "2号地块稻飞虱发生风险上升，建议加强监测与防治",
    "4号地块大豆长势良好，预计产量高于区域平均水平"
  ].slice(0, 5);

  return (
    <div className="sci-analysis-list">
      {items.map((item, index) => (
        <article className={`analysis-${index}`} key={`${item}-${index}`}>
          <RadioTower size={15} />
          <p title={item}>{item}</p>
          <time>{createdAt ? formatCommandDate(createdAt) : `05-20 0${index + 8}:50`}</time>
        </article>
      ))}
    </div>
  );
}

function fallbackTasks(dueDate: string): CommandTask[] {
  return [
    { id: "t1", title: "灌溉", description: "3号地块玉米灌溉建议", priority: "high", status: "pending", dueDate, fieldId: "field_corn_001", fieldName: "3号地块" },
    { id: "t2", title: "追肥", description: "1号地块小麦追肥建议", priority: "high", status: "pending", dueDate, fieldId: "field_wheat_001", fieldName: "1号地块" },
    { id: "t3", title: "病虫防治", description: "2号地块稻飞虱防治", priority: "medium", status: "pending", dueDate, fieldId: "field_rice_001", fieldName: "2号地块" },
    { id: "t4", title: "除草", description: "4号地块大豆除草建议", priority: "low", status: "pending", dueDate, fieldId: "field_soybean_001", fieldName: "4号地块" }
  ];
}
