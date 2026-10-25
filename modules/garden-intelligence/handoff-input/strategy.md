# Garden Intelligence

Decision record · 25 October 2026 · v0.1

## Product decision

Build an intergenerational gardening knowledge commons, beginning with a private family notebook and a transfer protocol that works through ordinary ChatGPT conversations. Working name: Garden Intelligence, a Starlight Communities module. This is a product direction, not an approved standalone brand or evidence of market demand.

The unit of value is one corrected account that helps another person make and document a better gardening decision. The unit of trust is a contextualized claim with traceable evidence, not a token, follower count, or AI confidence score.

## What exists in this release

A dependency-free Worker application with private, identity-scoped R2 records; six MCP tools; a responsive notebook; fourteen bilingual interview prompts; contributor-review and storage-consent checks; family export/import; deletion; and public-safe source. Original accounts and summaries are separate. Every stored record starts unverified. There is no background model call, raw audio upload, public feed, payment integration, shared-family access control, plant diagnosis, weather integration or automatic synchronization.

The current Site is owner-private. The grandfather workflow works without giving him access: he uses a prompt in his own ChatGPT, corrects the resulting text, authorizes sharing, and sends the selected card to a relative. The relative stores it with permission. JSON export/import additionally works between compatible installations. Installing a plugin does not connect two people's conversation histories.

## Why this is worth testing

GrowVeg already provides mobile garden journaling, records, advice, reports and reminders. Seed Savers Exchange preserves seed-associated stories and traditions and works with community science. Gardening journals and heritage knowledge are established categories; neither is a unique invention here.

Our hypothesis is that combining low-friction elder interviews, contributor-controlled family collections, conditional gardening claims and returned observations makes knowledge transfer more useful and more durable than a chat transcript or a static journal alone. Validate through use before claiming differentiation.

Primary pages inspected 25 October 2026:
- https://www.growveg.com/journal.aspx — journaling, mobile capture, reminders; borrow continuity of observation, not commercial claims.
- https://seedsavers.org/preservation/the-collection/ — stories alongside conserved varieties; borrow provenance and stewardship.
- https://www.rhs.org.uk/advice/grow-your-own — organized crop and growing-space guidance; borrow context-first navigation. UK seasonal advice must not be treated as universal.

Only page content was inspected, not their signed-in product experience. No comparative usability study or conversion evidence is claimed.

## The knowledge architecture

Future canonical objects: person or pseudonym, private collection, garden context, original account, extracted claim, source, observation, trial, review, consent grant, publication edition and revision receipt.

A claim should link to its original account; context includes crop/variety, coarse region/climate, soil or container, season/year, method, conditions, observed result and uncertainty. Extracted claims are proposals until the contributor corrects them. Do not replace someone's wording with AI prose. Keep translation alongside the original and mark who reviewed it.

Separate dimensions:
- Cultural value: a meaningful family story can be preserved without asserting technical efficacy.
- Evidence: recollection, documented observation, local replication, independent review. These are scoped to the claim and context; repetition or popularity is not proof.
- Permission: private storage, named-family sharing, community publication, attribution, commercial reuse, and model-training reuse are distinct grants. v0.1 supports private storage and family export only; public and commercial permission are absent, therefore not granted.

## Community flywheel

One elder tells a story → a relative corrects and contextualizes the card → a gardener documents a low-risk trial → the result returns to the original story → a steward curates a consented edition → another local group can adapt it.

Start with five family pairs, one corrected card per pair each week for four weeks. Offer voice-led participation without making older people navigate a dashboard. No posting streak penalties. Offer printable pages and a family member as facilitator. Keep refusal and pause easy.

Useful roles: storyteller, translator, gardener, librarian/steward and domain reviewer. Recognize careful corrections, negative results, accessible translations and sustained stewardship. Badges describe contributions; they do not certify horticultural truth. Community publication requires a named steward and a contributor preview.

