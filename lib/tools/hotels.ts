import { type ToolResult } from "../agent/types";

export async function searchHotelsStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: [] }; // Day-1: empty; real impl Day-3
}

export async function getHotelDetailsStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: null };
}
