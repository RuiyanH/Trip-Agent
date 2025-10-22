import { NormalizedOffer, Slice, Segment, BaggageAllowance } from "@/lib/agent/flights.types";

export function normalizeDuffelOffers(raw: any[], currency: string): NormalizedOffer[] {
  return (raw ?? []).map((o: any) => {
    const price = Number(o.total_amount ?? o.total ?? 0);
    const slices: Slice[] = (o.slices ?? []).map((sl: any, i: number) => {
      const segments: Segment[] = (sl.segments ?? []).map((sg: any, j: number) => ({
        id: sg.id || `${i}-${j}`,
        origin: { iata: sg.origin?.iata_code, terminal: sg.origin_terminal },
        destination: { iata: sg.destination?.iata_code, terminal: sg.destination_terminal },
        marketingCarrier: { code: sg.marketing_carrier?.iata_code, flightNumber: sg.marketing_carrier_flight_number },
        operatingCarrier: sg.operating_carrier ? { code: sg.operating_carrier.iata_code } : undefined,
        aircraft: sg.aircraft?.iata_code,
        departure: sg.departing_at,
        arrival: sg.arriving_at,
        durationMinutes: parseISODurationToMin(sg.duration)
      }));
      for (let k = 0; k < segments.length - 1; k++) {
        const a = new Date(segments[k].arrival).getTime();
        const d = new Date(segments[k + 1].departure).getTime();
        segments[k].layoverMinutesToNext = Math.max(0, Math.round((d - a) / 60000));
      }
      return { id: sl.id || `slice-${i}`, segments };
    });

    const includedBaggage: BaggageAllowance | undefined = o.baggages?.[0]
      ? { quantity: o.baggages[0].quantity, weightKg: o.baggages[0].weight_kg, weightType: "kg" }
      : undefined;

    return {
      id: o.id,
      provider: "duffel",
      slices,
      price: { total: price, currency, refundable: o.refundability === "refundable" },
      includedBaggage,
      raw: { offerId: o.id }
    } as NormalizedOffer;
  });
}

export function normalizeAmadeusOffers(raw: any): NormalizedOffer[] {
  const offers = raw?.data ?? [];
  const currency = offers?.[0]?.price?.currency || "USD";

  return offers.map((o: any, oi: number) => {
    const itineraries = o.itineraries ?? [];
    const slices: Slice[] = itineraries.map((it: any, si: number) => {
      const segments: Segment[] = (it.segments ?? []).map((sg: any, j: number) => ({
        id: sg.id || `${si}-${j}`,
        origin: { iata: sg.departure?.iataCode, terminal: sg.departure?.terminal },
        destination: { iata: sg.arrival?.iataCode, terminal: sg.arrival?.terminal },
        marketingCarrier: { code: sg.carrierCode, flightNumber: sg.number },
        operatingCarrier: sg.operating?.carrierCode ? { code: sg.operating.carrierCode } : undefined,
        aircraft: sg.aircraft?.code,
        departure: sg.departure?.at,
        arrival: sg.arrival?.at,
        durationMinutes: parseISODurationToMin(sg.duration)
      }));
      for (let k = 0; k < segments.length - 1; k++) {
        const a = new Date(segments[k].arrival).getTime();
        const d = new Date(segments[k + 1].departure).getTime();
        segments[k].layoverMinutesToNext = Math.max(0, Math.round((d - a) / 60000));
      }
      return { id: it.id || `slice-${si}`, segments };
    });

    const total = Number(o.price?.grandTotal ?? o.price?.total ?? 0);
    let includedBaggage = undefined as BaggageAllowance | undefined;
    const fares = o.travelerPricings?.[0]?.fareDetailsBySegment?.[0];
    if (fares?.includedCheckedBags?.quantity || fares?.includedCheckedBags?.weight) {
      includedBaggage = {
        quantity: fares.includedCheckedBags.quantity,
        weightKg: fares.includedCheckedBags.weight,
        weightType: fares.includedCheckedBags.weight ? "kg" : undefined
      };
    }

    return {
      id: o.id ?? `am-${oi}`,
      provider: "amadeus",
      slices,
      price: { total, currency },
      includedBaggage,
      raw: { offer: o }
    } as NormalizedOffer;
  });
}

function parseISODurationToMin(d?: string) {
  if (!d) return undefined;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(d);
  if (!m) return undefined;
  const h = Number(m[1] || 0), mm = Number(m[2] || 0);
  return h * 60 + mm;
}



