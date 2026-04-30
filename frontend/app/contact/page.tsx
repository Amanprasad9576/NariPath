import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-medium text-sky-700 hover:text-sky-900">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">Contact us</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Questions about Solosphere, partnerships, or accessibility? We read every message—travel is personal, and we
        want this product to feel that way too.
      </p>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Email</h2>
        <a href="mailto:hello@solosphere.example" className="mt-2 inline-block text-lg font-semibold text-sky-700 hover:text-sky-900">
          hello@solosphere.example
        </a>
        <p className="mt-6 text-sm leading-relaxed text-slate-600">
          Replace this address with your real support inbox in the footer and on this page when you go live. Typical
          response time: 2–3 business days.
        </p>
      </div>
      <h2 className="mt-10 text-xl font-semibold text-slate-900">Before you write</h2>
      <p className="mt-3 leading-relaxed text-slate-600">
        For booking changes, refunds, or hotel disputes, contact the provider you booked with directly. We cannot
        modify third-party reservations on your behalf.
      </p>
    </main>
  );
}
