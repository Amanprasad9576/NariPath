import type { CultureNote } from '@/services/api';

export function CultureCard({ note }: { note: CultureNote }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>
      <p className="mt-3 text-slate-600">{note.description}</p>
    </article>
  );
}
