import type { CommandDashboardViewModel } from "@/features/dashboard/types";

export function createCommandDashboardDemoData(now: Date): CommandDashboardViewModel {
  const generatedAt = now.toISOString();

  return {
    generatedAt,
    formattedTime: "",
    source: {
      mode: "demo",
      fallbackReasons: ["demo fallback data loaded"],
    },
    fields: [
      {
        id: "demo_field_rice",
        name: "江淮水稻示范田",
        location: "安徽省江淮示范区",
        areaMu: 210,
        cropType: "rice",
        variety: "优质稻",
        growthStage: "分蘖期",
        riskLevel: "low",
      },
      {
        id: "demo_field_wheat",
        name: "黄淮麦田示范区",
        location: "河南省黄淮示范区",
        areaMu: 180,
        cropType: "wheat",
        variety: "强筋小麦",
        growthStage: "灌浆期",
        riskLevel: "medium",
      },
      {
        id: "demo_field_corn",
        name: "东北玉米示范田",
        location: "吉林省黑土示范区",
        areaMu: 200,
        cropType: "corn",
        variety: "耐密玉米",
        growthStage: "拔节期",
        riskLevel: "high",
      },
      {
        id: "demo_field_soybean",
        name: "黑土地大豆示范田",
        location: "黑龙江省示范区",
        areaMu: 120,
        cropType: "soybean",
        variety: "高蛋白大豆",
        growthStage: "开花期",
        riskLevel: "low",
      },
    ],
    tasks: [
      {
        id: "demo_task_irrigation",
        title: "灌溉",
        description: "东北玉米示范田拔节期灌溉建议",
        priority: "high",
        status: "pending",
        dueDate: generatedAt,
        fieldId: "demo_field_corn",
        fieldName: "东北玉米示范田",
      },
      {
        id: "demo_task_fertilizer",
        title: "追肥",
        description: "黄淮麦田示范区叶面补磷钾肥",
        priority: "medium",
        status: "pending",
        dueDate: generatedAt,
        fieldId: "demo_field_wheat",
        fieldName: "黄淮麦田示范区",
      },
    ],
    latestRun: {
      id: "demo_agent_run",
      fieldId: "demo_field_corn",
      fieldName: "东北玉米示范田",
      overallRiskLevel: "high",
      summary:
        "基于天气预测、土壤墒情和拔节期需水特征，东北玉米示范田存在干旱风险。",
      recommendations: JSON.stringify([
        "24小时内安排灌溉",
        "避开中午高温时段",
        "加强墒情监测",
      ]),
      createdAt: generatedAt,
      steps: [
        {
          id: "demo_step_1",
          agentName: "田间感知 Agent",
          status: "completed",
          inputSummary: "读取地块、天气、土壤和苗情数据。",
          outputSummary: "识别玉米处于拔节期，近期降雨不足。",
        },
        {
          id: "demo_step_2",
          agentName: "作物诊断 Agent",
          status: "completed",
          inputSummary: "分析生育期和作物长势。",
          outputSummary: "判断当前水分约束会影响拔节期生长。",
        },
        {
          id: "demo_step_3",
          agentName: "风险预警 Agent",
          status: "completed",
          inputSummary: "综合天气和土壤墒情。",
          outputSummary: "生成高风险干旱预警。",
        },
        {
          id: "demo_step_4",
          agentName: "水肥决策 Agent",
          status: "completed",
          inputSummary: "匹配灌溉窗口和水肥策略。",
          outputSummary: "建议24小时内完成灌溉。",
        },
        {
          id: "demo_step_5",
          agentName: "灾害应对 Agent",
          status: "completed",
          inputSummary: "评估高温干旱应急措施。",
          outputSummary: "建议避开中午高温作业。",
        },
        {
          id: "demo_step_6",
          agentName: "农事档案 Agent",
          status: "completed",
          inputSummary: "沉淀分析结果。",
          outputSummary: "生成任务和可追溯报告。",
        },
      ],
    },
  };
}
