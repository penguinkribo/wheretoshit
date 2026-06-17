"use client";

import Link from "next/link";
import { useUserContext } from "./UserProvider";

export default function Header() {
  const { nickname, isLoading } = useUserContext();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <nav className="max-w-4xl mx-auto px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2">
        <Link href="/" className="text-lg sm:text-xl font-bold text-accent shrink-0">
          WhereToShit 💩
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/leaderboard"
            className="text-accent/70 hover:text-accent transition-colors"
            title="Leaderboard"
          >
            🏆
          </Link>
          <Link
            href="/profile"
            className="hidden sm:inline text-accent/70 hover:text-accent text-sm font-medium transition-colors max-w-[100px] truncate"
          >
            {isLoading ? "..." : nickname ?? "Anonymous"}
          </Link>
          <Link
            href="/profile"
            className="sm:hidden text-accent/70 hover:text-accent transition-colors"
            title={nickname ?? "Profile"}
          >
            👤
          </Link>
          <Link
            href="/add"
            className="bg-accent text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm hover:bg-accent-light transition-colors whitespace-nowrap"
          >
            + Add Toilet
          </Link>
        </div>
      </nav>
    </header>
  );
}
