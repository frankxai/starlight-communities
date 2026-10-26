# Runtime and trust boundary

## Implemented

Browser and ChatGPT MCP → Sites authentication → Worker validation → owner-prefixed R2 objects.

Identity comes exclusively from `oai-authenticated-user-id` injected by Sites. The application must be deployed behind that platform boundary. A standalone internet deployment accepting caller-supplied identity headers is unsafe. `scripts/preview.mjs` injects a synthetic user for local QA only; it is not included in the deployed Worker artifact.

R2 namespace: `private/SHA256(siteScopedUserId)/UUID.json`. Save/import generates the UUID; list/export/delete recompute the owner prefix. No client-selected owner, public visibility, or evidence state is accepted. Unknown properties are rejected recursively. Max request body: 64 KiB. Text limits are enforced. The UI renders stored text through textContent. The server never fetches URLs from imported records or executes record content.

Source authority: original account and contributor-reviewed summary; live data authority: private R2; GitHub authority: implementation, versioned schema, tests, decisions, synthetic examples. Cross-estate adapters must not make an aggregate dashboard the source of private truth.

Six tools: garden_prompt, garden_save_card, garden_list_cards, garden_export_card, garden_import_card, garden_delete_card. MCP supports the Sites 2026-07-28 discovery contract and basic initialize compatibility. Tool errors return isError. HTTP writes reject unexpected origins and non-JSON requests. Identity checks remain mandatory even if Site audience changes.

## Deliberate limits

- Storage permission is an explicit attestation, not proof of the real-world contributor's identity.
- Export hides the alias when requested; it cannot automatically remove names embedded inside free text. Contributor review must redact those before export.
- Copies sent outside the system cannot be recalled. v0.1 has no remote family-sharing grant to revoke.
- Original text is immutable after save; correction currently means deleting and resaving, creating a new record. Auditable revisions are a follow-up requirement.
- Repeated imports create distinct records. Content-based deduplication and idempotent mutation receipts are follow-up work.
- List is paginated at 50 records; no full-text index or semantic search yet.
- No media, public publish tool, automatic transcription, scheduler, plant identification or high-risk advice generator.
- No credential, personal account identifier, real testimony or contact details belong in GitHub.

## Release gates for shared use

Implement invitation acceptance, family membership, consent scope per recipient, revocation checks on every read/export, quota/rate limiting, moderation, observable deletion and backup/restore. Use a second-user test through the actual identity provider. Until then, keep the Site owner-private and use explicit reviewed handoffs.

## Portability

`garden-wisdom.v1` is `{format, card}`. The payload contains only declared card fields. Owners, server record IDs, verification state and publication state are not transferable authority. An import creates a new private, unverified record. Synthetic fixture: `test/fixtures/card.json`.

Public source does not automatically license contributed testimony. The repository's code license remains in place; contributions have independent permissions. A family export is not a grant for publication, commercial reuse or model training.

## Rollback

Restore the previous Site source revision and publish it using the same project ID. Source rollback does not roll back R2 data. v0.1 uses only versioned JSON records, with no destructive migration. Export authorized private data before any later schema migration. Revert the bounded GitHub PR to remove the source module; this does not delete hosted records.
