# Starlight Communities Agent Instructions

This repo packages the Starlight Communities operating system into a public-safe
agentic community toolkit.

## Rules

- Keep private member data out of this repo.
- Use synthetic examples only.
- Agents draft and prepare; humans approve external sends, publishing, calendar
  events, leaderboard publication, raw media storage, and paid services.
- Prefer deterministic, testable logic over vague prompt-only automation.
- Keep schemas, docs, examples, skills, OpenClaw templates, and Hermes profiles
  aligned when behavior changes.
- Run `pnpm validate` before handoff when dependencies are installed.

## Public Safety

Do not commit:

- API keys, tokens, cookies, secrets, or `.env` files.
- Real member profiles, contact details, voice/video transcripts, or matching
  rationale.
- Private Starlight strategy that is not already public-safe.

## Architecture Bias

- SIS-style memory is canonical.
- Community platforms are surfaces, not sources of truth.
- OpenClaw templates must declare a minimal permission posture.
- Hermes profiles are routing/synthesis contracts, not unchecked autonomous
  executors.
- Agent Skills should stay small, navigable, and permission-scoped.
