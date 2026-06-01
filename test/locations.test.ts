import { describe, expect, test } from "bun:test";
import { cameraForLocation, locations, validateLocationSet } from "../src/locations";

describe("locations", () => {
  test("keeps the tour ordered and contiguous", () => {
    expect(locations.map((location) => location.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(validateLocationSet(locations)).toEqual([]);
  });

  test("normalizes nullable camera values", () => {
    const green = locations.find((location) => location.simple === "green");

    expect(green).toBeDefined();
    if (!green) {
      throw new Error("green location missing");
    }

    expect(green?.pitch).toBe(0);
    expect(cameraForLocation(green).pitch).toBe(0);
  });
});
