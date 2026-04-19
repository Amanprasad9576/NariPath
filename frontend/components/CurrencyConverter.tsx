'use client';

import { useState, type FormEvent } from 'react';
import { convertCurrency } from '@/services/api';

export function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await convertCurrency(amount, fromCurrency, toCurrency);
      setResult(`${data.convertedAmount} ${toCurrency}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="currency" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Currency converter</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Smart travel budgeting</h2>
      </div>
      <form className="grid gap-4 md:grid-cols-4" onSubmit={handleConvert}>
        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <select
          value={fromCurrency}
          onChange={(event) => setFromCurrency(event.target.value)}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
        <select
          value={toCurrency}
          onChange={(event) => setToCurrency(event.target.value)}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
        <button
          type="submit"
          className="rounded-3xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? 'Converting…' : 'Convert'}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      {result ? <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-700 shadow-sm">{result}</div> : null}
    </section>
  );
}
