export type SessionState = {
  destination?: string;          // "Osaka, JP"
  dates?: { start: string; end: string };  // ISO
  pax?: { adults: number; children?: number };
  budgetPerNightUSD?: number;
  interests?: string[];          // ["food", "cycling"]
  diet?: string[];               // ["vegetarian"]
  hotelAreaHint?: string;        // "Namba", "Umeda"
  notes?: string;
};

export type ChatMessage = {
  role: "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export type ToolResult<T=unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type ItineraryDay = {
  day: number;
  slots: Array<{
    type: "meal" | "poi" | "hotel" | "flight";
    name: string;
    refId?: string;
    reason?: string;
    estDurationMin?: number;
    start?: string;
    end?: string;
  }>;
};

export type DraftItinerary = {
  days: ItineraryDay[];
  costUSD?: number;
  notes?: string;
};

// Day-2: Google Places & Maps types
export type LatLng = { lat: number; lng: number };

export type NormalizedPlace = {
  id: string;
  name: string;
  address?: string;
  location?: LatLng;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number; // 0..4 (Google scale)
  primaryType?: string;
  types?: string[];
  phone?: string;          // national
  intlPhone?: string;      // international
  website?: string;
  openNow?: boolean;
  hours?: { periods?: Array<{ openDay: number; openTime: string; closeDay: number; closeTime: string }>; };
  photoRefs?: string[];    // for Place Photos (future)
};

export type PlacesSearchArgs = {
  textQuery: string;       // e.g., "ramen in Osaka"
  locationBias?: { center: LatLng; radiusMeters: number };
  includedTypes?: string[]; // e.g., ["restaurant","tourist_attraction"]
  maxResults?: number;      // clamp to 20
};

export type PlacesSearchResponse = {
  places: NormalizedPlace[];
  nextPageToken?: string; // not used in v1 text search; reserved
};

export type PlaceDetailsArgs = { placeId: string; };

export type DistanceMatrixArgs = {
  origin: LatLng;
  destinations: LatLng[];
  mode?: "driving" | "walking" | "bicycling" | "transit";
};

export type DistanceMatrixEntry = { minutes: number; meters: number; status: string; };
export type DistanceMatrixResponse = { rows: DistanceMatrixEntry[]; };
