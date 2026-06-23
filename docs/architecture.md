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

The package is production-grade as a deterministic core and agent kit. It is not
yet a hosted SaaS. Production deployment should add:

- authenticated member profiles;
- encrypted private memory storage;
- audit logs for agent proposals and human approvals;
- platform adapters with dry-run mode;
- consent UI for raw media, recognition, and public artifacts.
