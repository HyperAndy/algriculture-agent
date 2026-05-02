import { describe, expect, it } from "vitest";
import { formatCommandTime } from "@/features/dashboard/server/format-command-time";

describe("formatCommandTime", () => {
  it("formats local command-center timestamps", () => {
    const date = new Date("2026-05-03T01:02:03+08:00");

    expect(formatCommandTime(date)).toBe("2026-05-03 01:02:03");
  });
});
