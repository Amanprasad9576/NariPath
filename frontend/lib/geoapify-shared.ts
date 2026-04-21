export const GEOAPIFY_BASE = 'https://api.geoapify.com';

export function getGeoapifyKey(): string | null {
  const key = process.env.GEOAPIFY_API_KEY?.trim() || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY?.trim();
  return key || null;
}

type GeoFeature = {
  geometry?: { type: string; coordinates?: [number, number] };
  properties?: Record<string, unknown>;
};

type GeoFeatureCollection = {
  features?: GeoFeature[];
};

function lonLatFromGeocode(feature: GeoFeature | undefined): { lon: number; lat: number } | null {
  if (!feature) return null;
  const coords = feature.geometry?.coordinates;
  if (coords && coords.length >= 2) {
    return { lon: coords[0], lat: coords[1] };
  }
  const props = feature.properties as { lon?: number; lat?: number } | undefined;
  if (props && typeof props.lon === 'number' && typeof props.lat === 'number') {
    return { lon: props.lon, lat: props.lat };
  }
  return null;
}

/** First geocode hit for free-text place search. */
export async function geocodeSearchFirst(
  place: string,
  apiKey: string
): Promise<{ lon: number; lat: number; label: string } | null> {
  const trimmed = place.trim();
  if (!trimmed) return null;

  const geocodeParams = new URLSearchParams({ text: trimmed, apiKey });
  const geocodeRes = await fetch(`${GEOAPIFY_BASE}/v1/geocode/search?${geocodeParams.toString()}`);
  if (!geocodeRes.ok) {
    return null;
  }

  const geocodeJson = (await geocodeRes.json()) as GeoFeatureCollection;
  const first = geocodeJson.features?.[0];
  const point = lonLatFromGeocode(first);
  if (!point) return null;

  const props = first?.properties as { formatted?: string } | undefined;
  const label = typeof props?.formatted === 'string' && props.formatted ? props.formatted : trimmed;

  return { lon: point.lon, lat: point.lat, label };
}
