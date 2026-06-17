"use client";

import Link from "next/link";
import { ToiletWithStats } from "@/app/lib/types";
import { formatDistance } from "@/app/lib/distance";

interface ToiletCardProps {
  toilet: ToiletWithStats;
  distance?: number;
}

export default function ToiletCard({ toilet, distance }: ToiletCardProps) {
  return (
    <Link href={`/toilet/${toilet.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-accent truncate">{toilet.name}</h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {toilet.address}
            </p>
          </div>
          {distance !== undefined && (
            <span className="shrink-0 bg-primary/20 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm">
            ⭐ {toilet.avg_rating > 0 ? toilet.avg_rating.toFixed(1) : "—"}{" "}
            <span className="text-gray-400">({toilet.review_count})</span>
          </span>

          <span className="text-sm">
            {toilet.bidet_confirmed || toilet.has_bidet ? "🚿 Bidet" : "🚿 ❌"}
          </span>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              toilet.is_free
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {toilet.is_free ? "Free" : "Paid"}
          </span>

          {toilet.is_verified && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Verified ✅
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
