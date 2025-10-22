import { FlightSearchArgs, FlightSearchResponse } from "@/lib/agent/flights.types";
import { normalizeDuffelOffers } from "./normalizers";

export async function duffelSearch(args: FlightSearchArgs): Promise<FlightSearchResponse> {
  const token = process.env.DUFFEL_API_TOKEN!;
  const passengers = [
    ...Array.from({ length: args.passengers.find((p) => p.type === "ADT")?.count ?? 1 }).map(() => ({ type: "adult" })),
    ...Array.from({ length: args.passengers.find((p) => p.type === "CHD")?.count ?? 0 }).map(() => ({ type: "child" })),
    ...Array.from({ length: args.passengers.find((p) => p.type === "INF")?.count ?? 0 }).map(() => ({ type: "infant_without_seat" }))
  ];

  const body: any = {
    slices: args.slices.map((s) => ({ origin: s.origin, destination: s.destination, departure_date: s.departureDate })),
    passengers,
    cabin_class: args.cabin?.toLowerCase(),
    return_offers: true,
    max_connections: args.nonStop ? 0 : undefined
  };

  const r = await fetch(`${process.env.DUFFEL_API_BASE}/air/offer_requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  const json = await r.json();
  if (!r.ok) throw new Error(`Duffel search failed: ${r.status} ${JSON.stringify(json)}`);

  const offers = json?.offers ?? json?.data?.offers ?? json?.data ?? [];
  return { offers: normalizeDuffelOffers(offers, args.currency || "USD") };
}



