---
name: starlight-communities-builder
description: "Build, evaluate, and evolve Starlight Communities: agentic 3-5 person creation-cell systems with weekly quests, member profiles, human-gated agents, OpenClaw/Hermes workflows, local/Railway deployability, and public-safe GitHub documentation. Use when designing community strategy, generating a pilot run sheet, auditing a community plan, creating agent workflows, or deciding platform/deployment architecture for Starlight Communities."
---

# Starlight Communities Builder

Use this skill to turn community ideas into a production-grade Starlight Communities system: member promise, cell topology, weekly quest loop, agent roles, safety gates, memory boundaries, deployment path, and public GitHub presentation.

## Workflow

1. Classify the request:
   - `strategy`: member promise, business value, rituals, metrics.
   - `pilot`: 3-5 person cell map, quest, proof, reflection, run sheet.
   - `agent-system`: OpenClaw/Hermes profiles, agent gates, workflows.
   - `deployment`: local API, Railway, platform adapter, dry-run mode.
   - `repo-polish`: README, docs, examples, CI, contribution path.
2. Load only the needed reference:
   - Strategy and growth: `references/community-strategy.md`.
   - System and deployment: `references/architecture-deployment.md`.
   - Agent workflows: `references/agent-workflows.md`.
3. Prefer deterministic repo commands before prompt-only work:
   - `pnpm validate`
   - `pnpm build`
   - `pnpm smoke:cli`
   - `pnpm dev`
4. Keep human gates explicit for sends, publishing, calendar events, raw media, leaderboards, paid tools, and destructive data changes.
5. Return concrete artifacts: run sheet, architecture, workflow, doc diff, adapter plan, or validation report.

## Scoring

For plan audits, run:

```bash
node plugins/starlight-communities/skills/starlight-communities-builder/scripts/score-community-plan.mjs <plan.json>
```

The script expects JSON with `memberPromise`, `weeklyLoop`, `agents`, `gates`, `metrics`, and `deployment` fields.

## Quality Bar

- Start with member value before platform choice.
- Make every ritual produce proof, memory, relationship, or next commitment.
- Treat platforms as adapters, not source of truth.
- Make the default path local and dry-run.
- Make Railway deployment explicit and reversible.
- Keep public examples synthetic.
- Make GitHub visitors understand the project in 30 seconds.
