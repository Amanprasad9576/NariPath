import { NextResponse } from 'next/server';

type CultureInsights = {
  place: string;
  dressCode: string;
  behavior: string;
  etiquette: string;
  culturalInsights: string;
};

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function parseJsonObject(text: string): CultureInsights | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as CultureInsights;
  } catch {
    // Fallback for cases where the model adds extra text around JSON
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as CultureInsights;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY in frontend/.env.local' },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { place?: string };
  const place = body.place?.trim();

  if (!place) {
    return NextResponse.json({ error: 'Place is required.' }, { status: 400 });
  }

  const prompt = `You are a concise culture advisor for travelers.
Return strictly valid JSON only, with keys:
"place", "dressCode", "behavior", "etiquette", "culturalInsights".
Each value should be plain text in 2-4 short bullet-style sentences (no markdown bullets, no numbering).
Focus on practical, respectful advice for this place: ${place}`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Return only JSON with exactly the requested keys. Do not include markdown or commentary.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json(
      { error: `OpenAI request failed: ${errText}` },
      { status: 500 }
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? '';
  const parsed = parseJsonObject(content);

  if (!parsed) {
    return NextResponse.json(
      { error: 'Could not parse model output. Try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
