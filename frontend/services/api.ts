export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  priceLevel: string;
  description: string;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: string;
  highlights: string;
};

export type CultureNote = {
  id: string;
  title: string;
  description: string;
};

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE}/restaurants`);
  if (!response.ok) {
    throw new Error('Unable to fetch restaurants');
  }
  return response.json();
}

export async function fetchHotels(): Promise<Hotel[]> {
  const response = await fetch(`${API_BASE}/hotels`);
  if (!response.ok) {
    throw new Error('Unable to fetch hotels');
  }
  return response.json();
}

export async function fetchCultureNotes(): Promise<CultureNote[]> {
  const response = await fetch(`${API_BASE}/culture`);
  if (!response.ok) {
    throw new Error('Unable to fetch culture notes');
  }
  return response.json();
}

