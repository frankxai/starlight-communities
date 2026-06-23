import { z } from "zod";

export const PrivacyClassSchema = z.enum(["private", "cell", "community", "public"]);
export type PrivacyClass = z.infer<typeof PrivacyClassSchema>;

export const SocialEnergySchema = z.enum(["solo", "pair", "small_group", "host", "variable"]);
export type SocialEnergy = z.infer<typeof SocialEnergySchema>;

export const RhythmSchema = z.enum([
  "weekday_mornings",
  "weekday_afternoons",
  "weekday_evenings",
  "weekends",
  "async_first",
  "flexible"
]);
export type Rhythm = z.infer<typeof RhythmSchema>;

export const ChallengeTypeSchema = z.enum([
  "mind_map",
  "freedom_system",
  "voice",
  "offer_seed",
  "event_spark",
  "ai_companion"
]);
export type ChallengeType = z.infer<typeof ChallengeTypeSchema>;

export const WeekdaySchema = z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "weekend"]);
export type Weekday = z.infer<typeof WeekdaySchema>;

export const ConsentFlagsSchema = z.object({
  allowCellMatching: z.boolean().default(true),
  allowProfileMemory: z.boolean().default(true),
  allowAsyncProofSummary: z.boolean().default(true),
  allowRawMediaStorage: z.boolean().default(false),
  allowPublicRecognition: z.boolean().default(false),
  allowPlatformSync: z.boolean().default(false)
});
export type ConsentFlags = z.infer<typeof ConsentFlagsSchema>;

export const ChannelSchema = z.object({
  kind: z.enum(["email", "discord", "slack", "circle", "sms", "telegram", "other"]),
  value: z.string().min(1),
  verified: z.boolean().default(false)
});
export type Channel = z.infer<typeof ChannelSchema>;

export const CommunityMemberProfileSchema = z.object({
  member_id: z.string().min(1),
  display_name: z.string().min(1),
  timezone: z.string().min(1),
  goals: z.array(z.string().min(1)).min(1),
  skills: z.array(z.string().min(1)).default([]),
  current_project: z.string().min(1).optional(),
  preferred_rhythm: RhythmSchema.default("flexible"),
  social_energy: SocialEnergySchema.default("variable"),
  growth_edge: z.string().min(1).optional(),
  channels: z.array(ChannelSchema).default([]),
  consent_flags: ConsentFlagsSchema.default({
    allowCellMatching: true,
    allowProfileMemory: true,
    allowAsyncProofSummary: true,
    allowRawMediaStorage: false,
    allowPublicRecognition: false,
    allowPlatformSync: false
  }),
  privacy_class: PrivacyClassSchema.default("private"),
  weekly_commitments: z.array(z.string().min(1)).default([]),
  artifacts_shipped: z.array(z.string().min(1)).default([]),
  reflections: z.array(z.string().min(1)).default([]),
  matching_notes: z.array(z.string().min(1)).default([])
});
export type CommunityMemberProfile = z.infer<typeof CommunityMemberProfileSchema>;

export const CreationCellSchema = z.object({
  cell_id: z.string().min(1),
  name: z.string().min(1),
  theme: z.string().min(1),
  member_ids: z.array(z.string().min(1)).min(3).max(5),
  week_id: z.string().min(1),
  status: z.enum(["proposed", "active", "completed", "archived"]).default("proposed"),
  matching_rationale: z.array(z.string().min(1)).default([]),
  shared_mission: z.string().min(1),
  team_challenge: z.string().min(1),
  risk_notes: z.array(z.string().min(1)).default([]),
  steward_agent: z.string().min(1).default("community_steward")
});
export type CreationCell = z.infer<typeof CreationCellSchema>;

export const QuestSchema = z.object({
  quest_id: z.string().min(1),
  week_id: z.string().min(1),
  cell_id: z.string().min(1).optional(),
  challenge_type: ChallengeTypeSchema,
  theme: z.string().min(1),
  title: z.string().min(1),
  prompt: z.string().min(1),
  personal_prompt: z.string().min(1),
  expected_artifact: z.string().min(1),
  proof_type: z.enum(["link", "voice_note", "video", "doc", "map", "prompt", "event_plan", "demo"]).default("link"),
  difficulty: z.enum(["all_levels", "beginner", "intermediate", "advanced"]).default("all_levels"),
  created_by: z.string().min(1),
  gates: z.array(z.string().min(1)).default([])
});
export type Quest = z.infer<typeof QuestSchema>;

