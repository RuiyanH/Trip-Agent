import { rapidGET } from "./http";
import { cacheGet, cacheSet, cacheKey } from "../tools/cache";

export async function propertyIdsForRegion(
  regionId: string,
  expanded = true,
  ttlSeconds = 43200
): Promise<string[]> {
  const include = expanded ? "property_ids_expanded" : "property_ids";
  const key = cacheKey("rapid:regionProperties", { regionId, include });
  const cached = await cacheGet<string[]>(key);
  if (cached) return cached;

  const data = await rapidGET<any>(`/geography/regions/${regionId}?include=${include}`);
  const ids: string[] = data?.[include] ?? data?.property_ids ?? [];
  await cacheSet(key, ids, ttlSeconds);
  return ids.map(String);
}


