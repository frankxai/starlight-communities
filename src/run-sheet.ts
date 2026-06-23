import { weeklyCadence } from "./cadence.js";
import { defaultSafetyGates } from "./gates.js";
import { proposeCreationCells } from "./matching.js";
import { createProfileMemoryRecord } from "./memory.js";
import { createQuest } from "./quests.js";
import {
  PilotInputSchema,
  WeeklyCommitmentSchema,
  WeeklyRunSheetSchema,
  type PilotInput,
  type WeeklyCommitment,
  type WeeklyRunSheet
} from "./schemas.js";
import { slugify } from "./util.js";

function goalFor(memberId: string, input: PilotInput): string {
  const member = input.members.find((candidate) => candidate.member_id === memberId);
  return member?.current_project ?? member?.goals[0] ?? `Build a ${input.theme} artifact`;
}

function roleFor(index: number): string {
  const roles = ["artifact_owner", "spark_partner", "proof_capturer", "reflection_host", "salon_scout"];
  return roles[index % roles.length] ?? "artifact_owner";
}

export function generateWeeklyRunSheet(rawInput: PilotInput): WeeklyRunSheet {
  const input = PilotInputSchema.parse(rawInput);
  const proposed = proposeCreationCells(input.members, {
    week_id: input.week_id,
    theme: input.theme
  });

  const quests = proposed.cells.map((cell) =>
    createQuest({
      week_id: input.week_id,
      theme: cell.theme,
      challenge_type: input.challenge_type,
      created_by: input.created_by,
      cell_id: cell.cell_id
    })
  );

  const commitments: WeeklyCommitment[] = proposed.cells.flatMap((cell) =>
    cell.member_ids.map((member_id, index) =>
      WeeklyCommitmentSchema.parse({
        commitment_id: `${slugify(input.week_id)}-${slugify(cell.cell_id)}-${slugify(member_id)}`,
        member_id,
        cell_id: cell.cell_id,
        week_id: input.week_id,
        individual_build_goal: goalFor(member_id, input),
        team_role: roleFor(index),
        due_day: "thursday",
        status: "planned"
      })
    )
  );

  const memory_records = input.members
    .filter((member) => member.consent_flags.allowProfileMemory)
    .map((member) => createProfileMemoryRecord(member, input.week_id));

  return WeeklyRunSheetSchema.parse({
    week_id: input.week_id,
    theme: input.theme,
    generated_at: new Date().toISOString(),
    cells: proposed.cells,
    quests,
    commitments,
    cadence: weeklyCadence,
    gates: defaultSafetyGates(),
    memory_records,
    warnings: proposed.warnings
  });
}
