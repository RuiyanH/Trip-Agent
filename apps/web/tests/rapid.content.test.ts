import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/rapid/http", () => ({
  rapidGET: vi.fn().mockResolvedValue({ property_ids_expanded: ["111","222","333"] })
}));

describe("rapid content", () => {
  it("propertyIdsForRegion returns string ids", async () => {
    const { propertyIdsForRegion } = await import("../lib/rapid/content");
    const ids = await propertyIdsForRegion("602958", true);
    expect(ids).toEqual(["111","222","333"]);
  });
});

import { describe, it, expect, vi } from "vitest";
import { propertyIdsForRegion } from "../lib/rapid/content";

vi.mock("../lib/rapid/http", () => ({
  rapidGET: vi.fn().mockResolvedValue({ property_ids_expanded: ["111","222","333"] })
}));

vi.mock("../lib/tools/cache", () => ({
  cacheKey: vi.fn(() => "k"),
  cacheGet: vi.fn(async () => null),
  cacheSet: vi.fn(async () => {})
}));

describe("rapid content", () => {
  it("returns property ids", async () => {
    const ids = await propertyIdsForRegion("r1", true);
    expect(ids).toEqual(["111","222","333"]);
  });
});



