import { describe, it, expect } from "vitest";
import { GRID, BARS } from "./grid-data";

describe("grid-data", () => {
  it("has positive grid dimensions", () => {
    expect(GRID.cols).toBeGreaterThan(0);
    expect(GRID.rows).toBeGreaterThan(0);
  });

  it("has at least one red and one green bar", () => {
    expect(BARS.some(b => b.color === "red")).toBe(true);
    expect(BARS.some(b => b.color === "green")).toBe(true);
  });

  it("places every bar inside the grid", () => {
    for (const b of BARS) {
      expect(b.col).toBeGreaterThanOrEqual(0);
      expect(b.col).toBeLessThan(GRID.cols);
      expect(b.row).toBeGreaterThanOrEqual(0);
      expect(b.row + b.height).toBeLessThanOrEqual(GRID.rows);
    }
  });
});
