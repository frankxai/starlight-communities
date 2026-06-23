import { describe, expect, it } from "vitest";
import { classifyCommunityAction, defaultSafetyGates } from "../src/gates.js";

describe("community gates", () => {
  it("requires a human gate for public publishing", () => {
    const gate = classifyCommunityAction("public_artifact_publish");
    expect(gate.tier).toBe("human_gate");
  });

  it("blocks professional advice", () => {
    const gate = classifyCommunityAction("professional_advice");
    expect(gate.tier).toBe("blocked");
  });

  it("ships default safety gates for risky external actions", () => {
    const gates = defaultSafetyGates();
    expect(gates.map((gate) => gate.action_kind)).toContain("external_invite_send");
    expect(gates.map((gate) => gate.action_kind)).toContain("paid_service_or_subscription");
  });
});
