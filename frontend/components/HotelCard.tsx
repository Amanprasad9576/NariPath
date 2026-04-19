import type { Hotel } from '@/services/api';

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{hotel.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{hotel.location}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {hotel.pricePerNight}
        </span>
      </div>
      <p className="mt-4 text-slate-600">{hotel.highlights}</p>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span>Rating: {hotel.rating.toFixed(1)}</span>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700">
          Book room
        </button>
      </div>
    </article>
  );
}
