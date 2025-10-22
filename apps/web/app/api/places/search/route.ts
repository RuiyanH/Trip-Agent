import { NextRequest, NextResponse } from "next/server";
import { placesSearch } from "@/lib/tools/maps.google";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { z } from "zod";

const schema = z.object({
  textQuery: z.string().min(2),
  locationBias: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    radiusMeters: z.number().min(50).max(50000)
  }).optional(),
  includedTypes: z.array(z.string()).optional(),
  maxResults: z.number().min(1).max(20).optional()
});

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const data = await placesSearch(parsed.data);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(err?.message ?? err) }, { status: 502 });
  }
}

