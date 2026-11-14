import { createHash } from "node:crypto";
import { z } from "zod";
import { classifyCommunityAction } from "./gates.js";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import {
  ActionGateSchema,
  CommunityMemberProfileSchema,
  WeeklyRunSheetSchema,
  type ActionGate,
  type CommunityMemberProfile,
  type WeeklyRunSheet
} from "./schemas.js";

export const ACADEMY_HANDOFF_SCHEMA_VERSION = "starlight.academy_circle_handoff.v1" as const;

export const AcademyIcpLensSchema = z.enum([
  "enterprise-architect",
  "production-builder",
  "technical-creator",
  "workflow-operator"
]);
export type AcademyIcpLens = z.infer<typeof AcademyIcpLensSchema>;

export const CircleCampusSpaceSlugSchema = z.enum([
  "start-here-orientation",
  "architecture-critique-arena",
  "weekly-red-gate-lab-clinic",
  "worked-run-trace-exchange",
  "gencreator-studio-showcase",
  "alumni-builders-office-hours"
]);
export type CircleCampusSpaceSlug = z.infer<typeof CircleCampusSpaceSlugSchema>;

export const BuilderStandingTierIdSchema = z.enum([
  "observer",
  "scoped_builder",
  "red_gate_verifier",
  "verified_architect",
  "cell_steward"
]);
export type BuilderStandingTierId = z.infer<typeof BuilderStandingTierIdSchema>;

export const AcademyActSchema = z.enum([
  "act_1_foundations",
  "act_2_governance_evals",
  "act_3_studio_coe"
]);
export type AcademyAct = z.infer<typeof AcademyActSchema>;

export type AcademyHandoffErrorCode =
  | "MISSING_APPROVAL_RECEIPT"
  | "INVALID_APPROVAL_RECEIPT"
  | "NON_DRAFT_STATUS_BLOCKED"
  | "DRY_RUN_REQUIRED"
  | "LIVE_MUTATION_BLOCKED"
  | "CIRCLE_DRAFT_OVERWRITE_BLOCKED"
  | "INLINE_CREDENTIAL_BLOCKED"
  | "PRIVATE_REPO_URL_BLOCKED"
  | "ACT_WEEK_MISMATCH";

export class AcademyHandoffSafetyError extends Error {
  readonly code: AcademyHandoffErrorCode;
  readonly details: Record<string, unknown>;

  constructor(code: AcademyHandoffErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(`[${code}] ${message}`);
    this.name = "AcademyHandoffSafetyError";
    this.code = code;
    this.details = details;
  }
}

export interface CircleCampusSpaceSpec {
  slug: CircleCampusSpaceSlug;
  title: string;
  space_group: "orientation" | "engineering_forge" | "studio_and_alumni";
  access_tier: "member" | "operator_and_cohort";
  reuses_existing_space_slot: true;
  sia_surface_routes: string[];
  aaa_lab_surfaces: string[];
  primary_ritual: string;
  artifact_expectation: string;
  moderation_posture: "draft_staged_human_approved";
}

export const ACADEMY_CIRCLE_SPACES: readonly CircleCampusSpaceSpec[] = [
  {
    slug: "start-here-orientation",
    title: "Start Here / Orientation",
    space_group: "orientation",
    access_tier: "member",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy", "/academy/curriculum-atlas"],
    aaa_lab_surfaces: ["02-learning-paths/12-week-production-architect.md"],
    primary_ritual: "48-hour Arrival Path (#23), ICP lens selection, and Week 1 Field Notes signal.",
    artifact_expectation: "First structured Field Note with workflow triage and measurable kill criterion.",
    moderation_posture: "draft_staged_human_approved"
  },
  {
    slug: "architecture-critique-arena",
    title: "Architecture Critique Arena",
    space_group: "engineering_forge",
    access_tier: "operator_and_cohort",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy/studio", "/academy/curriculum-atlas"],
    aaa_lab_surfaces: ["01-design-patterns", "15-workflows/peer-review.md"],
    primary_ritual: "Weekly 20-minute Async Peer Review on ADRs, constitutions, and boundary diagrams.",
    artifact_expectation: "ADR or 00-frame.md with restatable human gate, rollback path, and peer critique diff.",
    moderation_posture: "draft_staged_human_approved"
  },
  {
    slug: "weekly-red-gate-lab-clinic",
    title: "Weekly Red-Gate Lab Clinic",
    space_group: "engineering_forge",
    access_tier: "operator_and_cohort",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy/studio", "/academy/evaluation"],
    aaa_lab_surfaces: [
      "labs/01-rag-pipeline",
      "labs/02-multi-agent-system",
      "labs/03-mcp-server",
      "labs/04-trust-boundary-firewall",
      "labs/05-eval-admission-gate"
    ],
    primary_ritual: "Monday 15-minute UnaidedAttempt followed by Wednesday offline lab diagnosis and red-gate clinic.",
    artifact_expectation: "Deterministic offline test output and non-compensable red-gate verification receipt.",
    moderation_posture: "draft_staged_human_approved"
  },
  {
    slug: "worked-run-trace-exchange",
    title: "Worked-Run Trace Exchange",
    space_group: "engineering_forge",
    access_tier: "operator_and_cohort",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy/evaluation", "/academy/curriculum-atlas"],
    aaa_lab_surfaces: ["site/app/worked-run/page.tsx", "07-evaluation"],
    primary_ritual: "Forensic dissection of failing production traces (contract-rag, support-triage, personal-ai-coe).",
    artifact_expectation: "Annotated failure trace comparing priorAttemptDigest assumptions against verified fix.",
    moderation_posture: "draft_staged_human_approved"
  },
  {
    slug: "gencreator-studio-showcase",
    title: "GenCreator Studio Showcase",
    space_group: "studio_and_alumni",
    access_tier: "member",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy/studio", "/academy/curriculum-atlas"],
    aaa_lab_surfaces: ["assets/diagrams"],
    primary_ritual: "Friday artifact showcase for SVG architecture plates, multimodal specs (MFG-01..12), and Remotion explainers.",
    artifact_expectation: "Shipped visual diagram, Remotion manifest, or multimodal launch packet with anti-slop check.",
    moderation_posture: "draft_staged_human_approved"
  },
  {
    slug: "alumni-builders-office-hours",
    title: "Alumni Builders & Office Hours",
    space_group: "studio_and_alumni",
    access_tier: "operator_and_cohort",
    reuses_existing_space_slot: true,
    sia_surface_routes: ["/academy", "/academy/studio"],
    aaa_lab_surfaces: ["08-governance", "02-learning-paths/12-week-production-architect.md"],
    primary_ritual: "Day-7 Changed-Context Transfer verification, capability receipt revalidation, and Creation Cell stewarding.",
    artifact_expectation: "Unassisted Day-7 transfer diff and steward synthesis note.",
    moderation_posture: "draft_staged_human_approved"
  }
] as const;

