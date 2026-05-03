"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Bot,
  ClipboardList,
  Droplets,
  FileText,
  Sprout,
  Tractor,
  Wheat,
} from "lucide-react";
import type { CommandCenterData } from "./types";
import {
  dataSourceLabel,
  normalizeCommandFields,
  parseRecommendations,
  riskValue,
} from "./model";
import { PanelTitle } from "./panel-title";
import { TopBar } from "./top-bar";
import { SituationMetricsPanel } from "./situation-metrics-panel";
import { CropDistributionPanel } from "./crop-distribution-panel";
import { GrowthStagePanel } from "./growth-stage-panel";
import { FieldRiskMap } from "./field-risk-map";
import { AgentDecisionChain } from "./agent-decision-chain";
import { RiskWarningPanel } from "./risk-warning-panel";
import { SoilMoistureTrend } from "./soil-moisture-trend";
import { CommandTaskQueue } from "./command-task-queue";
import { RecentAnalysisPanel } from "./recent-analysis-panel";

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
          <FieldRiskMap />
        </section>

        <section className="sci-panel sci-agent">
          <PanelTitle icon={<Bot size={18} />} title="多Agent决策链" />
          <AgentDecisionChain steps={data.latestRun?.steps ?? []} />
        </section>

        <section className="sci-panel sci-alerts">
          <PanelTitle icon={<AlertTriangle size={18} />} title="风险预警" />
          <RiskWarningPanel fields={fields} />
        </section>

        <section className="sci-panel sci-soil">
          <PanelTitle icon={<Droplets size={18} />} title="土壤墒情趋势" />
          <SoilMoistureTrend fields={fields} />
        </section>

        <section className="sci-panel sci-tasks">
          <PanelTitle icon={<ClipboardList size={18} />} title="农事任务队列" />
          <CommandTaskQueue tasks={data.tasks} generatedAt={data.generatedAt} />
        </section>

        <section className="sci-panel sci-analysis">
          <PanelTitle icon={<FileText size={18} />} title="近期分析结果" />
          <RecentAnalysisPanel
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
