import { httpJson } from "./http";
import { cacheGet, cacheSet, cacheKey } from "./cache";
import { normalizePlace } from "./normalizers";
import { type PlacesSearchArgs, type PlaceDetailsArgs, type DistanceMatrixArgs, type PlacesSearchResponse, type DistanceMatrixResponse } from "@/lib/agent/types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const PLACES_V1 = "https://places.googleapis.com/v1";
const DM_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

// Field masks are required in Places API (New)
const SEARCH_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.primaryType",
  "places.types",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.regularOpeningHours",
  "places.currentOpeningHours",
  "places.photos.name"
].join(",");

const DETAILS_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "priceLevel",
  "primaryType",
  "types",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "regularOpeningHours",
  "currentOpeningHours",
  "photos.name"
].join(",");

export async function placesSearch(args: PlacesSearchArgs, ttlSeconds = 43200): Promise<PlacesSearchResponse> {
  const key = cacheKey("places:searchText", args);
  const cached = await cacheGet<PlacesSearchResponse>(key);
  if (cached) return cached;

  const body: any = {
    textQuery: args.textQuery
  };
  if (args.locationBias) {
    body.locationBias = {
      circle: {
        center: { latitude: args.locationBias.center.lat, longitude: args.locationBias.center.lng },
        radius: args.locationBias.radiusMeters
      }
    };
  }
  // Places API (New, v1) Text Search expects a single "includedType" (singular).
  // If multiple are provided, omit to avoid INVALID_ARGUMENT.
  if (args.includedTypes?.length) {
    if (args.includedTypes.length === 1) {
      body.includedType = args.includedTypes[0];
    }
    // else: ignore, since the API does not support multiple included types for text search
  }
  if (args.maxResults) body.maxResultCount = Math.min(Math.max(args.maxResults, 1), 20);

  const data = await httpJson<any>(`${PLACES_V1}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": SEARCH_MASK
    },
    body: JSON.stringify(body)
  });

  const placesRaw = data.places ?? [];
  const places = placesRaw.map(normalizePlace);
  const resp = { places } as PlacesSearchResponse;
  await cacheSet(key, resp, ttlSeconds);
  return resp;
}

export async function placeDetails(args: PlaceDetailsArgs, ttlSeconds = 43200) {
  const key = cacheKey("places:details", args);
  const cached = await cacheGet<any>(key);
  if (cached) return cached;

  const data = await httpJson<any>(`${PLACES_V1}/places/${encodeURIComponent(args.placeId)}?key=${API_KEY}`, {
    method: "GET",
    headers: { "X-Goog-FieldMask": DETAILS_MASK }
  });
  const normalized = normalizePlace(data);
  await cacheSet(key, normalized, ttlSeconds);
  return normalized;
}

export async function distanceMatrix(args: DistanceMatrixArgs, ttlSeconds = 43200): Promise<DistanceMatrixResponse> {
  const key = cacheKey("maps:distancematrix", args);
  const cached = await cacheGet<DistanceMatrixResponse>(key);
  if (cached) return cached;

  const origins = `${args.origin.lat},${args.origin.lng}`;
  const destinations = args.destinations.map(d => `${d.lat},${d.lng}`).join("|");
  const url = `${DM_URL}?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=${args.mode ?? "driving"}&key=${API_KEY}`;

  const data = await httpJson<any>(url, { method: "GET" });
  const row = data.rows?.[0]?.elements ?? [];
  const rows = row.map((el: any) => ({
    minutes: el.duration?.value ? Math.round(el.duration.value / 60) : -1,
    meters:  el.distance?.value ?? -1,
    status:  el.status ?? "UNKNOWN"
  }));
  const resp: DistanceMatrixResponse = { rows };
  await cacheSet(key, resp, ttlSeconds);
  return resp;
}
