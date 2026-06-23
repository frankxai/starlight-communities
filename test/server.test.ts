import { afterEach, describe, expect, it } from "vitest";
import { createStarlightCommunitiesServer } from "../src/server.js";
import pilotWeek from "../examples/pilot-week.json" with { type: "json" };

let server: ReturnType<typeof createStarlightCommunitiesServer> | undefined;

function listen(): Promise<string> {
  server = createStarlightCommunitiesServer();
  return new Promise((resolve) => {
    server?.listen(0, "127.0.0.1", () => {
      const address = server?.address();
      if (typeof address === "object" && address) resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

afterEach(() => {
  server?.close();
  server = undefined;
});

describe("HTTP server", () => {
  it("responds to health checks", async () => {
    const baseUrl = await listen();
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("generates run sheets over HTTP", async () => {
    const baseUrl = await listen();
    const response = await fetch(`${baseUrl}/v1/run-sheet`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(pilotWeek)
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.run_sheet.commitments).toHaveLength(6);
  });
});
