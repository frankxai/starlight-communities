import { ActionGateSchema, type ActionGate } from "./schemas.js";

export type CommunityActionKind =
  | "draft_invite"
  | "propose_cells"
  | "generate_quest"
  | "summarize_reflection"
  | "package_artifact"
  | "write_private_memory"
  | "external_invite_send"
  | "direct_message_send"
  | "public_artifact_publish"
  | "calendar_event_with_external_attendees"
  | "raw_voice_or_video_storage"
  | "leaderboard_publication"
  | "paid_service_or_subscription"
  | "professional_advice"
  | "delete_member_data";

const humanGateReasons: Partial<Record<CommunityActionKind, string>> = {
  external_invite_send: "Outbound invites can affect relationships and require explicit approval.",
  direct_message_send: "Agents may draft direct messages, but humans approve sends.",
  public_artifact_publish: "Public artifacts require member approval and voice review.",
  calendar_event_with_external_attendees: "External calendar invitations are real-world commitments.",
  raw_voice_or_video_storage: "Raw media is sensitive and requires explicit consent.",
  leaderboard_publication: "Recognition can shame or pressure members if handled poorly.",
  paid_service_or_subscription: "Recurring tools and services require cost-gate approval.",
  professional_advice: "Legal, financial, medical, and mental-health advice is outside scope.",
  delete_member_data: "Destructive data actions require direct human approval."
};

const autonomousActions = new Set<CommunityActionKind>([
  "draft_invite",
  "propose_cells",
  "generate_quest",
  "summarize_reflection",
  "package_artifact",
  "write_private_memory"
]);

export function classifyCommunityAction(action_kind: CommunityActionKind): ActionGate {
  if (humanGateReasons[action_kind]) {
    return ActionGateSchema.parse({
      action_kind,
      tier: action_kind === "professional_advice" ? "blocked" : "human_gate",
      reason: humanGateReasons[action_kind],
      required_approver: action_kind === "professional_advice" ? "none" : "human_operator"
    });
  }

  if (autonomousActions.has(action_kind)) {
    return ActionGateSchema.parse({
      action_kind,
      tier: "autonomous",
      reason: "Allowed when performed within private scope and without external side effects."
    });
  }

  return ActionGateSchema.parse({
    action_kind,
    tier: "steward_gate",
    reason: "Unrecognized community action requires steward review.",
    required_approver: "community_steward"
  });
}

export function defaultSafetyGates(): ActionGate[] {
  return [
    "external_invite_send",
    "direct_message_send",
    "public_artifact_publish",
    "calendar_event_with_external_attendees",
    "raw_voice_or_video_storage",
    "leaderboard_publication",
    "paid_service_or_subscription",
    "professional_advice"
  ].map((action) => classifyCommunityAction(action as CommunityActionKind));
}
