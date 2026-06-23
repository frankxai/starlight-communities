import { ChallengeTypeSchema, QuestSchema, type ChallengeType, type Quest } from "./schemas.js";
import { slugify, titleCase } from "./util.js";

export interface QuestTemplate {
  challenge_type: ChallengeType;
  title: string;
  prompt: string;
  personal_prompt: string;
  expected_artifact: string;
  proof_type: Quest["proof_type"];
}

export const questTemplates: Record<ChallengeType, QuestTemplate> = {
  mind_map: {
    challenge_type: "mind_map",
    title: "Mind Map Quest",
    prompt: "Create your model of human change and make the model visible.",
    personal_prompt: "What pattern do you keep seeing that other people have not named clearly yet?",
    expected_artifact: "Model, diagram, essay, or tldraw board.",
    proof_type: "map"
  },
  freedom_system: {
    challenge_type: "freedom_system",
    title: "Freedom System Quest",
    prompt: "Map one income, energy, time, or lifestyle lever that would increase practical freedom.",
    personal_prompt: "What lever would make your life feel less rented and more authored?",
    expected_artifact: "Income or lifestyle lever map.",
    proof_type: "doc"
  },
  voice: {
    challenge_type: "voice",
    title: "Voice Quest",
    prompt: "Record a two-minute truth, lesson, or story that carries real signal.",
    personal_prompt: "What do you keep editing out because it feels too honest?",
    expected_artifact: "Two-minute voice note, transcript, or video.",
    proof_type: "voice_note"
  },
  offer_seed: {
    challenge_type: "offer_seed",
    title: "Offer Seed Quest",
    prompt: "Define one thing you can help people with and turn it into a tiny offer seed.",
    personal_prompt: "What problem do people already bring you, even informally?",
    expected_artifact: "Offer sketch, landing copy, or short pitch.",
    proof_type: "doc"
  },
  event_spark: {
    challenge_type: "event_spark",
    title: "Event Spark Quest",
    prompt: "Design a five-person salon, walk, dinner, or micro-event with one beautiful outcome.",
    personal_prompt: "Who would become more alive in the right room together?",
    expected_artifact: "Five-person salon or event plan.",
    proof_type: "event_plan"
  },
  ai_companion: {
    challenge_type: "ai_companion",
    title: "AI Companion Quest",
    prompt: "Build one prompt, agent, or workflow that makes your week more intelligent.",
    personal_prompt: "What recurring drag could an agent quietly remove this week?",
    expected_artifact: "Prompt, agent, workflow, script, or demo.",
    proof_type: "prompt"
  }
};

export interface CreateQuestInput {
  week_id: string;
  theme: string;
  challenge_type: ChallengeType;
  created_by: string;
  cell_id?: string;
}

export function createQuest(input: CreateQuestInput): Quest {
  const challenge_type = ChallengeTypeSchema.parse(input.challenge_type);
  const template = questTemplates[challenge_type];
  const cellSuffix = input.cell_id ? `-${slugify(input.cell_id)}` : "";

  return QuestSchema.parse({
    quest_id: `${slugify(input.week_id)}-${slugify(input.theme)}-${challenge_type}${cellSuffix}`,
    week_id: input.week_id,
    cell_id: input.cell_id,
    challenge_type,
    theme: input.theme,
    title: `${titleCase(input.theme)}: ${template.title}`,
    prompt: template.prompt,
    personal_prompt: template.personal_prompt,
    expected_artifact: template.expected_artifact,
    proof_type: template.proof_type,
    difficulty: "all_levels",
    created_by: input.created_by,
    gates: ["professional_advice_block", "publish_requires_human_approval"]
  });
}
