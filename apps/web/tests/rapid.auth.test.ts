import { describe, it, expect } from "vitest";
import { rapidAuthHeader } from "../lib/rapid/auth";

describe("rapid auth", () => {
  it("builds EAN Authorization header with sha512 (fixed ts)", () => {
    process.env.RAPID_API_KEY = "ak_test";
    process.env.RAPID_SHARED_SECRET = "ss_test";
    const ts = 1723500000;
    const h = rapidAuthHeader(ts);
    expect(h.startsWith("EAN apikey=ak_test,signature=")).toBe(true);
    const sigHex = h.split("signature=")[1].split(",")[0];
    expect(sigHex).toMatch(/^[a-f0-9]{128}$/);
    expect(h.endsWith(",timestamp=1723500000")).toBe(true);
  });
});



