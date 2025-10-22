"use client";
import { useState } from "react";

type Region = { id: string; type: string; name: string; countryCode?: string };
type Rate = {
  rateId: string;
  roomName: string;
  board?: string;
  cancellation: { refundable: boolean; freeUntil?: string };
  totals?: { inclusive?: { value: number; currency: string } };
  priceCheckLink?: string;
};
type ShopHotel = { propertyId: string; name?: string; starRating?: number; rates: Rate[] };

export default function DebugHotels() {
  const [q, setQ] = useState("Osaka Station");
  const [lat, setLat] = useState<number | undefined>(34.7025);
  const [lng, setLng] = useState<number | undefined>(135.4959);
  const [km, setKm] = useState(5);
  const [type, setType] = useState<"city" | "neighborhood" | "multi_city_vicinity">("city");
  const [cc, setCC] = useState("JP");

  const [checkin, setCheckin] = useState("2025-10-03");
  const [checkout, setCheckout] = useState("2025-10-06");
  const [adults, setAdults] = useState(2);
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en-US");
  const [enrich, setEnrich] = useState(true);

  const [regions, setRegions] = useState<Region[]>([]);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [propertyIds, setPropertyIds] = useState<string[]>([]);
  const [hotels, setHotels] = useState<ShopHotel[]>([]);
  const [raw, setRaw] = useState<any>({});

  async function resolvePlace() {
    const res = await fetch("/api/places/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textQuery: q, locationBias: lat && lng ? { center: { lat, lng }, radiusMeters: km * 1000 } : undefined, maxResults: 1 })
    });
    const json = await res.json();
    const p = json.places?.[0]?.location;
    if (p) {
      setLat(p.lat);
      setLng(p.lng);
    }
  }

  async function runRegions() {
    if (lat == null || lng == null) return;
    const url = `/api/hotels/regions?km=${km}&lat=${lat}&lng=${lng}&type=${type}&countryCode=${cc}`;
    const res = await fetch(url);
    const json = await res.json();
    setRegions(json.regions || []);
    setRaw((r: any) => ({ ...r, regions: json }));
    if (json.regions?.[0]?.id) setRegionId(json.regions[0].id);
  }

  async function runProperties() {
    if (!regionId) return;
    const res = await fetch(`/api/hotels/properties?regionId=${regionId}&expanded=true`);
    const json = await res.json();
    setPropertyIds(json.propertyIds || []);
    setRaw((r: any) => ({ ...r, properties: json }));
  }

  async function runShop() {
    const ids = propertyIds.slice(0, 6000);
    const body = {
      checkin,
      checkout,
      occupancies: [{ adults }],
      currency,
      countryCode: "US",
      language,
      propertyIds: ids,
      travelPurpose: "leisure",
      includeDealsOnly: false,
      enrich
    };
    const res = await fetch("/api/hotels/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setHotels(json.hotels || []);
    setRaw((r: any) => ({ ...r, shop: json }));
  }

  async function runPriceCheck(href?: string) {
    if (!href) return;
    const res = await fetch("/api/hotels/price-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ href }) });
    const json = await res.json();
    alert(`Price check: ${json.status}${json.bookingLink ? " | booking link ready" : ""}`);
    setRaw((r: any) => ({ ...r, pricecheck: json }));
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Hotels Debug (Rapid)</h1>

      <section className="space-y-2">
        <div className="grid sm:grid-cols-2 gap-2">
          <input className="border px-2 py-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Destination text (e.g., Osaka Station)" />
          <button className="bg-black text-white px-3 py-1 rounded" onClick={resolvePlace}>
            Resolve via Places (optional)
          </button>
        </div>
        <div className="grid sm:grid-cols-5 gap-2">
          <input className="border px-2 py-1" type="number" value={lat ?? ""} onChange={(e) => setLat(Number(e.target.value))} placeholder="lat" />
          <input className="border px-2 py-1" type="number" value={lng ?? ""} onChange={(e) => setLng(Number(e.target.value))} placeholder="lng" />
          <input className="border px-2 py-1" type="number" value={km} onChange={(e) => setKm(Number(e.target.value))} placeholder="km radius" />
          <select className="border px-2 py-1" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="city">city</option>
            <option value="neighborhood">neighborhood</option>
            <option value="multi_city_vicinity">multi_city_vicinity</option>
          </select>
          <input className="border px-2 py-1" value={cc} onChange={(e) => setCC(e.target.value)} placeholder="country code (JP)" />
        </div>
        <button className="bg-black text-white px-3 py-1 rounded" onClick={runRegions}>
          1) Regions
        </button>
        {regions.length ? (
          <div className="text-sm text-gray-700">
            Selected region: {regionId} — {regions.find((r) => r.id === regionId)?.name}
          </div>
        ) : null}
      </section>

      <section className="space-y-2">
        <button className="bg-black text-white px-3 py-1 rounded" onClick={runProperties} disabled={!regionId}>
          2) Properties
        </button>
        <div className="text-xs text-gray-600">
          Found {propertyIds.length} properties{propertyIds.length > 250 ? " (server will chunk by 250 on Shop)" : ""}.
        </div>
      </section>

      <section className="space-y-2">
        <div className="grid sm:grid-cols-6 gap-2">
          <input className="border px-2 py-1" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
          <input className="border px-2 py-1" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
          <input className="border px-2 py-1" type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} placeholder="adults" />
          <input className="border px-2 py-1" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
          <input className="border px-2 py-1" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="en-US" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enrich} onChange={(e) => setEnrich(e.target.checked)} /> Enrich content
          </label>
        </div>
        <button className="bg-black text-white px-3 py-1 rounded" onClick={runShop} disabled={!propertyIds.length}>
          3) Shop
        </button>
      </section>

      {!!hotels.length && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Results ({hotels.length} hotels)</h2>
          <div className="space-y-3">
            {hotels.slice(0, 10).map((h) => (
              <div key={h.propertyId} className="border rounded p-3">
                <div className="font-medium">
                  {h.name || "(no name)"} <span className="text-gray-500">#{h.propertyId}</span> {h.starRating ? `• ${h.starRating}★` : ""}
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {h.rates.slice(0, 3).map((r) => (
                    <li key={r.rateId} className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-medium">{r.roomName}</span> {r.board ? `• ${r.board}` : ""} {r.cancellation?.refundable ? "• Refundable" : "• Non-refundable"}
                        {r.cancellation?.freeUntil ? ` • Free until ${new Date(r.cancellation.freeUntil).toLocaleString()}` : ""}
                        {r.totals?.inclusive ? ` • ${r.totals.inclusive.value.toFixed(0)} ${r.totals.inclusive.currency}` : ""}
                      </div>
                      <button className="text-xs bg-black text-white px-2 py-1 rounded" onClick={() => runPriceCheck(r.priceCheckLink)}>
                        Price-check
                      </button>
                    </li>
                  ))}
                </ul>
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



