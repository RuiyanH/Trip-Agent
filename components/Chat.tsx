import { useState } from "react";

type Props = { onItinerary: (it: any) => void };

export default function Chat({ onItinerary }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! Tell me your trip idea (e.g., 3 days in Osaka, food + cycling)." }
  ]);

  async function send() {
    if (!input.trim()) return;
    const nextMsgs: { role: "user" | "assistant"; content: string }[] = [...messages, { role: "user", content: input }];
    setMessages(nextMsgs);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMsgs })
    });
    const json = await res.json();
    onItinerary(json.itinerary);
    setMessages([...nextMsgs, { role: "assistant", content: "Draft itinerary created ✅ (Day-1 fixture)" }]);
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 overflow-auto rounded border p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block rounded px-3 py-2 ${m.role === "user" ? "bg-black text-white" : "bg-gray-100"}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Plan 3 days in Osaka, food + cycling, <$120/night"
        />
        <button className="rounded bg-black px-4 py-2 text-white" onClick={send}>Send</button>
      </div>
    </div>
  );
}
