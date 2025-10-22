import { describe, it, expect } from "vitest";
import { normalizeAmadeusOffers, normalizeDuffelOffers } from "../lib/flights/normalizers";

const am = { data: [{ id: "am1", itineraries: [{ segments: [{ carrierCode: "AA", number: "100", departure: { iataCode: "JFK", at: "2025-10-03T10:00:00Z" }, arrival: { iataCode: "KIX", at: "2025-10-04T02:00:00Z" }, duration: "PT14H" }] }], price: { currency: "USD", total: "999.00" }, travelerPricings: [] }] };
const df = [{ id: "df1", total_amount: "200.00", slices: [{ segments: [{ origin: { iata_code: "NYC" }, destination: { iata_code: "ATL" }, marketing_carrier: { iata_code: "DL" }, marketing_carrier_flight_number: "50", departing_at: "2025-10-03T08:00:00Z", arriving_at: "2025-10-03T10:00:00Z", duration: "PT2H" }] }] }];

describe("flights normalizers", () => {
  it("amadeus → normalized", () => {
    const out = normalizeAmadeusOffers(am);
    expect(out[0].slices.length).toBeGreaterThan(0);
    expect(out[0].price.currency).toBeDefined();
  });
  it("duffel → normalized", () => {
    const out = normalizeDuffelOffers(df as any, "USD");
    expect(out[0].provider).toBe("duffel");
    expect(out[0].price.total).toBeGreaterThan(0);
  });
});



