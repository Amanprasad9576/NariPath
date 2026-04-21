'use client';

import { useState, type FormEvent } from 'react';

type RouteStep = {
  text: string;
  distanceMeters: number | null;
  durationSeconds: number | null;
};

type RouteResponse = {
  mode: string;
  from: { label: string; lat: number; lon: number };
  to: { label: string; lat: number; lon: number };
  distanceMeters: number | null;
  durationSeconds: number | null;
  steps: RouteStep[];
};

function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatDistance(meters: number | null): string {
  if (meters == null || meters <= 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const MODES = [
  { value: 'drive', label: 'Drive' },
  { value: 'walk', label: 'Walk' },
  { value: 'bicycle', label: 'Bicycle' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'scooter', label: 'Scooter' },
] as const;

export function MapRoutePlanner() {
  const [from, setFrom] = useState('Eiffel Tower, Paris');
  const [to, setTo] = useState('Louvre Museum, Paris');
  const [mode, setMode] = useState<string>('drive');
  const [result, setResult] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/route-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, mode }),
      });
      const data = (await response.json()) as RouteResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? 'Could not build route');
      }
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 p-6 shadow-soft sm:p-8">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">From</span>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Starting point (address, landmark, city)"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-800">To</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">Travel mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60 md:w-auto"
            >
              {loading ? 'Planning route…' : 'Get directions'}
            </button>
          </div>
        </form>
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </section>

      {result ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Distance</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatDistance(result.distanceMeters)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Est. time</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatDuration(result.durationSeconds)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mode</p>
              <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">{result.mode}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Resolved places</h3>
            <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Start</p>
                <p className="mt-1 font-medium text-slate-900">{result.from.label}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">End</p>
                <p className="mt-1 font-medium text-slate-900">{result.to.label}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Turn-by-turn</h3>
            {result.steps.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No turn-by-turn steps in this response. Distance and time above still reflect the full route.
              </p>
            ) : (
              <ol className="mt-4 space-y-3">
                {result.steps.map((step, i) => (
                  <li
                    key={`${i}-${step.text.slice(0, 24)}`}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-900">{step.text}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {step.distanceMeters != null ? formatDistance(step.distanceMeters) : '—'}
                        {step.durationSeconds != null ? ` · ${formatDuration(step.durationSeconds)}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <p className="text-center text-xs text-slate-400">
            Routes by Geoapify Routing API · add <code className="rounded bg-slate-100 px-1">GEOAPIFY_API_KEY</code> in{' '}
            <code className="rounded bg-slate-100 px-1">.env.local</code>
          </p>
        </>
      ) : null}
    </div>
  );
}
