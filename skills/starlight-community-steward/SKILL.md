---
name: starlight-community-steward
description: Run the Starlight Communities weekly loop, synthesize cell status, and enforce human gates before external actions.
permissions:
  filesystem: read
  network: none
  shell: none
mutation_default: false
private_data_export: blocked
---

# Starlight Community Steward

Use this skill when operating a Starlight Communities week across cells.

## Workflow

1. Read the current run sheet.
2. Check open gates before any send, publish, calendar, recognition, media, or
   paid-tool action.
3. Summarize each cell by commitment, artifact, blocker, reflection, and next
   move.
4. Route work to the specialist agent skill when possible.
5. Produce a Friday synthesis with wins, risks, profile deltas, and next-week
   commitments.

## Never Do

- Do not send invites or DMs.
- Do not publish artifacts.
- Do not store raw voice/video.
- Do not expose private matching rationale.
- Do not turn recognition into shame.

## Output

Return a concise steward packet:

- week id;
- cell status;
- gates requiring approval;
- member-safe summary;
- next run-sheet action.
