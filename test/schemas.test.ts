import { describe, expect, it } from "vitest";
import { CommunityMemberProfileSchema, PilotInputSchema } from "../src/schemas.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

describe("schemas", () => {
  it("validates the synthetic pilot input", () => {
    const parsed = PilotInputSchema.parse(pilotWeek);
    expect(parsed.members).toHaveLength(6);
    expect(parsed.challenge_type).toBe("ai_companion");
  });

  it("defaults consent flags conservatively for raw media and public recognition", () => {
    const parsed = CommunityMemberProfileSchema.parse({
      member_id: "test",
      display_name: "Test",
      timezone: "UTC",
      goals: ["ship"],
      skills: []
    });

    expect(parsed.consent_flags.allowCellMatching).toBe(true);
    expect(parsed.consent_flags.allowRawMediaStorage).toBe(false);
    expect(parsed.consent_flags.allowPublicRecognition).toBe(false);
  });
});
