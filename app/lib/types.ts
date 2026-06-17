export interface Toilet {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  has_bidet: boolean;
  is_free: boolean;
  created_at: string;
}

export interface ToiletWithStats extends Toilet {
  avg_rating: number;
  review_count: number;
  bidet_confirmed: boolean;
}

export interface Review {
  id: string;
  toilet_id: string;
  rating: number;
  has_bidet: boolean;
  comment: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  toilet_id: string;
  storage_url: string;
  created_at: string;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}
