"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">💩</p>
      <h2 className="text-2xl font-bold text-accent mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-6">Even toilets have bad days.</p>
      <button
        onClick={reset}
        className="bg-primary text-accent px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
