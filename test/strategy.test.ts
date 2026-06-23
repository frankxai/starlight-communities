import { describe, expect, it } from "vitest";
import { generateCommunityBlueprint } from "../src/strategy.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

describe("generateCommunityBlueprint", () => {
  it("creates a strategy with a run sheet when pilot input is present", () => {
    const blueprint = generateCommunityBlueprint({
      name: "Visible Proof Guild",
      audience: "AI-native creators",
      member_promise: "Ship one proof object per week with a small cell.",
      value_pillar: "engagement",
      primary_surface: "railway_api",
      pilot: pilotWeek
    });

    expect(blueprint.strategy.metrics).toContain("weekly_commitment_rate");
    expect(blueprint.member_journey).toHaveLength(6);
    expect(blueprint.run_sheet?.cells.length).toBeGreaterThan(0);
    expect(blueprint.architecture.deployment).toContain("Railway");
  });
});
