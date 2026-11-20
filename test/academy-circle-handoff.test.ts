import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import cohortWeekExample from "../examples/academy-cohort-week.json" with { type: "json" };
import {
  ACADEMY_BUILDER_STANDING_TIERS,
  ACADEMY_CIRCLE_SPACES,
  AcademyHandoffSafetyError,
  compileAcademyCircleHandoff,
  compileCohortCalendarIcs,
  evaluateBuilderStanding,
  PRIVATE_ESTATE_REPO_SLUGS,
  type AcademyCohortWeekInput,
  type AcademyIcpLens
} from "../src/index.js";

const execFileAsync = promisify(execFile);

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function cloneExample(): AcademyCohortWeekInput {
  return structuredClone(cohortWeekExample) as unknown as AcademyCohortWeekInput;
}

describe("compileAcademyCircleHandoff", () => {
  it("compiles examples/academy-cohort-week.json into a deterministic draft-only Circle campus plan", () => {
    const first = compileAcademyCircleHandoff(cloneExample());
    const second = compileAcademyCircleHandoff(cloneExample());

    expect(first.schema_version).toBe("starlight.academy_circle_handoff.v1");
    expect(first.plan_digest).toBe(second.plan_digest);
    expect(first.safety_posture.status).toBe("draft");
    expect(first.safety_posture.dry_run).toBe(true);
    expect(first.safety_posture.live_mutations_blocked).toBe(true);
    expect(first.safety_posture.overwrite_existing_circle_drafts).toBe(false);
    expect(first.safety_posture.protected_circle_draft_ids).toEqual(["37119809", "37119811"]);
    expect(first.safety_posture.circle_space_budget.community_space_cap).toBe(30);
    expect(first.safety_posture.circle_space_budget.campus_spaces_mapped).toBe(6);

    expect(first.spaces).toHaveLength(6);
    expect(first.spaces.map((space) => space.slug)).toEqual(ACADEMY_CIRCLE_SPACES.map((space) => space.slug));
    expect(first.draft_posts.every((post) => post.status === "draft" && post.dry_run && !post.overwrite_existing_draft)).toBe(
      true
    );
    expect(
      first.draft_events.every((event) => event.status === "draft" && event.dry_run && !event.external_calendar_send)
    ).toBe(true);

    expect(first.arrival_checklist_48h).toHaveLength(4);
    expect(first.peer_review_protocol.duration_minutes).toBe(20);
    expect(first.peer_review_protocol.blocks).toHaveLength(4);
    expect(first.day7_transfer_ritual.scheduled_offset_days).toBe(7);
    expect(first.day7_transfer_ritual.revalidates_contract).toBe("starlight.capability_receipt.v1");

    expect(first.creation_cell_run_sheet?.cells.length).toBe(1);
    expect(first.standing_evaluations.map((item) => item.standing_tier)).toEqual([
      "red_gate_verifier",
      "scoped_builder",
      "verified_architect"
    ]);
  });

  it("supports all 4 ICP lenses and all 12 curriculum weeks across Acts I, II, and III", () => {
    const lenses: AcademyIcpLens[] = [
      "enterprise-architect",
      "production-builder",
      "technical-creator",
      "workflow-operator"
    ];

    const digests = new Set<string>();
    for (const lens of lenses) {
      const input = cloneExample();
      input.icp_lens = lens;
      const plan = compileAcademyCircleHandoff(input);
      expect(plan.cohort_week.icp_lens).toBe(lens);
      digests.add(plan.plan_digest);
    }
    expect(digests.size).toBe(4);

    for (let week = 1; week <= 12; week += 1) {
      const input = cloneExample();
      input.week_number = week;
      delete input.act;
      const plan = compileAcademyCircleHandoff(input);
      expect(plan.cohort_week.week_number).toBe(week);
      if (week <= 4) expect(plan.cohort_week.act).toBe("act_1_foundations");
      else if (week <= 8) expect(plan.cohort_week.act).toBe("act_2_governance_evals");
      else expect(plan.cohort_week.act).toBe("act_3_studio_coe");
    }
  });

  it("fails closed when approval_receipt is missing or omits starlight-intelligence-academy#86", () => {
    const missingReceipt = cloneExample();
    delete missingReceipt.approval_receipt;

    expect(() => compileAcademyCircleHandoff(missingReceipt)).toThrowError(AcademyHandoffSafetyError);
    try {
      compileAcademyCircleHandoff(missingReceipt);
    } catch (error) {
      expect((error as AcademyHandoffSafetyError).code).toBe("MISSING_APPROVAL_RECEIPT");
    }

    const wrongIssueReceipt = cloneExample();
    wrongIssueReceipt.approval_receipt = {
      receipt_id: "rcpt-missing-86",
      issue_refs: ["starlight-communities#23"],
      approved_by: "steward",
      approved_at: "2026-11-14T10:00:00.000Z",
      approved_scope: "draft_plan_only"
    };

    try {
      compileAcademyCircleHandoff(wrongIssueReceipt);
      expect.unreachable("Should have thrown INVALID_APPROVAL_RECEIPT");
    } catch (error) {
      expect((error as AcademyHandoffSafetyError).code).toBe("INVALID_APPROVAL_RECEIPT");
    }
  });

  it("fails closed on non-draft status, dry_run=false, live_http_mutation=true, or Circle draft overwrite", () => {
    const publishAttempt = cloneExample();
    publishAttempt.execution_mode.desired_status = "published";
    expect(() => compileAcademyCircleHandoff(publishAttempt)).toThrow(/NON_DRAFT_STATUS_BLOCKED/);

    const nonDryRunAttempt = cloneExample();
    nonDryRunAttempt.execution_mode.dry_run = false;
    expect(() => compileAcademyCircleHandoff(nonDryRunAttempt)).toThrow(/DRY_RUN_REQUIRED/);

    const liveHttpAttempt = cloneExample();
    liveHttpAttempt.execution_mode.live_http_mutation = true;
    expect(() => compileAcademyCircleHandoff(liveHttpAttempt)).toThrow(/LIVE_MUTATION_BLOCKED/);

    const overwriteAttempt = cloneExample();
    overwriteAttempt.execution_mode.overwrite_existing_circle_drafts = true;
    expect(() => compileAcademyCircleHandoff(overwriteAttempt)).toThrow(/CIRCLE_DRAFT_OVERWRITE_BLOCKED/);
  });

  it("fails closed on inline credentials, bearer tokens, private GitHub URLs, and week/act mismatches", () => {
    const tokenAttempt = cloneExample();
    tokenAttempt.execution_mode.api_token = "circle_live_secret_token_value";
    expect(() => compileAcademyCircleHandoff(tokenAttempt)).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    const bearerInThesis = cloneExample();
    bearerInThesis.epistemic_thesis = "Send Authorization: Bearer abcdef1234567890token to Circle";
    expect(() => compileAcademyCircleHandoff(bearerInThesis)).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    const quotedCircleToken = cloneExample();
    quotedCircleToken.epistemic_thesis = 'Do not leak circle_api_token="synthetic_token_123456" into drafts';
    expect(() => compileAcademyCircleHandoff(quotedCircleToken)).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    const tabbedBearerToken = cloneExample();
    tabbedBearerToken.day7_transfer_override = "Header Authorization: Bearer\tabcdef1234567890token";
    expect(() => compileAcademyCircleHandoff(tabbedBearerToken)).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    const privateRepoAttempt = cloneExample();
    privateRepoAttempt.day7_transfer_override = "See https://github.com/frankxai/agentic-ops-hub/blob/main/ops.md";
    expect(() => compileAcademyCircleHandoff(privateRepoAttempt)).toThrow(/PRIVATE_REPO_URL_BLOCKED/);

    const privateSiaRepoAttempt = cloneExample();
    privateSiaRepoAttempt.day7_transfer_override =
      "See https://github.com/frankxai/starlight-intelligence-academy/issues/86";
    expect(() => compileAcademyCircleHandoff(privateSiaRepoAttempt)).toThrow(/PRIVATE_REPO_URL_BLOCKED/);

    const mismatchedAct = cloneExample();
    mismatchedAct.week_number = 2;
    mismatchedAct.act = "act_3_studio_coe";
    expect(() => compileAcademyCircleHandoff(mismatchedAct)).toThrow(/ACT_WEEK_MISMATCH/);
  });

  it("evaluates all 5 Builder Standing tiers strictly from repo/eval artifacts with zero vanity points", () => {
    expect(ACADEMY_BUILDER_STANDING_TIERS).toHaveLength(5);

    const pending = evaluateBuilderStanding({
      member_id: "m0",
      arrival_path_completed: false,
      shipped_repo_artifacts: 5,
      red_gates_passed: 5,
      rubric_peer_reviews: 5,
      day7_transfers_verified: 5,
      cells_stewarded_or_upstream_prs: 2
    });
    expect(pending.standing_tier).toBe("observer");
    expect(pending.next_tier).toBe("observer");
    expect(pending.vanity_points_awarded).toBe(0);

    const steward = evaluateBuilderStanding({
      member_id: "m5",
      arrival_path_completed: true,
      shipped_repo_artifacts: 8,
      red_gates_passed: 8,
      rubric_peer_reviews: 6,
      day7_transfers_verified: 3,
      cells_stewarded_or_upstream_prs: 1
    });
    expect(steward.standing_tier).toBe("cell_steward");
    expect(steward.next_tier).toBeNull();
    expect(steward.missing_for_next_tier).toEqual([]);
    expect(steward.vanity_points_awarded).toBe(0);
  });

  it("keeps modules/academy-circle-campus blueprint and #86 drafts aligned and public-safe", async () => {
    const topologyRaw = await readFile(
      join(repoRoot, "modules/academy-circle-campus/campus-topology.json"),
      "utf8"
    );
    const topology = JSON.parse(topologyRaw) as {
      spaces: Array<{ slug: string }>;
      standing_tiers: Array<{ tier: string }>;
    };
    expect(topology.spaces).toHaveLength(6);
    expect(topology.standing_tiers).toHaveLength(5);

    const draftFiles = [
      "modules/academy-circle-campus/drafts/01-welcome-announcement.md",
      "modules/academy-circle-campus/drafts/02-visual-system-map-post.md",
      "modules/academy-circle-campus/drafts/03-week-01-field-notes.md",
      "modules/academy-circle-campus/drafts/04-icp-onboarding-tracks.md",
      "modules/academy-circle-campus/drafts/05-capstone-defense-protocol.md"
    ];

    const privateUrlPattern =
      /github\.com\/frankxai\/(starlight-intelligence-academy|starlight-command|agentic-ops-hub|starlight-private-memory|starlight-agent-config|affiliate-agent-skills|claude-code-config)\b/i;

    for (const relativePath of draftFiles) {
      const content = await readFile(join(repoRoot, relativePath), "utf8");
      expect(content).toContain("DRAFT FOR HUMAN REVIEW");
      expect(content).not.toMatch(privateUrlPattern);
    }

    for (const frontmatterDraft of [
      "modules/academy-circle-campus/drafts/04-icp-onboarding-tracks.md",
      "modules/academy-circle-campus/drafts/05-capstone-defense-protocol.md"
    ]) {
      const content = await readFile(join(repoRoot, frontmatterDraft), "utf8");
      expect(/^---\r?\n/.test(content)).toBe(true);
      expect(content).toContain("publish_status: draft_do_not_auto_post");
      for (const slug of PRIVATE_ESTATE_REPO_SLUGS) {
        expect(content.toLowerCase()).not.toContain(slug.toLowerCase());
      }
    }

    const moduleDocs = [
      "modules/academy-circle-campus/README.md",
      "modules/academy-circle-campus/RITUALS_AND_STANDING.md",
      "modules/academy-circle-campus/campus-topology.json"
    ];

    for (const relativePath of moduleDocs) {
      const content = await readFile(join(repoRoot, relativePath), "utf8");
      expect(content).not.toMatch(privateUrlPattern);
    }
  });
});