export const WeeklyCommitmentSchema = z.object({
  commitment_id: z.string().min(1),
  member_id: z.string().min(1),
  cell_id: z.string().min(1),
  week_id: z.string().min(1),
  individual_build_goal: z.string().min(1),
  team_role: z.string().min(1),
  due_day: WeekdaySchema,
  proof_uri: z.string().min(1).optional(),
  status: z.enum(["planned", "in_progress", "submitted", "reflected", "missed"]).default("planned"),
  next_commitment: z.string().min(1).optional()
});
export type WeeklyCommitment = z.infer<typeof WeeklyCommitmentSchema>;

export const ArtifactSchema = z.object({
  artifact_id: z.string().min(1),
  member_id: z.string().min(1).optional(),
  cell_id: z.string().min(1),
  week_id: z.string().min(1),
  type: z.enum(["post", "doc", "map", "prompt", "video", "voice", "event_plan", "agent", "demo"]),
  title: z.string().min(1),
  uri: z.string().min(1).optional(),
  visibility: PrivacyClassSchema.default("private"),
  source_session: z.string().min(1).optional(),
  attestation_status: z.enum(["draft", "submitted", "approved", "published"]).default("draft"),
  publish_gate: z.enum(["none", "human_required"]).default("human_required")
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const ReflectionSchema = z.object({
  reflection_id: z.string().min(1),
  member_id: z.string().min(1),
  cell_id: z.string().min(1),
  week_id: z.string().min(1),
  wins: z.array(z.string().min(1)).default([]),
  friction: z.array(z.string().min(1)).default([]),
  insight: z.string().min(1),
  next_move: z.string().min(1),
  profile_delta: z.record(z.string(), z.unknown()).default({}),
  privacy_class: PrivacyClassSchema.default("private")
});
export type Reflection = z.infer<typeof ReflectionSchema>;

export const GateTierSchema = z.enum(["autonomous", "steward_gate", "human_gate", "blocked"]);
export type GateTier = z.infer<typeof GateTierSchema>;

export const ActionGateSchema = z.object({
  action_kind: z.string().min(1),
  tier: GateTierSchema,
  reason: z.string().min(1),
  required_approver: z.string().min(1).optional()
});
export type ActionGate = z.infer<typeof ActionGateSchema>;

export const MemoryRecordSchema = z.object({
  memory_id: z.string().min(1),
  tenant: z.string().min(1),
  source: z.string().min(1),
  memory_type: z.enum(["working", "episodic", "semantic", "procedural", "profile", "policy", "aspirational"]),
  privacy_class: PrivacyClassSchema,
  summary: z.string().min(1),
  entities: z.array(z.string().min(1)).default([]),
  relations: z.array(z.string().min(1)).default([]),
  provenance: z.record(z.string(), z.unknown()).default({})
});
export type MemoryRecord = z.infer<typeof MemoryRecordSchema>;

export const CadenceItemSchema = z.object({
  day: WeekdaySchema,
  system_action: z.string().min(1),
  human_effect: z.string().min(1),
  output: z.string().min(1)
});
export type CadenceItem = z.infer<typeof CadenceItemSchema>;

export const PilotInputSchema = z.object({
  week_id: z.string().min(1),
  theme: z.string().min(1),
  challenge_type: ChallengeTypeSchema.default("mind_map"),
  created_by: z.string().min(1).default("quest_designer"),
  members: z.array(CommunityMemberProfileSchema).min(1)
});
export type PilotInput = z.infer<typeof PilotInputSchema>;

export const WeeklyRunSheetSchema = z.object({
  week_id: z.string().min(1),
  theme: z.string().min(1),
  generated_at: z.string().datetime(),
  cells: z.array(CreationCellSchema),
  quests: z.array(QuestSchema),
  commitments: z.array(WeeklyCommitmentSchema),
  cadence: z.array(CadenceItemSchema),
  gates: z.array(ActionGateSchema),
  memory_records: z.array(MemoryRecordSchema),
  warnings: z.array(z.string().min(1)).default([])
});
export type WeeklyRunSheet = z.infer<typeof WeeklyRunSheetSchema>;
