import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/rapid/http", () => ({
  rapidGET: vi.fn().mockResolvedValue({ regions: [ { region_id: 123, type: "city", name: "Osaka", country_code: "JP" } ] })
}));

describe("rapid geography", () => {
  it("regionsByArea maps to RapidRegion[] and caches", async () => {
    const { regionsByArea } = await import("../lib/rapid/geography");
    const { cacheGet, cacheSet } = await import("../lib/tools/cache");
    const keySpy = vi.spyOn(await import("../lib/tools/cache"), "cacheKey");

    const out = await regionsByArea({ km: 5, lat: 34.7, lng: 135.5, type: "city", countryCode: "JP" });
    expect(out[0].id).toBe("123");
    expect(out[0].name).toBe("Osaka");
    expect(keySpy).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from "vitest";
import { regionsByArea } from "../lib/rapid/geography";

vi.mock("@/lib/rapid/http", () => ({
  rapidGET: vi.fn().mockResolvedValue({
    regions: [
      { region_id: 123, type: "city", name: "Osaka", country_code: "JP" }
    ]
  })
}));

vi.mock("@/lib/tools/cache", () => ({
  cacheKey: vi.fn(() => "k"),
  cacheGet: vi.fn(async () => null),
  cacheSet: vi.fn(async () => {})
}));

describe("rapid geography", () => {
  it("maps regions", async () => {
    const out = await regionsByArea({ km: 5, lat: 1, lng: 2, type: "city", countryCode: "JP" });
    expect(out[0].id).toBe("123");
    expect(out[0].type).toBe("city");
  });
});



