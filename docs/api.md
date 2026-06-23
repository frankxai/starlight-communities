# API Reference

The API is intentionally small. It exists to make the core system deployable
locally or on Railway without forcing a platform choice.

## `GET /health`

Returns service health.

```json
{
  "ok": true,
  "service": "starlight-communities",
  "version": "0.1.0"
}
```

## `POST /v1/run-sheet`

Accepts a pilot input payload and returns a weekly run sheet.

Input shape:

- `week_id`
- `theme`
- `challenge_type`
- `created_by`
- `members`

Output includes:

- cells;
- quests;
- commitments;
- cadence;
- gates;
- memory records;
- warnings.

## `POST /v1/blueprint`

Accepts a community strategy input and returns a strategy blueprint.

Input shape:

- `name`
- `audience`
- `member_promise`
- `value_pillar`
- `primary_surface`
- optional `pilot`

Output includes:

- strategy;
- member journey;
- architecture;
- optional run sheet;
- risks.
