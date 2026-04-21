import { createClient } from "@/lib/supabase/server";

export async function getSignedPhotoUrls(
  paths: string[],
  expiresIn = 3600,
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("family-photos")
    .createSignedUrls(paths, expiresIn);
  if (error || !data) return {};
  const map: Record<string, string> = {};
  for (const row of data) {
    if (row.path && row.signedUrl) map[row.path] = row.signedUrl;
  }
  return map;
}
