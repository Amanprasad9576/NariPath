import type { Restaurant } from '@/services/api';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{restaurant.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{restaurant.category}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {restaurant.priceLevel}
        </span>
      </div>
      <p className="mt-4 text-slate-600">{restaurant.description}</p>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span>Rating: {restaurant.rating.toFixed(1)}</span>
        <span className="font-medium text-slate-900">Reserve now</span>
      </div>
    </article>
  );
}
