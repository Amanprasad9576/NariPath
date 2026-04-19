'use client';

import { useState, type FormEvent } from 'react';
import { translateText } from '@/services/api';

export function Translator() {
  const [input, setInput] = useState('Hello, how can I stay safe while traveling?');
  const [language, setLanguage] = useState('es');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranslate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await translateText(input, language);
      setResult(data.translation ?? 'Translation result unavailable');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="translator" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Translator</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Language travel companion</h2>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleTranslate}>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={4}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? 'Translating…' : 'Translate'}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      {result ? <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-700 shadow-sm">{result}</div> : null}
    </section>
  );
}
