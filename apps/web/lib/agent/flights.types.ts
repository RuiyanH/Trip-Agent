export type Cabin = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export type Pax = { type: "ADT"|"CHD"|"INF"; count: number };

export type FlightSearchArgs = {
  slices: Array<{
    origin: string;            // IATA, e.g., "JFK"
    destination: string;       // IATA, e.g., "KIX"
    departureDate: string;     // YYYY-MM-DD
  }>;
  cabin?: Cabin;
  passengers: Pax[];           // [{ type:"ADT", count:1 }]
  maxOffers?: number;          // default 50
  allowChangeOfAirport?: boolean;
  nonStop?: boolean;
  currency?: string;           // e.g., "USD"
};

export type BaggageAllowance = {
  quantity?: number;           // number of pieces
  weightKg?: number;
  weightType?: "kg";
};

export type Segment = {
  id: string;
  origin: { iata: string; terminal?: string };
  destination: { iata: string; terminal?: string };
  marketingCarrier: { code: string; name?: string; flightNumber?: string };
  operatingCarrier?: { code: string; name?: string };
  aircraft?: string;           // IATA aircraft code if available
  departure: string;           // ISO datetime
  arrival: string;             // ISO datetime
  durationMinutes?: number;
  layoverMinutesToNext?: number;
  baggage?: BaggageAllowance;  // included baggage per pax if available
};

export type Slice = {
  id: string;
  segments: Segment[];
  durationMinutes?: number;
};

export type Price = {
  total: number;
  currency: string;
  base?: number;
  taxes?: number;
  refundable?: boolean;        // best-effort
  fareBrand?: string;          // e.g., "Light", "Basic Economy"
};

export type NormalizedOffer = {
  id: string;
  provider: "duffel" | "amadeus";
  slices: Slice[];
  price: Price;
  includedBaggage?: BaggageAllowance;
  conditions?: { changePenalties?: string; cancellationPenalties?: string };
  raw?: any;                   // (debug only) provider payload id
};

export type FlightSearchResponse = {
  offers: NormalizedOffer[];
};

export type AmadeusPriceConfirmArgs = {
  offer: any;                  // raw Amadeus offer to confirm
  currency?: string;
};