export interface BuilderStandingTierSpec {
  tier: BuilderStandingTierId;
  order: 1 | 2 | 3 | 4 | 5;
  label: string;
  required_evidence: {
    arrival_path_completed: boolean;
    min_shipped_repo_artifacts: number;
    min_red_gates_passed: number;
    min_rubric_peer_reviews: number;
    min_day7_transfers_verified: number;
    min_cells_stewarded_or_upstream_prs: number;
  };
  unlocked_responsibilities: string[];
  prohibited_vanity_signals: readonly string[];
}

const ANTI_VANITY_SIGNALS = [
  "login_streaks",
  "message_count_xp",
  "like_farming_badges",
  "public_shame_leaderboards"
] as const;

export const ACADEMY_BUILDER_STANDING_TIERS: readonly BuilderStandingTierSpec[] = [
  {
    tier: "observer",
    order: 1,
    label: "Observer (Arrival Verified)",
    required_evidence: {
      arrival_path_completed: true,
      min_shipped_repo_artifacts: 0,
      min_red_gates_passed: 0,
      min_rubric_peer_reviews: 0,
      min_day7_transfers_verified: 0,
      min_cells_stewarded_or_upstream_prs: 0
    },
    unlocked_responsibilities: [
      "Select primary ICP lens and join weekly orientation thread",
      "Submit first structured Field Note and 15-minute UnaidedAttempt"
    ],
    prohibited_vanity_signals: ANTI_VANITY_SIGNALS
  },
  {
    tier: "scoped_builder",
    order: 2,
    label: "Scoped Builder",
    required_evidence: {
      arrival_path_completed: true,
      min_shipped_repo_artifacts: 1,
      min_red_gates_passed: 1,
      min_rubric_peer_reviews: 0,
      min_day7_transfers_verified: 0,
      min_cells_stewarded_or_upstream_prs: 0
    },
    unlocked_responsibilities: [
      "Eligible for 3-5 person Creation Cell matching",
      "Submit repository artifacts for Thursday 20-minute Async Peer Review"
    ],
    prohibited_vanity_signals: ANTI_VANITY_SIGNALS
  },
  {
    tier: "red_gate_verifier",
    order: 3,
    label: "Red-Gate Verifier",
    required_evidence: {
      arrival_path_completed: true,
      min_shipped_repo_artifacts: 3,
      min_red_gates_passed: 3,
      min_rubric_peer_reviews: 2,
      min_day7_transfers_verified: 0,
      min_cells_stewarded_or_upstream_prs: 0
    },
    unlocked_responsibilities: [
      "Co-sign peer boundary critiques in Architecture Critique Arena",
      "Contribute failure cases to Worked-Run Trace Exchange"
    ],
    prohibited_vanity_signals: ANTI_VANITY_SIGNALS
  },
  {
    tier: "verified_architect",
    order: 4,
    label: "Verified Systems Architect",
    required_evidence: {
      arrival_path_completed: true,
      min_shipped_repo_artifacts: 6,
      min_red_gates_passed: 6,
      min_rubric_peer_reviews: 4,
      min_day7_transfers_verified: 2,
      min_cells_stewarded_or_upstream_prs: 0
    },
    unlocked_responsibilities: [
      "Hold digest-bound starlight.capability_receipt.v1 standing",
      "Participate in Alumni Builders & Office Hours architecture clinics"
    ],
    prohibited_vanity_signals: ANTI_VANITY_SIGNALS
  },
  {
    tier: "cell_steward",
    order: 5,
    label: "Cell Steward & Pattern Maintainer",
    required_evidence: {
      arrival_path_completed: true,
      min_shipped_repo_artifacts: 8,
      min_red_gates_passed: 8,
      min_rubric_peer_reviews: 6,
      min_day7_transfers_verified: 3,
      min_cells_stewarded_or_upstream_prs: 1
    },
    unlocked_responsibilities: [
      "Facilitate a 3-5 person Creation Cell under Community Steward human gates",
      "Propose reviewed open-source labs, SVG plates, or golden eval fixtures"
    ],
    prohibited_vanity_signals: ANTI_VANITY_SIGNALS
  }
] as const;

export const CanonicalCurriculumWeekMap: Record<
  number,
  { act: AcademyAct; canonical_focus: string; default_day7_perturbation: string }
> = {
  1: {
    act: "act_1_foundations",
    canonical_focus: "Problem Framing, Workflow Triage & The Agentic Hierarchy",
    default_day7_perturbation: "Re-triage the workflow when zero customer PII may leave regional VPC boundaries."
  },
  2: {
    act: "act_1_foundations",
    canonical_focus: "Production Retrieval, Chunking Geometry & Hybrid Ranking",
    default_day7_perturbation: "Preserve exact alphanumeric error codes and bilingual SKUs across versioned docs."
  },
  3: {
    act: "act_1_foundations",
    canonical_focus: "Trust Boundaries, Prompt-Injection Firewalls & Citation Grounding",
    default_day7_perturbation: "Quarantine indirect prompt injection embedded inside a retrieved vendor addendum."
  },
  4: {
    act: "act_1_foundations",
    canonical_focus: "Model Context Protocol (MCP v2) & Zero-Trust Tool Meshes",
    default_day7_perturbation: "Enforce read/write scope separation when a downstream MCP tool times out mid-batch."
  },
  5: {
    act: "act_2_governance_evals",
    canonical_focus: "The Agent Skill Standard (SKILL.md) & Cross-Harness Compilation",
    default_day7_perturbation: "Compile one portable skill contract across two harnesses without positional-arg drift."
  },
  6: {
    act: "act_2_governance_evals",
    canonical_focus: "Deterministic Multi-Agent Orchestration, FSMs & Maker-Checker Loops",
    default_day7_perturbation: "Bound retry budgets and dead-letter recovery when the verifier rejects twice."
  },
  7: {
    act: "act_2_governance_evals",
    canonical_focus: "Cognitive Governance, Protector Vetoes & Memory Sanitization",
    default_day7_perturbation: "Prevent private reflection records from leaking into public cohort summaries."
  },
  8: {
    act: "act_2_governance_evals",
    canonical_focus: "Agentic Evaluation Harnesses, Golden Sets & Digest-Bound Approvals",
    default_day7_perturbation: "Block promotion when average score rises to 94% while a single safety red gate fails."
  },
  9: {
    act: "act_3_studio_coe",
    canonical_focus: "Multimodal Brand Narrative, design.md & Anti-Slop Visual Systems",
    default_day7_perturbation: "Adapt an architecture plate to 390px mobile and reduced-motion without losing legibility."
  },
  10: {
    act: "act_3_studio_coe",
    canonical_focus: "Programmatic Remotion Video, WebVTT Captions & Conversion Proof",
    default_day7_perturbation: "Re-time deterministic Remotion scenes and WebVTT cues after changing FPS from 30 to 60."
  },
  11: {
    act: "act_3_studio_coe",
    canonical_focus: "AI Department Architecture, Provider Gateways & Unit Economics",
    default_day7_perturbation: "Maintain service continuity and cost caps during primary model provider degradation."
  },
  12: {
    act: "act_3_studio_coe",
    canonical_focus: "Sovereign AI CoE Runbooks, Disaster Recovery & Architecture Defense",
    default_day7_perturbation: "Execute clean rollback and receipt revalidation after an upstream dependency regression."
  }
};

