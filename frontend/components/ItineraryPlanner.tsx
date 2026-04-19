'use client';

import { useState, type FormEvent } from 'react';
import { planItinerary } from '@/services/api';

export function ItineraryPlanner() {
  const [tripDetails, setTripDetails] = useState('3-day beach adventure with local culture');
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await planItinerary(tripDetails);
      setPlan(JSON.stringify(data, null, 2));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="itinerary" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Itinerary planner</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Plan your perfect journey</h2>
      </div>
      <form className="space-y-4" onSubmit={handlePlan}>
        <textarea
          value={tripDetails}
          onChange={(event) => setTripDetails(event.target.value)}
          rows={4}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          className="rounded-3xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate itinerary'}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      {plan ? (
        <pre className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
          {plan}
        </pre>
      ) : null}
    </section>
  );
}
