import { FlightSearchArgs, FlightSearchResponse, AmadeusPriceConfirmArgs } from "@/lib/agent/flights.types";
import { getAmadeusToken } from "./amadeus.auth";
import { normalizeAmadeusOffers } from "./normalizers";

export async function amadeusSearch(args: FlightSearchArgs): Promise<FlightSearchResponse> {
  const token = await getAmadeusToken();
  const adults = args.passengers.find((p) => p.type === "ADT")?.count ?? 1;
  const children = args.passengers.find((p) => p.type === "CHD")?.count ?? 0;
  const infants = args.passengers.find((p) => p.type === "INF")?.count ?? 0;

  const payload: any = {
    currencyCode: args.currency || "USD",
    travelers: [
      ...Array.from({ length: adults }).map((_, i) => ({ id: String(i + 1), travelerType: "ADULT" })),
      ...Array.from({ length: children }).map((_, i) => ({ id: String(adults + i + 1), travelerType: "CHILD" })),
      ...Array.from({ length: infants }).map((_, i) => ({ id: String(adults + children + i + 1), travelerType: "HELD_INFANT" }))
    ],
    sources: ["GDS"],
    searchCriteria: {
      maxFlightOffers: args.maxOffers ?? 50,
      flightFilters: {
        cabinRestrictions: args.cabin
          ? [
              {
                cabin: args.cabin,
                coverage: "MOST_SEGMENTS",
                originDestinationIds: ["*"]
              }
            ]
          : undefined,
        connectionRestriction: args.nonStop ? { maxNumberOfConnections: 0 } : undefined,
        changeOfAirport: args.allowChangeOfAirport ?? false
      }
    },
    originDestinations: args.slices.map((s, idx) => ({
      id: `OD${idx + 1}`,
      originLocationCode: s.origin,
      destinationLocationCode: s.destination,
      departureDateTimeRange: { date: s.departureDate }
    }))
  };

  const r = await fetch(`${process.env.AMADEUS_API_BASE}/v2/shopping/flight-offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const json = await r.json();
  if (!r.ok) throw new Error(`Amadeus search failed: ${r.status} ${JSON.stringify(json)}`);
  return { offers: normalizeAmadeusOffers(json) };
}

export async function amadeusPriceConfirm(args: AmadeusPriceConfirmArgs) {
  const token = await getAmadeusToken();
  const payload = { data: { type: "flight-offers-pricing", flightOffers: [args.offer] } };
  const r = await fetch(`${process.env.AMADEUS_API_BASE}/v1/shopping/flight-offers/pricing`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const json = await r.json();
  if (!r.ok) throw new Error(`Amadeus price confirm failed: ${r.status} ${JSON.stringify(json)}`);
  return json;
}



