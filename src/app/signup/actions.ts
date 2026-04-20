"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function signupAction(formData: FormData): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const inviteToken = String(formData.get("inviteToken") ?? "").trim() || undefined;

  if (!email || !password || !fullName) {
    return { error: "Por favor llena tu nombre, correo y contraseña." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, invite_token: inviteToken },
      emailRedirectTo: `${origin}/auth/callback?next=${inviteToken ? `/invite/${inviteToken}` : "/onboarding"}`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Ya existe una cuenta con este correo. Mejor inicia sesión." };
    }
    return { error: error.message };
  }

  redirect("/signup/check-email");
}
