"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useUserContext } from "@/app/components/UserProvider";
import BadgeDisplay from "@/app/components/BadgeDisplay";
import { LeaderboardEntry, UserStats } from "@/app/lib/types";

export default function ProfilePage() {
  const { userId, nickname, isLoading: userLoading, setNickname } = useUserContext();
  const [stats, setStats] = useState<LeaderboardEntry | null>(null);
  const [bidetReviewCount, setBidetReviewCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      const supabase = createClient();

      const { data: leaderboardData } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("id", userId)
        .single();

      if (leaderboardData) {
        setStats(leaderboardData);
      }

      const { count } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("has_bidet", true);

      setBidetReviewCount(count ?? 0);
      setIsLoading(false);
    };

    fetchStats();
  }, [userId]);

  const handleSaveNickname = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === nickname) {
      setIsEditing(false);
      return;
    }

    await setNickname(trimmed);
    setIsEditing(false);
  };

  if (userLoading || isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">💩</p>
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">👤</p>
        <p className="text-lg font-bold text-accent mb-2">No profile yet</p>
        <p className="text-gray-500">
          Start contributing to get your profile! Add a toilet or write a review.
        </p>
      </div>
    );
  }

  const userStats: UserStats = {
    toilet_count: stats?.toilet_count ?? 0,
    review_count: stats?.review_count ?? 0,
    photo_count: stats?.photo_count ?? 0,
    verification_count: stats?.verification_count ?? 0,
    bidet_review_count: bidetReviewCount,
  };

  return (
    <div className="space-y-6">
      {/* Nickname */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl">
            💩
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  maxLength={30}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                />
                <button
                  onClick={handleSaveNickname}
                  className="bg-primary text-accent px-3 py-1.5 rounded-lg text-sm font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-accent">{nickname}</h1>
                <button
                  onClick={() => {
                    setEditValue(nickname ?? "");
                    setIsEditing(true);
                  }}
                  className="text-gray-400 hover:text-accent text-sm"
                >
                  ✏️
                </button>
              </div>
            )}
            <p className="text-2xl font-bold text-primary mt-1">
              {stats?.score ?? 0} points
            </p>
          </div>
        </div>
      </div>

      {/* Contribution Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-accent mb-4">Contributions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {stats?.toilet_count ?? 0}
            </p>
            <p className="text-xs text-gray-500">Toilets Added</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {stats?.review_count ?? 0}
            </p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {stats?.photo_count ?? 0}
            </p>
            <p className="text-xs text-gray-500">Photos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {stats?.verification_count ?? 0}
            </p>
            <p className="text-xs text-gray-500">Verifications</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-accent mb-4">Badges</h2>
        <BadgeDisplay stats={userStats} />
      </div>
    </div>
  );
}
