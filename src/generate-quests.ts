import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { QuestDesignerAgent } from "./quest-designer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const designer = new QuestDesignerAgent();
  
  // Design 4 weeks of 'Visible Proof' quests for Starlight Founder Collective (Tier 2)
  const quests = designer.designSeries({
    targetAudience: "Starlight Founder Collective",
    theme: "Visible Proof",
    weeks: 4,
    tier: "tier_2"
  });

  let markdown = `# Starlight Founder Collective
## Visible Proof - First 4 Quests (Tier 2)

These quests are designed to be challenging and agentic. Do not settle for manual effort where AI can leverage your output.

---

`;

  for (const q of quests) {
    markdown += `### ${q.week_id.replace("_", " ").toUpperCase()}: ${q.title}
**Theme**: ${q.theme}
**Difficulty**: ${q.difficulty}
**Quest ID**: \`${q.quest_id}\`

#### Challenge Prompt
${q.prompt}

#### Personal Prompt
${q.personal_prompt}

#### Expected Artifact
${q.expected_artifact}
*Proof type requirement: \`${q.proof_type}\`*

---

`;
  }

  const docsDir = path.resolve(__dirname, "..", "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const outputPath = path.join(docsDir, "FIRST_4_QUESTS.md");
  fs.writeFileSync(outputPath, markdown, "utf-8");
  
  console.log(`Success! Generated first 4 quests at ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating quests:", err);
  process.exit(1);
});
