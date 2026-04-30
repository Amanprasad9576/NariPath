'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/profile', label: 'Profile' },
] as const;

function NavLink({ href, label, onNavigate }: { href: string; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={closeMenu}>
          <div className="h-11 w-11 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-sky-100/60">
            <Image src="/solosphere.png" alt="Solosphere logo" width={44} height={44} className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-slate-900">Solosphere</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
              Travel with clarity
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          <Link
            href="/itinerary"
            className="ml-2 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:brightness-110"
          >
            Plan a trip
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/itinerary"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            onClick={closeMenu}
          >
            Plan
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <span className="text-lg leading-none">×</span>
            ) : (
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-inner md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {mainNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} onNavigate={closeMenu} />
            ))}
            <Link
              href="/itinerary"
              className="mt-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white"
              onClick={closeMenu}
            >
              Plan a trip
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
