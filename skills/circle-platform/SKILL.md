---
name: circle-platform
description: Operate the Starlight Circle community (circle.so) through the official Circle MCP. Use when reading or changing spaces, space groups, access groups, member tags, posts, events or invites; when mapping a curriculum hub into Circle; or when someone asks what a member can see. Not for 3-5 person creation cells (that is circle-architect) and not for Circle the USDC company.
permissions:
  filesystem: read
  network: circle-mcp
  shell: none
mutation_default: false
private_data_export: blocked
---

# Circle platform

One Circle community carries every Starlight domain. Members see only the spaces
their access groups grant. Git is the source of truth; Circle is the delivery surface.

## Connection

- Official server (circle.so, the community platform): `https://app.circle.so/api/mcp`.
- Claude Code: `claude mcp add --transport http --scope user circle-mcp https://app.circle.so/api/mcp`, then `/mcp` and sign in as a community admin.
- The admin MCP needs the Circle Business plan. On a lower plan, reads may fail; report it, do not work around it.
- Do not use `api.circle.com` (Circle Internet, USDC). Third-party wrappers (Pipedream, Membrane, community repos) are not approved.
- List the server's tools before the first call. Tool names change between Circle releases; never call a name from memory.

## The model: three layers

| Layer | Who sees it | Spaces |
| --- | --- | --- |
| 0. Starlight Community Layer | every member | Start Here, Announcements, Events, Field Notes / Showcase |
| 1. Domain hubs | members of that hub's access group | one space group per curriculum: Starlight Intelligence Academy, AI Architect Academy, Music Academy, Arcanea Academy, GenCreator |
| 2. Cohort and Operator | paid cohort / operator access groups | Critique Arena, Red-Gate Lab Clinic, Worked-Run Trace Exchange, Active Missions, Run Receipts |

Rules that make "only what is relevant" true:

1. Every hub and cohort space is secret, not just private. Private spaces still show in the directory.
2. Access is granted only through access groups. Never add a member to a space by hand.
3. Routing is tag to access group to spaces. The waitlist role (enterprise-architect, production-builder, technical-creator, workflow-operator) becomes a member tag; the tag maps to access groups.
4. Layer 0 stays small (4 spaces). Depth lives in hubs.
5. The space map lives in `modules/academy-circle-campus/campus-topology.json`. Change the file first, then apply.
6. Space budget: cap 30. Reuse existing slots before creating. Hidden legacy brand spaces count against the cap.

## Workflow

1. Read: list spaces, space groups, access groups and tags. Save the snapshot as `circle-snapshot-<date>.json` in the scratch area, never in git (it holds member data).
2. Diff the snapshot against `campus-topology.json`. Report: missing spaces, extra visible spaces, access groups that grant the wrong spaces, spaces visible to Layer 0 that belong to a hub.
3. Propose the change set as a table (object, current, target, layer).
4. Apply only what the gates below allow. Re-read after every write and confirm the result.

## Gates (fail closed)

- Allowed without asking: reads; creating or editing a space, space group or post as a draft; hiding a space from the sidebar.
- Needs Frank's explicit yes in this conversation: granting an access group to spaces, adding or removing members from access groups, creating invitation links, publishing a post or event, sending any email or notification, deleting anything, changing plan or paywalls.
- Never overwrite protected drafts listed in `campus-topology.json` (`protected_circle_draft_ids`).
- Paywalls, pricing and checkout are money paths: stage only.
- No XP, login streaks, message-volume scores or shame leaderboards.
- No API tokens in prompts, files or posts.
- Circle workflows (automations) are UI-only; write the steps for Frank instead of claiming they were created.

## Platform decision (2026-11-25)

Frank: full focus on Circle; everything, GenCreator included, is centralized there for now.
Skool is parked: possibly an extra acquisition surface later, or a migration target if Circle
stops earning its cost. Keep the topology portable (git-first, tags and groups named by role,
not by Circle ids) so a later move is a mapping job, not a rebuild.

## Output

- Snapshot summary (counts per layer, no member names).
- Diff table against the topology.
- Applied changes with read-back evidence.
- Pending changes that wait on Frank, each as one line.