describe("compileCohortCalendarIcs", () => {
  it("generates deterministic RFC 5545 .ics with CRLF line endings and 37 events for a 12-week cohort", () => {
    const first = compileCohortCalendarIcs({
      cohort_id: "architect-fall-2026",
      start_date: "2026-11-16",
      weeks: 12,
      icp_lens: "production-builder"
    });
    const second = compileCohortCalendarIcs({
      cohort_id: "architect-fall-2026",
      start_date: "2026-11-16",
      weeks: 12,
      icp_lens: "production-builder"
    });

    expect(first.schema_version).toBe("starlight.academy_cohort_calendar.v1");
    expect(first.calendar_digest).toBe(second.calendar_digest);
    expect(first.ics).toBe(second.ics);
    expect(first.event_count).toBe(37);
    expect(first.events).toHaveLength(37);

    // Strictly CRLF line endings (no bare LF)
    expect(first.ics.includes("\r\n")).toBe(true);
    expect(first.ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(first.ics.replace(/\r\n/g, "").includes("\n")).toBe(false);

    const lines = first.ics.split("\r\n").filter((line) => line.length > 0);
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines[lines.length - 1]).toBe("END:VCALENDAR");
    expect(lines).toContain("VERSION:2.0");

    const beginEventCount = lines.filter((line) => line === "BEGIN:VEVENT").length;
    const endEventCount = lines.filter((line) => line === "END:VEVENT").length;
    expect(beginEventCount).toBe(37);
    expect(endEventCount).toBe(37);

    for (const requiredPrefix of ["UID:", "DTSTAMP:", "DTSTART:", "DTEND:", "SUMMARY:", "DESCRIPTION:"]) {
      const count = lines.filter((line) => line.startsWith(requiredPrefix)).length;
      expect(count).toBe(37);
    }

    // Verify exact weekly rituals + Week 12 Capstone Defense Panel
    expect(first.events.filter((e) => e.ritual_kind === "architecture_clinic")).toHaveLength(12);
    expect(first.events.filter((e) => e.ritual_kind === "async_artifact_critique")).toHaveLength(12);
    expect(first.events.filter((e) => e.ritual_kind === "ship_and_verify_friday")).toHaveLength(12);
    expect(first.events.filter((e) => e.ritual_kind === "capstone_defense_panel")).toHaveLength(1);

    expect(first.ics).toContain("Architecture Clinic");
    expect(first.ics).toContain("Async Artifact Critique");
    expect(first.ics).toContain("Ship & Verify Friday");
    expect(first.ics).toContain("Capstone Defense Panel");

    // Partial cohort window (< 12 weeks) omits Week 12 Capstone Defense Panel
    const fourWeek = compileCohortCalendarIcs({
      cohort_id: "architect-sprint",
      start_date: "2026-11-16",
      weeks: 4
    });
    expect(fourWeek.event_count).toBe(12);
    expect(fourWeek.events.some((e) => e.ritual_kind === "capstone_defense_panel")).toBe(false);
  });

  it("rejects PRIVATE_ESTATE_REPO_SLUGS, private URLs, private domains, and inline credentials", () => {
    for (const privateSlug of PRIVATE_ESTATE_REPO_SLUGS) {
      expect(() =>
        compileCohortCalendarIcs({
          cohort_id: "public-cohort-01",
          start_date: "2026-11-16",
          notes: `Internal reference to ${privateSlug} roadmap`
        })
      ).toThrowError(AcademyHandoffSafetyError);

      try {
        compileCohortCalendarIcs({
          cohort_id: "public-cohort-01",
          start_date: "2026-11-16",
          cohort_label: `https://github.com/frankxai/${privateSlug}`
        });
        expect.unreachable(`Expected PRIVATE_REPO_URL_BLOCKED for ${privateSlug}`);
      } catch (error) {
        expect((error as AcademyHandoffSafetyError).code).toBe("PRIVATE_REPO_URL_BLOCKED");
      }
    }

    const privateDomain = ["starlightintelligence", "ai"].join(".");
    expect(() =>
      compileCohortCalendarIcs({
        cohort_id: "public-cohort-01",
        start_date: "2026-11-16",
        organizer_domain: privateDomain
      })
    ).toThrow(/PRIVATE_REPO_URL_BLOCKED/);

    expect(() =>
      compileCohortCalendarIcs({
        cohort_id: "public-cohort-01",
        start_date: "2026-11-16",
        notes: "Authorization: Bearer secretToken1234567890"
      })
    ).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    expect(() =>
      compileCohortCalendarIcs({
        cohort_id: "public-cohort-01",
        start_date: "2026-11-16",
        notes: 'Use circle_api_token="synthetic_token_123456"'
      })
    ).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    expect(() =>
      compileCohortCalendarIcs({
        cohort_id: "public-cohort-01",
        start_date: "2026-11-16",
        notes: "Authorization: Bearer\tsecretToken1234567890"
      })
    ).toThrow(/INLINE_CREDENTIAL_BLOCKED/);

    try {
      compileCohortCalendarIcs({
        cohort_id: "tuesday-cohort",
        start_date: "2026-11-17"
      });
      expect.unreachable("Expected NON_MONDAY_START_DATE for Tuesday 2026-11-17");
    } catch (error) {
      expect((error as AcademyHandoffSafetyError).code).toBe("NON_MONDAY_START_DATE");
    }
  });

  it("supports the academy-calendar CLI subcommand for stdout ICS/JSON and --out file export", async () => {
    const cliEntry = join(repoRoot, "src/cli.ts");
    const tsxBin = join(repoRoot, "node_modules/tsx/dist/cli.mjs");

    const { stdout: icsStdout } = await execFileAsync(process.execPath, [
      tsxBin,
      cliEntry,
      "academy-calendar",
      "--cohort",
      "cli-cohort-2026",
      "--start",
      "2026-11-16",
      "--weeks",
      "12",
      "--ics"
    ]);
    expect(icsStdout.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(icsStdout.endsWith("END:VCALENDAR\r\n")).toBe(true);

    const tempDir = await mkdtemp(join(tmpdir(), "starlight-cal-"));
    try {
      const outIcsPath = join(tempDir, "cohort.ics");
      const { stdout: receiptJson } = await execFileAsync(process.execPath, [
        tsxBin,
        cliEntry,
        "academy-calendar",
        "--cohort",
        "cli-cohort-2026",
        "--start",
        "2026-11-16",
        "--weeks",
        "12",
        "--out",
        outIcsPath
      ]);
      const receipt = JSON.parse(receiptJson) as { event_count: number; format: string };
      expect(receipt.event_count).toBe(37);
      expect(receipt.format).toBe("ics");

      const writtenIcs = await readFile(outIcsPath, "utf8");
      expect(writtenIcs).toBe(icsStdout);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
