import broadway from "./locations/broadway.json";
import cultural from "./locations/cultural.json";
import green from "./locations/green.json";
import hopper from "./locations/hopper.json";
import house from "./locations/house.json";
import sae from "./locations/sae.json";
import stiles from "./locations/stiles.json";
import xc from "./locations/xc.json";
import ypd from "./locations/ypd.json";

export type Coordinates = readonly [number, number];

export type Location = {
  readonly bearing: number;
  readonly center: Coordinates;
  readonly id: number;
  readonly image: string;
  readonly imageAlt: string;
  readonly imageCredit: string;
  readonly marker: Coordinates;
  readonly pitch: number;
  readonly simple: string;
  readonly speed: number;
  readonly status: string | null;
  readonly text: string;
  readonly title: string;
  readonly zoom: number;
};

export type Camera = {
  readonly bearing: number;
  readonly center: Coordinates;
  readonly pitch: number;
  readonly speed: number;
  readonly zoom: number;
};

const rawLocations: readonly unknown[] = [stiles, broadway, house, cultural, green, hopper, sae, xc, ypd];

export const overviewCamera: Camera = {
  bearing: 0,
  center: [-72.92889674697767, 41.311363185264725],
  pitch: 0,
  speed: 0.3,
  zoom: 14.66,
};

export const locations = Object.freeze(
  rawLocations
    .map((location, index) => parseLocation(location, `src/locations[${index}]`))
    .sort((left, right) => left.id - right.id),
);

const locationSetErrors = validateLocationSet(locations);
if (locationSetErrors.length > 0) {
  throw new Error(`Invalid location data:\n${locationSetErrors.join("\n")}`);
}

export function cameraForLocation(location: Location): Camera {
  return {
    bearing: location.bearing,
    center: location.center,
    pitch: location.pitch,
    speed: location.speed,
    zoom: location.zoom,
  };
}

export function findLocationById(id: number): Location | undefined {
  return locations.find((location) => location.id === id);
}

export function validateLocationSet(values: readonly Location[]): string[] {
  const errors: string[] = [];
  const seenIds = new Set<number>();

  for (const location of values) {
    if (seenIds.has(location.id)) {
      errors.push(`duplicate id ${location.id}`);
    }
    seenIds.add(location.id);

    if (!location.image.startsWith("/images/")) {
      errors.push(`${location.title}: image must live under /images`);
    }

    if (location.marker[0] < -180 || location.marker[0] > 180 || location.center[0] < -180 || location.center[0] > 180) {
      errors.push(`${location.title}: longitude is out of range`);
    }

    if (location.marker[1] < -90 || location.marker[1] > 90 || location.center[1] < -90 || location.center[1] > 90) {
      errors.push(`${location.title}: latitude is out of range`);
    }
  }

  const sortedIds = [...seenIds].sort((left, right) => left - right);
  for (let expected = 0; expected < sortedIds.length; expected += 1) {
    if (sortedIds[expected] !== expected) {
      errors.push(`location ids must be contiguous from 0; missing ${expected}`);
      break;
    }
  }

  return errors;
}

function parseLocation(input: unknown, label: string): Location {
  if (!isRecord(input)) {
    throw new Error(`${label}: expected object`);
  }

  return {
    bearing: readNumber(input, "bearing", label, 0),
    center: readCoordinates(input, "center", label),
    id: readInteger(input, "id", label),
    image: readString(input, "image", label),
    imageAlt: readNullableString(input, "image_alt", label) ?? "",
    imageCredit: readNullableString(input, "image_credit", label) ?? "",
    marker: readCoordinates(input, "marker", label),
    pitch: readNumber(input, "pitch", label, 0),
    simple: readString(input, "simple", label),
    speed: readNumber(input, "speed", label, 0.3),
    status: readNullableString(input, "status", label),
    text: readString(input, "text", label),
    title: readString(input, "title", label),
    zoom: readNumber(input, "zoom", label),
  };
}

function readCoordinates(input: Record<string, unknown>, key: string, label: string): Coordinates {
  const value = input[key];
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    typeof value[0] !== "number" ||
    typeof value[1] !== "number" ||
    !Number.isFinite(value[0]) ||
    !Number.isFinite(value[1])
  ) {
    throw new Error(`${label}.${key}: expected [longitude, latitude]`);
  }

  return [value[0], value[1]];
}

function readInteger(input: Record<string, unknown>, key: string, label: string): number {
  const value = input[key];
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`${label}.${key}: expected integer`);
  }

  return value;
}

function readNumber(input: Record<string, unknown>, key: string, label: string, fallback?: number): number {
  const value = input[key];
  if (value === null || value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`${label}.${key}: expected number`);
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label}.${key}: expected finite number`);
  }

  return value;
}

function readNullableString(input: Record<string, unknown>, key: string, label: string): string | null {
  const value = input[key];
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${label}.${key}: expected string or null`);
  }

  return value;
}

function readString(input: Record<string, unknown>, key: string, label: string): string {
  const value = input[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label}.${key}: expected non-empty string`);
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
