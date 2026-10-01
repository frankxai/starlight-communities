# Host programme architecture

Status: proposed extension; synthetic planning examples only. No venue availability,
professional endorsement, market price or commercial agreement is asserted here.

The first paid unit is a bounded team work programme: improve one repeatable business
workflow and teach its owner to operate it. A venue is an optional delivery setting.
One buyer and one accountable programme operator keep the offer understandable.

## Reuse map

| System | Owns | Does not own |
|---|---|---|
| Ana AI Business Kit | HR call-to-offer/invoice drafts, reviewed research, approved content, templates; complementary team-practice and productisation skills | Worker ranking, diagnosis, recruitment decisions, therapy records |
| Starlight Communities | Programme feasibility, owner/producer runbook, 3–5 person cells, weekly work artifacts and private reflection boundaries | Booking, money movement, contract execution |
| VibeClubs | Reusable session formats, build sessions and visible work artifacts | Property inventory or employer assessment |
| Property operation | Venue availability, commercial-control evidence, property contract, handover | Programme outcomes or participant ticket sales |
| Existing CRM / documents / community surface | Authorised leads, consent records, approved content and event coordination | A second competing source of truth |

Reference these systems with programme, engagement and artifact IDs. Never join
private reflection or clinical records to an employer dashboard. An employer sees
agreed work-process measures, such as reviewed proposal turnaround and acceptance,
with a baseline, denominator, quality check and measurement window. Small-group
aggregation does not guarantee anonymity; suppress or combine sensitive results.

## Local planner contract

`assessHostProgramme(input)` and `assess-programme <input.json>` parse
`host-programme.v1` and return a deterministic `host-assessment.v1` draft.
The planner checks supplied capacity, single-occupancy room use, programme-operator
contribution, break-even, cash shortfall and missing responsibility/review references.
It has no network/storage imports and makes no booking, messaging or payment calls.

Every result is `bookable: false` and `evidenceVerified: false`, including an input
with all review references present. References are assertions, not verified signatures
or current consent. Content eligibility only routes an asset to human review.
Unknown fields are rejected, including private notes and mixed per-line currencies.
See the plugin's host-contract worksheet for units and exclusions.

Run from the repository:

```bash
pnpm install --frozen-lockfile
pnpm validate
node dist/cli.js assess-programme examples/host-programme.json
```

The synthetic day-space example yields EUR 10,000 assumed operator revenue,
EUR 5,800 modeled costs including EUR 2,000 operator labour, EUR 4,200 contribution,
six paying places to break even, and EUR 1,000 cash shortfall. It is deliberately
unready, with unresolved property/contract evidence and no media permissions.
This is a worked arithmetic example, not a recommended ticket price or real offer.

## Distribution and adapters

The Codex plugin is distributed from `plugins/starlight-communities` through this
repository's existing marketplace. Its instructions need a runtime checkout for
CLI execution. The npm package contains the compiled CLI and library, not the Codex
plugin directory. This change does not install or publish either package.

Existing runtime interfaces are TypeScript, CLI and HTTP; this host capability
has no HTTP route and no registered MCP transport. The current HTTP server lacks
application authentication; do not expose private programme records through it.
Do not reuse experimental `steward.ts`/`simulate-onboarding.ts` messaging paths.

Add an authenticated adapter only after two paid deliveries reveal a repeated
manual operation that existing connectors cannot handle. Before an adapter writes
calendar holds, invoices, publication or bookings, define authority, idempotency,
conflict handling, expiry, audit records and rollback. A read-only plan is not an
inventory lock. Prefer existing approved calendar, documents, accounting and
community connectors before building another database or automation service.

## Pilot evidence

Run one paid programme in an existing suitable venue before investing in a new
building or membership platform. Record signed scope, paid amount, delivery hours,
venue costs, unplanned owner interventions, one quality-preserving work metric,
and follow-up use after 30 days. A public case study requires a separate rights
review. A private reference call and anonymised operational receipt can provide
proof without recording group conversations.
