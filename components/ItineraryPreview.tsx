export default function ItineraryPreview({ itinerary }: { itinerary: any }) {
  if (!itinerary) return <div className="text-sm text-gray-500">No itinerary yet. Ask for a plan on the left.</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Draft Itinerary</h2>
      <div className="space-y-3">
        {itinerary.days?.map((d: any) => (
          <div key={d.day} className="rounded border p-3">
            <div className="font-medium mb-2">Day {d.day}</div>
            <ul className="space-y-1 pl-4 list-disc">
              {d.slots.map((s: any, idx: number) => (
                <li key={idx}>
                  <span className="font-semibold">{s.type.toUpperCase()}</span>: {s.name}
                  {s.reason ? <span className="text-gray-500"> — {s.reason}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {itinerary.notes ? <p className="text-sm text-gray-600">{itinerary.notes}</p> : null}
    </div>
  );
}
