"use client";

import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useUserContext } from "./UserProvider";

interface ReportButtonProps {
  targetType: "toilet" | "review";
  targetId: string;
}

const REASONS = [
  "Doesn't exist",
  "Inappropriate content",
  "Spam",
  "Duplicate",
];

export default function ReportButton({
  targetType,
  targetId,
}: ReportButtonProps) {
  const { userId } = useUserContext();
  const [showMenu, setShowMenu] = useState(false);
  const [reported, setReported] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReport = async (reason: string) => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("reports").insert({
        target_type: targetType,
        target_id: targetId,
        user_id: userId,
        reason,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint — already reported
          setReported(true);
        }
        return;
      }

      setReported(true);
    } catch {
      // Silently fail
    } finally {
      setIsSubmitting(false);
      setShowMenu(false);
    }
  };

  if (reported) {
    return (
      <span className="text-xs text-gray-400">Reported</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        🚩 Report
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px]">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
            Why are you reporting this?
          </p>
          {REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => handleReport(reason)}
              disabled={isSubmitting}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              {reason}
            </button>
          ))}
          <button
            onClick={() => setShowMenu(false)}
            className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 border-t border-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
