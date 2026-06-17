"use client";

import { UserStats } from "@/app/lib/types";
import { BADGE_DEFINITIONS } from "@/app/lib/badges";

interface BadgeDisplayProps {
  stats: UserStats;
}

export default function BadgeDisplay({ stats }: BadgeDisplayProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {BADGE_DEFINITIONS.map((badge) => {
        const earned = badge.check(stats);
        return (
          <div
            key={badge.id}
            className={`rounded-xl p-3 text-center border transition-colors ${
              earned
                ? "bg-primary/10 border-primary/30"
                : "bg-gray-50 border-gray-100 opacity-40"
            }`}
          >
            <p className="text-2xl mb-1">{badge.emoji}</p>
            <p
              className={`text-xs font-bold ${earned ? "text-accent" : "text-gray-400"}`}
            >
              {badge.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
