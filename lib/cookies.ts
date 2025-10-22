import { cookies } from "next/headers";
import crypto from "crypto";

export function getOrCreateSessionCookie() {
  const c = cookies();
  let sid = c.get("sid")?.value;
  if (!sid) {
    sid = crypto.randomUUID();
    c.set("sid", sid, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  }
  return sid;
}
