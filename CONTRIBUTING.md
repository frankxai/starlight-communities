# Contributing

Keep contributions public-safe and test-backed.

## Local Checks

```bash
pnpm install
pnpm validate
```

## Skill Contributions

Agent Skills must:

- include a `SKILL.md`;
- declare a narrow purpose;
- avoid secrets and private data;
- avoid broad shell or network authority;
- include safety gates when external side effects are possible.

## Agent Templates

OpenClaw SOUL and Hermes profile updates must stay aligned with `src/agents.ts`
and `modules/starlight-communities.module.yaml`.
