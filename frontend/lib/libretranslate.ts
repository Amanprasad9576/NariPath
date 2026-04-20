/** Public LibreTranslate-compatible instance (no trailing slash). */
export const LIBRETRANSLATE_BASE = (process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL ?? 'https://libretranslate.com').replace(
  /\/$/,
  ''
);

/** Required for translate on libretranslate.com — get a key at https://portal.libretranslate.com */
export function getLibreTranslateApiKey(): string {
  return process.env.NEXT_PUBLIC_LIBRETRANSLATE_API_KEY?.trim() ?? '';
}

export type LibreLanguage = {
  code: string;
  name: string;
  targets: string[];
};

const AUTO: LibreLanguage = {
  code: 'auto',
  name: 'Auto-detect',
  targets: [],
};

export async function fetchLibreLanguages(): Promise<LibreLanguage[]> {
  const res = await fetch(`${LIBRETRANSLATE_BASE}/languages`);
  if (!res.ok) {
    throw new Error('Could not load languages');
  }
  const list = (await res.json()) as LibreLanguage[];
  return [AUTO, ...list];
}

/** Plain-text translation via LibreTranslate HTTP API (browser → instance, no Flask). */
export async function libreTranslateText(q: string, source: string, target: string): Promise<string> {
  const trimmed = q.trim();
  if (!trimmed) {
    throw new Error('Enter text to translate');
  }
  if (source === target) {
    return trimmed;
  }

  const apiKey = getLibreTranslateApiKey();
  if (!apiKey) {
    throw new Error(
      'Add NEXT_PUBLIC_LIBRETRANSLATE_API_KEY to frontend/.env.local (free key: https://portal.libretranslate.com). Restart the dev server after saving.'
    );
  }

  const res = await fetch(`${LIBRETRANSLATE_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: trimmed,
      source,
      target,
      format: 'text',
      api_key: apiKey,
    }),
  });

  const data = (await res.json()) as { translatedText?: string; error?: string };
  if (!res.ok || data.error) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Translation failed');
  }
  if (typeof data.translatedText !== 'string') {
    throw new Error('Unexpected response from translation service');
  }
  return data.translatedText;
}

export function targetLanguagesForSource(
  all: LibreLanguage[],
  sourceCode: string
): LibreLanguage[] {
  const withoutAuto = all.filter((l) => l.code !== 'auto');
  if (sourceCode === 'auto') {
    return withoutAuto;
  }
  const entry = withoutAuto.find((l) => l.code === sourceCode);
  if (!entry?.targets?.length) {
    return withoutAuto;
  }
  const allowed = new Set(entry.targets);
  return withoutAuto.filter((l) => allowed.has(l.code));
}
