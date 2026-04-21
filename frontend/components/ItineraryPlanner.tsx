'use client';

import { useState, type FormEvent } from 'react';

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

export function ItineraryPlanner() {
  const [place, setPlace] = useState('Lisbon, Portugal');
  const [days, setDays] = useState(3);
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/itinerary-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place, days }),
      });
      const data = (await response.json()) as ItineraryPlan & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? 'Itinerary request failed');
      }
      if (!data.days?.length) {
        throw new Error('Empty itinerary returned');
      }
      setPlan(data);
    } catch (err) {
      setError((err as Error).message);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="itinerary" className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Itinerary planner</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Day-by-day plan</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter where you are going and how many days you have. We generate a structured itinerary (places + short
            details) using AI.
          </p>
        </div>
        <form className="grid gap-4 md:grid-cols-[2fr_1fr_auto]" onSubmit={handlePlan}>
          <label className="block space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-slate-700">Place</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="City, region, or country"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Days (1–14)</span>
            <input
              type="number"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-3xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 md:w-auto"
              disabled={loading}
            >
              {loading ? 'Generating…' : 'Build itinerary'}
            </button>
          </div>
        </form>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>

      {plan ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 px-5 py-4">
            <p className="text-sm text-sky-900">
              <span className="font-semibold">{plan.destination}</span>
              <span className="text-sky-800"> · {plan.tripLengthDays} day plan</span>
            </p>
          </div>

          {plan.days.map((day) => (
            <article
              key={day.day}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft"
            >
              <header className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">Day {day.day}</p>
                <h3 className="mt-1 text-xl font-semibold">{day.title}</h3>
              </header>
              <ul className="divide-y divide-slate-100">
                {day.activities.map((act, i) => (
                  <li key={`${day.day}-${i}-${act.name}`} className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {act.timeOfDay ? (
                        <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                          {act.timeOfDay}
                        </span>
                      ) : null}
                      <h4 className="text-lg font-semibold text-slate-900">{act.name}</h4>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{act.details}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
