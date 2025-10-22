import { rapidGET } from "./http";
import { HotelShopArgs, HotelShopResponse } from "@/lib/agent/hotels.types";
import { normalizeShopResponse, normalizePriceCheck } from "./normalizers";

export async function shopAvailability(args: HotelShopArgs): Promise<HotelShopResponse> {
  const sp = new URLSearchParams();
  sp.set("checkin", args.checkin);
  sp.set("checkout", args.checkout);
  sp.set("currency", args.currency);
  sp.set("country_code", args.countryCode);
  sp.set("language", args.language);
  sp.set("sales_channel", process.env.RAPID_SALES_CHANNEL || "website");
  sp.set("sales_environment", process.env.RAPID_SALES_ENV || "hotel_only");
  for (const occ of args.occupancies) {
    const childAges = occ.childrenAges?.length ? `,${occ.childrenAges.join(",")}` : "";
    sp.append("occupancy", `${occ.adults}${childAges}`);
  }
  for (const pid of args.propertyIds) sp.append("property_id", pid);
  if (args.travelPurpose) sp.set("travel_purpose", args.travelPurpose);
  if (args.includeDealsOnly) sp.set("deal", "true");

  const data = await rapidGET<any>(`/properties/availability?${sp.toString()}`);
  return normalizeShopResponse(data);
}

export async function priceCheck(priceCheckHref: string) {
  const href = priceCheckHref.startsWith("/v3") ? priceCheckHref.replace("/v3", "") : priceCheckHref;
  const data = await rapidGET<any>(href);
  return normalizePriceCheck(data);
}

import { rapidGET } from "./http";
import type { HotelShopArgs, HotelShopResponse } from "@/lib/agent/hotels.types";
import { normalizeShopResponse, normalizePriceCheck } from "./normalizers";

export async function shopAvailability(args: HotelShopArgs): Promise<HotelShopResponse> {
  const sp = new URLSearchParams();
  sp.set("checkin", args.checkin);
  sp.set("checkout", args.checkout);
  sp.set("currency", args.currency);
  sp.set("country_code", args.countryCode);
  sp.set("language", args.language);
  sp.set("sales_channel", process.env.RAPID_SALES_CHANNEL || "website");
  sp.set("sales_environment", process.env.RAPID_SALES_ENV || "hotel_only");
  for (const occ of args.occupancies) {
    const childAges = occ.childrenAges?.length ? `,${occ.childrenAges.join(",")}` : "";
    sp.append("occupancy", `${occ.adults}${childAges}`);
  }
  for (const pid of args.propertyIds) sp.append("property_id", pid);
  if (args.travelPurpose) sp.set("travel_purpose", args.travelPurpose);
  if (args.includeDealsOnly) sp.set("deal", "true");

  const data = await rapidGET<any>(`/properties/availability?${sp.toString()}`);
  return normalizeShopResponse(data);
}

export async function priceCheck(priceCheckHref: string) {
  const href = priceCheckHref.startsWith("/v3") ? priceCheckHref.replace("/v3", "") : priceCheckHref;
  const data = await rapidGET<any>(href);
  return normalizePriceCheck(data);
}



