# 大田作物稳产减灾 Agent 数据字典

## 1. 文档目的

本文档定义 MVP 阶段涉及的核心数据字段、单位、取值范围、枚举值、必填规则和样例数据，避免开发过程中出现字段含义不一致、单位混乱或输入校验缺失。

## 2. 通用约定

- 面积单位：亩。
- 产量单位：kg/亩。
- 温度单位：摄氏度，字段后缀使用 `C`。
- 降雨量单位：毫米。
- 土壤墒情单位：百分比，0-100。
- 日期格式：`YYYY-MM-DD`。
- 风险等级：`low | medium | high`，中文展示为 `低风险 | 中风险 | 高风险`。
- MVP 不处理真实图片识别结果，图片上传可作为二期扩展。

## 3. 作物枚举

| 值 | 中文 | 说明 |
|---|---|---|
| `rice` | 水稻 | 重点关注水层、分蘖、抽穗扬花、灌浆等管理 |
| `wheat` | 小麦 | 重点关注返青、拔节、抽穗、灌浆、干热风 |
| `corn` | 玉米 | 重点关注苗期、拔节、大喇叭口、抽雄吐丝、灌浆 |
| `soybean` | 大豆 | 重点关注分枝、开花、结荚、鼓粒和病虫害 |

## 4. 生育期枚举

| 作物 | 生育期 |
|---|---|
| 水稻 | 返青期、分蘖期、拔节孕穗期、抽穗扬花期、灌浆期 |
| 小麦 | 返青期、拔节期、抽穗期、灌浆期、成熟期 |
| 玉米 | 苗期、拔节期、大喇叭口期、抽雄吐丝期、灌浆期 |
| 大豆 | 苗期、分枝期、开花期、结荚期、鼓粒期 |

## 5. Field 地块字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 | `field_corn_001` | 系统生成唯一 ID |
| `name` | string | 是 | `东北玉米示范田` | 地块名称 |
| `location` | string | 是 | `吉林省示范区` | 位置描述，MVP 不要求经纬度 |
| `areaMu` | number | 是 | `120` | 面积，必须大于 0 |
| `cropType` | enum | 是 | `corn` | 作物类型 |
| `variety` | string | 否 | `先玉335` | 品种名称，不明确时可填“示范品种” |
| `growthStage` | string | 是 | `拔节期` | 必须匹配作物对应生育期 |
| `sowingDate` | date | 是 | `2026-04-15` | 播种日期 |
| `targetYieldKgPerMu` | number | 否 | `650` | 目标产量，必须大于 0 |
| `riskLevel` | enum | 是 | `medium` | 当前地块风险等级 |
| `createdAt` | datetime | 是 | 系统生成 | 创建时间 |
| `updatedAt` | datetime | 是 | 系统生成 | 更新时间 |

## 6. FieldObservation 观测字段

### 6.1 天气字段

| 字段 | 类型 | 必填 | 范围 | 示例 | 说明 |
|---|---|---|---|---|---|
| `temperatureC` | number | 是 | -30 到 50 | `34` | 当前或当天最高温 |
| `rainfallMm` | number | 是 | 0 到 500 | `0` | 当天或近 24 小时降雨 |
| `windLevel` | string | 否 | 文本 | `3级` | 风力描述 |
| `weatherTrend` | string | 是 | 文本 | `未来5天高温少雨` | 未来天气趋势摘要 |

### 6.2 土壤字段

| 字段 | 类型 | 必填 | 范围 | 示例 | 说明 |
|---|---|---|---|---|---|
| `soilMoisturePercent` | number | 是 | 0 到 100 | `38` | 土壤墒情百分比 |
| `soilTemperatureC` | number | 否 | -10 到 45 | `27` | 土壤温度 |
| `soilPh` | number | 否 | 3 到 10 | `6.8` | 土壤 pH |
| `nitrogenLevel` | enum | 是 | `low | normal | high` | `normal` | 氮素水平 |
| `phosphorusLevel` | enum | 是 | `low | normal | high` | `normal` | 磷素水平 |
| `potassiumLevel` | enum | 是 | `low | normal | high` | `low` | 钾素水平 |

### 6.3 苗情字段

| 字段 | 类型 | 必填 | 范围 | 示例 | 说明 |
|---|---|---|---|---|---|
| `plantHeightCm` | number | 否 | 0 到 300 | `65` | 株高 |
| `leafColor` | enum | 是 | `pale | normal | dark` | `pale` | 叶色，浅淡通常提示营养或水分风险 |
| `growthStatus` | enum | 是 | `weak | normal | vigorous` | `weak` | 长势等级 |

