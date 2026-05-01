import { describe, expect, test } from "vitest";
import { maxRisk, scoreBiologicalRisk, scoreDroughtRisk, scoreGrowthRisk, scoreNutrientRisk } from "@/lib/domain/risk";

describe("agricultural risk scoring", () => {
  test("scores high drought risk for high temperature and low soil moisture", () => {
    expect(scoreDroughtRisk({ soilMoisturePercent: 38, temperatureC: 34, rainfallMm: 0, weatherTrend: "未来5天高温少雨" })).toBe("high");
  });

  test("scores low drought risk for normal weather and moisture", () => {
    expect(scoreDroughtRisk({ soilMoisturePercent: 65, temperatureC: 26, rainfallMm: 8, weatherTrend: "天气平稳" })).toBe("low");
  });

  test("raises biological risk when pest or disease descriptions are present", () => {
    expect(scoreBiologicalRisk({ pestDescription: "少量虫咬叶片", diseaseDescription: "", weedDescription: "" })).toBe("medium");
    expect(scoreBiologicalRisk({ pestDescription: "", diseaseDescription: "病斑扩散，成片发生", weedDescription: "" })).toBe("high");
  });

  test("scores growth and nutrient risks from field observations", () => {
    expect(scoreGrowthRisk({ leafColor: "pale", growthStatus: "weak" })).toBe("high");
    expect(scoreNutrientRisk({ nitrogenLevel: "normal", phosphorusLevel: "normal", potassiumLevel: "low" })).toBe("medium");
  });

  test("returns the highest risk level across risk dimensions", () => {
    expect(maxRisk("low", "medium", "high")).toBe("high");
    expect(maxRisk("low", "medium")).toBe("medium");
  });
});
