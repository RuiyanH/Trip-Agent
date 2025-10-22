export async function rapidGET<T>(path: string, headers: Record<string,string> = {}): Promise<T> {
  const base = process.env.RAPID_API_BASE!;
  const auth = await import("./auth").then(m => m.rapidAuthHeader());
  const res = await fetch(`${base}${path}`, {
    headers: {
      "authorization": auth,
      "accept": "application/json",
      "accept-encoding": "gzip",
      "user-agent": "TripPlanner/0.1 (+server)",
      ...headers
    },
    next: { revalidate: 0 }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Rapid ${res.status}: ${text || res.statusText}`);
  return text ? JSON.parse(text) as T : ({} as T);
}

export async function rapidGET<T>(path: string, headers: Record<string,string> = {}): Promise<T> {
  const base = process.env.RAPID_API_BASE!;
  const auth = await import("./auth").then(m => m.rapidAuthHeader());
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: {
      "authorization": auth,
      "accept": "application/json",
      "accept-encoding": "gzip",
      "user-agent": "TripPlanner/0.1 (+server)",
      ...headers
    },
    next: { revalidate: 0 }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Rapid ${res.status}: ${text || res.statusText}`);
  return text ? JSON.parse(text) as T : ({} as T);
}

export async function rapidGET<T>(path: string, headers: Record<string,string> = {}): Promise<T> {
  const base = process.env.RAPID_API_BASE!;
  const auth = await import("./auth").then(m => m.rapidAuthHeader());
  const res = await fetch(`${base}${path}`, {
    headers: {
      "authorization": auth,
      "accept": "application/json",
      "accept-encoding": "gzip",
      "user-agent": "TripPlanner/0.1 (+server)",
      ...headers
    },
    next: { revalidate: 0 }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Rapid ${res.status}: ${text || res.statusText}`);
  return text ? JSON.parse(text) as T : ({} as T);
}


