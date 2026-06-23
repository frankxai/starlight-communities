import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const manifestPath = new URL("../modules/starlight-communities.module.yaml", import.meta.url);
const manifest = parse(await readFile(manifestPath, "utf8"));

const required = ["id", "name", "version", "agents", "objects", "weekly_loop", "gates", "metrics"];
const missing = required.filter((key) => !(key in manifest));

if (missing.length > 0) {
  console.error(`Manifest missing required keys: ${missing.join(", ")}`);
  process.exit(1);
}

if (!Array.isArray(manifest.agents) || manifest.agents.length < 7) {
  console.error("Manifest must define the steward plus six worker agents.");
  process.exit(1);
}

console.log("manifest valid");
