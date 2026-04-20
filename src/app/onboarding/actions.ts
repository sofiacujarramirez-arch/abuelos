"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const TERM_OPTIONS = ["abuela", "abuelita", "nona", "tita", "mamita", "abuelo", "abuelito", "papito"];

export async function createFamilyAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  const familyName = String(formData.get("familyName") ?? "").trim();
  const yourDisplayName = String(formData.get("yourDisplayName") ?? "").trim();
  const yourRelationship = String(formData.get("yourRelationship") ?? "").trim() || null;
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const recipientNickname = String(formData.get("recipientNickname") ?? "").trim() || null;
  const term = String(formData.get("termOfEndearment") ?? "abuela").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim() || null;
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "CO").trim().toUpperCase();
  const birthDate = String(formData.get("birthDate") ?? "").trim() || null;

  if (!familyName || !yourDisplayName || !recipientName || !addressLine1 || !city) {
    return { error: "Faltan campos obligatorios." };
  }
  if (!TERM_OPTIONS.includes(term)) {
    return { error: "Elige cómo le dices." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada. Vuelve a entrar." };

  // Generate family code
  const { data: codeRow, error: codeErr } = await supabase.rpc("generate_family_code", {
    base: familyName,
  });
  if (codeErr || !codeRow) {
    return { error: `No pudimos generar el código de familia: ${codeErr?.message ?? "desconocido"}` };
  }

  // Create family
  const { data: family, error: fErr } = await supabase
    .from("families")
    .insert({ name: familyName, code: codeRow as unknown as string, owner_id: user.id })
    .select("id")
    .single();
  if (fErr || !family) return { error: `Error creando familia: ${fErr?.message}` };

  // Create owner membership
  const { error: mErr } = await supabase.from("memberships").insert({
    family_id: family.id,
    user_id: user.id,
    role: "owner",
    display_name: yourDisplayName,
    relationship: yourRelationship,
  });
  if (mErr) return { error: `Error creando membresía: ${mErr.message}` };

  // Create recipient (abuela)
  const { error: rErr } = await supabase.from("recipients").insert({
    family_id: family.id,
    name: recipientName,
    nickname: recipientNickname,
    term_of_endearment: term,
    birth_date: birthDate,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    department,
    postal_code: postalCode,
    country,
  });
  if (rErr) return { error: `Error añadiendo a tu ${term}: ${rErr.message}` };

  // Trial subscription stub
  await supabase.from("subscriptions").insert({
    family_id: family.id,
    plan: "mensual",
    status: "trialing",
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });

  redirect(`/app/${family.id}?welcome=1`);
}
