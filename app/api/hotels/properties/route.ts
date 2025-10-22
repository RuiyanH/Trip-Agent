import { NextRequest, NextResponse } from "next/server";
import { propertyIdsForRegion } from "@/lib/rapid/content";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";

const schema = z.object({
  regionId: z.string(),
  expanded: z.coerce.boolean().optional()
});

export async function GET(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = schema.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const ids = await propertyIdsForRegion(parsed.data.regionId, parsed.data.expanded ?? true);
    return NextResponse.json({ propertyIds: ids });
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { propertyIdsForRegion } from "@/lib/rapid/content";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";

const schema = z.object({
  regionId: z.string(),
  expanded: z.coerce.boolean().optional()
});

export async function GET(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = schema.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const ids = await propertyIdsForRegion(parsed.data.regionId, parsed.data.expanded ?? true);
    return NextResponse.json({ propertyIds: ids });
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}



