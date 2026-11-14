#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  compileAcademyCircleHandoff,
  compileCohortCalendarIcs,
  type AcademyCohortWeekInput,
  type AcademyIcpLens,
  type CohortCalendarInput
} from "./academy-circle-handoff.js";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import { PilotInputSchema } from "./schemas.js";

interface ParsedCalendarCliArgs {
  inputJsonPath?: string;
  cohort?: string;
  start?: string;
  weeks?: number;
  label?: string;
  icpLens?: AcademyIcpLens;
  outPath?: string;
  format?: "json" | "ics";
}

function parseAcademyCalendarArgs(args: string[]): ParsedCalendarCliArgs {
  const result: ParsedCalendarCliArgs = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === "--cohort" && args[i + 1]) {
      result.cohort = args[i + 1];
      i += 1;
    } else if (token.startsWith("--cohort=")) {
      result.cohort = token.slice("--cohort=".length);
    } else if (token === "--start" && args[i + 1]) {
      result.start = args[i + 1];
      i += 1;
    } else if (token.startsWith("--start=")) {
      result.start = token.slice("--start=".length);
    } else if (token === "--weeks" && args[i + 1]) {
      result.weeks = Number(args[i + 1]);
      i += 1;
    } else if (token.startsWith("--weeks=")) {
      result.weeks = Number(token.slice("--weeks=".length));
    } else if (token === "--label" && args[i + 1]) {
      result.label = args[i + 1];
      i += 1;
    } else if (token.startsWith("--label=")) {
      result.label = token.slice("--label=".length);
    } else if (token === "--lens" && args[i + 1]) {
      result.icpLens = args[i + 1] as AcademyIcpLens;
      i += 1;
    } else if (token.startsWith("--lens=")) {
      result.icpLens = token.slice("--lens=".length) as AcademyIcpLens;
    } else if (token === "--out" && args[i + 1]) {
      result.outPath = args[i + 1];
      i += 1;
    } else if (token.startsWith("--out=")) {
      result.outPath = token.slice("--out=".length);
    } else if (token === "--format" && args[i + 1]) {
      const fmt = args[i + 1].toLowerCase();
      if (fmt === "json" || fmt === "ics") {
        result.format = fmt;
      } else {
        throw new Error(`Unsupported --format "${args[i + 1]}"; expected "json" or "ics".`);
      }
      i += 1;
    } else if (token.startsWith("--format=")) {
      const fmt = token.slice("--format=".length).toLowerCase();
      if (fmt === "json" || fmt === "ics") {
        result.format = fmt;
      } else {
        throw new Error(`Unsupported --format "${fmt}"; expected "json" or "ics".`);
      }
    } else if (token === "--ics") {
      result.format = "ics";
    } else if (token === "--json") {
      result.format = "json";
    } else if (!token.startsWith("-") && !result.inputJsonPath) {
      result.inputJsonPath = token;
    } else {
      throw new Error(`Unknown or incomplete flag for academy-calendar: ${token}`);
    }
  }

  return result;
}

async function runAcademyCalendarCli(args: string[]): Promise<void> {
  const parsedArgs = parseAcademyCalendarArgs(args);
  let baseInput: Partial<CohortCalendarInput> = {};

  if (parsedArgs.inputJsonPath) {
    baseInput = JSON.parse(await readFile(parsedArgs.inputJsonPath, "utf8")) as Partial<CohortCalendarInput>;
  }

  const cohortId = parsedArgs.cohort ?? baseInput.cohort_id ?? "academy-cohort-01";
  const calendarInput: CohortCalendarInput = {
    ...baseInput,
    cohort_id: cohortId,
    ...(parsedArgs.start !== undefined ? { start_date: parsedArgs.start } : {}),
    ...(parsedArgs.weeks !== undefined ? { weeks: parsedArgs.weeks } : {}),
    ...(parsedArgs.label !== undefined ? { cohort_label: parsedArgs.label } : {}),
    ...(parsedArgs.icpLens !== undefined ? { icp_lens: parsedArgs.icpLens } : {})
  };

  const compiled = compileCohortCalendarIcs(calendarInput);

  if (parsedArgs.outPath) {
    await mkdir(dirname(parsedArgs.outPath), { recursive: true });
    const emitJsonFile =
      parsedArgs.format === "json" ||
      (parsedArgs.format === undefined && parsedArgs.outPath.toLowerCase().endsWith(".json"));
    const payload = emitJsonFile ? `${JSON.stringify(compiled, null, 2)}\n` : compiled.ics;
    await writeFile(parsedArgs.outPath, payload, "utf8");
    process.stdout.write(
      `${JSON.stringify(
        {
          schema_version: compiled.schema_version,
          cohort_id: compiled.cohort_id,
          start_date: compiled.start_date,
          weeks: compiled.weeks,
          event_count: compiled.event_count,
          calendar_digest: compiled.calendar_digest,
          out: parsedArgs.outPath,
          format: emitJsonFile ? "json" : "ics"
        },
        null,
        2
      )}\n`
    );
    return;
  }

  if (parsedArgs.format === "ics") {
    process.stdout.write(compiled.ics);
    return;
  }

  process.stdout.write(`${JSON.stringify(compiled, null, 2)}\n`);
}

async function main(): Promise<void> {
  const [command, ...restArgs] = process.argv.slice(2);

  if (command === "academy-calendar") {
    await runAcademyCalendarCli(restArgs);
    return;
  }

  const [inputPath] = restArgs;
  if (!inputPath || (command !== "run-sheet" && command !== "academy-handoff")) {
    console.error(
      "Usage: starlight-communities <run-sheet|academy-handoff> <input.json> | academy-calendar [--cohort <slug>] [--start YYYY-MM-DD] [--weeks 1..12] [--format json|ics] [--out <path>]"
    );
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
