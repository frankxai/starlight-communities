import { MemoryRecordSchema, type CommunityMemberProfile, type MemoryRecord, type Reflection } from "./schemas.js";
import { slugify } from "./util.js";

export function createProfileMemoryRecord(member: CommunityMemberProfile, week_id: string): MemoryRecord {
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

export function createReflectionMemoryRecord(reflection: Reflection): MemoryRecord {
  return MemoryRecordSchema.parse({
    memory_id: `reflection-${slugify(reflection.reflection_id)}`,
    tenant: reflection.member_id,
    source: "starlight-communities:friday-reflection",
    memory_type: "episodic",
    privacy_class: reflection.privacy_class,
    summary: `${reflection.insight} Next move: ${reflection.next_move}`,
    entities: [reflection.member_id, reflection.cell_id],
    relations: ["captured_reflection", `week:${reflection.week_id}`],
    provenance: {
      week_id: reflection.week_id,
      wins: reflection.wins,
      friction: reflection.friction,
      profile_delta: reflection.profile_delta
    }
  });
}
