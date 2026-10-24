import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateWeeklyRunSheet } from "./run-sheet.js";
import { generateCommunityBlueprint } from "./strategy.js";

const MAX_BODY_BYTES = 1_000_000;

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > MAX_BODY_BYTES) throw new Error("Request body too large.");
    chunks.push(buffer);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(`${JSON.stringify(body, null, 2)}\n`);
}

function routeNotFound(res: ServerResponse): void {
  sendJson(res, 404, {
    ok: false,
    error: "Not found",
    routes: ["GET /health", "POST /v1/run-sheet", "POST /v1/blueprint"]
  });
}

export function createStarlightCommunitiesServer(): Server {
  return createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/health") {
        sendJson(res, 200, {
          ok: true,
          service: "starlight-communities",
          version: "0.1.0"
        });
        return;
      }

      if (req.method === "POST" && req.url === "/v1/run-sheet") {
        const input = await readJson(req);
        sendJson(res, 200, {
          ok: true,
          run_sheet: generateWeeklyRunSheet(input as never)
        });
        return;
      }

      if (req.method === "POST" && req.url === "/v1/blueprint") {
        const input = await readJson(req);
        sendJson(res, 200, {
          ok: true,
          blueprint: generateCommunityBlueprint(input as never)
        });
        return;
      }

      routeNotFound(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 400, {
        ok: false,
        error: message
      });
    }
  });
}

const isDirectRun = process.argv[1] ? fileURLToPath(import.meta.url) === resolve(process.argv[1]) : false;

if (isDirectRun) {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";
  createStarlightCommunitiesServer().listen(port, host, () => {
    console.log(`starlight-communities listening on http://${host}:${port}`);
  });
}
