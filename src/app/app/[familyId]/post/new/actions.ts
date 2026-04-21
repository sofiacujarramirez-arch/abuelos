"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PhotoInput = { path: string; width?: number; height?: number };

export async function createPostAction(input: {
  familyId: string;
  message: string;
  photos: PhotoInput[];
  eventDate?: string | null;
}): Promise<{ error: string } | void> {
  const { familyId, photos, eventDate } = input;
  const message = input.message.trim();

  if (!message) return { error: "Escribe un mensaje para la abuela." };
  if (photos.length < 3) return { error: "Sube al menos 3 fotos." };
  if (photos.length > 5) return { error: "Máximo 5 fotos por publicación." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const { data: post, error: pErr } = await supabase
    .from("posts")
    .insert({
      family_id: familyId,
      author_id: user.id,
      message,
      event_date: eventDate || null,
      status: "published",
    })
    .select("id")
    .single();
  if (pErr || !post) return { error: `No se pudo publicar: ${pErr?.message}` };

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

  redirect(`/app/${familyId}`);
}
