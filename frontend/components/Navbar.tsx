import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Translator', href: '#translator' },
  { label: 'Restaurants', href: '#restaurants' },
  { label: 'Hotels', href: '#hotels' },
  { label: 'Converter', href: '#currency' },
  { label: 'Culture', href: '#culture' },
  { label: 'Itinerary', href: '#itinerary' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="#home" className="text-xl font-semibold text-slate-900">
          Ashoka Travel
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
