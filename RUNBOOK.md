# starlight-communities — Runbook

<!-- STARLIGHT-REPO-CONTRACT:START -->
## Starlight repository contract

Contract: `starlight.repo_profile.v2` · Team: `communities-academies-team` · Priority: `now`
### Fast gates

- health: `pnpm run validate`
- lint: not applicable
- typecheck: `pnpm run typecheck`
- test: `pnpm run test`
- build: `pnpm run build`
- security: `pwsh ../security/Invoke-RepoSecurityScan.ps1 -Path .`

### Release

Classify risk, run applicable gates locally, use one coherent preview when deployed, obtain an independent verifier verdict, record evidence, and confirm rollback before promotion. Only predesignated low-risk web changes may use green automatic promotion.
<!-- STARLIGHT-REPO-CONTRACT:END -->
