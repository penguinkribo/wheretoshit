import { BadgeDefinition } from "./types";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-flush",
    emoji: "💩",
    name: "First Flush",
    description: "Added your first toilet",
    check: (stats) => stats.toilet_count >= 1,
  },
  {
    id: "throne-critic",
    emoji: "⭐",
    name: "Throne Critic",
    description: "Wrote 10 reviews",
    check: (stats) => stats.review_count >= 10,
  },
  {
    id: "paparazzi",
    emoji: "📸",
    name: "Paparazzi",
    description: "Uploaded 20 photos",
    check: (stats) => stats.photo_count >= 20,
  },
  {
    id: "toilet-tycoon",
    emoji: "🏆",
    name: "Toilet Tycoon",
    description: "Added 10 toilets",
    check: (stats) => stats.toilet_count >= 10,
  },
  {
    id: "bidet-baron",
    emoji: "🚿",
    name: "Bidet Baron",
    description: "Reviewed 5 bidet toilets",
    check: (stats) => stats.bidet_review_count >= 5,
  },
  {
    id: "verified-explorer",
    emoji: "✅",
    name: "Verified Explorer",
    description: "Verified 10 toilets",
    check: (stats) => stats.verification_count >= 10,
  },
];