Promising extensions, in order:
1. Invite-only family circles with explicit member roles and revocable server-side grants.
2. Family garden books: corrected memories, seasonal notes and photographs with per-item consent.
3. Local learning circles with allotments, libraries and schools: elder/youth pairs and seasonal experiments.
4. Seed heritage passports: seed variety, provenance, growing records and stories. Legal restrictions and plant-health requirements must be checked for any physical exchange.
5. Community trials with a prewritten method, comparator, dated observations and negative results.
6. Habitat and biodiversity diaries, accessible balcony gardening, and multilingual local knowledge maps at coarse location resolution.
7. Household heritage modules for repair, craft and resourcefulness. Medical remedies, food preservation, chemicals and electrical work require separate domain-specific review; do not generalize gardening approval into these domains.

## Fit with Starlight

Starlight Communities owns the participation loop and schemas. The Garden module owns domain records and evidence policies. Starlight Memory can ingest a consented, scoped export; Atlas can display aggregate operation receipts, never family transcripts by default. GenCreator can produce a family edition from explicitly selected content. FrankX can teach the method using synthetic or contributor-approved examples. Arcanea may supply an optional narrative learning experience, separate from evidence claims.

Contributors can build adapters for ChatGPT/Codex, n8n, local agents and other clouds around the same versioned card format. Existing tools execute the workflow; this module does not require a new centralized agent brain. A customer's agent and keys remain viable runtimes.

Agent contracts: interviewer asks one question at a time; archivist extracts without invention; context assistant identifies missing context; horticultural reviewer checks claims against primary sources; trial designer proposes a bounded low-risk comparison; consent steward controls publication; editor compiles approved editions. These are proposed roles, not seven deployed autonomous services. Every role records inputs, output revision, tool actions and unresolved uncertainty.

## Cloud, graph and blockchain decision

v0.1: Sites-hosted Cloudflare Worker, Sites identity boundary, one R2 object per private card. No server-side LLM spend. ChatGPT performs conversational synthesis in the participant's session. This avoids pretending a ChatGPT subscription provides a backend API budget.

Next shared platform: relational records and authorization policies before graph infrastructure. PostgreSQL/Supabase is a candidate for richer sharing, searchable claims and audit events; D1 is a candidate for an economical Worker-native deployment. Select through measured collaboration/query needs, not tool accumulation. Derived search and embeddings must be reproducible from canonical records and permission-filtered at query time.

No blockchain in v0.1. A hash can demonstrate byte integrity, not truth, authorship, informed consent or deletion of copies. Introduce signed exports first when independent organizations require verifiable provenance. Consider optional external timestamping of non-personal edition commitments only after a concrete interoperability requirement. Never put family stories, exact locations, personal identifiers or revocable consent on an immutable public ledger. No token issuance or speculative reward economics.

## Commercial model to test

Free: interview prompts, portable schemas, code, private capture and export. Paid hypotheses: shared family collections at €5–9/month, local group workspaces at €29–79/month, optional printed family editions and sponsor-funded oral-history programs. These are proposed price tests, not market-validated prices or forecasts. Do not sell private testimony or bundle commercial reuse into basic participation.

For each paid experiment measure activation (one corrected card), four-week contribution retention, returning observations, number of invited relatives who participate, export success, deletion completion, moderator minutes and willingness to pay. Calculate contribution margin using observed storage/requests, any model or transcription usage, support and payment costs. No fabricated provider SKU prices. At ten 8 KB cards per family per month, 1,000 families add roughly 80 MB of text per month before metadata, indexes and backups; media would change the model substantially. This is a sizing assumption, not a bill estimate.

## Four-week delivery experiment

Week 1: family capture and handoff, five pairs, 20 corrected cards target. Success means the story owner understands what was saved and can correct it; target is a hypothesis.
Week 2: implement family membership, permission revocation, export/deletion integration tests and operational audit receipts. Do not widen audience before isolation tests and a consent UX review.
Week 3: five safe, seasonal observations with conditions recorded. A winter observation counts; do not force an unsuitable planting experiment to satisfy a metric.
Week 4: contributor-reviewed family edition, a small local-group pilot, and a paid offer test. Stop or narrow expansion when capture burden, review effort or demand makes the loop unworkable.

Owner responsibilities: product steward owns prioritization and publication; technical maintainer owns isolation and recovery; contributor owns wording and grants; qualified reviewer owns technical review conclusions. No unattended public publication.