export const SiaMissionRefSchema = z.object({
  mission_id: z
    .string()
    .min(3)
    .regex(/^[a-z0-9._-]+(@[0-9]+\.[0-9]+\.[0-9]+)?$/i, "Invalid SIA mission identifier"),
  title: z.string().min(1),
  sia_route: z
    .string()
    .min(1)
    .regex(/^\/academy(\/[a-z0-9/_-]+)?$/i, "SIA route must start with /academy"),
  aaa_lab_path: z
    .string()
    .min(1)
    .regex(/^(labs|01-design-patterns|02-learning-paths|07-evaluation|08-governance|site)\/[a-z0-9._/-]+$/i),
  worked_run_id: z.enum(["contract-rag", "support-triage", "personal-ai-coe"]).optional(),
  expected_repo_artifact: z.string().min(1)
});
export type SiaMissionRef = z.infer<typeof SiaMissionRefSchema>;

export const NonCompensableRedGateSchema = z.object({
  gate_id: z.string().min(1),
  label: z.string().min(1),
  refusal_code: z.string().min(1),
  verification_command: z.string().min(1),
  non_compensable: z.literal(true)
});
export type NonCompensableRedGate = z.infer<typeof NonCompensableRedGateSchema>;

export const HumanApprovalReceiptSchema = z.object({
  receipt_id: z.string().min(1),
  issue_refs: z.array(z.string().min(1)).min(1),
  approved_by: z.string().min(1),
  approved_at: z.string().datetime(),
  approved_scope: z.enum(["draft_plan_only", "draft_copy_review_only"]).default("draft_plan_only"),
  notes: z.string().min(1).optional()
});
export type HumanApprovalReceipt = z.infer<typeof HumanApprovalReceiptSchema>;

export const BuilderEvidenceSnapshotSchema = z.object({
  member_id: z.string().min(1),
  arrival_path_completed: z.boolean().default(false),
  shipped_repo_artifacts: z.number().int().min(0).default(0),
  red_gates_passed: z.number().int().min(0).default(0),
  rubric_peer_reviews: z.number().int().min(0).default(0),
  day7_transfers_verified: z.number().int().min(0).default(0),
  cells_stewarded_or_upstream_prs: z.number().int().min(0).default(0)
});
export type BuilderEvidenceSnapshot = z.infer<typeof BuilderEvidenceSnapshotSchema>;

export const HandoffExecutionModeSchema = z.object({
  dry_run: z.boolean().default(true),
  desired_status: z.string().min(1).default("draft"),
  live_http_mutation: z.boolean().default(false),
  overwrite_existing_circle_drafts: z.boolean().default(false),
  protected_circle_draft_ids: z.array(z.string().min(1)).default(["37119809", "37119811"]),
  api_token: z.string().optional()
});
export type HandoffExecutionMode = z.infer<typeof HandoffExecutionModeSchema>;

export const AcademyCohortWeekInputSchema = z.object({
  cohort_id: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/i, "cohort_id must be a clean slug"),
  week_number: z.number().int().min(1).max(12),
  week_id: z
    .string()
    .min(4)
    .regex(/^[0-9]{4}-W[0-9]{2}$/, "week_id must follow ISO week format YYYY-Www"),
  act: AcademyActSchema.optional(),
  title: z.string().min(1),
  epistemic_thesis: z.string().min(1),
  icp_lens: AcademyIcpLensSchema,
  secondary_icp_lenses: z.array(AcademyIcpLensSchema).default([]),
  sia_missions: z.array(SiaMissionRefSchema).min(1),
  red_gates: z.array(NonCompensableRedGateSchema).min(1),
  day7_transfer_override: z.string().min(1).optional(),
  execution_mode: HandoffExecutionModeSchema.default({
    dry_run: true,
    desired_status: "draft",
    live_http_mutation: false,
    overwrite_existing_circle_drafts: false,
    protected_circle_draft_ids: ["37119809", "37119811"]
  }),
  approval_receipt: HumanApprovalReceiptSchema.optional(),
  members: z.array(CommunityMemberProfileSchema).default([]),
  standing_snapshots: z.array(BuilderEvidenceSnapshotSchema).default([])
});
export type AcademyCohortWeekInput = z.infer<typeof AcademyCohortWeekInputSchema>;

export const DraftCirclePostPlanSchema = z.object({
  post_plan_id: z.string().min(1),
  space_slug: CircleCampusSpaceSlugSchema,
  day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]),
  title: z.string().min(1),
  status: z.literal("draft"),
  dry_run: z.literal(true),
  overwrite_existing_draft: z.literal(false),
  publish_gate: z.literal("human_required"),
  issue_gate_refs: z.array(z.string().min(1)).min(1),
  icp_framing: z.string().min(1),
  markdown_body: z.string().min(1),
  expected_member_output: z.string().min(1)
});
export type DraftCirclePostPlan = z.infer<typeof DraftCirclePostPlanSchema>;

