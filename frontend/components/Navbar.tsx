import Link from 'next/link';
import { FEATURE_CARDS } from '@/lib/features';

const navItems = [{ label: 'Home', href: '/' }, ...FEATURE_CARDS.map((f) => ({ label: f.title, href: f.href }))];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Link href="/" className="shrink-0 text-xl font-semibold text-slate-900">
          Nari Path
        </Link>
        <nav className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 sm:justify-end">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-xs text-slate-600 transition hover:text-slate-900 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
