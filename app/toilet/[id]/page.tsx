import { createClient } from "@/app/lib/supabase/server";
import { notFound } from "next/navigation";
import ToiletDetailClient from "@/app/components/ToiletDetailClient";

export default async function ToiletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: toilet } = await supabase
    .from("toilets_with_stats")
    .select("*")
    .eq("id", id)
    .single();

  if (!toilet) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, users(nickname)")
    .eq("toilet_id", id)
    .order("created_at", { ascending: false });

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("toilet_id", id)
    .order("created_at", { ascending: false });

  return (
    <ToiletDetailClient
      toilet={toilet}
      reviews={reviews ?? []}
      photos={photos ?? []}
    />
  );
}
