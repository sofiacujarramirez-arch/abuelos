import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Copy, Share2, UserPlus, MapPin, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WelcomeBanner } from "./_components/welcome-banner";
import { InvitePanel } from "./_components/invite-panel";

export default async function FamilyHome({
  params,
  searchParams,
}: {
  params: Promise<{ familyId: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { familyId } = await params;
  const { welcome } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch everything in parallel
  const [familyRes, membersRes, recipientsRes, postsRes, subRes] = await Promise.all([
    supabase.from("families").select("*").eq("id", familyId).single(),
    supabase.from("memberships").select("*").eq("family_id", familyId).order("joined_at"),
    supabase.from("recipients").select("*").eq("family_id", familyId),
    supabase
      .from("posts")
      .select("id, message, created_at, author_id")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("subscriptions").select("*").eq("family_id", familyId).single(),
  ]);

  if (familyRes.error || !familyRes.data) notFound();
  const family = familyRes.data;
  const members = membersRes.data ?? [];
  const recipients = recipientsRes.data ?? [];
  const posts = postsRes.data ?? [];
  const subscription = subRes.data;

  const myMembership = members.find((m) => m.user_id === user.id);
  if (!myMembership) notFound();

  const daysUntilTrialEnd = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div>
      {welcome && <WelcomeBanner familyCode={family.code} />}

      {/* Masthead */}
      <div className="nameplate-border py-2 mb-10">
        <div className="flex items-center justify-between font-body italic text-xs md:text-sm text-tobacco">
          <span>Código · {family.code}</span>
          <span className="uppercase tracking-widest not-italic font-semibold">
            La gaceta de la familia
          </span>
          <span className="hidden md:inline">{members.length} {members.length === 1 ? "miembro" : "miembros"}</span>
        </div>
      </div>

      <header className="mb-16">
        <h1 className="font-display text-display-lg font-black mb-3 leading-tight">
          <span className="italic font-normal">La</span>{" "}
          <span className="font-black">{family.name}</span>
        </h1>
        {recipients[0] && (
          <p className="font-body italic text-body-lg text-tobacco">
            Para {recipients[0].term_of_endearment}{" "}
            <span className="not-italic font-semibold text-inkwell">
              {recipients[0].nickname || recipients[0].name.split(" ")[0]}
            </span>
            {recipients[0].city && <>, en {recipients[0].city}</>}.
          </p>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main column — feed placeholder */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl font-bold">
              <span className="italic font-normal">El</span> muro
            </h2>
            <button disabled className="btn-primary opacity-50 cursor-not-allowed text-sm px-5 py-3">
              Publicar (próximamente)
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-inkwell/20 p-10 text-center">
              <p className="font-display italic text-2xl text-tobacco mb-2">
                Aún nadie ha publicado.
              </p>
              <p className="font-body italic text-body text-tobacco mb-6">
                Invita a la familia y comienza a llenar la gaceta.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {posts.map((p) => (
                <li key={p.id} className="bg-white border-2 border-inkwell/10 p-6 shadow-photo">
                  <p className="font-body text-body text-inkwell">{p.message}</p>
                  <p className="font-body italic text-sm text-tobacco mt-3">
                    {new Date(p.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          {/* Recipient card */}
          {recipients[0] && (
            <div className="bg-envelope text-parchment p-6">
              <p className="font-body uppercase tracking-widest text-xs text-envelope-tint font-semibold mb-2">
                Destinataria
              </p>
              <h3 className="font-display text-2xl font-bold mb-4">
                {recipients[0].nickname || recipients[0].name}
              </h3>
              <p className="font-body text-sm text-parchment/90 mb-1 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {recipients[0].address_line1}
                  {recipients[0].address_line2 && <>, {recipients[0].address_line2}</>}
                  <br />
                  {recipients[0].city}
                  {recipients[0].department && <>, {recipients[0].department}</>}
                  <br />
                  {recipients[0].country}
                </span>
              </p>
              {recipients[0].birth_date && (
                <p className="font-body text-sm text-parchment/90 mt-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    Cumpleaños:{" "}
                    {new Date(recipients[0].birth_date).toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Trial banner */}
          {subscription?.status === "trialing" && daysUntilTrialEnd !== null && (
            <div className="bg-letter-tint border-l-4 border-letter p-5">
              <p className="font-body uppercase tracking-widest text-xs font-semibold text-letter">
                Prueba gratis
              </p>
              <p className="font-display text-2xl font-bold mt-1 text-inkwell">
                {daysUntilTrialEnd} {daysUntilTrialEnd === 1 ? "día" : "días"} restantes
              </p>
              <p className="font-body italic text-sm text-tobacco mt-2">
                Tómate el tiempo para poblar la primera gaceta.
              </p>
            </div>
          )}

          {/* Invite panel */}
          <InvitePanel familyCode={family.code} familyName={family.name} />

          {/* Members */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              <span className="italic font-normal">La</span> familia ({members.length})
            </h3>
            <ul className="space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 bg-white border-2 border-inkwell/10 p-3">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center font-display font-bold text-inkwell">
                    {m.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-inkwell truncate">{m.display_name}</p>
                    <p className="font-body italic text-sm text-tobacco truncate">
                      {m.relationship || m.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
