import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { allow } from "@/lib/tools/rateLimit";
import { cacheKey, cacheGet, cacheSet } from "@/lib/tools/cache";
import { duffelSearch } from "@/lib/flights/duffel.search";
import { amadeusSearch } from "@/lib/flights/amadeus.search";
import { type FlightSearchArgs } from "@/lib/agent/flights.types";

const schema = z.object({
  provider: z.enum(["duffel", "amadeus"]),
  searchArgs: z.object({
    slices: z
      .array(
        z.object({
          origin: z.string().length(3),
          destination: z.string().length(3),
          departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        })
      )
      .min(1)
      .max(6),
    cabin: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).optional(),
    passengers: z
      .array(z.object({ type: z.enum(["ADT", "CHD", "INF"]), count: z.number().min(0).max(9) }))
      .min(1),
    maxOffers: z.number().min(1).max(250).optional(),
    allowChangeOfAirport: z.boolean().optional(),
    nonStop: z.boolean().optional(),
    currency: z.string().length(3).optional()
  })
});

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  const { provider, searchArgs } = parsed.data;
  const key = cacheKey(`flights:${provider}:search`, searchArgs);
  const cached = await cacheGet<any>(key);
  if (cached) return NextResponse.json(cached);

  try {
    const resp = provider === "duffel" ? await duffelSearch(searchArgs as FlightSearchArgs) : await amadeusSearch(searchArgs as FlightSearchArgs);
    await cacheSet(key, resp, 15 * 60);
    return NextResponse.json(resp);
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}



