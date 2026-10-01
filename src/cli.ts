#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import { assessHostProgramme } from "./host-programme.js";
import { PilotInputSchema } from "./schemas.js";

async function main(): Promise<void> {
  const [command, inputPath] = process.argv.slice(2);

  if ((command !== "run-sheet" && command !== "assess-programme") || !inputPath) {
    console.error("Usage: starlight-communities <run-sheet|assess-programme> <input.json>");
    process.exitCode = 1;
    return;
  }

  const raw = JSON.parse(await readFile(inputPath, "utf8"));
  const runSheet = command === "assess-programme"
    ? assessHostProgramme(raw)
    : generateWeeklyRunSheet(PilotInputSchema.parse(raw));
  process.stdout.write(`${JSON.stringify(runSheet, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
