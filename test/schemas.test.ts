import { describe, expect, it } from "vitest";
import { CommunityMemberProfileSchema, PilotInputSchema } from "../src/schemas.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

describe("schemas", () => {
  it("validates the synthetic pilot input", () => {
    const parsed = PilotInputSchema.parse(pilotWeek);
    expect(parsed.members).toHaveLength(6);
    expect(parsed.challenge_type).toBe("ai_companion");
  });

  it("does not infer any consent from an omitted consent record", () => {
    const parsed = CommunityMemberProfileSchema.parse({
      member_id: "test",
      display_name: "Test",
      timezone: "UTC",
      goals: ["ship"],
      skills: []
    });

    expect(Object.values(parsed.consent_flags).every((value) => value === false)).toBe(true);
  });

  it("grants only explicitly supplied flags in a partial consent record", () => {
    const parsed = CommunityMemberProfileSchema.parse({
      member_id: "test", display_name: "Test", timezone: "UTC", goals: ["ship"],
      consent_flags: { allowCellMatching: true }
    });
    expect(parsed.consent_flags.allowCellMatching).toBe(true);
    expect(parsed.consent_flags.allowProfileMemory).toBe(false);
    expect(parsed.consent_flags.allowAsyncProofSummary).toBe(false);
  });
});
