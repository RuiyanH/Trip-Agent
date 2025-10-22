import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionCookie } from "@/lib/cookies";
import { runAgentDraft } from "@/lib/agent";
import { type ChatMessage, type SessionState } from "@/lib/agent/types";

export async function POST(req: NextRequest) {
  const sid = getOrCreateSessionCookie();
  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  
  // Ensure session exists first
  const existingSession = await prisma.session.findUnique({ where: { id: sid } });
  if (!existingSession) {
    await prisma.session.create({ data: { id: sid, state: JSON.stringify({}) } });
  }
  
  const session = await prisma.session.findUnique({ where: { id: sid } });
  const state = session?.state ? JSON.parse(session.state) as SessionState : {};
  const itinerary = await runAgentDraft(messages ?? [], state);
  
  // Persist or upsert itinerary
  await prisma.itinerary.upsert({
    where: { sessionId: sid },
    update: { days: JSON.stringify(itinerary.days), costUSD: itinerary.costUSD, notes: itinerary.notes ?? null },
    create: { sessionId: sid, days: JSON.stringify(itinerary.days), costUSD: itinerary.costUSD, notes: itinerary.notes ?? null }
  });
  
  return NextResponse.json({ itinerary });
}
