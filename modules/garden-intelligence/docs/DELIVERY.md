# Delivery receipt · 25 October 2026

- GitHub implementation: https://github.com/frankxai/starlight-communities/pull/28 (open, not merged).
- Delivery epic: https://github.com/frankxai/starlight-communities/issues/29.
- Owner-private app: https://garden-intelligence-frankx.frankx-ai.chatgpt.site.
- Private plugin: https://chatgpt.com/plugins/plugin_asdk_app_sites_acbe608f02dc81919b5e75085f08faf7.
- Application version 0.1.0. Saved plugin version 1.0.1, containing capture-garden-wisdom and plan-garden-experiment.
- Sites reported successful deployment with MCP enabled. Plugin Management reported already installed. Plugin Creator readback confirmed both skills, the version, unchanged presentation and the same app binding (serialization formatting changed).
- Newly created tool names did not appear in the authoring chat's tool registry. A fresh chat selecting Garden Intelligence is the next host-verification step. No successful live tool call is claimed.
- Browser reached the real deployed sign-in gate. Synthetic local UI capture/save/list was tested. No live family records were created; hosted R2 roundtrip under a real signed-in identity remains unverified.
- Independent behavioral suite: 19 passed. Module CI on the first implementation commit passed. Parent-repo CI is tracked on the PR.
- Forge: portable baseline passed, deterministic archives identical, clean extraction passed, seven negative fixtures correctly rejected. Hosted App metadata was preserved rather than changed to meet dated baseline presentation-length assumptions.
- Specialist handoff packed, integrity verified and exported to a clean directory. Digest: da46bc78c442862cd0fa8a812a0c8af33f7a916d618b88976b3e37772c1504fd. It contains the original strategy and validation receipt. No native Memory/Atlas import or runtime admission is implied.

Next bounded action: open the private app signed in, save/export/import a synthetic card, then implement revocable family-circle membership using two actual accounts before widening audience. The current useful grandfather workflow remains a consented text handoff from his ChatGPT to a relative.

Repository-wide CI initially failed on missing Node globals/import types in existing src/*.ts. A narrow tsconfig.json change adds compilerOptions.types=["node"]; the existing @types/node dependency is retained. Subsequent CI is authoritative on the PR.
