import type { ActionGate } from "./schemas.js";

export type CommunityAgentId =
  | "community_steward"
  | "circle_architect"
  | "quest_designer"
  | "invitation_agent"
  | "accountability_agent"
  | "artifact_agent"
  | "memory_agent";

export interface CommunityAgentDefinition {
  id: CommunityAgentId;
  name: string;
  layer: "steward" | "worker";
  purpose: string;
  outputs: string[];
  forbidden: string[];
  defaultGates: ActionGate[];
}

const humanGate = (action_kind: string, reason: string): ActionGate => ({
  action_kind,
  tier: "human_gate",
  reason,
  required_approver: "community_steward_or_human_operator"
});

export const communityAgents: CommunityAgentDefinition[] = [
  {
    id: "community_steward",
    name: "Community Steward",
    layer: "steward",
    purpose: "Own weekly cadence, safety, synthesis, gates, and escalation.",
    outputs: ["weekly_run_sheet", "risk_register", "friday_synthesis"],
    forbidden: ["bypass_human_gate", "publish_without_approval"],
    defaultGates: [
      humanGate("external_invite_send", "Outbound community invitations require explicit approval."),
      humanGate("public_leaderboard_publish", "Recognition can create social pressure and must be reviewed.")
    ]
  },
  {
    id: "circle_architect",
    name: "Circle Architect",
    layer: "worker",
    purpose: "Form 3-5 person cells by goal, energy, skill, rhythm, and consent.",
    outputs: ["cell_map", "matching_rationale", "alternate_pairings"],
    forbidden: ["expose_private_matching_rationale", "match_without_consent"],
    defaultGates: [humanGate("sensitive_matching_decision", "Relationally sensitive matches need steward review.")]
  },
  {
    id: "quest_designer",
    name: "Quest Designer",
    layer: "worker",
    purpose: "Turn weekly themes into quest cards, personal prompts, and team challenges.",
    outputs: ["quest_card", "personal_prompt", "team_challenge"],
    forbidden: ["professional_legal_financial_medical_advice"],
    defaultGates: []
  },
  {
    id: "invitation_agent",
    name: "Invitation Agent",
    layer: "worker",
    purpose: "Draft warm personalized invitations and follow-ups.",
    outputs: ["invite_draft", "follow_up_draft", "rsvp_tracker"],
    forbidden: ["send_without_approval", "use_private_context_without_consent"],
    defaultGates: [humanGate("direct_message_send", "Agents draft DMs; humans approve sends.")]
  },
  {
    id: "accountability_agent",
    name: "Accountability Agent",
    layer: "worker",
    purpose: "Ask for proof, blockers, voice notes, and next moves without shame.",
    outputs: ["nudge_draft", "proof_checklist", "blocker_route"],
    forbidden: ["shame_language", "over_nudging"],
    defaultGates: [humanGate("distress_escalation", "Potential distress or harm needs human review.")]
  },
  {
    id: "artifact_agent",
    name: "Artifact Agent",
    layer: "worker",
    purpose: "Turn sessions into posts, docs, maps, prompts, demos, and event plans.",
    outputs: ["artifact_draft", "distribution_variant", "title_options"],
    forbidden: ["publish_without_approval", "change_member_voice_without_review"],
    defaultGates: [humanGate("public_artifact_publish", "Public artifacts require member approval.")]
  },
  {
    id: "memory_agent",
    name: "Memory Agent",
    layer: "worker",
    purpose: "Capture profile deltas, reflections, commitments, and insights.",
    outputs: ["profile_delta", "memory_record", "reflection_summary"],
    forbidden: ["store_raw_media_without_consent", "make_private_data_public"],
    defaultGates: [humanGate("raw_voice_or_video_storage", "Raw media storage requires explicit consent.")]
  }
];

export function findCommunityAgent(id: CommunityAgentId): CommunityAgentDefinition {
  const agent = communityAgents.find((candidate) => candidate.id === id);
  if (!agent) throw new Error(`Unknown community agent: ${id}`);
  return agent;
}
