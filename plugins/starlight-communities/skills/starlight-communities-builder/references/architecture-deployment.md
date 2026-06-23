# Architecture And Deployment Reference

Use this reference when deciding how to run Starlight Communities locally,
through Railway, or through a platform adapter.

## Canonical Layers

1. Core object model: profile, cell, quest, commitment, artifact, reflection.
2. Run-sheet engine: deterministic weekly plan generation.
3. Safety gates: human approval for external side effects.
4. Memory boundary: private summaries by default, public only by consent.
5. Adapter layer: Circle, Discord, Slack, email, calendar, native web.

## Local Runtime

```bash
pnpm install
pnpm validate
pnpm dev
```

Routes:

- `GET /health`
- `POST /v1/run-sheet`
- `POST /v1/blueprint`

## Railway Runtime

Use the included `Dockerfile` and `railway.json`.

Required variables:

- `PORT`
- `HOST`

No secrets are required for the core API. Platform adapters will need separate
secret handling and human-gated dry-run mode.

## Adapter Rule

Adapters should never own canonical member state. Store shadow references only:

- platform member id;
- channel id;
- message id;
- event id;
- artifact URL.
