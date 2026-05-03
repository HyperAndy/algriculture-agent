import { describe, expect, it } from "vitest";
import {
  dataSourceLabel,
  formatCommandDate,
  normalizeCommandFields,
  parseRecommendations,
  priorityLabel,
  riskLabel,
  riskValue,
} from "@/components/command-center/model";
import type { CommandField } from "@/components/command-center/types";

describe("command-center model helpers", () => {
  it("normalizes risk and labels priorities", () => {
    expect(riskValue("high")).toBe("high");
    expect(riskValue("unknown")).toBe("low");
    expect(priorityLabel("high")).toBe("高");
    expect(priorityLabel("medium")).toBe("中");
    expect(priorityLabel("low")).toBe("低");
    expect(riskLabel("high")).toBe("高风险");
  });

  it("formats command dates as MM-DD HH:mm", () => {
    const localDate = new Date(2026, 4, 3, 4, 5, 6).toISOString();

    expect(formatCommandDate(localDate)).toBe("05-03 04:05");
  });

  it("parses recommendation JSON and plain text", () => {
    expect(parseRecommendations(JSON.stringify(["及时灌溉", "加强监测"]))).toEqual(["及时灌溉", "加强监测"]);
    expect(parseRecommendations("及时灌溉;加强监测")).toEqual(["及时灌溉", "加强监测"]);
  });

  it("labels data source modes", () => {
    expect(dataSourceLabel("real")).toBe("实时业务数据");
    expect(dataSourceLabel("mixed")).toBe("真实数据 + 演示补齐");
    expect(dataSourceLabel("demo")).toBe("演示数据");
  });

  it("normalizes missing fields with stable demo fields", () => {
    const fields = normalizeCommandFields([]);

    expect(fields).toHaveLength(4);
    expect(fields.map((field) => field.cropType)).toEqual(["rice", "wheat", "corn", "soybean"]);
  });

  it("keeps valid real field values when normalizing", () => {
    const input: CommandField[] = [
      {
        id: "field_real",
        name: "真实玉米田",
        location: "东北示范区",
        areaMu: 88,
        cropType: "corn",
        variety: null,
        growthStage: "拔节期",
        riskLevel: "high",
      },
    ];

    const fields = normalizeCommandFields(input);

    expect(fields[2]?.name).toBe("真实玉米田");
    expect(fields[2]?.areaMu).toBe(88);
    expect(fields[2]?.riskLevel).toBe("high");
  });
});
