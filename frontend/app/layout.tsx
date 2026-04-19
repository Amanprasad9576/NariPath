import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Ashoka Innovate Travel Assistant',
  description: 'Modern travel assistant UI for safety, culture, and planning.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