### 6.4 病虫草害字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `pestDescription` | string | 否 | `少量虫咬叶片` | 虫害描述，空字符串表示未发现 |
| `diseaseDescription` | string | 否 | `叶片有零星病斑` | 病害描述，空字符串表示未发现 |
| `weedDescription` | string | 否 | `田间有零星杂草` | 杂草描述，空字符串表示未发现 |

### 6.5 农事记录字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `lastIrrigationDate` | date | 否 | `2026-04-25` | 最近灌溉日期 |
| `lastFertilizationDate` | date | 否 | `2026-04-20` | 最近施肥日期 |
| `lastPesticideDate` | date | 否 | `2026-04-18` | 最近用药日期 |
| `notes` | string | 否 | `部分叶片午后卷曲` | 其他观察 |

## 7. AgentRun 字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 | `run_001` | 分析记录 ID |
| `fieldId` | string | 是 | `field_corn_001` | 关联地块 |
| `observationId` | string | 是 | `obs_001` | 关联观测 |
| `status` | enum | 是 | `completed` | `pending | running | completed | failed` |
| `overallRiskLevel` | enum | 是 | `high` | 综合风险 |
| `summary` | string | 是 | `存在中高等级干旱风险` | 综合判断 |
| `reasoning` | string | 是 | 文本 | 长链推理过程 |
| `recommendations` | JSON/string | 是 | 数组 | 农事建议列表 |
| `createdAt` | datetime | 是 | 系统生成 | 创建时间 |
| `completedAt` | datetime | 否 | 系统生成 | 完成时间 |

## 8. AgentStep 字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 | `step_001` | 步骤 ID |
| `agentRunId` | string | 是 | `run_001` | 关联分析 |
| `agentName` | string | 是 | `水肥决策Agent` | Agent 名称 |
| `status` | enum | 是 | `completed` | 执行状态 |
| `inputSummary` | string | 是 | 文本 | 输入摘要 |
| `outputSummary` | string | 是 | 文本 | 输出摘要 |
| `startedAt` | datetime | 是 | 系统生成 | 开始时间 |
| `completedAt` | datetime | 否 | 系统生成 | 完成时间 |

## 9. FarmingTask 字段

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 | `task_001` | 任务 ID |
| `fieldId` | string | 是 | `field_corn_001` | 关联地块 |
| `agentRunId` | string | 是 | `run_001` | 来源分析 |
| `title` | string | 是 | `安排补灌` | 任务标题 |
| `description` | string | 是 | 文本 | 任务说明 |
| `priority` | enum | 是 | `high` | `low | medium | high` |
| `dueDate` | date | 是 | `2026-05-02` | 截止日期 |
| `status` | enum | 是 | `pending` | `pending | completed | overdue` |
| `createdAt` | datetime | 是 | 系统生成 | 创建时间 |
| `completedAt` | datetime | 否 | 系统生成 | 完成时间 |

## 10. 样例观测数据

```json
{
  "field": {
    "name": "东北玉米示范田",
    "cropType": "corn",
    "growthStage": "拔节期",
    "areaMu": 120
  },
  "observation": {
    "temperatureC": 34,
    "rainfallMm": 0,
    "windLevel": "3级",
    "weatherTrend": "未来5天高温少雨",
    "soilMoisturePercent": 38,
    "soilTemperatureC": 27,
    "soilPh": 6.8,
    "nitrogenLevel": "normal",
    "phosphorusLevel": "normal",
    "potassiumLevel": "low",
    "plantHeightCm": 65,
    "leafColor": "pale",
    "growthStatus": "weak",
    "pestDescription": "少量虫咬叶片",
    "diseaseDescription": "",
    "weedDescription": "田间有零星杂草",
    "notes": "部分叶片午后卷曲"
  }
}
```

## 11. 输入校验规则

- `areaMu` 必须大于 0。
- `soilMoisturePercent` 必须在 0 到 100。
- `rainfallMm` 不得小于 0。
- `soilPh` 如果填写，必须在 3 到 10。
- `cropType` 必须是四类作物之一。
- `growthStage` 必须属于对应作物的生育期列表。
- 分析前必须存在至少一条观测数据。
- 文本描述长度建议不超过 500 字。

