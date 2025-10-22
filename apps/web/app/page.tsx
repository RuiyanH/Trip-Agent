"use client";

import Chat from "@/components/Chat";
import ItineraryPreview from "@/components/ItineraryPreview";
import { useState } from "react";

export default function HomePage() {
  const [itinerary, setItinerary] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div className="border-r p-4">
        <Chat onItinerary={(data) => setItinerary(data)} />
      </div>
      <div className="p-4">
        <ItineraryPreview itinerary={itinerary} />
      </div>
    </div>
  );
}
