import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredPaths = [
  "plugins/starlight-communities/.codex-plugin/plugin.json",
  "plugins/starlight-communities/skills/starlight-communities-builder/SKILL.md",
  "plugins/starlight-communities/skills/starlight-communities-builder/agents/openai.yaml",
  "openclaw/REGISTRY.md",
  "hermes/CLAW.md"
];

for (const relative of requiredPaths) {
  if (!existsSync(join(root, relative))) {
    console.error(`Missing agent asset: ${relative}`);
    process.exit(1);
  }
}

const skillDirs = await readdir(join(root, "skills"));
if (skillDirs.length < 7) {
  console.error("Expected at least seven root Agent Skills.");
  process.exit(1);
}

const pluginSkill = await readFile(
  join(root, "plugins/starlight-communities/skills/starlight-communities-builder/SKILL.md"),
  "utf8"
);

if (pluginSkill.includes("[TODO")) {
  console.error("Plugin skill still contains TODO placeholders.");
  process.exit(1);
}

console.log("agent assets valid");
