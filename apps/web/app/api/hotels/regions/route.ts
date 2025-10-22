import { NextRequest, NextResponse } from "next/server";
import { regionsByArea } from "@/lib/rapid/geography";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";

const schema = z.object({
  km: z.coerce.number().min(0).max(200),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  type: z.enum(["city","neighborhood","multi_city_vicinity"]).optional(),
  countryCode: z.string().length(2).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export async function GET(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = schema.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const regions = await regionsByArea(parsed.data);
    return NextResponse.json({ regions });
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { regionsByArea } from "@/lib/rapid/geography";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";

const schema = z.object({
  km: z.coerce.number().min(0).max(200),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  type: z.enum(["city","neighborhood","multi_city_vicinity"]).optional(),
  countryCode: z.string().length(2).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export async function GET(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = schema.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const regions = await regionsByArea(parsed.data);
    return NextResponse.json({ regions });
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}



