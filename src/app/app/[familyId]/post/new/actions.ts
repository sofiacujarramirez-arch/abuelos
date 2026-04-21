"use server";

import { createClient } from "@/lib/supabase/server";

type PhotoInput = { path: string; width?: number | null; height?: number | null };

export async function createPostAction(input: {
  familyId: string;
  message: string;
  photos: PhotoInput[];
  eventDate?: string | null;
  status?: "draft" | "published";
}): Promise<{ error: string } | { ok: true; redirectTo: string }> {
  const { familyId, photos, eventDate } = input;
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

  const { data: post, error: pErr } = await supabase
    .from("posts")
    .insert({
      family_id: familyId,
      author_id: user.id,
      message: message || "",
      event_date: eventDate || null,
      status,
    })
    .select("id")
    .single();
  if (pErr || !post) return { error: `No se pudo publicar: ${pErr?.message}` };

  if (photos.length > 0) {
    const rows = photos.map((p, i) => ({
      post_id: post.id,
      storage_path: p.path,
      display_order: i,
      width: p.width ?? null,
      height: p.height ?? null,
    }));
    const { error: phErr } = await supabase.from("photos").insert(rows);
    if (phErr) {
      await supabase.from("posts").delete().eq("id", post.id);
      return { error: `No se pudieron guardar las fotos: ${phErr.message}` };
    }
  }

  return { ok: true, redirectTo: `/app/${familyId}` };
}
