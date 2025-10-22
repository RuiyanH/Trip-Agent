import { describe, it, expect } from "vitest";
import { runAgentDraft } from "../lib/agent";
import { type ChatMessage, type SessionState } from "../lib/agent/types";

describe("agent router", () => {
  it("returns deterministic fixture itinerary", async () => {
    const messages: ChatMessage[] = [
      { role: "user", content: "Plan 3 days in Osaka" }
    ];
    
    const state: SessionState = {
      destination: "Osaka, JP",
      dates: { start: "2024-01-01", end: "2024-01-04" },
      pax: { adults: 2 }
    };

    const itinerary = await runAgentDraft(messages, state);
    
    expect(itinerary).toBeTruthy();
    expect(itinerary.days).toHaveLength(3);
    expect(itinerary.days[0].day).toBe(1);
    expect(itinerary.days[0].slots).toHaveLength(3);
    expect(itinerary.days[1].day).toBe(2);
    expect(itinerary.days[1].slots).toHaveLength(4);
    expect(itinerary.days[2].day).toBe(3);
    expect(itinerary.days[2].slots).toHaveLength(3);
    
    // Check specific fixture content
    expect(itinerary.days[0].slots[0].type).toBe("hotel");
    expect(itinerary.days[0].slots[0].name).toBe("Hotel Sample Namba");
    expect(itinerary.days[1].slots[1].type).toBe("poi");
    expect(itinerary.days[1].slots[1].name).toBe("Cycling along Yodogawa");
    expect(itinerary.days[2].slots[2].type).toBe("meal");
    expect(itinerary.days[2].slots[2].name).toBe("Kushikatsu Night");
  });
});
