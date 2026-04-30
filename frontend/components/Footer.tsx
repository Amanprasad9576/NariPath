import Image from 'next/image';
import Link from 'next/link';
import { FEATURE_CARDS } from '@/lib/features';

const companyLinks = [
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact us' },
] as const;

const legalLinks = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white shadow-lg shadow-sky-900/30">
                <Image src="/solosphere-logo.png" alt="Solosphere logo" width={40} height={40} className="h-full w-full object-cover" />
              </div>
              Solosphere
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Plan safer, smarter trips—culture tips, routes, stays, and dining ideas built for travelers who care
              about respect, comfort, and clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:hello@solosphere.example"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-sky-400/40 hover:bg-sky-500/10"
              >
                <span aria-hidden>✉️</span> hello@solosphere.example
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/90">Explore</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
                    Home
                  </Link>
                </li>
                {FEATURE_CARDS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/90">Company</p>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/90">Legal</p>
              <ul className="mt-4 space-y-2.5">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                Tools and suggestions are for planning only. Always verify bookings, visas, and safety with official
                sources before you travel.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Solosphere. Crafted for thoughtful travelers.</p>
          <p className="text-xs text-slate-600">Made with care · Travel smart · Stay curious</p>
        </div>
      </div>
    </footer>
  );
}
