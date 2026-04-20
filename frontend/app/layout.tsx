import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Mohit Manajan Travel Assistant',
  description: 'Modern travel assistant UI for safety, culture, and planning.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
