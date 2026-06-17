"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { uploadPhoto } from "@/app/lib/supabase/storage";
import StarRating from "./StarRating";
import { useUserContext } from "./UserProvider";

interface ReviewFormProps {
  toiletId: string;
}

export default function ReviewForm({ toiletId }: ReviewFormProps) {
  const router = useRouter();
  const { userId } = useUserContext();
  const [rating, setRating] = useState(0);
  const [hasBidet, setHasBidet] = useState(false);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("reviews").insert({
        toilet_id: toiletId,
        rating,
        has_bidet: hasBidet,
        comment: comment.trim() || null,
        user_id: userId,
      });

      if (insertError) throw insertError;

      for (const file of photos) {
        const storageUrl = await uploadPhoto(toiletId, file);
        await supabase
          .from("photos")
          .insert({ toilet_id: toiletId, storage_url: storageUrl, user_id: userId });
      }

      router.push(`/toilet/${toiletId}`);
      router.refresh();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5"
    >
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold text-accent mb-2">
          Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Bidet Toggle */}
      <div>
        <label className="block text-sm font-semibold text-accent mb-1.5">
          Does this toilet have a bidet? 🚿
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHasBidet(true)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              hasBidet
                ? "bg-primary text-accent"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setHasBidet(false)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              !hasBidet
                ? "bg-primary text-accent"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-accent mb-1.5">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {comment.length}/500
        </p>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-semibold text-accent mb-1.5">
          Photos (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-accent hover:file:bg-primary/30"
        />
        {photos.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {photos.map((file, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-accent py-3 rounded-xl font-bold text-base hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review ✍️"}
      </button>
    </form>
  );
}
