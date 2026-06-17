import { createClient } from "./client";

export async function uploadPhoto(
  toiletId: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${toiletId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(fileName, file, { contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

  return data.publicUrl;
}
