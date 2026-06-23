import type { CadenceItem } from "./schemas.js";

export const weeklyCadence: CadenceItem[] = [
  {
    day: "monday",
    system_action: "Send weekly quest and personal prompt.",
    human_effect: "direction",
    output: "Quest card and personal commitment."
  },
  {
    day: "tuesday",
    system_action: "Propose 1:1 or pair spark calls.",
    human_effect: "intimacy and momentum",
    output: "Pair agenda and next micro-step."
  },
  {
    day: "wednesday",
    system_action: "Run deep creation lab.",
    human_effect: "artifact",
    output: "Draft, map, prompt, post, event plan, or agent."
  },
  {
    day: "thursday",
    system_action: "Request async voice or video updates.",
    human_effect: "social proof",
    output: "Proof note, blocker, and next move."
  },
  {
    day: "friday",
    system_action: "Run demo, reflection, and recognition.",
    human_effect: "dopamine and closure",
    output: "Artifact record, reflection, next commitment."
  },
  {
    day: "weekend",
    system_action: "Offer salon, walk, or event prompt.",
    human_effect: "community and beauty",
    output: "Story, connection note, or event artifact."
  }
];
