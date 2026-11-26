---
draft_id: circle-campus-04-icp-onboarding-tracks
target_space: start-here-orientation
publish_status: draft_do_not_auto_post
dry_run: true
overwrite_existing_circle_drafts: false
issue_gates:
  - starlight-communities#23
  - "#86"
---

# [DRAFT FOR HUMAN REVIEW — DO NOT AUTO-PUBLISH] Choose Your Builder Track: Four Lenses Through the 12-Week Campus

> **Governance metadata (`starlight-communities#23` & `#86`)**
> - **Status:** `draft` (`publish_status: draft_do_not_auto_post`, `dry_run: true`)
> - **Target Circle space:** `Start Here / Orientation` (`start-here-orientation`)
> - **Protected Circle draft IDs:** Do **not** overwrite existing Circle drafts `37119809` or `37119811` without Frank's explicit review and approval.

---

Every builder arrives with a different daily responsibility—and all four tracks test against the same engineering invariants: quarantined trust boundaries, deterministic verification, and named human approval gates.

During your first 48 hours, pick **one primary lens** so your weekly labs, 20-minute Thursday peer critiques, and Creation Cell matches stay focused on work you can immediately carry into production.

## 1. Enterprise Systems Architect (`enterprise-architect`)

- **Who this fits:** Staff/principal engineers, security leads, and platform architects governing multi-team AI deployments.
- **What you stress-test:** `T0/T1` constitution pinning vs. untrusted `T3` retrieved data, VPC and regional data-residency boundaries, ADR trade-off records, and multi-provider gateway failover.
- **Week 1 proof artifact:** `00-frame.md` naming your workflow boundary, accountable human approver, rollback path, and numeric `killCriterion`.
- **Paired surfaces:** Interactive Atlas at [Starlight Intelligence Academy](https://starlightintelligence.academy/academy/curriculum-atlas) and `labs/05-tool-authority-gate` in [AI Architect Academy](https://github.com/frankxai/ai-architect-academy).

## 2. Production AI Builder (`production-builder`)

- **Who this fits:** Applied AI and backend engineers shipping Python/TypeScript retrieval pipelines, MCP servers, and multi-agent state machines.
- **What you stress-test:** Sliding-window chunk overlap (`0` dropped tail clauses), Reciprocal Rank Fusion (`k=60`), zero-trust MCP tool schemas, and 5-case offline admission gates (`p95 <= 4200ms`, `cost <= $0.05`, `safety == 100%`).
- **Week 1 proof artifact:** Timestamped 15-minute `UnaidedAttempt` root-cause note plus passing stdlib/Vitest offline suite output.
- **Paired surfaces:** `labs/01-rag-pipeline` through `labs/05-tool-authority-gate` in [AI Architect Academy](https://github.com/frankxai/ai-architect-academy) and `/academy/evaluation` at [Starlight Intelligence Academy](https://starlightintelligence.academy/academy).

## 3. Technical GenCreator (`technical-creator`)

- **Who this fits:** Design engineers, technical educators, and media builders turning complex system mechanics into clear diagrams and programmatic video.
- **What you stress-test:** `design.md` visual contracts, code-rendered SVG architecture plates with mobile legibility checks, deterministic Remotion compositions, and monotonic WebVTT captions.
- **Week 1 proof artifact:** One version-controlled SVG system boundary plate or Remotion scene manifest paired with an editorial accuracy check.
- **Paired surfaces:** `/academy/studio` at [Starlight Intelligence Academy](https://starlightintelligence.academy/academy/studio) and visual architecture guides at [FrankX.ai](https://frankx.ai/guides).

## 4. Structured Workflow Operator (`workflow-operator`)

- **Who this fits:** Technical founders, operations leads, and domain specialists redesigning recurring team workflows around reliable human-in-the-loop queues.
- **What you stress-test:** Workflow triage (`BOUNDED_AUTOMATE` vs. `ASSIST_ONLY` vs. `DO_NOT_AUTOMATE`), staging queues for outbound communications, and tested recovery SOPs when upstream tools degrade.
- **Week 1 proof artifact:** Three-workflow triage audit marking at least one high-consequence surface (`spend`, `pricing`, `legal`, or `external_send`) as `ASSIST_ONLY` or `DO_NOT_AUTOMATE` with a measurable shutoff threshold.
- **Paired surfaces:** Triage Studio at [Starlight Intelligence Academy](https://starlightintelligence.academy/academy/studio) and [Starlight Communities](https://github.com/frankxai/starlight-communities).

## Declare your track in four lines

Reply below with synthetic or public-safe details only (never confidential employer data or credentials):

```text
1. Primary lens: [enterprise-architect | production-builder | technical-creator | workflow-operator]
2. Secondary lens (optional):
3. Weekly rhythm: [Creation Cell (3-5 builders) | Solo async verification lane]
4. Week 1 target boundary & human gate:
```

Switching lenses later never resets your verified artifacts—every passed red gate, 20-minute rubric review, and Day-7 changed-context transfer carries forward across the campus.
