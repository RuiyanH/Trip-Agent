import { cacheGet, cacheSet, cacheKey } from "@/lib/tools/cache";
import { rapidGET } from "./http";

type ContentLite = {
  propertyId: string;
  name?: string;
  address?: string;
  location?: { lat: number; lng: number };
  starRating?: number;
};

async function getOne(id: string): Promise<ContentLite | null> {
  const key = cacheKey("rapid:content", { id });
  const cached = await cacheGet<ContentLite>(key);
  if (cached) return cached;

  const sp = new URLSearchParams();
  sp.set("property_id", id);
  sp.set("language", process.env.RAPID_LANG || "en-US");
  sp.set("include", "names,address,location,ratings");
  const raw = await rapidGET<any>(`/properties/content?${sp.toString()}`);

  const name = raw?.names?.name || raw?.name || raw?.property_name || undefined;
  const address = raw?.address?.line_1
    ? [raw?.address?.line_1, raw?.address?.city, raw?.address?.country_code].filter(Boolean).join(", ")
    : raw?.address?.full || undefined;
  const loc = raw?.location;
  const location = typeof loc?.latitude === "number" && typeof loc?.longitude === "number" ? { lat: loc.latitude, lng: loc.longitude } : undefined;
  const starRating = Number((raw?.ratings?.category ?? raw?.star_rating) || 0) || undefined;

  const out: ContentLite = { propertyId: id, name, address, location, starRating };
  await cacheSet(key, out, 60 * 60 * 12);
  return out;
}

export async function enrichHotelsContent(hotels: any[]) {
  const ids = hotels.map((h) => h.propertyId);
  const results = await Promise.allSettled(ids.map(getOne));
  const byId = new Map<string, ContentLite>();
  results.forEach((r, i) => {
    const id = ids[i];
    if (r.status === "fulfilled" && r.value) byId.set(id, r.value);
  });

  return hotels.map((h) => {
    const ct = byId.get(h.propertyId);
    if (!ct) return h;
    return {
      ...h,
      name: h.name ?? ct.name,
      address: h.address ?? ct.address,
      location: h.location ?? ct.location,
      starRating: h.starRating ?? ct.starRating
    };
  });
}



