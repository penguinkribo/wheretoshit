"use client";

import { LeaderboardEntry } from "@/app/lib/types";
import { useUserContext } from "./UserProvider";

interface LeaderboardClientProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardClient({
  entries,
}: LeaderboardClientProps) {
  const { userId } = useUserContext();

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🏆</p>
        <p className="text-gray-500">
          No contributors yet. Be the first to earn points!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[3rem_1fr_4rem_4rem_4rem] sm:grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem] gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500">
        <span>#</span>
        <span>User</span>
        <span className="text-center">Score</span>
        <span className="text-center hidden sm:block">🚽</span>
        <span className="text-center hidden sm:block">⭐</span>
        <span className="text-center">Pts</span>
      </div>

      {/* Rows */}
      {entries.map((entry, index) => {
        const isCurrentUser = entry.id === userId;
        const rank = index + 1;
        const rankEmoji =
          rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;

        return (
          <div
            key={entry.id}
            className={`grid grid-cols-[3rem_1fr_4rem_4rem_4rem] sm:grid-cols-[3rem_1fr_5rem_5rem_5rem_5rem] gap-2 px-4 py-3 border-t border-gray-50 items-center ${
              isCurrentUser ? "bg-primary/10" : ""
            }`}
          >
            <span className="text-sm font-bold">{rankEmoji}</span>
            <span
              className={`text-sm truncate ${isCurrentUser ? "font-bold text-accent" : "text-gray-700"}`}
            >
              {entry.nickname}
              {isCurrentUser && (
                <span className="text-xs text-primary ml-1">(you)</span>
              )}
            </span>
            <span className="text-center text-sm font-bold text-primary">
              {entry.score}
            </span>
            <span className="text-center text-xs text-gray-500 hidden sm:block">
              {entry.toilet_count}
            </span>
            <span className="text-center text-xs text-gray-500 hidden sm:block">
              {entry.review_count}
            </span>
            <span className="text-center text-sm font-semibold text-accent">
              {entry.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
