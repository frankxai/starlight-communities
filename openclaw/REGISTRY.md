# Starlight Communities OpenClaw Registry

This registry describes public-safe OpenClaw-style SOUL templates for Starlight
Communities. These templates are not auto-installed. Review and adapt them
before runtime use.

## Security Posture

- Source-only from this repository.
- No unrestricted shell.
- No direct secret access.
- No outbound publishing without human approval.
- No raw member data in examples.
- Humans approve sends, publishing, calendars, raw media storage, recognition,
  paid services, and destructive data changes.

## Templates

| Agent | Template | Permissions |
|---|---|---|
| Community Steward | `agents/community-steward/SOUL.md` | read-only planning |
| Circle Architect | `agents/circle-architect/SOUL.md` | read-only matching |
| Quest Designer | `agents/quest-designer/SOUL.md` | read-only design |
| Invitation Agent | `agents/invitation-agent/SOUL.md` | draft-only |
| Accountability Agent | `agents/accountability-agent/SOUL.md` | draft-only |
| Artifact Agent | `agents/artifact-agent/SOUL.md` | draft-only |
| Memory Agent | `agents/memory-agent/SOUL.md` | private memory summaries |

## Runtime Rule

OpenClaw can be a channel gateway. It must not become the source of truth.
Canonical community objects stay in the Starlight Communities data model.
