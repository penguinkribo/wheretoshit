"use client";

import { useState, useEffect, useMemo } from "react";
import { ToiletWithStats } from "@/app/lib/types";
import { haversineDistance } from "@/app/lib/distance";
import { searchAddress } from "@/app/lib/nominatim";
import ToiletCard from "./ToiletCard";
import Link from "next/link";

interface HomeClientProps {
  toilets: ToiletWithStats[];
}

export default function HomeClient({ toilets }: HomeClientProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "granted" | "denied" | "searched"
  >("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      }
    );
  }, []);

  const referenceLocation = userLocation ?? searchLocation;

  const sortedToilets = useMemo(() => {
    if (!referenceLocation) return toilets;

    return [...toilets].sort((a, b) => {
      const distA = haversineDistance(
        referenceLocation.lat,
        referenceLocation.lng,
        a.lat,
        a.lng
      );
      const distB = haversineDistance(
        referenceLocation.lat,
        referenceLocation.lng,
        b.lat,
        b.lng
      );
      return distA - distB;
    });
  }, [toilets, referenceLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchAddress(searchQuery);
      if (results.length > 0) {
        setSearchLocation({
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        });
        setLocationStatus("searched");
      }
    } catch {
      // Nominatim failed — silently ignore
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      {locationStatus === "loading" && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">💩</p>
          <p className="text-lg font-semibold text-accent">
            Finding toilets near you...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please allow location access
          </p>
        </div>
      )}

      {locationStatus === "granted" && (
        <div className="mb-4 px-3 py-2 bg-green-50 text-green-700 text-sm rounded-xl">
          📍 Using your location — showing nearest toilets first
        </div>
      )}

      {(locationStatus === "denied" || locationStatus === "searched") && (
        <div className="mb-4">
          {locationStatus === "denied" && (
            <div className="px-3 py-2 bg-amber-50 text-amber-700 text-sm rounded-xl mb-3">
              📍 Location unavailable — search for a place instead
            </div>
          )}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a location in Singapore..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-primary text-accent px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </form>
        </div>
      )}

      {locationStatus !== "loading" && (
        <>
          {sortedToilets.length > 0 ? (
            <div className="space-y-3">
              {sortedToilets.map((toilet) => (
                <ToiletCard
                  key={toilet.id}
                  toilet={toilet}
                  distance={
                    referenceLocation
                      ? haversineDistance(
                          referenceLocation.lat,
                          referenceLocation.lng,
                          toilet.lat,
                          toilet.lng
                        )
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">💩</p>
              <h2 className="text-xl font-bold text-accent mb-2">
                No toilets found nearby
              </h2>
              <p className="text-gray-500 mb-6">
                You&apos;re on your own. But you can help others!
              </p>
              <Link
                href="/add"
                className="inline-block bg-primary text-accent px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Add a Toilet 🚽
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
