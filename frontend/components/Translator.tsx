'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  fetchLibreLanguages,
  getLibreTranslateApiKey,
  libreTranslateText,
  targetLanguagesForSource,
  type LibreLanguage,
} from '@/lib/libretranslate';

const FALLBACK_LANGS: LibreLanguage[] = [
  { code: 'auto', name: 'Auto-detect', targets: [] },
  { code: 'en', name: 'English', targets: ['es', 'fr', 'de', 'hi', 'ja'] },
  { code: 'es', name: 'Spanish', targets: ['en', 'fr'] },
  { code: 'fr', name: 'French', targets: ['en', 'es'] },
  { code: 'de', name: 'German', targets: ['en'] },
  { code: 'hi', name: 'Hindi', targets: ['en'] },
  { code: 'ja', name: 'Japanese', targets: ['en'] },
];

export function Translator() {
  const [languages, setLanguages] = useState<LibreLanguage[]>(FALLBACK_LANGS);
  const [langsLoading, setLangsLoading] = useState(true);
  const [langsError, setLangsError] = useState<string | null>(null);

  const [source, setSource] = useState('en');
  const [target, setTarget] = useState('es');
  const [input, setInput] = useState('Hello, how can I stay safe while traveling?');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = useMemo(() => Boolean(getLibreTranslateApiKey()), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLangsLoading(true);
      setLangsError(null);
      try {
        const list = await fetchLibreLanguages();
        if (!cancelled) {
          setLanguages(list);
        }
      } catch (e) {
        if (!cancelled) {
          setLangsError((e as Error).message);
          setLanguages(FALLBACK_LANGS);
        }
      } finally {
        if (!cancelled) {
          setLangsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const targetOptions = useMemo(() => targetLanguagesForSource(languages, source), [languages, source]);

  useEffect(() => {
    if (!targetOptions.some((l) => l.code === target)) {
      const first = targetOptions[0]?.code;
      if (first) {
        setTarget(first);
      }
    }
  }, [targetOptions, target]);

  async function handleTranslate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const text = await libreTranslateText(input, source, target);
      setResult(text);
    } catch (err) {
      setError((err as Error).message);
      setResult('');
    } finally {
      setLoading(false);
    }
  }

  const sourceOptions = languages.filter((l) => l.code === 'auto' || l.targets?.length);

  return (
    <section id="translator" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Translator</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Language travel companion</h2>
          <p className="mt-2 text-sm text-slate-500">Powered by LibreTranslate (direct from your browser).</p>
        </div>
      </div>

      {!hasApiKey ? (
        <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Translation needs a free API key: add{' '}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_LIBRETRANSLATE_API_KEY</code> to{' '}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">frontend/.env.local</code>, then restart{' '}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">npm run dev</code>. Keys:{' '}
          <a href="https://portal.libretranslate.com" className="font-medium text-sky-800 underline" target="_blank" rel="noreferrer">
            portal.libretranslate.com
          </a>
          .
        </p>
      ) : null}

      {langsError ? (
        <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Using fallback language list: {langsError}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleTranslate}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">From</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={langsLoading}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            >
              {sourceOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">To</span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={langsLoading}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            >
              {targetOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Text to translate</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Type or paste text…"
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          disabled={loading || langsLoading}
        >
          {loading ? 'Translating…' : 'Translate'}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {result ? (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-slate-700">Translation</p>
          <textarea
            readOnly
            value={result}
            rows={6}
            className="w-full resize-y rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none"
          />
        </div>
      ) : null}
    </section>
  );
}
