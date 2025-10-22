import { describe, it, expect } from "vitest";

describe("rapid price check normalizer", () => {
  it("maps MATCHED status to matched and exposes booking link", async () => {
    const raw = { status: "MATCHED", links: { booking: { href: "/v3/booking?token=xyz" } }, occupancies: { "2": { totals: { inclusive: { request_currency: { value: 300, currency: "USD" } } } } } };
    const { normalizePriceCheck } = await import("../lib/rapid/normalizers");
    const out = normalizePriceCheck(raw);
    expect(out.status).toBe("matched");
    expect(out.bookingLink).toContain("/v3/booking");
  });
});


