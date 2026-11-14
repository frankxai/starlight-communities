#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { compileAcademyCircleHandoff, type AcademyCohortWeekInput } from "./academy-circle-handoff.js";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import { PilotInputSchema } from "./schemas.js";

async function main(): Promise<void> {
  const [command, inputPath] = process.argv.slice(2);

  if (!inputPath || (command !== "run-sheet" && command !== "academy-handoff")) {
    console.error("Usage: starlight-communities <run-sheet|academy-handoff> <input.json>");
    process.exitCode = 1;
    return;
  }

  const raw = JSON.parse(await readFile(inputPath, "utf8"));
  if (command === "academy-handoff") {
    const plan = compileAcademyCircleHandoff(raw as AcademyCohortWeekInput);
    process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
    return;
  }

  const input = PilotInputSchema.parse(raw);
  const runSheet = generateWeeklyRunSheet(input);
  process.stdout.write(`${JSON.stringify(runSheet, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
