import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { CommunitySteward } from "./steward.js";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function runSimulation() {
  console.log("Starting onboarding simulation: Flow A");
  
  const serverScript = join(__dirname, "../../starlight-mcp-hub/src/index.ts");
  
  const transport = new StdioClientTransport({
    command: "node",
    args: ["--import", "tsx", serverScript]
  });

  const mcpClient = new Client(
    { name: "steward-simulation", version: "1.0.0" },
    { capabilities: {} }
  );

  console.log("Connecting to MCP server...");
  await mcpClient.connect(transport);
  console.log("Connected to MCP server.");

  const steward = new CommunitySteward(mcpClient);
  
  console.log("Simulating: User joined and posted intro.");
  await steward.processIntros("intros-channel");
  
  console.log("Simulation complete.");
  process.exit(0);
}

runSimulation().catch(err => {
  console.error("Simulation failed:", err);
  process.exit(1);
});
