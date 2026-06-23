# Decision 0001: Keep The Community Spine Platform-Independent

Status: accepted

## Context

Starlight Communities may eventually use Circle, Discord, Slack, email, calendar,
or a native web app. The temptation is to pick a community platform first.

## Decision

The canonical spine is the object model and weekly loop:

- profile;
- cell;
- quest;
- commitment;
- artifact;
- reflection;
- memory record.

Platforms are adapters. They do not own the truth.

## Consequences

- The system can pilot manually before paid tooling.
- Integrations can be swapped without losing community memory.
- Agent safety gates can be enforced before platform side effects.
- Platform-specific features need adapter tests rather than core rewrites.
