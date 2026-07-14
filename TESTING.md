# starlight-communities — Testing

<!-- STARLIGHT-REPO-CONTRACT:START -->
## Starlight repository contract

Contract: `starlight.repo_profile.v2` · Team: `communities-academies-team` · Priority: `now`
### Commands

- health: `pnpm run validate`
- lint: not applicable
- typecheck: `pnpm run typecheck`
- test: `pnpm run test`
- build: `pnpm run build`
- security: `pwsh ../security/Invoke-RepoSecurityScan.ps1 -Path .`

Tests must cover failure paths, idempotency where state changes, adapter compatibility, and rollback-sensitive behavior. Skipped checks require a reason and may not be reported as passed.
<!-- STARLIGHT-REPO-CONTRACT:END -->
