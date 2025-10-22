import { type ToolResult } from "../agent/types";

export async function searchPlacesStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: [] }; // Day-1: empty; real impl Day-2
}

export async function getPlaceDetailsStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: null };
}

export async function distanceMatrixStub(_args: unknown): Promise<ToolResult> {
  return { ok: true, data: [] };
}
