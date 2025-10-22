import { type ChatMessage, type DraftItinerary, type SessionState } from "./types";
import fs from "node:fs";
import path from "node:path";

export async function runAgentDraft(
  messages: ChatMessage[],
  sessionState: SessionState
): Promise<DraftItinerary> {
  // Day-1: return deterministic fixture (no external calls)
  // Resolve relative to this file to work from any CWD
  const p = path.join(__dirname, "../../fixtures/itinerary.osaka.3d.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as DraftItinerary;
}
