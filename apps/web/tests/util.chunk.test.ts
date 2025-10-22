import { describe, it, expect } from "vitest";
import { chunk } from "../lib/util/chunk";

describe("chunk", () => {
  it("chunks array to size", () => {
    const arr = Array.from({ length: 10 }, (_, i) => i);
    expect(chunk(arr, 4)).toEqual([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9]]);
  });
  it("handles empty and large size", () => {
    expect(chunk([], 4)).toEqual([]);
    expect(chunk([1, 2, 3], 50)).toEqual([[1, 2, 3]]);
  });
});



