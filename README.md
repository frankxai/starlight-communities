# Starlight Communities

Production-grade agentic community systems for small creation cells.

Starlight Communities turns a community from a passive chat room into a weekly
operating loop: 3-5 people, one shared theme, one mission, one artifact shipped,
one reflection captured, and one next commitment.

The repo is built for:

- community stewards running high-trust creation cells;
- builders creating freedom systems, mind systems, content, events, and
  intelligent lives;
- agents that draft, match, nudge, package artifacts, and remember context
  without sending, publishing, or exposing private data without approval.

## What Is Included

- TypeScript core package with Zod schemas.
- Deterministic cell matching with consent and group-size constraints.
- Weekly run-sheet generation for the Monday-Friday loop.
- Human-gated safety classifier for invites, DMs, publishing, calendars, and
  raw media storage.
- Agent Skills for the Community Steward and six worker agents.
- OpenClaw-style SOUL templates and a strict local registry posture.
- Hermes-style profiles for swarm routing and synthesis.
- Example pilot input, tests, CI, and machine-readable manifests.

## Core Idea

The community platform is not the brain. The canonical spine is:

1. profile and memory;
2. cell matching;
3. weekly quest;
4. proof and artifact;
5. reflection and profile delta;
6. next commitment.

Circle, Discord, Slack, email, calendar, and native web UI can become surfaces.
The system should still work if every platform is swapped out.

## Quick Start

```bash
pnpm install
pnpm validate
pnpm build
pnpm start -- run-sheet examples/pilot-week.json
```

The CLI prints a JSON weekly run sheet with cells, quests, commitments, cadence,
memory records, and safety gates.

## First Workflow

1. Capture member intake.
2. Generate a weekly run sheet.
3. Review proposed cells and quest cards.
4. Approve outbound invites or prompts manually.
5. Collect proof and artifacts.
6. Capture Friday reflections.
7. Write profile deltas to the canonical memory layer.

## Safety Model

Agents may draft, summarize, propose, package, and prepare. Agents may not send,
publish, rank sensitive progress, create external calendar events, store raw
voice/video, or add paid services without explicit human approval.

## Repository Map

| Path | Purpose |
|---|---|
| `src/` | TypeScript schemas, matching, gates, quests, memory, and run-sheet engine |
| `skills/` | Agent Skills compatible with Codex/Claude-style skill loaders |
| `openclaw/` | OpenClaw-oriented registry notes and SOUL agent templates |
| `hermes/` | Hermes-style swarm profile contracts |
| `modules/` | Machine-readable module manifest |
| `examples/` | Pilot week input data |
| `docs/` | Architecture, pilot kit, integrations, security, decisions |

## Public/Private Boundary

This repository is public-safe. Do not commit private member profiles, raw
voice/video, live invite lists, secrets, tokens, API keys, or private matching
rationale. Use examples with synthetic people only.

## Research Influences

Patterns were adapted from Starlight SIS/ACOS/ALOS/swarm doctrine and compared
against current public agent ecosystems:

- Awesome Agent Skills: https://github.com/VoltAgent/awesome-agent-skills
- OpenClaw: https://github.com/openclaw/openclaw
- Hermes Agent: https://github.com/nousresearch/hermes-agent
- Agent skill best practices: https://github.com/mgechev/skills-best-practices

Third-party skills and templates are not trusted automatically. Review,
permission-bound, and adapt them before production use.
