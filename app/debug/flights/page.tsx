"use client";
import { useState } from "react";

export default function DebugFlights() {
  const [provider, setProvider] = useState<"duffel" | "amadeus">("duffel");
  const [origin, setOrigin] = useState("NYC");
  const [destination, setDestination] = useState("ATL");
  const [date, setDate] = useState("2025-10-03");
  const [cabin, setCabin] = useState("ECONOMY");
  const [adults, setAdults] = useState(1);
  const [nonStop, setNonStop] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [offers, setOffers] = useState<any[]>([]);
  const [raw, setRaw] = useState<any>({});

  async function search() {
    const payload = {
      provider,
      searchArgs: {
        slices: [{ origin, destination, departureDate: date }],
        passengers: [{ type: "ADT", count: adults }],
        cabin,
        nonStop,
        currency
      }
    };
    const res = await fetch("/api/flights/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setOffers(json.offers || []);
    setRaw((r: any) => ({ ...r, search: json }));
  }

  async function priceConfirm(o: any) {
    const offer = o?.raw?.offer;
    if (!offer) return alert("No raw Amadeus offer attached");
    const res = await fetch("/api/flights/price-confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ offer }) });
    const json = await res.json();
    setRaw((r: any) => ({ ...r, priceConfirm: json }));
    alert("Price confirm done (see Raw Payloads)");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Flights Debug</h1>
      <div className="grid sm:grid-cols-6 gap-2">
        <select className="border px-2 py-1" value={provider} onChange={(e) => setProvider(e.target.value as any)}>
          <option value="duffel">duffel</option>
          <option value="amadeus">amadeus</option>
        </select>
        <input className="border px-2 py-1" value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="Origin IATA" />
        <input className="border px-2 py-1" value={destination} onChange={(e) => setDestination(e.target.value.toUpperCase())} placeholder="Dest IATA" />
        <input className="border px-2 py-1" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="border px-2 py-1" value={cabin} onChange={(e) => setCabin(e.target.value)}>
          <option>ECONOMY</option>
          <option>PREMIUM_ECONOMY</option>
          <option>BUSINESS</option>
          <option>FIRST</option>
        </select>
        <input className="border px-2 py-1" type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={nonStop} onChange={(e) => setNonStop(e.target.checked)} /> Non-stop</label>
        <input className="border px-2 py-1" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
        <button className="bg-black text-white px-3 py-1 rounded" onClick={search}>Search</button>
      </div>

      {!!offers.length && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Offers ({offers.length})</h2>
          <div className="space-y-3">
            {offers.slice(0, 10).map((o) => (
              <div key={o.id} className="border rounded p-3 text-sm">
                <div className="font-medium">{o.provider.toUpperCase()} • {o.price.total} {o.price.currency}</div>
                {o.slices.map((sl: any, i: number) => (
                  <div key={sl.id || i} className="pl-3">
                    {sl.segments.map((sg: any, j: number) => (
                      <div key={sg.id || j}>
                        {sg.marketingCarrier.code} {sg.marketingCarrier.flightNumber || ""} — {sg.origin.iata} → {sg.destination.iata} ({new Date(sg.departure).toLocaleTimeString()} → {new Date(sg.arrival).toLocaleTimeString()})
                        {sg.layoverMinutesToNext ? ` • layover ${sg.layoverMinutesToNext}m` : ""}
                      </div>
                    ))}
                  </div>
                ))}
                {o.provider === "amadeus" && (
                  <button className="mt-2 text-xs bg-black text-white px-2 py-1 rounded" onClick={() => priceConfirm(o)}>Price-confirm</button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-medium">Raw Payloads (debug)</h3>
        <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-[40vh]">{JSON.stringify(raw, null, 2)}</pre>
      </section>
    </div>
  );
}



