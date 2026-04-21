"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PhotoInput = { path: string; width?: number | null; height?: number | null };

export async function updatePostAction(input: {
  familyId: string;
  postId: string;
  message: string;
  photos: PhotoInput[];
  eventDate?: string | null;
  status?: "draft" | "published";
}): Promise<{ error: string } | { ok: true; redirectTo: string }> {
  const { familyId, postId, photos, eventDate } = input;
  const message = input.message.trim();
  const status = input.status ?? "published";

  if (status === "published") {
    if (!message) return { error: "Escribe un mensaje para la abuela." };
    if (photos.length < 3) return { error: "Sube al menos 3 fotos." };
  }
  if (photos.length > 5) return { error: "Máximo 5 fotos por publicación." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const { data: existingPhotos, error: fetchErr } = await supabase
    .from("photos")
    .select("id, storage_path")
    .eq("post_id", postId);
  if (fetchErr) return { error: `No se pudo leer el post: ${fetchErr.message}` };

  const existingByPath = new Map((existingPhotos ?? []).map((p) => [p.storage_path, p.id]));
  const desiredPaths = new Set(photos.map((p) => p.path));

  const toDelete = (existingPhotos ?? []).filter((p) => !desiredPaths.has(p.storage_path));
  if (toDelete.length > 0) {
    const ids = toDelete.map((p) => p.id);
    const paths = toDelete.map((p) => p.storage_path);
    const { error: delRowErr } = await supabase.from("photos").delete().in("id", ids);
    if (delRowErr) return { error: `No se pudo borrar fotos: ${delRowErr.message}` };
    await supabase.storage.from("family-photos").remove(paths);
  }

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const existingId = existingByPath.get(p.path);
    if (existingId) {
      await supabase.from("photos").update({ display_order: i }).eq("id", existingId);
    } else {
      const { error: insErr } = await supabase.from("photos").insert({
        post_id: postId,
        storage_path: p.path,
        display_order: i,
        width: p.width ?? null,
        height: p.height ?? null,
      });
      if (insErr) return { error: `No se pudo guardar foto nueva: ${insErr.message}` };
    }
  }

  const { error: upErr } = await supabase
    .from("posts")
    .update({ message, event_date: eventDate || null, status })
    .eq("id", postId);
  if (upErr) return { error: `No se pudo actualizar: ${upErr.message}` };

  return { ok: true, redirectTo: `/app/${familyId}/post/${postId}` };
}

export async function deletePostAction(input: {
  familyId: string;
  postId: string;
}): Promise<void> {
  const { familyId, postId } = input;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: photosRows } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("post_id", postId);
  const paths = (photosRows ?? []).map((p) => p.storage_path);

  await supabase.from("posts").delete().eq("id", postId);

  if (paths.length > 0) {
    await supabase.storage.from("family-photos").remove(paths);
  }

  redirect(`/app/${familyId}`);
}
