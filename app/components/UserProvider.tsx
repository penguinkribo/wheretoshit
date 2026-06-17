"use client";

import { createContext, useContext } from "react";
import { useUser, UseUserReturn } from "@/app/lib/hooks/useUser";

const UserContext = createContext<UseUserReturn>({
  userId: null,
  nickname: null,
  isLoading: true,
  setNickname: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
