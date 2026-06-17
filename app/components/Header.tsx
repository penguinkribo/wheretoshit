"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent">
          WhereToShit 💩
        </Link>
        <Link
          href="/add"
          className="bg-accent text-primary px-4 py-2 rounded-xl font-semibold text-sm hover:bg-accent-light transition-colors"
        >
          + Add a Toilet
        </Link>
      </nav>
    </header>
  );
}
