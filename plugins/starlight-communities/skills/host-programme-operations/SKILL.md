---
name: host-programme-operations
description: Plan a paid founder or team programme in a day space or residential venue; reconcile capacity, programme costs, cash gaps, owner and producer responsibilities, contract review inputs, and media permissions before a human commits dates or money.
---

# Host programme operations

Use for programme feasibility and operating preparation. Reuse the community
builder for 3–5 person creation cells and the existing run-sheet command for
weekly sessions. A venue programme has its own record; it is not a creation cell.

## Workflow

1. Name one buyer, one work outcome, programme operator, property owner and producer.
   Use reference IDs in files; keep personal records in the authorised private system.
2. Separate every venue. Country, usable capacity, commercial control and readiness
   are assertions to review, never inferred from a property photograph or draft site.
   Ownership, a lease, or an operating agreement may provide control. Unknown is valid
   during planning, but unresolved. Do not infer a lease is always required.
3. Read [host contract worksheet](references/host-contract-worksheet.md). Prepare
   commercial questions and role allocations, not an enforceable rental agreement.
4. In a checkout of `frankxai/starlight-communities`, install locked dependencies and
   build with `pnpm install --frozen-lockfile` then `pnpm build`. Copy
   `examples/host-programme.json` to an authorised private working file. Run:

   ```bash
   node dist/cli.js assess-programme /absolute/path/to/input.json
   ```

   The plugin supplies instructions, not a bundled runtime. An npm installation
   does not install this Codex plugin. There is no host-planning MCP or HTTP route.
5. Show revenue, every whole-programme cost, operator time, break-even, capacity and
   cash shortfall. Prices are test assumptions until accepted by a paying buyer.
   The tool models the programme operator only; never count an internal venue fee
   again as consolidated external revenue. Cash collected is not earned revenue.
6. Produce a draft runbook and a decision receipt: unresolved inputs, named reviewers,
   outcome baseline and denominator, cancellation checkpoint, next bounded action.
   A clean tool result verifies arithmetic and structure only; `bookable` stays false.
7. For content, prefer a facilitator demonstration using synthetic work. Private
   reflection is never eligible. Separate capture, edit and publication permissions;
   recheck current withdrawal status and rights immediately before any use. Tool
   eligibility means ready for human review, never permission to publish.

## Boundaries

No invitations, booking holds, contracts, payment requests, public posts or raw media
storage are executed by this skill or its planner. Do not invoke the repository's
experimental steward/onboarding messaging scripts. Prepare drafts; respect actual
session authorization and the external system's review controls for further actions.
Do not collect psychotherapy notes, infer emotional states, rank workers, diagnose,
or promise clinical outcomes. Optional personal practice is separate from employer
reporting and from access to the core work programme.
