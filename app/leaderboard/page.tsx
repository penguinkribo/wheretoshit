import { createClient } from "@/app/lib/supabase/server";
import { LeaderboardEntry } from "@/app/lib/types";
import LeaderboardClient from "@/app/components/LeaderboardClient";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(50)
    .returns<LeaderboardEntry[]>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-accent mb-6">Leaderboard 🏆</h1>
      <LeaderboardClient entries={entries ?? []} />
    </div>
  );
}
