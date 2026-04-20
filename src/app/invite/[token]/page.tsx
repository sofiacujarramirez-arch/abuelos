import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/auth-shell";
import { JoinForm } from "./join-form";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const code = decodeURIComponent(token).toUpperCase();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/invite/${token}`);

  const { data: family } = await supabase
    .from("families")
    .select("id, name, code")
    .eq("code", code)
    .maybeSingle();

  if (!family) {
    return (
      <AuthShell italic="Código" title="no encontrado." subtitle={`No encontramos ninguna familia con el código ${code}.`}>
        <p className="font-body text-body text-tobacco">
          Verifica con quien te invitó que el código esté bien escrito.
        </p>
      </AuthShell>
    );
  }

  const { data: existing } = await supabase
    .from("memberships")
    .select("family_id")
    .eq("family_id", family.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) redirect(`/app/${family.id}`);

  return (
    <AuthShell
      italic="Únete a"
      title={`La ${family.name}.`}
      subtitle="Cuéntanos quién eres para la abuela y entra a la gaceta familiar."
    >
      <JoinForm familyId={family.id} />
    </AuthShell>
  );
}
