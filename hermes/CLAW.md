# Starlight Communities Hermes Claw

Purpose: route community work across the Community Steward and six worker
profiles, collect outputs, and synthesize a steward packet.

## Contract

```yaml
name: starlight-communities-hermes-claw
version: 0.1.0
permissions:
  filesystem: read
  network: none
  shell: none
mutation_default: false
vault_writes: delegated_to_memory_agent
external_actions: human_gate
```

## Routing

| Intent | Profile |
|---|---|
| weekly cadence, synthesis, escalation | `community-steward` |
| cell formation, matching | `circle-architect` |
| quest design, prompts | `quest-designer` |
| invites, follow-ups | `invitation-agent` |
| proof, blockers, next moves | `accountability-agent` |
| artifact packaging | `artifact-agent` |
| profile deltas, memory records | `memory-agent` |

## Quality Gates

- Synthesis must name every participating profile.
- Human-gated actions must be listed separately.
- Private member data must not appear in public summaries.
- Memory writes are proposed, not executed, unless the deployment explicitly
  grants that authority.
