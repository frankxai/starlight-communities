# Security Policy

Report security issues privately to the repository owner. Do not open public
issues with secrets, exploit details, or private member data.

## Scope

Security-sensitive areas:

- consent and privacy gates;
- raw voice/video storage;
- direct messages and invites;
- public publishing;
- calendar actions;
- paid service activation;
- platform adapters;
- private memory records.

## Defaults

- Private by default.
- Dry-run first.
- Human approval for external side effects.
- No secrets in Git.
- No real member data in examples.

<!-- STARLIGHT-REPO-CONTRACT:START -->
## Starlight repository contract

Contract: `starlight.repo_profile.v2` · Team: `communities-academies-team` · Priority: `now`
### Data boundary

- Classification: `private`
- PII allowed in product-owned storage: `true`
- Auth owner: `starlight-communities`

Never read or print `.env` values. Keep secrets in approved secret stores, keep PII out of analytics events and receipts, scan untrusted code before execution, and stop on credential or private-memory exposure.
<!-- STARLIGHT-REPO-CONTRACT:END -->
