# Deployment

Starlight Communities can run as a local CLI, local API, Docker container, or
Railway service.

## Local CLI

```bash
pnpm install
pnpm validate
pnpm start -- run-sheet examples/pilot-week.json
```

## Local API

```bash
pnpm dev
curl http://localhost:3000/health
```

## Production Build

```bash
pnpm build
pnpm serve
```

## Docker

```bash
docker build -t starlight-communities .
docker run -p 3000:3000 starlight-communities
```

## Railway

The repo includes `railway.json` and `Dockerfile`.

```bash
railway up
```

Environment:

- `PORT`: set by Railway.
- `HOST`: defaults to `0.0.0.0`.

## Adapter Safety

The core API has no platform secrets. Future adapters should add:

- dry-run mode;
- audit logs;
- secret manager integration;
- human approval records;
- per-platform shadow references.
