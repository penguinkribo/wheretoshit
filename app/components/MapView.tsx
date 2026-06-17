"use client";

import dynamic from "next/dynamic";

const MapViewInner = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  ),
});

interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapView(props: MapViewProps) {
  return <MapViewInner {...props} />;
}
