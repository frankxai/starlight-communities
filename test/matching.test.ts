import { describe, expect, it } from "vitest";
import { proposeCreationCells } from "../src/matching.js";
import { PilotInputSchema } from "../src/schemas.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

describe("proposeCreationCells", () => {
  it("creates creation cells with valid 3-5 person sizing", () => {
    const input = PilotInputSchema.parse(pilotWeek);
    const result = proposeCreationCells(input.members, {
      week_id: input.week_id,
      theme: input.theme
    });

    expect(result.cells.length).toBeGreaterThan(0);
    for (const cell of result.cells) {
      expect(cell.member_ids.length).toBeGreaterThanOrEqual(3);
      expect(cell.member_ids.length).toBeLessThanOrEqual(5);
      expect(cell.matching_rationale.length).toBeGreaterThan(0);
    }
  });

  it("excludes members without matching consent", () => {
    const input = PilotInputSchema.parse(pilotWeek);
    const members = input.members.map((member, index) =>
      index === 0
        ? {
            ...member,
            consent_flags: {
              ...member.consent_flags,
              allowCellMatching: false
            }
          }
        : member
    );

    const result = proposeCreationCells(members, {
      week_id: input.week_id,
      theme: input.theme
    });

    expect(result.excluded_member_ids).toContain("mira");
    expect(result.cells.flatMap((cell) => cell.member_ids)).not.toContain("mira");
  });
});
