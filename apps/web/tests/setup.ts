import { vi } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: () => ({ value: "test-session-id" }),
    set: vi.fn()
  })
}));

// Mock fs for tests
vi.mock("node:fs", () => ({
  default: {
    readFileSync: vi.fn((path: string) => {
      if (path.includes("itinerary.osaka.3d.json")) {
        return JSON.stringify({
          days: [
            {
              day: 1,
              slots: [
                { type: "hotel", name: "Hotel Sample Namba", reason: "Close to food + cycling routes", estDurationMin: 0 },
                { type: "meal", name: "Okonomiyaki Place", reason: "Local specialty", estDurationMin: 90 },
                { type: "poi", name: "Dotonbori Walk", reason: "Evening lights", estDurationMin: 120 }
              ]
            },
            {
              day: 2,
              slots: [
                { type: "meal", name: "Morning Cafe Umeda", reason: "Breakfast", estDurationMin: 60 },
                { type: "poi", name: "Cycling along Yodogawa", reason: "Scenic cycling", estDurationMin: 180 },
                { type: "meal", name: "Ramen Alley", reason: "Casual lunch", estDurationMin: 60 },
                { type: "poi", name: "Osaka Castle Park", reason: "Historic site", estDurationMin: 120 }
              ]
            },
            {
              day: 3,
              slots: [
                { type: "meal", name: "Kuromon Market", reason: "Street food", estDurationMin: 90 },
                { type: "poi", name: "Sumiyoshi Taisha", reason: "Shrine visit", estDurationMin: 120 },
                { type: "meal", name: "Kushikatsu Night", reason: "Farewell dinner", estDurationMin: 90 }
              ]
            }
          ],
          costUSD: 0,
          notes: "Day-1 fixture; replace with live data Day-2+."
        });
      }
      throw new Error(`File not found: ${path}`);
    })
  },
  readFileSync: vi.fn((path: string) => {
    if (path.includes("itinerary.osaka.3d.json")) {
      return JSON.stringify({
        days: [
          {
            day: 1,
            slots: [
              { type: "hotel", name: "Hotel Sample Namba", reason: "Close to food + cycling routes", estDurationMin: 0 },
              { type: "meal", name: "Okonomiyaki Place", reason: "Local specialty", estDurationMin: 90 },
              { type: "poi", name: "Dotonbori Walk", reason: "Evening lights", estDurationMin: 120 }
            ]
          },
          {
            day: 2,
            slots: [
              { type: "meal", name: "Morning Cafe Umeda", reason: "Breakfast", estDurationMin: 60 },
              { type: "poi", name: "Cycling along Yodogawa", reason: "Scenic cycling", estDurationMin: 180 },
              { type: "meal", name: "Ramen Alley", reason: "Casual lunch", estDurationMin: 60 },
              { type: "poi", name: "Osaka Castle Park", reason: "Historic site", estDurationMin: 120 }
            ]
          },
          {
            day: 3,
            slots: [
              { type: "meal", name: "Kuromon Market", reason: "Street food", estDurationMin: 90 },
              { type: "poi", name: "Sumiyoshi Taisha", reason: "Shrine visit", estDurationMin: 120 },
              { type: "meal", name: "Kushikatsu Night", reason: "Farewell dinner", estDurationMin: 90 }
            ]
          }
        ],
        costUSD: 0,
        notes: "Day-1 fixture; replace with live data Day-2+."
      });
    }
    throw new Error(`File not found: ${path}`);
  })
}));
