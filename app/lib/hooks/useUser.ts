"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { generateNickname } from "@/app/lib/nicknames";

const USER_ID_KEY = "wheretoshit_user_id";
const NICKNAME_KEY = "wheretoshit_nickname";

export interface UseUserReturn {
  userId: string | null;
  nickname: string | null;
  isLoading: boolean;
  setNickname: (newNickname: string) => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedId = localStorage.getItem(USER_ID_KEY);
      const storedNickname = localStorage.getItem(NICKNAME_KEY);

      if (storedId && storedNickname) {
        setUserId(storedId);
        setNicknameState(storedNickname);
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const newNickname = generateNickname();

        const { data, error } = await supabase
          .from("users")
          .insert({ nickname: newNickname })
          .select()
          .single();

        if (error) throw error;

        localStorage.setItem(USER_ID_KEY, data.id);
        localStorage.setItem(NICKNAME_KEY, data.nickname);
        setUserId(data.id);
        setNicknameState(data.nickname);
      } catch {
        // Gracefully fall back to anonymous
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const setNickname = useCallback(
    async (newNickname: string) => {
      if (!userId) return;

      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("users")
          .update({ nickname: newNickname })
          .eq("id", userId);

        if (error) throw error;

        localStorage.setItem(NICKNAME_KEY, newNickname);
        setNicknameState(newNickname);
      } catch {
        // Silently fail
      }
    },
    [userId]
  );

  return { userId, nickname, isLoading, setNickname };
}
