import { readFile } from "node:fs/promises";

const [, , planPath] = process.argv;
if (!planPath) {
  console.error("Usage: node score-community-plan.mjs <plan.json>");
  process.exit(1);
}

const plan = JSON.parse(await readFile(planPath, "utf8"));
const checks = [
  ["memberPromise", Boolean(plan.memberPromise), "Names a clear member promise."],
  ["weeklyLoop", Array.isArray(plan.weeklyLoop) && plan.weeklyLoop.length >= 5, "Defines a weekly loop."],
  ["agents", Array.isArray(plan.agents) && plan.agents.length >= 7, "Defines steward plus six agents."],
  ["gates", Array.isArray(plan.gates) && plan.gates.includes("human_gate"), "Includes human gates."],
  ["metrics", Array.isArray(plan.metrics) && plan.metrics.length >= 3, "Includes success metrics."],
  ["deployment", Boolean(plan.deployment), "Names a deployment path."]
];

const passed = checks.filter(([, ok]) => ok).length;
const score = Math.round((passed / checks.length) * 100);

console.log(
  JSON.stringify(
    {
      score,
      passed,
      total: checks.length,
      checks: checks.map(([id, ok, description]) => ({ id, ok, description }))
    },
    null,
    2
  )
);
