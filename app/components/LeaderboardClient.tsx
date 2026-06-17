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
      <div className="grid grid-cols-[2.5rem_1fr_3.5rem] gap-1 px-3 sm:px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500">
        <span>#</span>
        <span>User</span>
        <span className="text-right">Pts</span>
      </div>

      {/* Rows */}
      {entries.map((entry, index) => {
        const isCurrentUser = entry.id === userId;
        const rank = index + 1;
        const rankDisplay =
          rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}`;

        return (
          <div
            key={entry.id}
            className={`grid grid-cols-[2.5rem_1fr_3.5rem] gap-1 px-3 sm:px-4 py-3 border-t border-gray-50 items-center ${
              isCurrentUser ? "bg-primary/10" : ""
            }`}
          >
            <span className="text-sm font-bold">{rankDisplay}</span>
            <span
              className={`text-sm min-w-0 break-words ${isCurrentUser ? "font-bold text-accent" : "text-gray-700"}`}
            >
              {entry.nickname}
              {isCurrentUser && (
                <span className="text-xs text-primary ml-1">(you)</span>
              )}
            </span>
            <span className="text-right text-sm font-bold text-primary">
              {entry.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
