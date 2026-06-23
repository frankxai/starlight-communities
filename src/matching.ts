import {
  CommunityMemberProfileSchema,
  CreationCellSchema,
  type CommunityMemberProfile,
  type CreationCell
} from "./schemas.js";
import { slugify, titleCase, uniqueSorted } from "./util.js";

export interface ProposeCellsOptions {
  week_id: string;
  theme: string;
  minSize?: number;
  maxSize?: number;
}

export interface ProposedCellsResult {
  cells: CreationCell[];
  excluded_member_ids: string[];
  warnings: string[];
}

function primaryGoal(member: CommunityMemberProfile): string {
  return member.goals[0] ?? "creation";
}

function memberSortKey(member: CommunityMemberProfile): string {
  return [
    primaryGoal(member).toLowerCase(),
    member.preferred_rhythm,
    member.social_energy,
    member.display_name.toLowerCase()
  ].join("|");
}

function chunkSizes(total: number, minSize: number, maxSize: number): number[] {
  const sizes: number[] = [];
  let remaining = total;

  while (remaining > 0) {
    if (remaining < minSize) {
      if (sizes.length === 0) return [];
      for (let index = 0; index < sizes.length && remaining > 0; index += 1) {
        if (sizes[index] < maxSize) {
          sizes[index] += 1;
          remaining -= 1;
        }
      }
      if (remaining > 0) return [];
      break;
    }

    if (remaining <= maxSize) {
      sizes.push(remaining);
      break;
    }

    const nextSize = remaining - maxSize < minSize ? remaining - minSize : maxSize;
    sizes.push(nextSize);
    remaining -= nextSize;
  }

  return sizes;
}

function cellTheme(members: CommunityMemberProfile[], fallbackTheme: string): string {
  const goals = members.flatMap((member) => member.goals.map((goal) => goal.toLowerCase()));
  const counts = new Map<string, number>();
  for (const goal of goals) counts.set(goal, (counts.get(goal) ?? 0) + 1);
  const [topGoal] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? [];
  return titleCase(topGoal ?? fallbackTheme);
}

function rationaleFor(members: CommunityMemberProfile[], theme: string): string[] {
  const rhythms = uniqueSorted(members.map((member) => member.preferred_rhythm));
  const energies = uniqueSorted(members.map((member) => member.social_energy));
  const skills = uniqueSorted(members.flatMap((member) => member.skills)).slice(0, 8);

  return [
    `Shared working theme: ${theme}.`,
    `Rhythm mix: ${rhythms.join(", ")}.`,
    `Social energy mix: ${energies.join(", ")}.`,
    skills.length > 0 ? `Skill surface: ${skills.join(", ")}.` : "Skill surface is intentionally open for week one."
  ];
}

export function proposeCreationCells(rawMembers: CommunityMemberProfile[], options: ProposeCellsOptions): ProposedCellsResult {
  const minSize = options.minSize ?? 3;
  const maxSize = options.maxSize ?? 5;
  if (minSize < 2 || maxSize < minSize) throw new Error("Invalid cell sizing constraints.");

  const members = rawMembers.map((member) => CommunityMemberProfileSchema.parse(member));
  const eligible = members
    .filter((member) => member.consent_flags.allowCellMatching)
    .sort((a, b) => memberSortKey(a).localeCompare(memberSortKey(b)));
  const excluded_member_ids = members
    .filter((member) => !member.consent_flags.allowCellMatching)
    .map((member) => member.member_id);

  const warnings: string[] = [];
  if (excluded_member_ids.length > 0) {
    warnings.push(`Excluded ${excluded_member_ids.length} member(s) without cell-matching consent.`);
  }

  const sizes = chunkSizes(eligible.length, minSize, maxSize);
  if (sizes.length === 0) {
    return {
      cells: [],
      excluded_member_ids,
      warnings: [...warnings, `Need at least ${minSize} eligible members to form a creation cell.`]
    };
  }

  const cells: CreationCell[] = [];
  let cursor = 0;
  for (let index = 0; index < sizes.length; index += 1) {
    const slice = eligible.slice(cursor, cursor + sizes[index]);
    cursor += sizes[index];
    const theme = cellTheme(slice, options.theme);
    const cell_id = `${slugify(options.week_id)}-${slugify(theme)}-${index + 1}`;

    cells.push(
      CreationCellSchema.parse({
        cell_id,
        name: `${theme} Cell ${index + 1}`,
        theme,
        member_ids: slice.map((member) => member.member_id),
        week_id: options.week_id,
        status: "proposed",
        matching_rationale: rationaleFor(slice, theme),
        shared_mission: `Ship one visible ${options.theme} artifact and capture one reflection.`,
        team_challenge: "Each member helps one other member unblock or sharpen their artifact.",
        risk_notes: []
      })
    );
  }

  return { cells, excluded_member_ids, warnings };
}
