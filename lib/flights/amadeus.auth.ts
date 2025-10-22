let tokenCache: { access_token: string; expires_at: number } | null = null;

export async function getAmadeusToken() {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.expires_at - 60 > now) return tokenCache.access_token;

  const res = await fetch(`${process.env.AMADEUS_API_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID!,
      client_secret: process.env.AMADEUS_CLIENT_SECRET!
    })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status} ${JSON.stringify(json)}`);
  tokenCache = {
    access_token: json.access_token,
    expires_at: Math.floor(Date.now() / 1000) + (json.expires_in ?? 1800)
  };
  return tokenCache.access_token;
}



