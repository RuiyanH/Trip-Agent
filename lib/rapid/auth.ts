import crypto from "node:crypto";

export function rapidAuthHeader(
  now = Math.floor(Date.now() / 1000),
  apiKey = process.env.RAPID_API_KEY!,
  secret = process.env.RAPID_SHARED_SECRET!
) {
  const sig = crypto
    .createHash("sha512")
    .update(`${apiKey}${secret}${now}`)
    .digest("hex");
  return `EAN apikey=${apiKey},signature=${sig},timestamp=${now}`;
}
