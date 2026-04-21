import { NextResponse } from 'next/server';

const GEOAPIFY_BASE = 'https://api.geoapify.com';

type GeoFeature = {
  geometry?: { type: string; coordinates?: [number, number] };
  properties?: Record<string, unknown>;
};

type GeoFeatureCollection = {
  features?: GeoFeature[];
};

function getGeoapifyKey(): string | null {
  const key = process.env.GEOAPIFY_API_KEY?.trim() || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY?.trim();
  return key || null;
}

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

function formatCategory(categories: unknown): string {
  if (!Array.isArray(categories) || categories.length === 0) {
    return 'Restaurant';
  }
  const first = String(categories[0]);
  return first
    .replace(/^catering\./, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickRating(props: Record<string, unknown>): number {
  const raw = props.datasource as { raw?: { rating?: number } } | undefined;
  const r = raw?.raw?.rating;
  if (typeof r === 'number' && r > 0 && r <= 5) {
    return r;
  }
  return 0;
}

export async function POST(req: Request) {
  const apiKey = getGeoapifyKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Set GEOAPIFY_API_KEY (or NEXT_PUBLIC_GEOAPIFY_API_KEY) in frontend/.env.local' },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { place?: string; radiusMeters?: number };
  const place = body.place?.trim();
  const radiusMeters = Math.min(20000, Math.max(500, Number(body.radiusMeters) || 5000));

  if (!place) {
    return NextResponse.json({ error: 'Place is required.' }, { status: 400 });
  }

  const geocodeParams = new URLSearchParams({ text: place, apiKey });
  const geocodeRes = await fetch(`${GEOAPIFY_BASE}/v1/geocode/search?${geocodeParams.toString()}`);
  if (!geocodeRes.ok) {
    const t = await geocodeRes.text();
    return NextResponse.json({ error: `Geocoding failed: ${t}` }, { status: 502 });
  }

  const geocodeJson = (await geocodeRes.json()) as GeoFeatureCollection;
  const first = geocodeJson.features?.[0];
  const point = lonLatFromGeocode(first);
  if (!point) {
    return NextResponse.json({ error: 'Could not find that place. Try a city or neighborhood name.' }, { status: 404 });
  }

  const { lon, lat } = point;
  const categories = [
    'catering.restaurant',
    'catering.fast_food',
    'catering.cafe',
    'catering.bar',
    'catering.pub',
  ].join(',');

  const placesParams = new URLSearchParams({
    categories,
    filter: `circle:${lon},${lat},${radiusMeters}`,
    bias: `proximity:${lon},${lat}`,
    limit: '40',
    lang: 'en',
    apiKey,
  });

  const placesRes = await fetch(`${GEOAPIFY_BASE}/v2/places?${placesParams.toString()}`);
  if (!placesRes.ok) {
    const t = await placesRes.text();
    return NextResponse.json({ error: `Places search failed: ${t}` }, { status: 502 });
  }

  const placesJson = (await placesRes.json()) as GeoFeatureCollection;
  const features = placesJson.features ?? [];

  const restaurants = features.map((feature, index) => {
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    const id = String(props.place_id ?? `geo-${lon}-${lat}-${index}`);
    const name = String(props.name ?? props.address_line1 ?? 'Unnamed place');
    const category = formatCategory(props.categories);
    const distance = typeof props.distance === 'number' ? Math.round(props.distance) : null;
    const address = [props.address_line1, props.address_line2, props.city].filter(Boolean).join(' · ') || String(props.formatted ?? '');
    const descriptionParts = [address || null, distance != null ? `~${distance} m from search center` : null].filter(Boolean);
    return {
      id,
      name,
      category,
      rating: pickRating(props),
      priceLevel: '—',
      description: descriptionParts.join(' · ') || 'Nearby dining spot.',
    };
  });

  return NextResponse.json({
    center: { lon, lat, label: place },
    restaurants,
  });
}
