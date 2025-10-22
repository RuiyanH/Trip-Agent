import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { shopAvailability } from "@/lib/rapid/shopping";
import { chunk } from "@/lib/util/chunk";

const occ = z.object({ adults: z.number().min(1), childrenAges: z.array(z.number().min(0).max(17)).optional() });

const schema = z.object({
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  occupancies: z.array(occ).min(1).max(8),
  currency: z.string().min(3).max(3),
  countryCode: z.string().length(2),
  language: z.string().min(2),
  propertyIds: z.array(z.string()).min(1).max(250),
  travelPurpose: z.enum(["leisure","business"]).optional(),
  includeDealsOnly: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const ids = parsed.data.propertyIds;
    const batches = chunk(ids, 250);
    const enrich = !!(body?.enrich);

    const results = await Promise.all(batches.map(b => shopAvailability({ ...parsed.data, propertyIds: b })));

    const byId = new Map<string, any>();
    for (const r of results) {
      for (const h of r.hotels) {
        const prev = byId.get(h.propertyId);
        if (!prev) byId.set(h.propertyId, h);
        else {
          const seen = new Set(prev.rates.map((x: any) => x.rateId));
          for (const rr of h.rates) if (!seen.has(rr.rateId)) prev.rates.push(rr);
        }
      }
    }
    let hotels = Array.from(byId.values());

    if (enrich && hotels.length) {
      const { enrichHotelsContent } = await import("@/lib/rapid/content.details");
      hotels = await enrichHotelsContent(hotels);
    }

    return NextResponse.json({ hotels });
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { shopAvailability } from "@/lib/rapid/shopping";

const occ = z.object({ adults: z.number().min(1), childrenAges: z.array(z.number().min(0).max(17)).optional() });

const schema = z.object({
  checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  occupancies: z.array(occ).min(1).max(8),
  currency: z.string().min(3).max(3),
  countryCode: z.string().length(2),
  language: z.string().min(2),
  propertyIds: z.array(z.string()).min(1).max(250),
  travelPurpose: z.enum(["leisure","business"]).optional(),
  includeDealsOnly: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const data = await shopAvailability(parsed.data);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}



