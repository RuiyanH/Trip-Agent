import { describe, it, expect } from "vitest";

describe("rapid shopping normalizer", () => {
  it("normalizes shop response", async () => {
    const raw = [{
      property_id: "999",
      rooms: [{
        id: "room1",
        room_name: "Standard Room",
        rates: [{
          id: "rate1",
          occupancy_pricing: {
            "2": {
              totals: {
                inclusive: { request_currency: { value: 300, currency: "USD" } },
                exclusive: { request_currency: { value: 260, currency: "USD" } },
                property_inclusive: { billable_currency: { value: 320, currency: "JPY" }, request_currency: { value: 300, currency: "USD" } }
              }
            }
          },
          cancellation: { refundable: true, free_until: "2025-10-01T00:00:00Z" },
          links: { price_check: { href: "/v3/price-check?token=abc" } },
          payment_terms: { type: "expedia_collect" }
        }]
      }]
    }];

    const { normalizeShopResponse } = await import("../lib/rapid/normalizers");
    const out = normalizeShopResponse(raw);
    expect(out.hotels[0].propertyId).toBe("999");
    expect(out.hotels[0].rates[0].totals.inclusive?.currency).toBe("USD");
    expect(out.hotels[0].rates[0].priceCheckLink).toContain("price-check");
  });
});

import { describe, it, expect } from "vitest";
import { normalizeShopResponse, normalizePriceCheck } from "../lib/rapid/normalizers";

describe("rapid shopping normalizer", () => {
  it("maps shop response", () => {
    const raw = [{
      property_id: "p1",
      rooms: [{
        id: "r1",
        room_name: "Double",
        rates: [{
          id: "rate1",
          occupancy_pricing: {
            2: { totals: {
              inclusive: { request_currency: { value: 200, currency: "USD" } },
              property_inclusive: { billable_currency: { value: 210, currency: "JPY" } }
            }}
          },
          cancellation: { refundable: true, free_until: "2025-10-01T00:00:00" },
          links: { price_check: { href: "/v3/price-check?token=abc" } },
          payment_terms: { type: "expedia_collect" }
        }]
      }]
    }];
    const out = normalizeShopResponse(raw);
    expect(out.hotels[0].propertyId).toBe("p1");
    expect(out.hotels[0].rates[0].totals?.inclusive?.currency).toBe("USD");
    expect(out.hotels[0].rates[0].priceCheckLink).toContain("price-check");
  });

  it("maps price check", () => {
    const raw = { status: "MATCHED", links: { booking: { href: "/v3/booking?token=x" } }, occupancies: {} };
    const out = normalizePriceCheck(raw);
    expect(out.status).toBe("matched");
    expect(out.bookingLink).toContain("booking");
  });
});