export const DraftCircleEventPlanSchema = z.object({
  event_plan_id: z.string().min(1),
  space_slug: CircleCampusSpaceSlugSchema,
  cadence_slot: z.enum(["wednesday_lab_clinic", "thursday_async_peer_window", "day7_transfer_check"]),
  title: z.string().min(1),
  duration_minutes: z.number().int().positive(),
  status: z.literal("draft"),
  dry_run: z.literal(true),
  external_calendar_send: z.literal(false),
  approval_gate: z.literal("human_required"),
  agenda: z.array(z.string().min(1)).min(1),
  exit_artifact: z.string().min(1)
});
export type DraftCircleEventPlan = z.infer<typeof DraftCircleEventPlanSchema>;

export const ArrivalChecklistStepSchema = z.object({
  step_id: z.string().min(1),
  window: z.enum(["hour_0_to_1", "hour_1_to_24", "hour_24_to_48"]),
  space_slug: CircleCampusSpaceSlugSchema,
  action: z.string().min(1),
  verification_signal: z.string().min(1),
  recovery_path: z.string().min(1)
});
export type ArrivalChecklistStep = z.infer<typeof ArrivalChecklistStepSchema>;

export const EvaluatedBuilderStandingSchema = z.object({
  member_id: z.string().min(1),
  standing_tier: BuilderStandingTierIdSchema,
  standing_label: z.string().min(1),
  next_tier: BuilderStandingTierIdSchema.nullable(),
  missing_for_next_tier: z.array(z.string().min(1)),
  vanity_points_awarded: z.literal(0)
});
export type EvaluatedBuilderStanding = z.infer<typeof EvaluatedBuilderStandingSchema>;

export const AcademyCircleHandoffPlanSchema = z.object({
  schema_version: z.literal(ACADEMY_HANDOFF_SCHEMA_VERSION),
  plan_id: z.string().min(1),
  plan_digest: z.string().regex(/^[a-f0-9]{64}$/),
  safety_posture: z.object({
    status: z.literal("draft"),
    dry_run: z.literal(true),
    live_mutations_blocked: z.literal(true),
    overwrite_existing_circle_drafts: z.literal(false),
    protected_circle_draft_ids: z.array(z.string().min(1)),
    circle_space_budget: z.object({
      community_space_cap: z.literal(30),
      campus_spaces_mapped: z.literal(6),
      reuses_existing_slots: z.literal(true),
      requires_plan_upgrade: z.literal(false)
    }),
    verified_approval_receipt: HumanApprovalReceiptSchema
  }),
  cohort_week: z.object({
    cohort_id: z.string().min(1),
    week_number: z.number().int().min(1).max(12),
    week_id: z.string().min(1),
    act: AcademyActSchema,
    canonical_focus: z.string().min(1),
    title: z.string().min(1),
    epistemic_thesis: z.string().min(1),
    icp_lens: AcademyIcpLensSchema,
    icp_lens_brief: z.string().min(1),
    secondary_icp_lenses: z.array(AcademyIcpLensSchema),
    sia_missions: z.array(SiaMissionRefSchema),
    red_gates: z.array(NonCompensableRedGateSchema)
  }),
  spaces: z.array(
    z.object({
      slug: CircleCampusSpaceSlugSchema,
      title: z.string().min(1),
      space_group: z.enum(["orientation", "engineering_forge", "studio_and_alumni"]),
      access_tier: z.enum(["member", "operator_and_cohort"]),
      active_this_week: z.boolean(),
      reuses_existing_space_slot: z.literal(true),
      sia_surface_routes: z.array(z.string().min(1)),
      aaa_lab_surfaces: z.array(z.string().min(1)),
      primary_ritual: z.string().min(1)
    })
  ),
  draft_posts: z.array(DraftCirclePostPlanSchema).min(4),
  draft_events: z.array(DraftCircleEventPlanSchema).length(3),
  arrival_checklist_48h: z.array(ArrivalChecklistStepSchema).length(4),
  peer_review_protocol: z.object({
    duration_minutes: z.literal(20),
    format: z.literal("async_structured_rubric"),
    blocks: z.array(
      z.object({
        minute_range: z.string().min(1),
        focus: z.string().min(1),
        required_output: z.string().min(1)
      })
    ),
    anti_shame_guardrail: z.string().min(1)
  }),
  day7_transfer_ritual: z.object({
    scheduled_offset_days: z.literal(7),
    assistance_policy: z.literal("unaided_first_15m"),
    perturbation_prompt: z.string().min(1),
    revalidates_contract: z.literal("starlight.capability_receipt.v1"),
    required_red_gate_ids: z.array(z.string().min(1)).min(1)
  }),
  standing_evaluations: z.array(EvaluatedBuilderStandingSchema),
  gates: z.array(ActionGateSchema).min(4),
  creation_cell_run_sheet: WeeklyRunSheetSchema.optional()
});
export type AcademyCircleHandoffPlan = z.infer<typeof AcademyCircleHandoffPlanSchema>;

const ICP_LENS_BRIEFS: Record<
  AcademyIcpLens,
  { label: string; focus: string; arrival_action: string }
> = {
  "enterprise-architect": {
    label: "Enterprise Systems Architect",
    focus: "Emphasizes trust boundaries, ADR governance, VPC/data residency constraints, and multi-provider resilience.",
    arrival_action: "Map one production governance boundary and name the human approver + kill criterion."
  },
  "production-builder": {
    label: "Production AI Builder",
    focus: "Emphasizes deterministic Python/TypeScript harnesses, hybrid retrieval, MCP tool contracts, and golden regression suites.",
    arrival_action: "Run an offline lab test suite locally and log one unaided root-cause hypothesis before hints."
  },
  "technical-creator": {
    label: "Technical GenCreator",
    focus: "Emphasizes design.md visual systems, SVG architecture plates, programmatic Remotion explainers, and anti-slop editorial gates.",
    arrival_action: "Publish one code-backed diagram or structured Field Note translating a system mechanism clearly."
  },
  "workflow-operator": {
    label: "Structured Workflow Operator",
    focus: "Emphasizes workflow triage (automate vs assist-only vs do-not-automate), human review queues, and measurable recovery SOPs.",
    arrival_action: "Audit three recurring workflows and mark at least one high-risk surface as assist-only or do-not-automate."
  }
};

