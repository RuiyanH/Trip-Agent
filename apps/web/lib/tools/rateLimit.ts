const buckets = new Map<string, { tokens: number; updated: number }>();
const CAP = 30;         // burst
const REFILL = 0.5;     // tokens per second

export function allow(sid: string, cost = 1) {
  const now = Date.now();
  const b = buckets.get(sid) ?? { tokens: CAP, updated: now };
  const elapsed = (now - b.updated) / 1000;
  b.tokens = Math.min(CAP, b.tokens + elapsed * REFILL);
  b.updated = now;
  if (b.tokens < cost) return false;
  b.tokens -= cost;
  buckets.set(sid, b);
  return true;
}

