export type RapidRegion = {
  id: string;                 // region_id
  type: string;               // e.g., "city"
  name: string;               // localized
  countryCode?: string;
};

export type HotelOccupancy = {
  adults: number;             // >=1
  childrenAges?: number[];    // 0..17
};

export type HotelShopArgs = {
  checkin: string;            // YYYY-MM-DD
  checkout: string;           // YYYY-MM-DD
  occupancies: HotelOccupancy[]; // 1..8 rooms
  currency: string;           // e.g., "USD"
  countryCode: string;        // POS (e.g., "US")
  language: string;           // e.g., "en-US"
  propertyIds: string[];      // 1..250
  travelPurpose?: "leisure" | "business";
  includeDealsOnly?: boolean; // filter rates with active promotions (deal=)
};

export type Money = { value: number; currency: string };

export type RateTotals = {
  inclusive?: Money;              // includes taxes/fees (request currency)
  inclusiveStrikethrough?: Money; // pre-discount (request currency)
  exclusive?: Money;              // excludes taxes/fees (request currency)
  strikethrough?: Money;          // pre-discount excl taxes/fees
  // New Rapid fields (property side totals; may be local currency)
  propertyInclusive?: {
    billableCurrency?: Money;     // often local/billable currency
    requestCurrency?: Money;
  };
};

export type Cancellation = {
  refundable: boolean;
  freeUntil?: string;             // ISO date-time (local property TZ if provided)
  policyText?: string;            // summarized
};

export type NormalizedRate = {
  rateId: string;
  roomId: string;
  roomName: string;
  occupancy: number;
  board?: string;                 // e.g., "Room only", "Breakfast"
  cancellation: Cancellation;
  totals: RateTotals;
  priceCheckLink?: string;        // tokenized link (short TTL)
  paymentType?: "expedia_collect" | "property_collect";
  loyaltyEligible?: boolean;      // from amenities if applicable
};

export type NormalizedHotel = {
  propertyId: string;
  name?: string;                  // if fetched from Content include
  address?: string;               // "
  location?: { lat: number; lng: number }; // "
  starRating?: number;            // "
  rates: NormalizedRate[];
};

export type HotelShopResponse = {
  hotels: NormalizedHotel[];
};

export type RapidRegion = {
  id: string;                 // region_id
  type: string;               // e.g., "city"
  name: string;               // localized
  countryCode?: string;
};

export type HotelOccupancy = {
  adults: number;             // >=1
  childrenAges?: number[];    // 0..17
};

export type HotelShopArgs = {
  checkin: string;            // YYYY-MM-DD
  checkout: string;           // YYYY-MM-DD
  occupancies: HotelOccupancy[]; // 1..8 rooms (Rapid returns one set per unique occupancy)
  currency: string;           // e.g., "USD"
  countryCode: string;        // POS (e.g., "US")
  language: string;           // e.g., "en-US"
  propertyIds: string[];      // 1..250
  travelPurpose?: "leisure" | "business";
  includeDealsOnly?: boolean; // filter rates with active promotions (deal=)
};

export type Money = { value: number; currency: string };

export type RateTotals = {
  inclusive?: Money;              // includes taxes/fees (request currency)
  inclusiveStrikethrough?: Money; // pre-discount (request currency)
  exclusive?: Money;              // excludes taxes/fees (request currency)
  strikethrough?: Money;          // pre-discount excl taxes/fees
  // New Rapid fields (property side totals; may be local currency)
  propertyInclusive?: {
    billableCurrency?: Money;     // often local/billable currency
    requestCurrency?: Money;
  };
};

export type Cancellation = {
  refundable: boolean;
  freeUntil?: string;             // ISO date-time (local property TZ if provided)
  policyText?: string;            // summarized
};

export type NormalizedRate = {
  rateId: string;
  roomId: string;
  roomName: string;
  occupancy: number;
  board?: string;                 // e.g., "Room only", "Breakfast"
  cancellation: Cancellation;
  totals: RateTotals;
  priceCheckLink?: string;        // tokenized link (short TTL)
  paymentType?: "expedia_collect" | "property_collect";
  loyaltyEligible?: boolean;      // from amenities if applicable
};

export type NormalizedHotel = {
  propertyId: string;
  name?: string;                  // if fetched from Content include
  address?: string;               // "
  location?: { lat: number; lng: number }; // "
  starRating?: number;            // "
  rates: NormalizedRate[];
};

export type HotelShopResponse = {
  hotels: NormalizedHotel[];
};

export type RapidRegion = {
  id: string;                 // region_id
  type: string;               // e.g., "city"
  name: string;               // localized
  countryCode?: string;
};

export type HotelOccupancy = {
  adults: number;             // >=1
  childrenAges?: number[];    // 0..17
};

export type HotelShopArgs = {
  checkin: string;            // YYYY-MM-DD
  checkout: string;           // YYYY-MM-DD
  occupancies: HotelOccupancy[]; // 1..8 rooms (Rapid returns one set per unique occupancy)
  currency: string;           // e.g., "USD"
  countryCode: string;        // POS (e.g., "US")
  language: string;           // e.g., "en-US"
  propertyIds: string[];      // 1..250
  travelPurpose?: "leisure" | "business";
  includeDealsOnly?: boolean; // filter rates with active promotions (deal=)
};

export type Money = { value: number; currency: string };

export type RateTotals = {
  inclusive?: Money;              // includes taxes/fees (request currency)
  inclusiveStrikethrough?: Money; // pre-discount (request currency)
  exclusive?: Money;              // excludes taxes/fees (request currency)
  strikethrough?: Money;          // pre-discount excl taxes/fees
  // New Rapid fields (property side totals; may be local currency)
  propertyInclusive?: {
    billableCurrency?: Money;     // often local/billable currency
    requestCurrency?: Money;
  };
};

export type Cancellation = {
  refundable: boolean;
  freeUntil?: string;             // ISO date-time (local property TZ if provided)
  policyText?: string;            // summarized
};

export type NormalizedRate = {
  rateId: string;
  roomId: string;
  roomName: string;
  occupancy: number;
  board?: string;                 // e.g., "Room only", "Breakfast"
  cancellation: Cancellation;
  totals: RateTotals;
  priceCheckLink?: string;        // tokenized link (short TTL)
  paymentType?: "expedia_collect" | "property_collect";
  loyaltyEligible?: boolean;      // from amenities if applicable
};

export type NormalizedHotel = {
  propertyId: string;
  name?: string;                  // if fetched from Content include
  address?: string;               // "
  location?: { lat: number; lng: number }; // "
  starRating?: number;            // "
  rates: NormalizedRate[];
};

export type HotelShopResponse = {
  hotels: NormalizedHotel[];
};


