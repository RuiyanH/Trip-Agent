import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { priceCheck } from "@/lib/rapid/shopping";

const schema = z.object({ href: z.string().min(2) });

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const data = await priceCheck(parsed.data.href);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { allow } from "@/lib/tools/rateLimit";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { priceCheck } from "@/lib/rapid/shopping";

const schema = z.object({ href: z.string().min(2) });

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  if (!allow(sid)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request", detail: parsed.error.format() }, { status: 400 });

  try {
    const data = await priceCheck(parsed.data.href);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "upstream_error", detail: String(e?.message ?? e) }, { status: 502 });
  }
}



