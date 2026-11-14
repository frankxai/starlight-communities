# Academy Circle Campus Module

Deterministic blueprint and draft-only handoff pack connecting **Starlight Intelligence Academy (SIA)**, **AI Architect Academy (AAA)**, and **Starlight Communities** to a 6-space Circle campus.

## Architectural Boundary

In Starlight Communities, **the weekly creation ritual, repository evidence, and SIS-style memory are canonical**. Circle is an optional delivery surface.

This module implements two strict operational rules documented in [`starlight-communities#23`](https://github.com/frankxai/starlight-communities/issues/23) and `starlight-intelligence-academy#86`:

1. **Fail closed on external mutations (`#86`):** The compiler (`src/academy-circle-handoff.ts`) emits **draft-only** space, post, and event plans (`status: "draft"`, `dry_run: true`, `overwrite_existing_circle_drafts: false`). Any request attempting live publication, disabling `dry_run`, overwriting existing Circle drafts (`37119809`, `37119811`), omitting an approval receipt, supplying inline credentials, or linking private repositories throws `AcademyHandoffSafetyError`.
2. **Respect Circle's 30-space cap and 3-tier access isolation (`#23`):** The 6 campus spaces map cleanly onto existing Circle space slots without requiring a plan upgrade, preserve Member vs. Operator vs. private governance isolation, never expose internal tracking names in member-facing copy, and state specialist readiness honestly.

## Pack Contents

| File | Purpose |
|---|---|
| [`campus-topology.json`](campus-topology.json) | Machine-readable 6-space Circle topology, 4-ICP lens routes, 12-week 3-act mapping, and 5-tier Builder Standing schema |
| [`RITUALS_AND_STANDING.md`](RITUALS_AND_STANDING.md) | 48-hour Arrival Path (`#23`), Weekly 20-minute Async Peer Review rubric, Day-7 Changed-Context Transfer ritual, and anti-vanity standing model |
| [`drafts/01-welcome-announcement.md`](drafts/01-welcome-announcement.md) | Ready-to-review draft copy for the Welcome announcement (`#86` draft-only handoff) |
| [`drafts/02-visual-system-map-post.md`](drafts/02-visual-system-map-post.md) | Ready-to-review draft copy for the Visual System Map post across FrankX, AAA, SIA, and Circle |
| [`drafts/03-week-01-field-notes.md`](drafts/03-week-01-field-notes.md) | Ready-to-review draft copy for Week 1 Field Notes (workflow triage, human gates, and kill criteria) |

## Deterministic Compilation & Verification

Compile a validated cohort week handoff plan from the synthetic example payload:

```bash
pnpm start -- academy-handoff examples/academy-cohort-week.json
```

Run full typecheck, unit tests, build, and manifest validation:

```bash
pnpm validate
```

All member examples in `examples/academy-cohort-week.json` and `drafts/*.md` are synthetic. Never commit real member profiles, private reflections, or Circle API credentials.
