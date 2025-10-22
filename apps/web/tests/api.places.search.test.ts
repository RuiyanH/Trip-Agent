import { describe, it, expect, vi, beforeEach } from "vitest";
import { placesSearch } from "../lib/tools/maps.google";

// Mock the cache module
vi.mock("../lib/tools/cache", () => ({
  cacheKey: vi.fn(() => "test-cache-key"),
  cacheGet: vi.fn(() => null),
  cacheSet: vi.fn()
}));

// Mock the http module
vi.mock("../lib/tools/http", () => ({
  httpJson: vi.fn().mockResolvedValue({
    places: [{
      id: "places/xyz",
      displayName: { text: "Ramen Sample" },
      formattedAddress: "Osaka",
      location: { latitude: 34.69, longitude: 135.50 },
      rating: 4.5, userRatingCount: 200, types: ["restaurant"]
    }]
  })
}));

describe("placesSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes", async () => {
    const out = await placesSearch({ textQuery: "ramen in osaka", maxResults: 1 });
    expect(out.places[0].name).toBe("Ramen Sample");
  });
});
