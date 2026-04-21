import { MapRoutePlanner } from '@/components/MapRoutePlanner';
import { PageHeading } from '@/components/PageHeading';

export default function MapPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeading eyebrow="Navigation" title="How to get there">
        Enter a starting point and destination. We geocode both with Geoapify, then use the Routing API for distance,
        time, and turn-by-turn suggestions.
      </PageHeading>
      <MapRoutePlanner />
    </main>
  );
}
