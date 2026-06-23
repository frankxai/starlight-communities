# Research Ledger

This repo adapts patterns from current agent ecosystems without vendoring or
auto-trusting third-party skills.

## Sources Reviewed

| Source | Pattern Used | Boundary |
|---|---|---|
| https://github.com/VoltAgent/awesome-agent-skills | Curated skill ecosystem and cross-agent compatibility posture | Do not trust listed skills without review |
| https://github.com/openclaw/openclaw | Gateway/channel assistant framing | OpenClaw is an optional surface, not source of truth |
| https://github.com/nousresearch/hermes-agent | Learning loop, scheduling, subagents, persistent memory | Use as inspiration; this repo stays deterministic and dry-run first |
| https://github.com/mgechev/skills-best-practices | Small skill folders with `SKILL.md`, scripts, references, and assets | Keep skills permission-scoped and under 500 lines |
| https://github.com/mergisi/awesome-openclaw-agents | SOUL template portability and agent catalog structure | Treat templates as examples, not production authority |

## Production Rule

External agent libraries are research inputs. Production use requires:

- provenance check;
- license check;
- permission review;
- safety gate review;
- test or dry-run proof;
- human approval for any external action.
