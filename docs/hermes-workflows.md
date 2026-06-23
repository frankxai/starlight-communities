# Hermes Workflows

Hermes workflows route work to bounded community agents, synthesize outputs, and
return steward packets with explicit gates.

## Workflow Catalog

| Workflow | File | Purpose |
|---|---|---|
| Weekly Creation Cell | `hermes/workflows/weekly-creation-cell.yaml` | Generate and operate the weekly loop |
| Pilot Launch | `hermes/workflows/pilot-launch.yaml` | Launch a 5-15 person concierge pilot |
| Artifact Engine | `hermes/workflows/artifact-engine.yaml` | Package proof into artifacts |
| Member Memory | `hermes/workflows/member-memory.yaml` | Capture private-safe profile deltas |

## Synthesis Contract

Every Hermes synthesis should include:

- participating profiles;
- inputs used;
- outputs created;
- gates requiring approval;
- private memory recommendations;
- public-safe summary;
- next action.

## Safety

Hermes profiles do not send, publish, store raw media, mutate calendars, or
activate paid services. They prepare work for review.
