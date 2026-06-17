"use client";

import Link from "next/link";
import { useUserContext } from "./UserProvider";

export default function Header() {
  const { nickname, isLoading } = useUserContext();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent">
          WhereToShit 💩
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/leaderboard"
            className="text-accent/70 hover:text-accent text-sm font-medium transition-colors"
          >
            🏆
          </Link>
          <Link
            href="/profile"
            className="text-accent/70 hover:text-accent text-sm font-medium transition-colors max-w-[120px] truncate"
          >
            {isLoading ? "..." : nickname ?? "Anonymous"}
          </Link>
          <Link
            href="/add"
            className="bg-accent text-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-accent-light transition-colors"
          >
            + Add a Toilet
          </Link>
        </div>
      </nav>
    </header>
  );
}
