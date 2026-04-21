import { NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

type ItineraryActivity = {
  timeOfDay?: string;
  name: string;
  details: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: ItineraryActivity[];
};

type ItineraryPlan = {
  destination: string;
  tripLengthDays: number;
  days: ItineraryDay[];
};

function parseJsonObject(text: string): ItineraryPlan | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as ItineraryPlan;
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as ItineraryPlan;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function validatePlan(data: ItineraryPlan | null): ItineraryPlan | null {
  if (!data || typeof data.destination !== 'string') return null;
  if (!Array.isArray(data.days) || data.days.length === 0) return null;
  for (const d of data.days) {
    if (typeof d.day !== 'number' || typeof d.title !== 'string' || !Array.isArray(d.activities)) return null;
    for (const a of d.activities) {
      if (typeof a.name !== 'string' || typeof a.details !== 'string') return null;
    }
  }
  return data;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY in frontend/.env.local' },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { place?: string; days?: number };
  const place = body.place?.trim();
  const daysRaw = Number(body.days);
  const days = Number.isFinite(daysRaw) ? Math.min(14, Math.max(1, Math.round(daysRaw))) : 3;

  if (!place) {
    return NextResponse.json({ error: 'Place is required.' }, { status: 400 });
  }

  const schema = `{
  "destination": string (the main place name),
  "tripLengthDays": number (${days}),
  "days": [
    {
      "day": number (1-based day index),
      "title": string (short theme for that day, e.g. "Old town & museums"),
      "activities": [
        { "timeOfDay": string optional (e.g. "Morning"), "name": string (place or activity name), "details": string (one sentence: what to do, why it matters, or practical tip) }
      ]
    }
  ]
}`;

  const prompt = `Create a ${days}-day travel itinerary for: ${place}.
Return strictly valid JSON only matching this shape (no markdown, no code fences):
${schema}
Rules:
- Include exactly ${days} objects in "days", with "day" from 1 through ${days}.
- Each day should have 3 to 5 activities with real or typical place names for that destination.
- Keep "details" under 220 characters each.
- Vary timeOfDay across Morning, Afternoon, Evening where natural.
- "tripLengthDays" must be ${days}.`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.55,
      messages: [
        {
          role: 'system',
          content:
            'You output only valid JSON objects. No markdown, no explanations outside JSON. Ensure all strings are JSON-escaped.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json({ error: `OpenAI request failed: ${errText}` }, { status: 500 });
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = payload.choices?.[0]?.message?.content ?? '';
  const parsed = parseJsonObject(content);
  const validated = validatePlan(parsed);

  if (!validated) {
    return NextResponse.json(
      { error: 'Could not parse itinerary. Try again with a simpler place name or fewer days.' },
      { status: 500 }
    );
  }

  return NextResponse.json(validated);
}
