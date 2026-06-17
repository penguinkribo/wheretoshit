import { createClient } from "@/app/lib/supabase/server";
import { ToiletWithStats } from "@/app/lib/types";
import HomeClient from "@/app/components/HomeClient";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: toilets } = await supabase
    .from("toilets_with_stats")
    .select("*")
    .returns<ToiletWithStats[]>();

  return <HomeClient toilets={toilets ?? []} />;
}