const FORBIDDEN_CREDENTIAL_PATTERNS: readonly RegExp[] = [
  /\bsk-[a-zA-Z0-9_-]{12,}\b/,
  /\bghp_[a-zA-Z0-9]{20,}\b/,
  /\bgithub_pat_[a-zA-Z0-9_]{20,}\b/,
  /\bBearer\s+[A-Za-z0-9._-]{12,}\b/i,
  /\bcircle_api_token\s*[:=]\s*["']?[A-Za-z0-9._-]{8,}/i
];

const PRIVATE_ESTATE_REPO_SLUGS = [
  "starlight-intelligence-academy",
  "starlight-command",
  "agentic-ops-hub",
  "starlight-private-memory",
  "starlight-agent-config",
  "affiliate-agent-skills",
  "claude-code-config"
] as const;

function assertNoSecretsOrPrivateUrls(rawPayloadText: string, apiToken?: string): void {
  if (apiToken !== undefined && apiToken.trim().length > 0) {
    throw new AcademyHandoffSafetyError(
      "INLINE_CREDENTIAL_BLOCKED",
      "Academy Circle handoff is strictly offline/draft-only and rejects api_token values.",
      { field: "execution_mode.api_token" }
    );
  }

  for (const pattern of FORBIDDEN_CREDENTIAL_PATTERNS) {
    if (pattern.test(rawPayloadText)) {
      throw new AcademyHandoffSafetyError(
        "INLINE_CREDENTIAL_BLOCKED",
        "Detected credential or bearer token pattern inside handoff payload.",
        { pattern: pattern.source }
      );
    }
  }

  for (const privateRepo of PRIVATE_ESTATE_REPO_SLUGS) {
    const repoPattern = new RegExp(`github\\.com/frankxai/${privateRepo}\\b`, "i");
    if (repoPattern.test(rawPayloadText)) {
      throw new AcademyHandoffSafetyError(
        "PRIVATE_REPO_URL_BLOCKED",
        `Public Circle campus drafts cannot link private repository frankxai/${privateRepo}.`,
        { private_repo: `frankxai/${privateRepo}` }
      );
    }
  }
}

function assertFailClosedExecutionPosture(
  mode: HandoffExecutionMode,
  receipt: HumanApprovalReceipt | undefined
): HumanApprovalReceipt {
  if (mode.desired_status !== "draft") {
    throw new AcademyHandoffSafetyError(
      "NON_DRAFT_STATUS_BLOCKED",
      `Circle handoff permits desired_status="draft" only; received "${mode.desired_status}".`,
      { desired_status: mode.desired_status }
    );
  }

  if (!mode.dry_run) {
    throw new AcademyHandoffSafetyError(
      "DRY_RUN_REQUIRED",
      "Circle handoff requires execution_mode.dry_run=true; live execution is fail-closed.",
      { dry_run: mode.dry_run }
    );
  }

  if (mode.live_http_mutation) {
    throw new AcademyHandoffSafetyError(
      "LIVE_MUTATION_BLOCKED",
      "Direct HTTP mutation to Circle is blocked in @starlight/communities; stage draft plans only.",
      { live_http_mutation: mode.live_http_mutation }
    );
  }

  if (mode.overwrite_existing_circle_drafts) {
    throw new AcademyHandoffSafetyError(
      "CIRCLE_DRAFT_OVERWRITE_BLOCKED",
      "Overwriting existing Circle drafts (e.g. 37119809, 37119811) is blocked per starlight-intelligence-academy#86.",
      { protected_circle_draft_ids: mode.protected_circle_draft_ids }
    );
  }

  if (!receipt) {
    throw new AcademyHandoffSafetyError(
      "MISSING_APPROVAL_RECEIPT",
      "Missing human approval_receipt referencing starlight-intelligence-academy#86 for Circle draft handoff staging."
    );
  }

  const referencesSia86 = receipt.issue_refs.some(
    (ref) => ref === "starlight-intelligence-academy#86" || ref === "#86"
  );
  if (!referencesSia86 || receipt.approved_by.trim().length === 0) {
    throw new AcademyHandoffSafetyError(
      "INVALID_APPROVAL_RECEIPT",
      "approval_receipt must include a non-empty approved_by and reference starlight-intelligence-academy#86.",
      { issue_refs: receipt.issue_refs }
    );
  }

  return receipt;
}

export function evaluateBuilderStanding(snapshot: BuilderEvidenceSnapshot): EvaluatedBuilderStanding {
  const parsed = BuilderEvidenceSnapshotSchema.parse(snapshot);
  let matchedTier: BuilderStandingTierSpec = ACADEMY_BUILDER_STANDING_TIERS[0];

  if (!parsed.arrival_path_completed) {
    return EvaluatedBuilderStandingSchema.parse({
      member_id: parsed.member_id,
      standing_tier: "observer",
      standing_label: "Observer (Arrival Pending)",
      next_tier: "observer",
      missing_for_next_tier: ["Complete 48-hour Arrival Path (#23) and first Field Note"],
      vanity_points_awarded: 0
    });
  }

  for (const candidate of ACADEMY_BUILDER_STANDING_TIERS) {
    const req = candidate.required_evidence;
    const qualifies =
      parsed.arrival_path_completed === req.arrival_path_completed &&
      parsed.shipped_repo_artifacts >= req.min_shipped_repo_artifacts &&
      parsed.red_gates_passed >= req.min_red_gates_passed &&
      parsed.rubric_peer_reviews >= req.min_rubric_peer_reviews &&
      parsed.day7_transfers_verified >= req.min_day7_transfers_verified &&
      parsed.cells_stewarded_or_upstream_prs >= req.min_cells_stewarded_or_upstream_prs;
    if (qualifies) {
      matchedTier = candidate;
    }
  }

  const nextSpec = ACADEMY_BUILDER_STANDING_TIERS.find((tier) => tier.order === matchedTier.order + 1) ?? null;
  const missing: string[] = [];

  if (nextSpec) {
    const req = nextSpec.required_evidence;
    if (parsed.shipped_repo_artifacts < req.min_shipped_repo_artifacts) {
      missing.push(
        `Ship ${req.min_shipped_repo_artifacts - parsed.shipped_repo_artifacts} more verified repo artifact(s)`
      );
    }
    if (parsed.red_gates_passed < req.min_red_gates_passed) {
      missing.push(`Pass ${req.min_red_gates_passed - parsed.red_gates_passed} more non-compensable red gate(s)`);
    }
    if (parsed.rubric_peer_reviews < req.min_rubric_peer_reviews) {
      missing.push(
        `Complete ${req.min_rubric_peer_reviews - parsed.rubric_peer_reviews} more 20-minute rubric peer review(s)`
      );
    }
    if (parsed.day7_transfers_verified < req.min_day7_transfers_verified) {
      missing.push(
        `Verify ${req.min_day7_transfers_verified - parsed.day7_transfers_verified} more Day-7 changed-context transfer(s)`
      );
    }
    if (parsed.cells_stewarded_or_upstream_prs < req.min_cells_stewarded_or_upstream_prs) {
      missing.push("Facilitate 1 Creation Cell week or land 1 reviewed open-source lab/eval improvement");
    }
  }

  return EvaluatedBuilderStandingSchema.parse({
    member_id: parsed.member_id,
    standing_tier: matchedTier.tier,
    standing_label: matchedTier.label,
    next_tier: nextSpec ? nextSpec.tier : null,
    missing_for_next_tier: missing,
    vanity_points_awarded: 0
  });
}

function computeCanonicalPlanDigest(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function buildArrivalChecklist(icpLens: AcademyIcpLens): ArrivalChecklistStep[] {
  const lensMeta = ICP_LENS_BRIEFS[icpLens];
  return [
    {
      step_id: "arrival-01-orientation-and-lens",
      window: "hour_0_to_1",
      space_slug: "start-here-orientation",
      action: `Read the Start Here Welcome & System Map, confirm ${lensMeta.label} track, and review privacy/consent flags.`,
      verification_signal: "Selected primary ICP track and reviewed explicit consent posture (private by default).",
      recovery_path: "If landing popup or space link fails, open /academy/curriculum-atlas directly and reply in Start Here."
    },
    {
      step_id: "arrival-02-unaided-framing",
      window: "hour_1_to_24",
      space_slug: "weekly-red-gate-lab-clinic",
      action: `Complete a 15-minute unassisted framing attempt before opening hints: ${lensMeta.arrival_action}`,
      verification_signal: "Saved local prior_attempt note with timestamped assumption before consulting Socratic hints.",
      recovery_path: "If local Python/Node runtime is unavailable, complete the browser triage packet in SIA /academy/studio."
    },
    {
      step_id: "arrival-03-first-field-note",
      window: "hour_24_to_48",
      space_slug: "start-here-orientation",
      action: "Submit a 5-line Field Note naming target workflow, human approval boundary, measurable kill criterion, and one failure mode.",
      verification_signal: "Structured Field Note posted without confidential employer data or vanity claims.",
      recovery_path: "Use the synthetic 5-line Field Note template in Start Here if unsure what scope is public-safe."
    },
    {
      step_id: "arrival-04-cell-readiness",
      window: "hour_24_to_48",
      space_slug: "architecture-critique-arena",
      action: "Opt into a 3-5 person Creation Cell or async pair slot for Thursday's 20-minute rubric peer review.",
      verification_signal: "Consent flag allowCellMatching=true confirmed or solo async track selected.",
      recovery_path: "Members who keep allowCellMatching=false remain on the solo async verification path with zero penalty."
    }
  ];
}

function buildDraftPosts(
  input: AcademyCohortWeekInput,
  verifiedReceipt: HumanApprovalReceipt,
  canonicalFocus: string
): DraftCirclePostPlan[] {
  const paddedWeek = String(input.week_number).padStart(2, "0");
  const lensMeta = ICP_LENS_BRIEFS[input.icp_lens];
  const missionSummary = input.sia_missions
    .map(
      (mission) =>
        `- **${mission.title}** (\`${mission.mission_id}\`) -> SIA \`${mission.sia_route}\` · AAA \`${mission.aaa_lab_path}\` -> Artifact: *${mission.expected_repo_artifact}*`
    )
    .join("\n");
  const redGateSummary = input.red_gates
    .map(
      (gate) =>
        `- **[NON-COMPENSABLE] ${gate.label}** (\`${gate.gate_id}\` -> \`${gate.refusal_code}\`): verify via \`${gate.verification_command}\``
    )
    .join("\n");

  const posts: DraftCirclePostPlan[] = [
    {
      post_plan_id: `${input.cohort_id}-w${paddedWeek}-post-01-monday-brief`,
      space_slug: "start-here-orientation",
      day: "monday",
      title: `[DRAFT · Week ${paddedWeek}] ${input.title} — Productive Failure Brief (${lensMeta.label})`,
      status: "draft",
      dry_run: true,
      overwrite_existing_draft: false,
      publish_gate: "human_required",
      issue_gate_refs: verifiedReceipt.issue_refs,
      icp_framing: `${lensMeta.label}: ${lensMeta.focus}`,
      markdown_body: [
        `> **Draft-only staging notice:** Prepared under \`${verifiedReceipt.receipt_id}\` (${verifiedReceipt.issue_refs.join(", ")}). Do not overwrite existing Circle drafts (${input.execution_mode.protected_circle_draft_ids.join(", ")}); human operator reviews before publication.`,
        "",
        `### Week ${paddedWeek} North Star — ${canonicalFocus}`,
        input.epistemic_thesis,
        "",
        "### Step 1 (15 minutes, unaided): Diagnose before reading hints",
        "Write down your initial failure hypothesis and human-gate boundary before opening `/hint` or reference patterns.",
        "",
        "### Mapped SIA Missions & Open-Source AAA Labs",
        missionSummary,
        "",
        "### Non-Compensable Red Gates",
        redGateSummary
      ].join("\n"),
      expected_member_output: "Reply with your 3-line UnaidedAttempt hypothesis and committed weekly artifact path."
    },
    {
      post_plan_id: `${input.cohort_id}-w${paddedWeek}-post-02-red-gate-clinic`,
      space_slug: "weekly-red-gate-lab-clinic",
      day: "wednesday",
      title: `[DRAFT · Week ${paddedWeek}] Offline Lab & Non-Compensable Red-Gate Clinic`,
      status: "draft",
      dry_run: true,
      overwrite_existing_draft: false,
      publish_gate: "human_required",
      issue_gate_refs: verifiedReceipt.issue_refs,
      icp_framing: `${lensMeta.label}: ${lensMeta.focus}`,
      markdown_body: [
        `### Week ${paddedWeek} Lab Verification Thread`,
        "Run the offline verification command for your selected mission and paste only synthetic/public-safe terminal output.",
        "",
        redGateSummary,
        "",
        "**Rule:** High aggregate rubric scores never compensate for a failing trust-boundary, citation, or human-approval gate."
      ].join("\n"),
      expected_member_output: "Deterministic offline test summary + one assumption changed since Monday's unaided attempt."
    },
    {
      post_plan_id: `${input.cohort_id}-w${paddedWeek}-post-03-worked-run-trace`,
      space_slug: "worked-run-trace-exchange",
      day: "thursday",
      title: `[DRAFT · Week ${paddedWeek}] Forensic Worked-Run Trace Dissection`,
      status: "draft",
      dry_run: true,
      overwrite_existing_draft: false,
      publish_gate: "human_required",
      issue_gate_refs: verifiedReceipt.issue_refs,
      icp_framing: `${lensMeta.label}: ${lensMeta.focus}`,
      markdown_body: [
        `### Forensic Trace Comparison — Week ${paddedWeek}`,
        "Compare a failing gate trace against your patched implementation:",
        "1. Which untrusted input or missing boundary caused the incident?",
        "2. Which exact check now fails closed before external side effects occur?",
        "3. What rollback step restores the prior verified state?"
      ].join("\n"),
      expected_member_output: "Annotated trace snippet + named recovery action."
    },
    {
      post_plan_id: `${input.cohort_id}-w${paddedWeek}-post-04-peer-critique`,
      space_slug: "architecture-critique-arena",
      day: "thursday",
      title: `[DRAFT · Week ${paddedWeek}] 20-Minute Async Peer Review Thread`,
      status: "draft",
      dry_run: true,
      overwrite_existing_draft: false,
      publish_gate: "human_required",
      issue_gate_refs: verifiedReceipt.issue_refs,
      icp_framing: `${lensMeta.label}: ${lensMeta.focus}`,
      markdown_body: [
        "### 20-Minute Structured Peer Review Protocol",
        "- **Minutes 0–5:** Restate your partner's workflow boundary and `killCriterion` in your own words.",
        "- **Minutes 5–12:** Stress-test one non-compensable red gate (injection, uncited claim, unguarded send/spend, or unbounded loop).",
        "- **Minutes 12–17:** Verify concrete artifact/test evidence rather than prose claims.",
        "- **Minutes 17–20:** Propose one bounded test case and one clear next commitment."
      ].join("\n"),
      expected_member_output: "Completed 4-part peer critique note referencing concrete repository or studio evidence."
    },
    {
      post_plan_id: `${input.cohort_id}-w${paddedWeek}-post-05-friday-showcase`,
      space_slug: "gencreator-studio-showcase",
      day: "friday",
      title: `[DRAFT · Week ${paddedWeek}] Shipped Proof, Visual Plates & Day-7 Transfer Lock`,
      status: "draft",
      dry_run: true,
      overwrite_existing_draft: false,
      publish_gate: "human_required",
      issue_gate_refs: verifiedReceipt.issue_refs,
      icp_framing: `${lensMeta.label}: ${lensMeta.focus}`,
      markdown_body: [
        `### Week ${paddedWeek} Friday Closure`,
        "Share your shipped repository artifact, SVG system diagram, or Remotion walkthrough manifest alongside your red-gate verification output.",
        "",
        "Standing advances strictly through verified artifacts, peer critiques, and Day-7 changed-context transfers—never message volume or streaks."
      ].join("\n"),
      expected_member_output: "Artifact link + red-gate pass output + scheduled Day-7 transfer commitment."
    }
  ];

  return posts.map((post) => DraftCirclePostPlanSchema.parse(post));
}

export function compileAcademyCircleHandoff(rawInput: AcademyCohortWeekInput): AcademyCircleHandoffPlan {
  const serializedRaw = JSON.stringify(rawInput);
  const input = AcademyCohortWeekInputSchema.parse(rawInput);

  assertNoSecretsOrPrivateUrls(serializedRaw, input.execution_mode.api_token);
  const verifiedReceipt = assertFailClosedExecutionPosture(input.execution_mode, input.approval_receipt);

  const canonicalWeek = CanonicalCurriculumWeekMap[input.week_number];
  if (input.act && input.act !== canonicalWeek.act) {
    throw new AcademyHandoffSafetyError(
      "ACT_WEEK_MISMATCH",
      `Week ${input.week_number} belongs to "${canonicalWeek.act}", but received "${input.act}".`,
      { week_number: input.week_number, expected_act: canonicalWeek.act, received_act: input.act }
    );
  }

  const resolvedAct = input.act ?? canonicalWeek.act;
  const paddedWeek = String(input.week_number).padStart(2, "0");
  const lensMeta = ICP_LENS_BRIEFS[input.icp_lens];
  const perturbationPrompt = input.day7_transfer_override ?? canonicalWeek.default_day7_perturbation;

  const draftPosts = buildDraftPosts(input, verifiedReceipt, canonicalWeek.canonical_focus);
  const activeSlugs = new Set<CircleCampusSpaceSlug>([
    ...draftPosts.map((post) => post.space_slug),
    "alumni-builders-office-hours"
  ]);

  const spaces = ACADEMY_CIRCLE_SPACES.map((space) => ({
    slug: space.slug,
    title: space.title,
    space_group: space.space_group,
    access_tier: space.access_tier,
    active_this_week: activeSlugs.has(space.slug),
    reuses_existing_space_slot: true as const,
    sia_surface_routes: [...space.sia_surface_routes],
    aaa_lab_surfaces: [...space.aaa_lab_surfaces],
    primary_ritual: space.primary_ritual
  }));

  const draftEvents: DraftCircleEventPlan[] = [
    DraftCircleEventPlanSchema.parse({
      event_plan_id: `${input.cohort_id}-w${paddedWeek}-event-01-lab-clinic`,
      space_slug: "weekly-red-gate-lab-clinic",
      cadence_slot: "wednesday_lab_clinic",
      title: `[DRAFT · Week ${paddedWeek}] Red-Gate Lab Clinic — ${input.title}`,
      duration_minutes: 60,
      status: "draft",
      dry_run: true,
      external_calendar_send: false,
      approval_gate: "human_required",
      agenda: [
        "10m: Compare Monday UnaidedAttempt failure hypotheses without blame",
        "30m: Live fault-injection and non-compensable red-gate walkthrough",
        "20m: Unblock Creation Cell edge cases and verify local test commands"
      ],
      exit_artifact: "Green offline red-gate test run and updated boundary note"
    }),
    DraftCircleEventPlanSchema.parse({
      event_plan_id: `${input.cohort_id}-w${paddedWeek}-event-02-peer-window`,
      space_slug: "architecture-critique-arena",
      cadence_slot: "thursday_async_peer_window",
      title: `[DRAFT · Week ${paddedWeek}] 20-Minute Async Peer Review Window`,
      duration_minutes: 20,
      status: "draft",
      dry_run: true,
      external_calendar_send: false,
      approval_gate: "human_required",
      agenda: [
        "5m: Restate partner workflow contract and measurable kill criterion",
        "7m: Probe trust-boundary or failure-mode assumption",
        "5m: Inspect concrete test/trace output",
        "3m: Record one bounded next commitment"
      ],
      exit_artifact: "Structured 4-block rubric peer critique"
    }),
    DraftCircleEventPlanSchema.parse({
      event_plan_id: `${input.cohort_id}-w${paddedWeek}-event-03-day7-transfer`,
      space_slug: "alumni-builders-office-hours",
      cadence_slot: "day7_transfer_check",
      title: `[DRAFT · Week ${paddedWeek} +7d] Changed-Context Transfer Verification`,
      duration_minutes: 25,
      status: "draft",
      dry_run: true,
      external_calendar_send: false,
      approval_gate: "human_required",
      agenda: [
        "15m unaided: Solve changed-context constraint perturbation without AI answer-dumping",
        "10m verification: Re-run non-compensable red gates and attach diff for receipt revalidation"
      ],
      exit_artifact: "Verified Day-7 transfer diff revalidating starlight.capability_receipt.v1"
    })
  ];

  const creationCellRunSheet: WeeklyRunSheet | undefined =
    input.members.length > 0
      ? generateWeeklyRunSheet({
          week_id: input.week_id,
          theme: input.title,
          challenge_type: "ai_companion",
          created_by: "quest_designer",
          members: input.members as CommunityMemberProfile[]
        })
      : undefined;

  const standingEvaluations = input.standing_snapshots.map((snapshot) => evaluateBuilderStanding(snapshot));

  const gates: ActionGate[] = [
    classifyCommunityAction("public_artifact_publish"),
    classifyCommunityAction("calendar_event_with_external_attendees"),
    classifyCommunityAction("external_invite_send"),
    classifyCommunityAction("leaderboard_publication"),
    ActionGateSchema.parse({
      action_kind: "circle_draft_handoff_sia_86",
      tier: "human_gate",
      reason:
        "Circle Welcome, System Map, Field Notes, and weekly lab posts remain draft-only until Frank reviews and publishes (starlight-intelligence-academy#86, starlight-communities#23).",
      required_approver: "human_operator"
    })
  ];

  const digestSeed = {
    schema_version: ACADEMY_HANDOFF_SCHEMA_VERSION,
    cohort_id: input.cohort_id,
    week_number: input.week_number,
    week_id: input.week_id,
    act: resolvedAct,
    title: input.title,
    epistemic_thesis: input.epistemic_thesis,
    icp_lens: input.icp_lens,
    secondary_icp_lenses: [...input.secondary_icp_lenses].sort(),
    sia_missions: input.sia_missions,
    red_gates: input.red_gates,
    perturbationPrompt,
    receipt_id: verifiedReceipt.receipt_id
  };

  return AcademyCircleHandoffPlanSchema.parse({
    schema_version: ACADEMY_HANDOFF_SCHEMA_VERSION,
    plan_id: `handoff-${input.cohort_id}-w${paddedWeek}-${input.icp_lens}`,
    plan_digest: computeCanonicalPlanDigest(digestSeed),
    safety_posture: {
      status: "draft",
      dry_run: true,
      live_mutations_blocked: true,
      overwrite_existing_circle_drafts: false,
      protected_circle_draft_ids: input.execution_mode.protected_circle_draft_ids,
      circle_space_budget: {
        community_space_cap: 30,
        campus_spaces_mapped: 6,
        reuses_existing_slots: true,
        requires_plan_upgrade: false
      },
      verified_approval_receipt: verifiedReceipt
    },
    cohort_week: {
      cohort_id: input.cohort_id,
      week_number: input.week_number,
      week_id: input.week_id,
      act: resolvedAct,
      canonical_focus: canonicalWeek.canonical_focus,
      title: input.title,
      epistemic_thesis: input.epistemic_thesis,
      icp_lens: input.icp_lens,
      icp_lens_brief: `${lensMeta.label} — ${lensMeta.focus}`,
      secondary_icp_lenses: input.secondary_icp_lenses,
      sia_missions: input.sia_missions,
      red_gates: input.red_gates
    },
    spaces,
    draft_posts: draftPosts,
    draft_events: draftEvents,
    arrival_checklist_48h: buildArrivalChecklist(input.icp_lens),
    peer_review_protocol: {
      duration_minutes: 20,
      format: "async_structured_rubric",
      blocks: [
        {
          minute_range: "00-05",
          focus: "Restate workflow boundary, accountable owner, and measurable kill criterion.",
          required_output: "Plain-language restatement confirming contract legibility."
        },
        {
          minute_range: "05-12",
          focus: "Stress-test non-compensable red gates (trust firewall, citation accuracy, human send/spend gate).",
          required_output: "At least one concrete boundary probe or failure scenario."
        },
        {
          minute_range: "12-17",
          focus: "Verify repository test output, forensic trace diff, or studio mission evidence.",
          required_output: "Evidence check citing exact file, test case, or trace line."
        },
        {
          minute_range: "17-20",
          focus: "Close with helpful recognition and one bounded next engineering move.",
          required_output: "One suggested regression test and one clear next commitment."
        }
      ],
      anti_shame_guardrail:
        "Critique inspects boundaries, failure modes, and tests—never personal velocity, message frequency, or public ranking."
    },
    day7_transfer_ritual: {
      scheduled_offset_days: 7,
      assistance_policy: "unaided_first_15m",
      perturbation_prompt: perturbationPrompt,
      revalidates_contract: "starlight.capability_receipt.v1",
      required_red_gate_ids: input.red_gates.map((gate) => gate.gate_id)
    },
    standing_evaluations: standingEvaluations,
    gates,
    creation_cell_run_sheet: creationCellRunSheet
  });
}
