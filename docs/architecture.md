# Architecture

Starlight Communities is a community operating system, not a chat platform.

## Layers

1. **Core package**: schemas, matching, quests, gates, memory records, run sheets.
2. **Agent package**: Agent Skills, OpenClaw SOUL templates, Hermes routing profiles.
3. **Pilot package**: synthetic examples and concierge workflows.
4. **Integration package**: future Circle, Discord, Slack, email, calendar, and web UI adapters.

## Canonical Data Flow

```text
member intake
  -> CommunityMemberProfile
  -> proposed CreationCell
  -> Quest
  -> WeeklyCommitment
  -> Artifact
  -> Reflection
  -> MemoryRecord
  -> next week run sheet
```

## Why The Platform Is Not Canonical

Circle, Discord, Slack, email, and a future web app are useful surfaces, but
none should own member truth. The system should still be able to regenerate the
week from profiles, commitments, artifacts, and reflections if a platform
changes or disappears.

## Agent Topology

```text
Community Steward
  |-- Circle Architect
  |-- Quest Designer
  |-- Invitation Agent
  |-- Accountability Agent
  |-- Artifact Agent
  `-- Memory Agent
```

The steward owns cadence, synthesis, safety, and escalation. Worker agents draft
and prepare bounded outputs. External side effects require human approval.

## Production Boundary

The package is a deterministic reference core and agent kit. Source tests do not
establish production authentication or a hosted service. Production use requires:

- authenticated member profiles;
- encrypted private memory storage;
- audit logs for agent proposals and human approvals;
- platform adapters with dry-run mode;
- consent UI for raw media, recognition, and public artifacts.

## Consent and memory

All consent flags default to false, including matching, profile memory and proof
summaries. Omitted or partial consent never grants an unmentioned permission.
The synthetic pilot explicitly opts its fictional members into matching and memory;
adopters must collect real choices rather than copy those fixture values.

The host must supply current authenticated member records. The library validates
their shape and gates behavior, but cannot prove who supplied them. Never treat an
inbound message, reflection or agent assertion as authenticated consent.

`createProfileMemoryRecord(member, week)` rejects missing or withdrawn memory consent.
`createReflectionMemoryRecord(reflection, member)` now requires the current member
record, matching member identity, and both profile-memory and proof-summary consent.
Existing one-argument reflection calls must be migrated; they now fail closed.
Derived memory stays private even when a reflection was labeled public. Public
recognition is a separate, human-reviewed projection, not a memory export switch.

Run sheets omit profile-memory records for members who did not opt in. These checks
apply to each new generation. They do not delete previously stored copies; adapters
must enforce withdrawal and deletion in their own durable storage. SIS owns the
shared event protocol; this package owns the steward workflow and does not duplicate
the SIS ledger or claim a working SIS adapter.

## Contributor assurance

CI uses immutable action commit revisions, a read-only repository token, no stored
checkout credentials, a 15-minute timeout, and cancellation of superseded runs.
Weekly Dependabot proposals cover Actions and package dependencies; compatible
minor/patch package updates are grouped. Updates still require review and checks.
This follows [GitHub's secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use),
checked September 7, 2026. These controls are not a security certification.

The next transport upgrade should evaluate
[MCP 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/): stateless
requests, cacheable discovery, issuer-bound authorization and the Tasks extension.
Upgrade only with a client/server compatibility fixture and cancellation/replay
tests. The current dependency declaration does not prove support for that revision;
this change does not install a new MCP runtime or expose a member-data service.
