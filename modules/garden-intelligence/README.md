# Garden Intelligence

Preserve a family garden memory, keep its context, and hand it to the next generation with permission.

A Starlight Communities module. v0.1 implements a private notebook and six ChatGPT MCP tools: bilingual interview prompts, consented capture, private listing, family export/import and deletion. It is not yet a shared-family SaaS or a public knowledge commons.

## Run and verify

Requires Node 22+. No application dependencies.

```bash
node scripts/compose.mjs
node --test test/*.test.mjs
bash scripts/build.sh
node scripts/validate-artifact.mjs
```

For a synthetic local preview: `node scripts/preview.mjs`, then localhost:3000. All preview records are in memory and reset on restart. Never deploy that server as an authenticated API.

Production uses the Sites Worker workflow, authenticated identity headers and R2 `BUCKET`. The deployed artifact contains only the compiled Worker and hosting manifest. Configure a distinct project ID for a new installation; do not reuse another owner's Site identity. Public-source hosting template deliberately omits deployment identity.

- [Product strategy and four-week pilot](docs/STRATEGY.md)
- [Runtime architecture and limits](docs/ARCHITECTURE.md)
- [German family interview kit](docs/GRANDPA.md)
- [Validation receipt](docs/VALIDATION.md)

No participant records are included. Code follows the parent repository's license; family testimony has its own explicit permissions. The portable skill package has no bundled credentials or fabricated MCP connection. Sites provisions the actual private plugin when the Worker is published.
