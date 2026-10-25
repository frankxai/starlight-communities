# Verification receipt · v0.1.0

25 October 2026. Application source: `worker/core.mjs`, `app/page.html`; generated deployment: `worker/index.js`. Source is composed during every build.

- Independent verifier: `verify_garden` agent; separate from implementation author. 19/19 Node behavioral tests passed. Includes owner isolation, foreign-list fail-closed behavior, storage/family consent, reviewed input, import owner/trust rejection, family roundtrip, deletion, pagination, malformed JSON/RPC, input bounds and notification no-write behavior.
- Two defects found and corrected: missing compose step in deployment build; notifications could trigger mutations without an ID. Both rechecked by verifier.
- Worker build and ESM deployment validation passed.
- Desktop browser: inspected actual rendered preview; synthetic capture saved successfully and appeared in notebook; export was visibly disabled without family consent. Preview used in-memory data and a synthetic identity, not a hosted production session.
- Phone (390 px) and tablet (768 px) layouts inspected in real iframe viewports through the browser; desktop inspected at the default browser width. Text and controls reflow; no crop or overflow observed in the inspected upper layouts. Full accessibility audit and device-specific voice input remain unverified.
- Portable plugin: Forge baseline passed; two deterministic ZIPs identical; clean extraction passed. SHA256: `3b37e14d63d5053a85201b6d6566fee6651ca5081918c99c40760f10466e1b8c`. This portable source contains two skills and no fabricated runtime mapping. Full official-schema validation and native loader behavior remain separate.
- Public source includes only synthetic fixtures and public-safe strategy. No real family record or source repository credential is included.
- Parent repository `pnpm validate` not run: this change is prepared through GitHub connector reads/writes and a standalone module checkout; parent dependencies are not installed here. The new module has a separate Node CI workflow.

The live Site deployment, plugin account release and host tool smoke results are recorded separately in the delivery PR. A private deployment is not public community availability. Cross-account sharing, revocable circle permissions, quotas, backup recovery and claim review remain subsequent release gates.
