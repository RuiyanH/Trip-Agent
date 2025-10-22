import { type ToolResult } from "../agent/types";

export async function searchFlightsStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: [] }; // Day-1: empty; real impl Day-4
}

export async function getFlightDetailsStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: null };
}
