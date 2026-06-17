export interface Toilet {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  has_bidet: boolean;
  is_free: boolean;
  created_at: string;
  user_id: string | null;
}

export interface ToiletWithStats extends Toilet {
  avg_rating: number;
  review_count: number;
  bidet_confirmed: boolean;
  verification_count: number;
  is_verified: boolean;
  report_count: number;
  is_flagged: boolean;
}

export interface Review {
  id: string;
  toilet_id: string;
  rating: number;
  has_bidet: boolean;
  comment: string | null;
  created_at: string;
  user_id: string | null;
  users?: { nickname: string } | null;
}

export interface Photo {
  id: string;
  toilet_id: string;
  storage_url: string;
  created_at: string;
  user_id: string | null;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface User {
  id: string;
  nickname: string;
  created_at: string;
}

export interface Report {
  id: string;
  target_type: "toilet" | "review";
  target_id: string;
  user_id: string | null;
  reason: string;
  created_at: string;
}

export interface Verification {
  id: string;
  toilet_id: string;
  user_id: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  created_at: string;
  toilet_count: number;
  review_count: number;
  photo_count: number;
  verification_count: number;
  score: number;
}

export interface BadgeDefinition {
  id: string;
  emoji: string;
  name: string;
  description: string;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  toilet_count: number;
  review_count: number;
  photo_count: number;
  verification_count: number;
  bidet_review_count: number;
}
