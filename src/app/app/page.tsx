import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AppHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("family_id, role, display_name, families(id, name, code)")
    .eq("user_id", user.id);

  if (!memberships || memberships.length === 0) {
    redirect("/onboarding");
  }
  if (memberships.length === 1) {
    redirect(`/app/${memberships[0].family_id}`);
  }

  return (
    <div>
      <h1 className="font-display text-display-lg font-black mb-2">
        <span className="italic font-normal">Tus</span> familias
      </h1>
      <p className="font-body italic text-body-lg text-tobacco mb-12">
        Elige la familia en la que quieres estar hoy.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {memberships.map((m) => {
          const fam = m.families as unknown as { id: string; name: string; code: string };
          return (
            <Link
              key={m.family_id}
              href={`/app/${m.family_id}`}
              className="block bg-white border-2 border-inkwell/10 hover:border-inkwell transition p-8 shadow-photo"
            >
              <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-2">
                {m.role}
              </p>
              <h2 className="font-display text-3xl font-black mb-2">{fam.name}</h2>
              <p className="font-body italic text-body text-tobacco">Código: {fam.code}</p>
            </Link>
          );
        })}

        <Link
          href="/onboarding"
          className="flex flex-col items-center justify-center bg-parchment border-2 border-dashed border-inkwell/30 hover:border-inkwell transition p-8 min-h-[180px] text-center"
        >
          <Plus className="w-8 h-8 text-tobacco mb-2" />
          <span className="font-display text-xl font-bold">Crear otra familia</span>
          <span className="font-body italic text-body text-tobacco mt-1">
            Otra abuela, otra gaceta.
          </span>
        </Link>
      </div>
    </div>
  );
}
