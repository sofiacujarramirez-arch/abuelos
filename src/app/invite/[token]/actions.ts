"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function joinFamilyAction(formData: FormData): Promise<{ error: string } | void> {
  const familyId = String(formData.get("familyId") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();

  if (!familyId || !displayName || !relationship) {
    return { error: "Por favor llena tu nombre y tu relación con la abuela." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const { error } = await supabase.from("memberships").insert({
    family_id: familyId,
    user_id: user.id,
    role: "contributor",
    display_name: displayName,
    relationship,
  });

  if (error) {
    if (error.code === "23505") return { error: "Ya eres miembro de esta familia." };
    return { error: error.message };
  }

  redirect(`/app/${familyId}`);
}
