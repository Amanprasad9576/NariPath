import Link from 'next/link';
import { FEATURE_CARDS } from '@/lib/features';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="text-lg font-semibold text-slate-900">Nari Path</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              AI-assisted travel planning focused on safety, culture, and practical tools for your journey.
            </p>
            <p className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} Mohit Mahajan. All rights reserved.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Features</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {FEATURE_CARDS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
