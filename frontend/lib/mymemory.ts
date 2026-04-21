export type MyMemoryLanguage = {
  code: string;
  name: string;
  targets: string[];
};

const LANGUAGES: MyMemoryLanguage[] = [
  { code: 'auto', name: 'Auto-detect', targets: [] },
  { code: 'en', name: 'English', targets: ['es', 'fr', 'de', 'hi', 'ja', 'zh', 'ar', 'pt', 'ru', 'it', 'ko', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'he', 'th', 'vi', 'id', 'ms', 'tl'] },
  { code: 'es', name: 'Spanish', targets: ['en', 'fr', 'de', 'pt', 'it'] },
  { code: 'fr', name: 'French', targets: ['en', 'es', 'de', 'it'] },
  { code: 'de', name: 'German', targets: ['en', 'fr', 'es', 'it'] },
  { code: 'hi', name: 'Hindi', targets: ['en'] },
  { code: 'ja', name: 'Japanese', targets: ['en'] },
  { code: 'zh', name: 'Chinese', targets: ['en'] },
  { code: 'ar', name: 'Arabic', targets: ['en'] },
  { code: 'pt', name: 'Portuguese', targets: ['en', 'es'] },
  { code: 'ru', name: 'Russian', targets: ['en'] },
  { code: 'it', name: 'Italian', targets: ['en', 'fr', 'de'] },
  { code: 'ko', name: 'Korean', targets: ['en'] },
  { code: 'nl', name: 'Dutch', targets: ['en'] },
  { code: 'sv', name: 'Swedish', targets: ['en'] },
  { code: 'da', name: 'Danish', targets: ['en'] },
  { code: 'no', name: 'Norwegian', targets: ['en'] },
  { code: 'fi', name: 'Finnish', targets: ['en'] },
  { code: 'pl', name: 'Polish', targets: ['en'] },
  { code: 'tr', name: 'Turkish', targets: ['en'] },
  { code: 'he', name: 'Hebrew', targets: ['en'] },
  { code: 'th', name: 'Thai', targets: ['en'] },
  { code: 'vi', name: 'Vietnamese', targets: ['en'] },
  { code: 'id', name: 'Indonesian', targets: ['en'] },
  { code: 'ms', name: 'Malay', targets: ['en'] },
  { code: 'tl', name: 'Tagalog', targets: ['en'] },
];

export async function fetchMyMemoryLanguages(): Promise<MyMemoryLanguage[]> {
  // Return static list since MyMemory doesn't have a languages endpoint
  return LANGUAGES;
}

export function targetLanguagesForSource(languages: MyMemoryLanguage[], source: string): MyMemoryLanguage[] {
  const sourceLang = languages.find((l) => l.code === source);
  if (!sourceLang) return [];
  return languages.filter((l) => sourceLang.targets.includes(l.code) || l.code === 'auto');
}

export async function myMemoryTranslateText(q: string, source: string, target: string): Promise<string> {
  const trimmed = q.trim();
  if (!trimmed) {
    throw new Error('Enter text to translate');
  }
  if (source === target) {
    return trimmed;
  }

  const langpair = source === 'auto' ? `auto|${target}` : `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${langpair}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Translation failed');
  }
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation error');
  }
  return data.responseData.translatedText;
}