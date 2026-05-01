# 大田作物稳产减灾 Agent 规格说明

## 1. 文档目的

本文档定义 MVP 阶段六类 Agent 的职责、输入、输出、协作顺序、Mock 规则、未来 LLM 提示词模板和安全边界，确保系统输出稳定、可解释、可替换。

## 2. 总体原则

- Agent 是农事辅助决策工具，不替代农技专家现场判断。
- MVP 使用确定性 Mock Agent，确保无 API Key 也能稳定演示。
- 每个 Agent 只负责一个清晰环节，避免职责重叠。
- 输出必须面向可执行农事行动，而不是泛泛解释。
- 所有建议都应包含依据、风险等级或观察指标。
- 禁止承诺“保证增产”“完全避免损失”“一定治愈病害”。

## 3. Agent 协作流程

```text
田间感知 Agent
→ 作物诊断 Agent
→ 病虫草害预警 Agent
→ 水肥决策 Agent
→ 灾害应对 Agent
→ 农事档案 Agent
→ 报告生成与任务生成
```

## 4. 统一输入

```ts
interface FieldAgentContext {
  field: {
    id: string;
    name: string;
    location: string;
    areaMu: number;
    cropType: "rice" | "wheat" | "corn" | "soybean";
    cropLabel: string;
    variety?: string;
    growthStage: string;
    targetYieldKgPerMu?: number;
  };
  observation: {
    temperatureC: number;
    rainfallMm: number;
    windLevel?: string;
    weatherTrend: string;
    soilMoisturePercent: number;
    soilTemperatureC?: number;
    soilPh?: number;
    nitrogenLevel: "low" | "normal" | "high";
    phosphorusLevel: "low" | "normal" | "high";
    potassiumLevel: "low" | "normal" | "high";
    plantHeightCm?: number;
    leafColor: "pale" | "normal" | "dark";
    growthStatus: "weak" | "normal" | "vigorous";
    pestDescription?: string;
    diseaseDescription?: string;
    weedDescription?: string;
    notes?: string;
  };
}
```

## 5. 统一输出

```ts
interface AgentStepResult {
  agentName: string;
  inputSummary: string;
  outputSummary: string;
  riskLevel?: "low" | "medium" | "high";
  signals?: string[];
}
```

## 6. 田间感知 Agent

### 6.1 职责

整理地块和观测数据，判断数据是否足以支撑分析，并提取关键农情信号。

### 6.2 输入

- 地块信息
- 作物类型
- 生育期
- 天气数据
- 土壤数据
- 苗情数据
- 病虫草害描述
- 最近农事记录

### 6.3 输出

- 数据完整度判断
- 关键指标摘要
- 需要重点关注的异常信号

### 6.4 Mock 输出规则

- 墒情 `< 45%`：输出“墒情偏低”。
- 温度 `>= 32℃`：输出“高温风险信号”。
- `weatherTrend` 包含“少雨”“高温”：输出“未来天气不利”。
- 任一病虫草害描述不为空：输出“存在生物胁迫线索”。

## 7. 作物诊断 Agent

### 7.1 职责

根据作物类型、生育期、苗情和营养指标判断长势风险。

### 7.2 输出

- 当前生育期判断
- 长势状态
- 缺水/缺肥/弱苗风险

### 7.3 作物关注点

| 作物 | 重点 |
|---|---|
| 水稻 | 分蘖、孕穗、抽穗扬花期水分和病害风险 |
| 小麦 | 拔节、抽穗、灌浆期干热风和水肥风险 |
| 玉米 | 拔节、大喇叭口、抽雄吐丝期水分和倒伏风险 |
| 大豆 | 开花、结荚、鼓粒期水分和病虫害风险 |

### 7.4 Mock 输出规则

- `leafColor = pale`：提示叶色偏淡。
- `growthStatus = weak`：提示长势偏弱。
- 氮磷钾任一为 `low`：提示养分短板。
- 叶色偏淡且长势偏弱：长势风险为高。

## 8. 病虫草害预警 Agent

### 8.1 职责

根据病虫草害描述、天气条件和作物阶段判断生物风险。

### 8.2 输出

- 病虫草害风险等级
- 主要风险来源
- 巡田和复查建议

### 8.3 Mock 输出规则

- 描述包含“严重”“大量”“扩散”“病斑”“虫口”：高风险。
- 任一病虫草害描述不为空：中风险。
- 全部为空：低风险。

## 9. 水肥决策 Agent

### 9.1 职责

根据墒情、天气、作物阶段和营养指标生成灌溉、追肥、控旺或排水建议。

### 9.2 输出

- 灌溉建议
- 追肥建议
- 投入品使用注意事项
- 建议执行窗口

### 9.3 Mock 输出规则

- 墒情 `< 40%` 且温度 `>= 32℃`：建议 24 小时内补灌。
- 墒情 `< 50%`：建议加强墒情监测并视天气补灌。
- 任一养分为 `low`：建议评估追肥方案。
- 高温时段禁止建议立即追肥，应提示避开高温。

## 10. 灾害应对 Agent

### 10.1 职责

识别干旱、高温、暴雨、低温、倒伏等灾害风险，生成应对方案。

### 10.2 输出

- 灾害风险等级
- 应急处置建议
- 后续观察指标

### 10.3 Mock 输出规则

- `weatherTrend` 包含“高温少雨”且墒情 `< 45%`：干旱风险高。
- `weatherTrend` 包含“暴雨”或“强降雨”：排水风险高。
- `windLevel` 包含“6级”或以上且作物为玉米/小麦：倒伏风险中。
- 小麦灌浆期 + 高温少雨：提示干热风风险。

## 11. 农事档案 Agent

### 11.1 职责

将诊断结果、建议措施、任务和关键依据组织成可追溯档案。

### 11.2 输出

- 档案摘要
- 追溯字段
- 下次复查要点

### 11.3 Mock 输出规则

每次分析必须输出：

- 地块名称
- 作物和生育期
- 综合风险
- 至少 3 条建议
- 下次复查时间建议

## 12. 报告生成规则

报告必须包含：

1. 综合判断。
2. 长链推理。
3. 主要风险。
4. 农事建议。
5. 后续观察指标。
6. Agent 步骤摘要。

## 13. 未来 LLM Prompt 模板

```text
你是一个农业种植业农技辅助决策 Agent，面向水稻、小麦、玉米、大豆等大田作物。

请基于输入的地块信息、作物生育期、天气、土壤墒情、苗情、病虫草害描述和农事记录，输出可执行的农事辅助建议。

要求：
1. 先判断作物、生育期和地块状态。
2. 再融合天气、土壤、苗情、病虫草害和农事记录。
3. 明确风险等级：低风险、中风险或高风险。
4. 给出建议依据，不要只给结论。
5. 输出建议要可执行，包含优先级和执行窗口。
6. 不承诺保证增产，不替代农技专家现场判断。
7. 如果数据不足，请说明缺少什么数据。

输入：
{context_json}

输出 JSON：
{
  "riskLevel": "low | medium | high",
  "summary": "综合判断",
  "reasoning": "长链推理过程",
  "recommendations": ["建议1", "建议2", "建议3"],
  "followUp": ["后续观察指标1", "后续观察指标2"]
}
```

## 14. 禁止输出

- “保证增产”
- “一定不会发生灾害”
- “该药剂必然有效”
- “无需人工复核”
- 超出输入数据支持的具体农药剂量
- 无依据的产量预测

