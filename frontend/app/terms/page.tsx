import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-medium text-sky-700 hover:text-sky-900">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">Terms & conditions</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>

      <section className="mt-10 space-y-6 text-slate-600">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Use of the service</h2>
          <p className="mt-2 leading-relaxed">
            Solosphere provides informational tools to support travel planning. Itineraries, cultural notes, and
            listings are suggestions only—not professional travel, legal, medical, or safety advice.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Accuracy</h2>
          <p className="mt-2 leading-relaxed">
            Opening hours, prices, road closures, and visa rules change. You are responsible for verifying everything
            material to your trip with operators, embassies, and official sources.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Liability</h2>
          <p className="mt-2 leading-relaxed">
            To the maximum extent permitted by law, Solosphere and its contributors are not liable for losses arising
            from reliance on generated content, map data, or third-party APIs.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Acceptable use</h2>
          <p className="mt-2 leading-relaxed">
            Do not misuse the product to spam APIs, scrape at unreasonable volume, or attempt to access others&apos;
            data. Respect rate limits and provider terms.
          </p>
        </div>
      </section>
    </main>
  );
}
