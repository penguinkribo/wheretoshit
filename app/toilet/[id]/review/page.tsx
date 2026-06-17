import { createClient } from "@/app/lib/supabase/server";
import { notFound } from "next/navigation";
import ReviewForm from "@/app/components/ReviewForm";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: toilet } = await supabase
    .from("toilets")
    .select("name")
    .eq("id", id)
    .single();

  if (!toilet) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-accent mb-1">Write a Review ✍️</h1>
      <p className="text-gray-500 mb-6">for {toilet.name}</p>
      <ReviewForm toiletId={id} />
    </div>
  );
}
