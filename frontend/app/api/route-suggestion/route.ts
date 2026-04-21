import { NextResponse } from 'next/server';
import { GEOAPIFY_BASE, geocodeSearchFirst, getGeoapifyKey } from '@/lib/geoapify-shared';

const ROUTING_MODES = new Set(['drive', 'walk', 'bicycle', 'motorcycle', 'scooter']);

type RoutingStep = {
  text: string;
  distanceMeters: number | null;
  durationSeconds: number | null;
};

function instructionText(instruction: unknown): string {
  if (typeof instruction === 'string') return instruction.trim();
  if (!instruction || typeof instruction !== 'object') return '';
  const ins = instruction as {
    text?: string;
    transition_instruction?: string;
    pre_transition_instruction?: string;
  };
  if (typeof ins.text === 'string' && ins.text.trim()) return ins.text.trim();
  if (typeof ins.transition_instruction === 'string' && ins.transition_instruction.trim()) {
    return ins.transition_instruction.trim();
  }
  if (typeof ins.pre_transition_instruction === 'string' && ins.pre_transition_instruction.trim()) {
    return ins.pre_transition_instruction.trim();
  }
  return '';
}

/** Geoapify `format=json` returns `results[]`; GeoJSON returns `features[].properties`. */
function parseRoutingJson(data: unknown): {
  distanceMeters: number | null;
  durationSeconds: number | null;
  steps: RoutingStep[];
} {
  const empty = { distanceMeters: null, durationSeconds: null, steps: [] as RoutingStep[] };
  if (!data || typeof data !== 'object') return empty;

  const root = data as Record<string, unknown>;

  // JSON format (see https://apidocs.geoapify.com/docs/routing/ — `results` array)
  const results = root.results as unknown[] | undefined;
  const routeFromResults = results?.[0];
  if (routeFromResults && typeof routeFromResults === 'object') {
    return extractRouteFromObject(routeFromResults as Record<string, unknown>);
  }

  // GeoJSON FeatureCollection (default format)
  const features = root.features as { properties?: Record<string, unknown> }[] | undefined;
  const props = features?.[0]?.properties;
  if (props && typeof props === 'object') {
    return extractRouteFromObject(props);
  }

  return empty;
}

function extractRouteFromObject(route: Record<string, unknown>): {
  distanceMeters: number | null;
  durationSeconds: number | null;
  steps: RoutingStep[];
} {
  const distanceMeters = typeof route.distance === 'number' ? route.distance : null;
  const durationSeconds = typeof route.time === 'number' ? route.time : null;

  const legs = route.legs as unknown[] | undefined;
  const firstLeg = legs?.[0] as { steps?: unknown[] } | undefined;
  const rawSteps = firstLeg?.steps;
  const steps: RoutingStep[] = [];

  if (!Array.isArray(rawSteps)) {
    return { distanceMeters, durationSeconds, steps };
  }

  for (const s of rawSteps) {
    if (!s || typeof s !== 'object') continue;
    const step = s as {
      instruction?: unknown;
      distance?: number;
      time?: number;
    };
    const text = instructionText(step.instruction);
    if (!text) continue;
    steps.push({
      text,
      distanceMeters: typeof step.distance === 'number' ? step.distance : null,
      durationSeconds: typeof step.time === 'number' ? step.time : null,
    });
  }

  return { distanceMeters, durationSeconds, steps };
}

export async function POST(req: Request) {
  const apiKey = getGeoapifyKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Set GEOAPIFY_API_KEY (or NEXT_PUBLIC_GEOAPIFY_API_KEY) in frontend/.env.local' },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    from?: string;
    to?: string;
    mode?: string;
  };

  const fromText = body.from?.trim();
  const toText = body.to?.trim();
  const modeRaw = body.mode?.trim().toLowerCase() ?? 'drive';
  const mode = ROUTING_MODES.has(modeRaw) ? modeRaw : 'drive';

  if (!fromText || !toText) {
    return NextResponse.json({ error: 'Both “from” and “to” places are required.' }, { status: 400 });
  }

  const [fromPt, toPt] = await Promise.all([geocodeSearchFirst(fromText, apiKey), geocodeSearchFirst(toText, apiKey)]);

  if (!fromPt) {
    return NextResponse.json({ error: `Could not find the starting place: “${fromText}”.` }, { status: 404 });
  }
  if (!toPt) {
    return NextResponse.json({ error: `Could not find the destination: “${toText}”.` }, { status: 404 });
  }

  // Geoapify waypoints: lat,lon|lat,lon (see Routing API docs)
  const waypoints = `${fromPt.lat},${fromPt.lon}|${toPt.lat},${toPt.lon}`;
  const params = new URLSearchParams({
    waypoints,
    mode,
    format: 'json',
    details: 'instruction_details',
    lang: 'en',
    units: 'metric',
    apiKey,
  });

  const routeRes = await fetch(`${GEOAPIFY_BASE}/v1/routing?${params.toString()}`);
  if (!routeRes.ok) {
    const t = await routeRes.text();
    return NextResponse.json({ error: `Routing failed: ${t}` }, { status: 502 });
  }

  const routeJson = await routeRes.json();
  const parsed = parseRoutingJson(routeJson);

  return NextResponse.json({
    mode,
    from: { label: fromPt.label, lat: fromPt.lat, lon: fromPt.lon },
    to: { label: toPt.label, lat: toPt.lat, lon: toPt.lon },
    distanceMeters: parsed.distanceMeters,
    durationSeconds: parsed.durationSeconds,
    steps: parsed.steps,
  });
}
