import { rapidGET } from "./http";
import { cacheGet, cacheSet, cacheKey } from "../tools/cache";
import { RapidRegion } from "@/lib/agent/hotels.types";

/** Search regions near a point within km radius; filter by type and country_code. */
export async function regionsByArea(
  args: { km: number; lat: number; lng: number; type?: string; countryCode?: string; limit?: number },
  ttlSeconds = 43200
): Promise<RapidRegion[]> {
  const key = cacheKey("rapid:regionsByArea", args);
  const cached = await cacheGet<RapidRegion[]>(key);
  if (cached) return cached;

  const params = new URLSearchParams();
  params.set("area", `${Math.max(0, Math.floor(args.km))},${args.lat},${args.lng}`);
  if (args.type) params.set("type", args.type);
  if (args.countryCode) params.set("country_code", args.countryCode);
  if (args.limit) params.set("limit", String(args.limit));

  const data = await rapidGET<any>(`/geography/regions?${params.toString()}`);
  const out: RapidRegion[] = (data?.regions ?? []).map((r: any) => ({
    id: String(r.region_id),
    type: r.type,
    name: r.name ?? r.name_full ?? "",
    countryCode: r.country_code
  }));
  await cacheSet(key, out, ttlSeconds);
  return out;
}


