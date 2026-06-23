import { z } from "zod";
import type { PilotInput, WeeklyRunSheet } from "./schemas.js";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import { uniqueSorted } from "./util.js";

export const CommunityValuePillarSchema = z.enum([
  "support",
  "product",
  "acquisition",
  "content",
  "engagement",
  "success"
]);
export type CommunityValuePillar = z.infer<typeof CommunityValuePillarSchema>;

export const CommunityBlueprintInputSchema = z.object({
  name: z.string().min(1).default("Starlight Community"),
  audience: z.string().min(1),
  member_promise: z.string().min(1),
  value_pillar: CommunityValuePillarSchema.default("engagement"),
  pilot: z
    .object({
      week_id: z.string().min(1),
      theme: z.string().min(1),
      challenge_type: z.enum(["mind_map", "freedom_system", "voice", "offer_seed", "event_spark", "ai_companion"]),
      created_by: z.string().min(1).default("quest_designer"),
      members: z.array(z.unknown()).default([])
    })
    .optional(),
  primary_surface: z.enum(["local", "email", "circle", "discord", "slack", "native_web", "railway_api"]).default("local")
});
export type CommunityBlueprintInput = z.infer<typeof CommunityBlueprintInputSchema>;

export interface CommunityBlueprint {
  name: string;
  audience: string;
  member_promise: string;
  value_pillar: CommunityValuePillar;
  strategy: {
    identity: string[];
    experience: string[];
    structure: string[];
    metrics: string[];
    anti_metrics: string[];
  };
  member_journey: Array<{
    stage: "visitor" | "new_member" | "cell_member" | "contributor" | "host" | "alumni";
    trigger: string;
    system_action: string;
    proof: string;
  }>;
  architecture: {
    canonical_layer: string;
    interaction_surface: string;
    agent_layer: string;
    memory_layer: string;
    deployment: string;
  };
  run_sheet?: WeeklyRunSheet;
  risks: string[];
}

const metricsByPillar: Record<CommunityValuePillar, string[]> = {
  support: ["resolved_member_blockers", "time_to_helpful_response", "member_reported_clarity"],
  product: ["artifact_feedback_items", "workflow_improvements", "member_problem_patterns"],
  acquisition: ["qualified_invites", "referral_intros", "demo_to_member_conversion"],
  content: ["member_artifacts_packaged", "approved_public_artifacts", "story_reuse_rate"],
  engagement: ["weekly_commitment_rate", "proof_submission_rate", "reflection_completion_rate"],
  success: ["goals_advanced", "next_commitments_kept", "member_reported_progress"]
};

export function generateCommunityBlueprint(rawInput: CommunityBlueprintInput): CommunityBlueprint {
  const input = CommunityBlueprintInputSchema.parse(rawInput);
  const run_sheet = input.pilot?.members.length ? generateWeeklyRunSheet(input.pilot as PilotInput) : undefined;
  const skills = run_sheet
    ? uniqueSorted(
        input.pilot?.members.flatMap((member) => {
          if (typeof member === "object" && member && "skills" in member && Array.isArray(member.skills)) {
            return member.skills.filter((skill): skill is string => typeof skill === "string");
          }
          return [];
        }) ?? []
      )
    : [];

  return {
    name: input.name,
    audience: input.audience,
    member_promise: input.member_promise,
    value_pillar: input.value_pillar,
    strategy: {
      identity: [
        `${input.audience} are treated as builders, not passive audience members.`,
        "The cell is the identity container: small enough to be remembered, structured enough to ship."
      ],
      experience: [
        "Monday direction, Tuesday spark, Wednesday lab, Thursday proof, Friday closure.",
        "Every ritual creates proof, memory, relationship, or a next commitment."
      ],
      structure: [
        "3-5 person cells.",
        "Human-gated external actions.",
        `Primary surface: ${input.primary_surface}.`,
        skills.length > 0 ? `Pilot skill surface: ${skills.slice(0, 8).join(", ")}.` : "Pilot skill surface is discovered during intake."
      ],
      metrics: metricsByPillar[input.value_pillar],
      anti_metrics: ["raw_message_volume", "forced_public_posting", "leaderboard_anxiety", "agent_over_nudging"]
    },
    member_journey: [
      {
        stage: "visitor",
        trigger: "Receives a specific invitation.",
        system_action: "Draft an invite that names the theme, proof object, and time boundary.",
        proof: "RSVP or explicit no."
      },
      {
        stage: "new_member",
        trigger: "Completes intake.",
        system_action: "Create a private profile and propose a first commitment.",
        proof: "Profile consent and week-one goal."
      },
      {
        stage: "cell_member",
        trigger: "Joins a 3-5 person cell.",
        system_action: "Send weekly quest and pair spark agenda.",
        proof: "Thursday proof object."
      },
      {
        stage: "contributor",
        trigger: "Helps another member unblock or sharpen an artifact.",
        system_action: "Capture contribution as a non-vanity recognition signal.",
        proof: "Peer-help note."
      },
      {
        stage: "host",
        trigger: "Runs a salon, walk, demo, or lab.",
        system_action: "Package the hosting pattern into a reusable ritual.",
        proof: "Ritual card."
      },
      {
        stage: "alumni",
        trigger: "Completes a cycle or pauses.",
        system_action: "Capture final reflection and next open loop.",
        proof: "Alumni memory record."
      }
    ],
    architecture: {
      canonical_layer: "Starlight Communities object model and SIS-style memory.",
      interaction_surface: input.primary_surface,
      agent_layer: "Community Steward plus six bounded worker agents.",
      memory_layer: "Private by default; summaries before raw media; public only by consent.",
      deployment:
        input.primary_surface === "railway_api"
          ? "Railway web service running the HTTP API."
          : "Local CLI/API first, adapter later."
    },
    run_sheet,
    risks: [
      "Premature platform build before weekly proof.",
      "Over-automation of sends or recognition.",
      "Using private matching rationale in public summaries.",
      "Optimizing for message volume instead of shipped artifacts."
    ]
  };
}
