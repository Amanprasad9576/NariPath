import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-medium text-sky-700 hover:text-sky-900">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">About Solosphere</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Solosphere is a travel companion for people who want more than a generic checklist—we combine practical tools
        (routes, currency, translation, culture notes) with a calm, respectful lens on how to move through new places.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-slate-900">What we care about</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600">
        <li>Safety-aware planning and clear, honest information where we can provide it.</li>
        <li>Cultural respect—dress, etiquette, and local norms surfaced early in your trip prep.</li>
        <li>Sustainable choices when possible: walkable days, public options, and mindful pacing.</li>
      </ul>
      <h2 className="mt-10 text-xl font-semibold text-slate-900">How to use the app</h2>
      <p className="mt-4 leading-relaxed text-slate-600">
        Start from the home dashboard, open the tools you need (itinerary, map, restaurants, hotels), and treat every
        AI or map suggestion as a draft—confirm hours, prices, and access before you go.
      </p>
    </main>
  );
}
