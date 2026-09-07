import { CommunityMemberProfileSchema, MemoryRecordSchema, ReflectionSchema, type CommunityMemberProfile, type MemoryRecord, type Reflection } from "./schemas.js";
import { slugify } from "./util.js";

/** The host must supply the current authenticated member record, never a content-derived claim. */
export function createProfileMemoryRecord(rawMember: CommunityMemberProfile, week_id: string): MemoryRecord {
  const member = CommunityMemberProfileSchema.parse(rawMember);
  if (!member.consent_flags.allowProfileMemory) {
    throw new Error("Profile memory requires explicit current member consent.");
  }
  return MemoryRecordSchema.parse({
    memory_id: `profile-${slugify(member.member_id)}-${slugify(week_id)}`,
    tenant: member.member_id,
    source: "starlight-communities:intake",
    memory_type: "profile",
    privacy_class: "private",
    summary: `${member.display_name} is building ${member.current_project ?? "a current project"} with goals: ${member.goals.join(", ")}.`,
    entities: [member.member_id, member.display_name],
    relations: member.skills.map((skill) => `has_skill:${skill}`),
    provenance: {
      week_id,
      consent_flags: member.consent_flags
    }
  });
}

/** Reflection text cannot authorize its own retention or public export. */
export function createReflectionMemoryRecord(rawReflection: Reflection, rawMember: CommunityMemberProfile): MemoryRecord {
  const member = CommunityMemberProfileSchema.parse(rawMember);
  if (!member.consent_flags.allowProfileMemory || !member.consent_flags.allowAsyncProofSummary) {
    throw new Error("Reflection memory requires explicit current memory and summary consent.");
  }
  const reflection = ReflectionSchema.parse(rawReflection);
  if (reflection.member_id !== member.member_id) {
    throw new Error("Reflection and consent must belong to the same member.");
  }
  return MemoryRecordSchema.parse({
    memory_id: `reflection-${slugify(reflection.reflection_id)}`,
    tenant: reflection.member_id,
    source: "starlight-communities:friday-reflection",
    memory_type: "episodic",
    privacy_class: "private",
    summary: `${reflection.insight} Next move: ${reflection.next_move}`,
    entities: [reflection.member_id, reflection.cell_id],
    relations: ["captured_reflection", `week:${reflection.week_id}`],
    provenance: {
      week_id: reflection.week_id,
      wins: reflection.wins,
      friction: reflection.friction,
      profile_delta: reflection.profile_delta,
      consent_flags: member.consent_flags
    }
  });
}
