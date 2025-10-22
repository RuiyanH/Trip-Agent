import { HotelShopResponse, NormalizedHotel, NormalizedRate, RateTotals } from "@/lib/agent/hotels.types";

export function normalizeShopResponse(raw: any): HotelShopResponse {
  const hotels: NormalizedHotel[] = (raw ?? []).map((p: any) => {
    const rates: NormalizedRate[] = (p.rooms ?? []).flatMap((r: any) => {
      const roomId = r.id ?? r.room_id ?? "";
      const roomName = r.room_name ?? r.name ?? "";
      return (r.rates ?? []).map((rate: any) => {
        const occKey = Object.keys(rate.occupancy_pricing ?? {})[0];
        const totalsNode = rate.occupancy_pricing?.[occKey]?.totals ?? {};

        const totals: RateTotals = {
          inclusive: totalsNode?.inclusive?.request_currency ? money(totalsNode.inclusive.request_currency) : undefined,
          inclusiveStrikethrough: totalsNode?.inclusive_strikethrough?.request_currency ? money(totalsNode.inclusive_strikethrough.request_currency) : undefined,
          exclusive: totalsNode?.exclusive?.request_currency ? money(totalsNode.exclusive.request_currency) : undefined,
          strikethrough: totalsNode?.strikethrough?.request_currency ? money(totalsNode.strikethrough.request_currency) : undefined,
          propertyInclusive: totalsNode?.property_inclusive ? {
            billableCurrency: totalsNode.property_inclusive.billable_currency ? money(totalsNode.property_inclusive.billable_currency) : undefined,
            requestCurrency: totalsNode.property_inclusive.request_currency ? money(totalsNode.property_inclusive.request_currency) : undefined
          } : undefined
        };

        const cancellable = !!rate.cancellation?.refundable;
        const freeUntil = rate.cancellation?.free_until ?? rate.cancellation?.free_cancellation_by;
        const board = rate.board ?? rate.board_type;
        const loyaltyEligible = (rate.amenities ?? []).some((a: any) => a?.name?.toLowerCase().includes("loyalty"));

        return {
          rateId: String(rate.id ?? rate.rate_id ?? `${roomId}:unknown`),
          roomId,
          roomName,
          occupancy: Number(occKey ?? 0) || rate.occupancy || 2,
          board,
          cancellation: {
            refundable: cancellable,
            freeUntil: freeUntil || undefined,
            policyText: rate.cancellation?.description
          },
          totals,
          priceCheckLink: rate.links?.price_check?.href,
          paymentType: rate.payment_terms?.type,
          loyaltyEligible
        } as NormalizedRate;
      });
    });

    return {
      propertyId: String(p.property_id),
      rates
    } as NormalizedHotel;
  });

  return { hotels };
}

function money(n: any) {
  return { value: Number(n?.value ?? 0), currency: String(n?.currency ?? "") };
}

export function normalizePriceCheck(raw: any) {
  const status = String(raw?.status ?? "unknown").toLowerCase();
  const bookingLink = raw?.links?.booking?.href || raw?.links?.payment_session?.href;
  const occ = raw?.occupancies ?? {};
  const firstOcc = Object.values(occ)[0] as any;
  const totals = firstOcc?.totals ? {
    inclusive: firstOcc.totals.inclusive?.request_currency && money(firstOcc.totals.inclusive.request_currency),
    exclusive: firstOcc.totals.exclusive?.request_currency && money(firstOcc.totals.exclusive.request_currency),
  } : undefined;

  let mapped: "matched"|"changed"|"unavailable" = "unavailable";
  if (status.includes("matched")) mapped = "matched";
  else if (status.includes("changed")) mapped = "changed";

  return { status: mapped, bookingLink, updatedTotals: totals };
}

// (Removed duplicate re-exports accidentally appended)



