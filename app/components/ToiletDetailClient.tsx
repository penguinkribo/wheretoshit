"use client";

import Link from "next/link";
import Image from "next/image";
import { ToiletWithStats, Review, Photo } from "@/app/lib/types";
import MapView from "./MapView";
import StarRating from "./StarRating";
import VerifyButton from "./VerifyButton";
import ReportButton from "./ReportButton";

interface ToiletDetailClientProps {
  toilet: ToiletWithStats;
  reviews: Review[];
  photos: Photo[];
}

export default function ToiletDetailClient({
  toilet,
  reviews,
  photos,
}: ToiletDetailClientProps) {
  return (
    <div className="space-y-6">
      {/* Flagged Warning */}
      {toilet.is_flagged && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          🚩 This toilet has been flagged by the community and may not exist.
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-accent">{toilet.name}</h1>
        <p className="text-gray-500 mt-1">{toilet.address}</p>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <StarRating value={toilet.avg_rating} size="sm" />
            <span className="text-sm text-gray-500 ml-1">
              {toilet.avg_rating > 0 ? toilet.avg_rating.toFixed(1) : "—"} (
              {toilet.review_count})
            </span>
          </div>

          <span className="text-sm">
            {toilet.bidet_confirmed || toilet.has_bidet
              ? "🚿 Bidet available"
              : "🚿 No bidet"}
          </span>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              toilet.is_free
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {toilet.is_free ? "Free" : "Paid"}
          </span>

          {toilet.is_verified ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              Verified ✅ ({toilet.verification_count})
            </span>
          ) : toilet.verification_count > 0 ? (
            <span className="text-xs text-gray-500">
              👀 {toilet.verification_count} verified
            </span>
          ) : null}
        </div>
      </div>

      {/* Map */}
      <MapView lat={toilet.lat} lng={toilet.lng} name={toilet.name} />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/toilet/${toilet.id}/review`}
          className="flex-1 bg-primary text-accent text-center px-4 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Write a Review ✍️
        </Link>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
        >
          Get Directions 🧭
        </a>
        <VerifyButton toiletId={toilet.id} />
      </div>

      <div className="flex justify-end">
        <ReportButton targetType="toilet" targetId={toilet.id} />
      </div>

      {/* Photos */}
      <div>
        <h2 className="text-lg font-bold text-accent mb-3">Photos</h2>
        {photos.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="shrink-0 snap-start w-40 h-40 relative rounded-xl overflow-hidden"
              >
                <Image
                  src={photo.storage_url}
                  alt="Toilet photo"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No photos yet. Be the first to share! 📸
          </p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-bold text-accent mb-3">
          Reviews ({toilet.review_count})
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} size="sm" />
                    <span className="text-xs font-medium text-accent/70">
                      {review.users?.nickname ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <ReportButton targetType="review" targetId={review.id} />
                </div>
                {review.has_bidet && (
                  <p className="text-xs text-blue-600 mb-1">
                    🚿 Confirmed bidet available
                  </p>
                )}
                {review.comment && (
                  <p className="text-sm text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No reviews yet. Share your throne experience! 👑
          </p>
        )}
      </div>
    </div>
  );
}
