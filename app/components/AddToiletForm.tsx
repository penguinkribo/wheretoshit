"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { uploadPhoto } from "@/app/lib/supabase/storage";
import { searchAddress } from "@/app/lib/nominatim";
import { NominatimResult } from "@/app/lib/types";

export default function AddToiletForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [hasBidet, setHasBidet] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (address.length < 3 || lat !== null) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchAddress(address);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address, lat]);

  const handleSuggestionSelect = (result: NominatimResult) => {
    setAddress(result.display_name);
    setLat(parseFloat(result.lat));
    setLng(parseFloat(result.lon));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setLat(null);
    setLng(null);
  };

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

    if (!name.trim()) {
      setError("Please enter a toilet name.");
      return;
    }
    if (!lat || !lng) {
      setError("Please select an address from the suggestions.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data: toilet, error: insertError } = await supabase
        .from("toilets")
        .insert({
          name: name.trim(),
          address,
          lat,
          lng,
          has_bidet: hasBidet,
          is_free: isFree,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      for (const file of photos) {
        const storageUrl = await uploadPhoto(toilet.id, file);
        await supabase
          .from("photos")
          .insert({ toilet_id: toilet.id, storage_url: storageUrl });
      }

      router.push(`/toilet/${toilet.id}`);
    } catch {
      setError("Failed to add toilet. Please try again.");
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

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-accent mb-1.5">
          Toilet Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. ION Orchard B2 Restroom"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Address with autocomplete */}
      <div className="relative">
        <label className="block text-sm font-semibold text-accent mb-1.5">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Start typing an address in Singapore..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        {lat && lng && (
          <p className="text-xs text-green-600 mt-1">
            📍 Location set ({lat.toFixed(4)}, {lng.toFixed(4)})
          </p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="px-4 py-2.5 text-sm hover:bg-primary/10 cursor-pointer border-b border-gray-50 last:border-b-0"
                onMouseDown={() => handleSuggestionSelect(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-accent mb-1.5">
            Has Bidet? 🚿
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

        <div>
          <label className="block text-sm font-semibold text-accent mb-1.5">
            Free or Paid?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFree(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isFree
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setIsFree(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                !isFree
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Paid
            </button>
          </div>
        </div>
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
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
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
        {isSubmitting ? "Adding..." : "Add Toilet 🚽"}
      </button>
    </form>
  );
}
