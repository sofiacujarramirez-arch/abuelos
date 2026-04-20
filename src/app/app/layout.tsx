import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "./_components/app-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("memberships")
    .select("family_id, role, families(id, name, code)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  return (
    <div className="min-h-screen bg-parchment">
      <AppNav
        user={{
          email: user.email ?? "",
          name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "",
        }}
        families={(memberships ?? []).map((m) => {
          const fam = m.families as unknown as { id: string; name: string; code: string } | null;
          return {
            id: fam?.id ?? m.family_id,
            name: fam?.name ?? "",
            code: fam?.code ?? "",
            role: m.role as string,
          };
        })}
      />
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      <footer className="mt-24 border-t-2 border-inkwell/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between font-body text-sm text-tobacco">
          <Link href="/" className="italic">← Volver a la portada</Link>
          <span className="italic">Hecho con cariño para la diáspora.</span>
        </div>
      </footer>
    </div>
  );
}
