import { ItineraryPlanner } from '@/components/ItineraryPlanner';
import { PageHeading } from '@/components/PageHeading';

export default function ItineraryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeading eyebrow="Planning" title="Itinerary planner">
        Choose a destination and trip length to get a day-wise list of places and short activity notes.
      </PageHeading>
      <ItineraryPlanner />
    </main>
  );
}
