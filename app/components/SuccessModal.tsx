"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessModalProps {
  type: "toilet" | "review";
  newBadge?: { emoji: string; name: string } | null;
  onContinue: () => void;
}

const POINTS = {
  toilet: 100,
  review: 20,
};

const MESSAGES = {
  toilet: "Toilet Added!",
  review: "Review Submitted!",
};

export default function SuccessModal({
  type,
  newBadge,
  onContinue,
}: SuccessModalProps) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F5C518", "#3D2B1F", "#22c55e", "#3b82f6"],
    });

    const timer = setTimeout(onContinue, 4000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl animate-[bounce-in_0.4s_ease-out]">
        <p className="text-5xl mb-3">🎉</p>
        <h2 className="text-2xl font-bold text-accent mb-2">
          {MESSAGES[type]}
        </h2>
        <p className="text-3xl font-bold text-primary mb-4">
          +{POINTS[type]} points
        </p>

        {newBadge && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1">
              NEW BADGE UNLOCKED
            </p>
            <p className="text-3xl mb-1">{newBadge.emoji}</p>
            <p className="text-sm font-bold text-accent">{newBadge.name}</p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full bg-primary text-accent py-3 rounded-xl font-bold text-base hover:bg-primary-dark transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
