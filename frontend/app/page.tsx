'use client';

import { useMemo, useState } from 'react';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { CultureCard } from '@/components/CultureCard';
import { HotelCard } from '@/components/HotelCard';
import { ItineraryPlanner } from '@/components/ItineraryPlanner';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Translator } from '@/components/Translator';
import { useFetch } from '@/hooks/useFetch';
import { fetchCultureNotes, fetchHotels, fetchRestaurants, type Hotel, type Restaurant } from '@/services/api';

const fallbackRestaurants: Restaurant[] = [
  {
    id: 'restaurant-1',
    name: 'Saffron Street Bistro',
    category: 'Indian fusion',
    rating: 4.8,
    priceLevel: '$$',
    description: 'Local favorites, safe dining with wellness-first menu options.',
  },
  {
    id: 'restaurant-2',
    name: 'Coastal Table',
    category: 'Seafood',
    rating: 4.7,
    priceLevel: '$$$',
    description: 'Ocean-view dining with secure booking and trusted reviews.',
  },
];

const fallbackHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Harbor Safe Suites',
    location: 'City center',
    rating: 4.6,
    pricePerNight: '$120/night',
    highlights: 'Women-friendly rooms, 24/7 support, sustainable design.',
  },
  {
    id: 'hotel-2',
    name: 'Greenway Boutique Stay',
    location: 'Historic district',
    rating: 4.5,
    pricePerNight: '$95/night',
    highlights: 'Eco-conscious accommodations close to culture spots.',
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: restaurants, loading: restaurantsLoading } = useFetch(fetchRestaurants, []);
  const { data: hotels, loading: hotelsLoading } = useFetch(fetchHotels, []);
  const { data: cultureNotes, loading: cultureLoading } = useFetch(fetchCultureNotes, []);

  const restaurantList = restaurants ?? fallbackRestaurants;
  const hotelList = hotels ?? fallbackHotels;

  const displayedRestaurants = useMemo(
    () => (activeCategory === 'all' ? restaurantList : restaurantList.filter((restaurant) => restaurant.category.toLowerCase().includes(activeCategory))),
    [activeCategory, restaurantList]
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section id="home" className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            Safety, culture, and travel intelligence
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            AI-powered travel planning for safe, sustainable journeys.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover restaurants, accommodations, currency insights, and cultural guidance from a modern travel assistant frontend connected to your Flask backend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#restaurants" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Explore restaurants
            </a>
            <a href="#itinerary" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Build itinerary
            </a>
          </div>
        </div>
        <MapPlaceholder />
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <Translator />
        <CurrencyConverter />
      </section>

      <section id="restaurants" className="mt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Restaurants nearby</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Curated dining with trusted reviews</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'indian fusion', 'seafood', 'local', 'vegan'].map((category) => (
              <button
                key={category}
                type="button"
                className={`rounded-full px-4 py-2 text-sm transition ${activeCategory === category ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {restaurantsLoading ? (
            <p className="text-slate-500">Loading restaurants…</p>
          ) : (
            displayedRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)
          )}
        </div>
      </section>

      <section id="hotels" className="mt-20">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Budget accommodation</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Comfortable stays with verified reviews</h2>
        </div>
        {hotelsLoading ? (
          <p className="text-slate-500">Loading accommodations…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {hotelList.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      <section id="culture" className="mt-20">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Cultural norms</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Local traditions & respectful travel tips</h2>
        </div>
        {cultureLoading ? (
          <p className="text-slate-500">Loading culture notes…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {(cultureNotes ?? [
              { id: 'culture-1', title: 'Greet respectfully', description: 'Learn local greetings and use them when entering shops or homes.' },
              { id: 'culture-2', title: 'Dress with awareness', description: 'Choose modest attire in religious areas and local neighborhoods.' },
              { id: 'culture-3', title: 'Support local artisans', description: 'Buy sustainable handcrafts and avoid over-touristed souvenirs.' },
            ]).map((note) => (
              <CultureCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-20">
        <ItineraryPlanner />
      </section>
    </main>
  );
}
