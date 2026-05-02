'use client';

import { useState, type FormEvent } from 'react';
import { PageHeading } from '@/components/PageHeading';
import { HotelCard } from '@/components/HotelCard';
import type { Hotel } from '@/services/api';

export default function HotelsPage() {
  const [place, setPlace] = useState('Paris');
  const [radiusMeters, setRadiusMeters] = useState(8000);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [centerLabel, setCenterLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/hotels-nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, radiusMeters }),
      });
      const data = (await response.json()) as {
        center?: { label: string };
        hotels?: Hotel[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? 'Request failed');
      }
      setHotels(data.hotels ?? []);
      setCenterLabel(data.center?.label ?? place);
    } catch (e) {
      setError((e as Error).message);
      setHotels([]);
      setCenterLabel(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeading eyebrow="Stays" title="Hotels near a place">
        Enter a city, district, or landmark. We use Geoapify Places (accommodation categories) to list hotels and
        similar stays nearby—same API family as the restaurants search, focused on lodging.
      </PageHeading>

      <section className="mb-10 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-sky-50 to-amber-50 p-6 shadow-soft sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Place</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Connaught Place, New York · Shinjuku, Tokyo"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none backdrop-blur focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Search radius: {Math.round(radiusMeters / 1000)} km</span>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Searching hotels…' : 'Find hotels'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </section>

      {centerLabel && hotels.length > 0 ? (
        <p className="mb-6 text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{hotels.length}</span> stays near{' '}
          <span className="font-semibold text-slate-900">{centerLabel}</span>.
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <p className="col-span-full text-slate-500">Loading accommodations…</p>
        ) : hotels.length > 0 ? (
          hotels.map((h) => <HotelCard key={h.id} hotel={h} />)
        ) : !loading && !error ? (
          <p className="col-span-full text-slate-500">
             
          </p>
        ) : null}
      </div>
    </main>
  );
}
