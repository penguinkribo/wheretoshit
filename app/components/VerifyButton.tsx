"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useUserContext } from "./UserProvider";

interface VerifyButtonProps {
  toiletId: string;
}

export default function VerifyButton({ toiletId }: VerifyButtonProps) {
  const { userId } = useUserContext();
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const check = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("verifications")
        .select("id")
        .eq("toilet_id", toiletId)
        .eq("user_id", userId)
        .maybeSingle();

      setVerified(!!data);
      setIsLoading(false);
    };

    check();
  }, [toiletId, userId]);

  const handleVerify = async () => {
    if (!userId || verified) return;

    setVerified(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("verifications")
        .insert({ toilet_id: toiletId, user_id: userId });

      if (error) {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="bg-gray-100 text-gray-400 px-4 py-3 rounded-xl font-semibold text-sm"
      >
        ...
      </button>
    );
  }

  if (!userId) {
    return (
      <button
        disabled
        className="bg-gray-100 text-gray-400 px-4 py-3 rounded-xl font-semibold text-sm"
        title="Loading your identity..."
      >
        I&apos;ve been here
      </button>
    );
  }

  if (verified) {
    return (
      <button
        disabled
        className="bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-semibold text-sm"
      >
        Verified ✅
      </button>
    );
  }

  return (
    <button
      onClick={handleVerify}
      className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors"
    >
      I&apos;ve been here 📍
    </button>
  );
}
