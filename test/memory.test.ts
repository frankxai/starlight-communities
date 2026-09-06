import { describe, expect, it } from "vitest";
import { createProfileMemoryRecord, createReflectionMemoryRecord } from "../src/memory.js";
import { CommunityMemberProfileSchema, ReflectionSchema } from "../src/schemas.js";

const member = (consent = {}) => CommunityMemberProfileSchema.parse({
  member_id: "synthetic-member", display_name: "Synthetic builder", timezone: "UTC",
  goals: ["finish a scene"], consent_flags: consent
});
const reflection = () => ReflectionSchema.parse({
  reflection_id: "synthetic-reflection", member_id: "synthetic-member",
  cell_id: "synthetic-cell", week_id: "2026-W36", insight: "A smaller scene helped.",
  next_move: "Revise the ending.", privacy_class: "public"
});

describe("memory consent boundaries", () => {
  it("rejects direct profile-memory creation without consent, including after withdrawal", () => {
    expect(() => createProfileMemoryRecord(member(), "2026-W36")).toThrow(/consent/i);
    const current = member({ allowProfileMemory: true });
    expect(createProfileMemoryRecord(current, "2026-W36").privacy_class).toBe("private");
    current.consent_flags.allowProfileMemory = false;
    expect(() => createProfileMemoryRecord(current, "2026-W36")).toThrow(/consent/i);
  });

  it("requires current member context and both memory and summary consent for reflections", () => {
    // Exercise the JavaScript caller boundary; an old one-argument call must fail closed.
    expect(() => Reflect.apply(createReflectionMemoryRecord, undefined, [reflection()])).toThrow();
    expect(() => createReflectionMemoryRecord(reflection(), member())).toThrow(/consent/i);
    expect(() => createReflectionMemoryRecord(reflection(), member({ allowProfileMemory: true }))).toThrow(/consent/i);
    expect(() => createReflectionMemoryRecord(reflection(), member({ allowAsyncProofSummary: true }))).toThrow(/consent/i);
  });

  it("rejects another member's consent and keeps derived memory private", () => {
    const current = member({ allowProfileMemory: true, allowAsyncProofSummary: true });
    expect(() => createReflectionMemoryRecord(
      { ...reflection(), member_id: "someone-else" }, current
    )).toThrow(/member/i);
    const record = createReflectionMemoryRecord(reflection(), current);
    expect(record.privacy_class).toBe("private");
    expect(record.provenance).toMatchObject({ consent_flags: { allowAsyncProofSummary: true } });
  });
});
