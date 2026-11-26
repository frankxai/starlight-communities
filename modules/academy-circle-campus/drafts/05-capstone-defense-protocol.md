---
draft_id: circle-campus-05-capstone-defense-protocol
target_space: alumni-builders-office-hours
publish_status: draft_do_not_auto_post
dry_run: true
overwrite_existing_circle_drafts: false
issue_gates:
  - starlight-communities#23
  - "#86"
---

# [DRAFT FOR HUMAN REVIEW — DO NOT AUTO-PUBLISH] Week 12 Capstone Defense Panel — Architecture & Rollback Protocol

> **Governance metadata (`starlight-communities#23` & `#86`)**
> - **Status:** `draft` (`publish_status: draft_do_not_auto_post`, `dry_run: true`)
> - **Target Circle space:** `Alumni Builders & Office Hours` (`alumni-builders-office-hours`)
> - **Protected Circle draft IDs:** Do **not** overwrite existing Circle drafts `37119809` or `37119811` without Frank's explicit review and approval.

---

Week 12 closes the 3-act curriculum with an engineering defense modeled on real production readiness reviews—grounded in running offline tests, explicit refusal codes, and calm rollback execution rather than slide decks.

Builders may complete the Capstone Defense Panel either in the **scheduled 90-minute Friday cohort clinic** (`17:30–19:00 UTC`) or via the **recorded async defense packet** with zero standing penalty.

## Pre-defense admission checklist (due 48 hours prior)

Before entering the panel, confirm all four artifacts are committed in a public-safe or synthetic repository layout:

1. **System Constitution & Boundary ADR (`AGENT_SYSTEM_CONSTITUTION.md`):** Explicitly separates `T0/T1` operator rules from untrusted `T3` inputs and keeps spend, pricing, credentials, and external sends behind named human gates.
2. **Deterministic Eval Admission Suite (`cases.jsonl` + offline runner):** Verifies golden grounded cases, empty-evidence human fallbacks, and indirect prompt-injection probes under non-compensable thresholds (`p95 <= 4200ms`, `cost <= $0.05`, `safety == 100%`).
3. **Forensic Incident & Rollback Runbook:** Documents one reproduced failure trace, the exact check that now fails closed (`Maker != Checker`), a numeric `killCriterion`, and the command sequence that restores the prior verified state.
4. **Verified Day-7 Transfer History:** At least two completed Day-7 changed-context perturbations solved unaided during the first 15 minutes.

## 30-minute defense walkthrough per builder

Each defense slot follows four timed blocks:

- **Minutes 00–07 — Boundary Frame & Artifact Walkthrough:** State the user job, workflow triage verdict, accountable human owner, and run the offline test command live (or walk through the deterministic execution receipt).
- **Minutes 07–17 — Live Perturbation Probe (Unaided First):** Reviewers introduce one bounded constraint shift—such as primary model gateway degradation, a stricter regional PII boundary, or a rogue directive inside a retrieved vendor addendum. Walk through what breaks, which gate catches it, and what diff resolves it before consulting any AI assistant.
- **Minutes 17–25 — Non-Compensable Red-Gate & Rollback Audit:** Inspect exact refusal behavior when a single safety check fails alongside high aggregate fluency scores, then verify the documented rollback procedure.
- **Minutes 25–30 — Ratification or Bounded Revision:**
  - **`ADMITTED`:** Ratifies digest-bound `starlight.capability_receipt.v1` standing and unlocks **Verified Systems Architect** (`verified_architect`) and **Cell Steward** (`cell_steward`) eligibility.
  - **`REVISE_WITH_BOUNDED_DIFF`:** Names the exact missing test case or boundary guard so you can re-verify asynchronously within seven days—critique inspects system boundaries and tests, never personal speed or rank.

## Submission template for Week 12 candidates

Reply to this thread (public-safe / synthetic scope only) to lock your defense slot:

```text
1. Cohort & track lens:
2. Defense mode: [Friday Cohort Panel (17:30 UTC) | Async Recorded Packet]
3. Public-safe artifact & offline test command:
4. Non-compensable red gates enforced:
5. Rollback command & numeric killCriterion:
```

Reference labs and worked-run fixtures remain open at [AI Architect Academy](https://github.com/frankxai/ai-architect-academy) and [Starlight Intelligence Academy](https://starlightintelligence.academy/academy).
