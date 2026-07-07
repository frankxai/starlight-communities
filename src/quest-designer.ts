import { createQuest } from "./quests.js";
import { type Quest, type ChallengeType } from "./schemas.js";

export interface QuestDesignerContext {
  targetAudience: string;
  theme: string;
  weeks: number;
  tier: "tier_1" | "tier_2" | "tier_3";
}

/**
 * Quest Designer Agent
 * Purpose: Turn weekly themes into quest cards, personal prompts, and team challenges.
 */
export class QuestDesignerAgent {
  public designSeries(context: QuestDesignerContext): Quest[] {
    // We select a sequence of challenge types suitable for the Visible Proof theme
    const challengeSequence: ChallengeType[] = [
      "mind_map",
      "freedom_system",
      "offer_seed",
      "ai_companion"
    ];

    const quests: Quest[] = [];

    for (let i = 0; i < context.weeks; i++) {
      const challenge_type = challengeSequence[i % challengeSequence.length] as ChallengeType;
      const week_id = `week_${i + 1}`;

      const quest = createQuest({
        week_id,
        theme: context.theme,
        challenge_type,
        created_by: "quest_designer"
      });

      // Augment for Tier 2 - Starlight Founder Collective
      if (context.tier === "tier_2") {
        quest.difficulty = "advanced";
        quest.title = `${quest.title} (Founder Collective Edition)`;
        quest.prompt = `[Agentic Challenge] ${quest.prompt} 
Requirement: Your approach must be agentic. Delegate at least one major component of this quest to an AI agent, script, or automated workflow to multiply your leverage.`;
        quest.expected_artifact = `${quest.expected_artifact} (Must include proof of the agentic workflow used).`;
      }

      quests.push(quest);
    }

    return quests;
  }
}
