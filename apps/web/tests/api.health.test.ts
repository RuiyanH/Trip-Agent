import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../app/api/health/route";

describe("health endpoint", () => {
  it("returns health status", async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      service: "trip-agent"
    });
  });
});
