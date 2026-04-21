'use client';

import { useState, type FormEvent } from 'react';
import { PageHeading } from '@/components/PageHeading';
import { RestaurantCard } from '@/components/RestaurantCard';
import type { Restaurant } from '@/services/api';

export default function RestaurantsPage() {
  const [place, setPlace] = useState('Paris');
  const [radiusMeters, setRadiusMeters] = useState(5000);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [centerLabel, setCenterLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/restaurants-nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, radiusMeters }),
      });
      const data = (await response.json()) as {
        center?: { label: string };
        restaurants?: Restaurant[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? 'Request failed');
      }
      setRestaurants(data.restaurants ?? []);
      setCenterLabel(data.center?.label ?? place);
    } catch (e) {
      setError((e as Error).message);
      setRestaurants([]);
      setCenterLabel(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeading eyebrow="Dining" title="Restaurants near a place">
        Enter a city, neighborhood, or address. We use Geoapify to locate the area and list nearby restaurants, cafés,
        and similar spots.
      </PageHeading>

      <section className="mb-10 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50 p-6 shadow-soft sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Place</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Shibuya, Tokyo · Brooklyn, NY · Champs-Élysées, Paris"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none backdrop-blur focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
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
              className="w-full accent-emerald-600"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Searching with Geoapify…' : 'Find restaurants'}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </section>

      {centerLabel && restaurants.length > 0 ? (
        <p className="mb-6 text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{restaurants.length}</span> places near{' '}
          <span className="font-semibold text-slate-900">{centerLabel}</span>.
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <p className="col-span-full text-slate-500">Loading restaurants…</p>
        ) : restaurants.length > 0 ? (
          restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
        ) : !loading && !error ? (
          <p className="col-span-full text-slate-500">
            Run a search to see restaurants. Add <code className="rounded bg-slate-100 px-1">GEOAPIFY_API_KEY</code> in{' '}
            <code className="rounded bg-slate-100 px-1">frontend/.env.local</code> (from{' '}
            <a href="https://myprojects.geoapify.com/" className="text-sky-700 underline" target="_blank" rel="noreferrer">
              Geoapify MyProjects
            </a>
            ), then restart <code className="rounded bg-slate-100 px-1">npm run dev</code>.
          </p>
        ) : null}
      </div>
    </main>
  );
}
