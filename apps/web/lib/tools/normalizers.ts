import { NormalizedPlace, LatLng } from "@/lib/agent/types";

export function normLatLng(loc?: { latitude?: number; longitude?: number }): LatLng | undefined {
  if (!loc || typeof loc.latitude !== "number" || typeof loc.longitude !== "number") return undefined;
  return { lat: loc.latitude, lng: loc.longitude };
}

export function normalizePlace(p: any): NormalizedPlace {
  return {
    id: p.id ?? p.placeId ?? "",
    name: p.displayName?.text ?? p.name ?? "",
    address: p.formattedAddress ?? p.vicinity ?? undefined,
    location: normLatLng(p.location),
    rating: p.rating,
    userRatingsTotal: p.userRatingCount,
    priceLevel: p.priceLevel,
    primaryType: p.primaryType,
    types: p.types ?? [],
    phone: p.nationalPhoneNumber,
    intlPhone: p.internationalPhoneNumber,
    website: p.websiteUri,
    openNow: p.currentOpeningHours?.openNow ?? p.openingHours?.openNow ?? undefined,
    hours: p.regularOpeningHours ?? p.currentOpeningHours ?? undefined,
    photoRefs: (p.photos ?? []).map((ph: any) => ph.name || ph.photoReference).filter(Boolean)
  };
}

