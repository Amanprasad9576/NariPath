'use client';

import { useState, type FormEvent } from 'react';
import { PageHeading } from '@/components/PageHeading';

type CultureInsights = {
  place: string;
  dressCode: string;
  behavior: string;
  etiquette: string;
  culturalInsights: string;
};

const cards = [
  { key: 'dressCode', label: 'Dress Code', emoji: '👗' },
  { key: 'behavior', label: 'Behavior', emoji: '🤝' },
  { key: 'etiquette', label: 'Etiquette', emoji: '🙏' },
  { key: 'culturalInsights', label: 'Cultural Insights', emoji: '🌏' },
] as const;

export default function CulturePage() {
  const [place, setPlace] = useState('Tokyo');
  const [result, setResult] = useState<CultureInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, get sections
      const sectionsUrl = `https://en.wikivoyage.org/w/api.php?action=parse&page=${encodeURIComponent(place)}&prop=sections&format=json&origin=*`;
      const sectionsRes = await fetch(sectionsUrl);
      if (!sectionsRes.ok) throw new Error('Failed to fetch sections');
      const sectionsData = await sectionsRes.json();
      if (!sectionsData.parse) throw new Error('Place not found on Wikivoyage');

      const sections = sectionsData.parse.sections;
      let section = sections.find((s: any) => s.line === 'Respect');
      if (!section) section = sections.find((s: any) => s.line === 'Culture');

      let text = '';
      if (section) {
        const textUrl = `https://en.wikivoyage.org/w/api.php?action=parse&page=${encodeURIComponent(place)}&section=${section.index}&prop=text&format=json&origin=*`;
        const textRes = await fetch(textUrl);
        if (textRes.ok) {
          const textData = await textRes.json();
          const html = textData.parse.text['*'];
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          text = doc.body.textContent?.trim() || '';
        }
      }

      if (!text) {
        // Fallback to summary
        const summaryUrl = `https://en.wikivoyage.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`;
        const summaryRes = await fetch(summaryUrl);
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          text = summaryData.extract || 'No information available.';
        } else {
          throw new Error('Failed to fetch information');
        }
      }

      setResult({
        place,
        dressCode: '',
        behavior: '',
        etiquette: '',
        culturalInsights: text,
      });
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeading eyebrow="Respect" title="Culture & local norms">
        Enter a place to get information on culture and local norms from Wikivoyage.
      </PageHeading>

      <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 p-6 shadow-soft sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Enter a place</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g., Kyoto, Dubai, Paris"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Fetching information…' : 'Get culture guide'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>

      {result ? (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {cards.filter(card => result[card.key]).map((card) => (
            <article
              key={card.key}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{result.place}</p>
              <h2 className="mt-3 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <span aria-hidden>{card.emoji}</span>
                {card.label}
              </h2>
              <p className="mt-3 whitespace-pre-line text-slate-700">
                {result[card.key]}
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
