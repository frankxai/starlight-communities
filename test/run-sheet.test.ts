import { describe, expect, it } from "vitest";
import { generateWeeklyRunSheet } from "../src/run-sheet.js";
import { PilotInputSchema } from "../src/schemas.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

describe("generateWeeklyRunSheet", () => {
  it("generates quests, commitments, cadence, gates, and memory records", () => {
    const input = PilotInputSchema.parse(pilotWeek);
    const runSheet = generateWeeklyRunSheet(input);

    expect(runSheet.week_id).toBe("2026-W27");
    expect(runSheet.cadence).toHaveLength(6);
    expect(runSheet.cells.length).toBeGreaterThan(0);
    expect(runSheet.quests).toHaveLength(runSheet.cells.length);
    expect(runSheet.commitments.length).toBe(input.members.length);
    expect(runSheet.gates.some((gate) => gate.tier === "human_gate")).toBe(true);
    expect(runSheet.memory_records.length).toBe(input.members.length);
  });
});
