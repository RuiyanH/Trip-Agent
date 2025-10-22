export async function httpJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  try { 
    return JSON.parse(text) as T; 
  } catch { 
    return text as unknown as T; 
  }
}

