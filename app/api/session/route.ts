import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  const body = (await req.json().catch(() => ({}))) ?? {};
  const state = body.state ?? {};
  const existing = await prisma.session.findUnique({ where: { id: sid } }).catch(() => null);
  if (!existing) {
    await prisma.session.create({ data: { id: sid, state: JSON.stringify(state) } });
  }
  return NextResponse.json({ id: sid });
}

export async function PUT(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  const { state } = await req.json();
  await prisma.session.update({ where: { id: sid }, data: { state: JSON.stringify(state) } });
  return NextResponse.json({ id: sid, updated: true });
}
