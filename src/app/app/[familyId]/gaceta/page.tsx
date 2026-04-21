import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import { GazettePage } from "./gazette-page";

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export default async function GazettePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ familyId: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { familyId } = await params;
  const sp = await searchParams;

  const now = new Date();
  const month = sp.month ? parseInt(sp.month) : now.getMonth() + 1;
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();

  const periodStart = new Date(year, month - 1, 1);
  const periodEnd = new Date(year, month, 1);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("family_id")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) notFound();

  const [familyRes, recipientsRes, membersRes, postsRes] = await Promise.all([
    supabase.from("families").select("name, code").eq("id", familyId).single(),
    supabase.from("recipients").select("*").eq("family_id", familyId),
    supabase.from("memberships").select("user_id, display_name, relationship").eq("family_id", familyId),
    supabase
      .from("posts")
      .select("id, message, created_at, event_date, author_id, photos(storage_path, display_order)")
      .eq("family_id", familyId)
      .in("status", ["published", "in_gazette"])
      .gte("created_at", periodStart.toISOString())
      .lt("created_at", periodEnd.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  if (familyRes.error || !familyRes.data) notFound();
  const family = familyRes.data;
  const recipient = recipientsRes.data?.[0];
  const members = membersRes.data ?? [];
  const posts = postsRes.data ?? [];

  const authorsById = new Map(members.map((m) => [m.user_id, m]));

  const allPaths = posts.flatMap(
    (p) => ((p.photos as { storage_path: string; display_order: number }[] | null) ?? []).map((ph) => ph.storage_path),
  );
  const signedUrls = await getSignedPhotoUrls(allPaths);

  const postsForPage = posts.map((p) => ({
    id: p.id,
    message: p.message,
    createdAt: p.created_at,
    eventDate: p.event_date as string | null,
    author: authorsById.get(p.author_id) ?? null,
    photos: ((p.photos as { storage_path: string; display_order: number }[] | null) ?? [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((ph) => signedUrls[ph.storage_path])
      .filter((u): u is string => !!u),
  }));

  const monthLabel = MONTHS_ES[month - 1];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 print:hidden">
        <Link
          href={`/app/${familyId}`}
          className="inline-flex items-center gap-2 font-body italic text-tobacco hover:text-inkwell"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <div className="flex items-center gap-3">
          <p className="font-body italic text-tobacco">
            Gaceta de {monthLabel} · {posts.length} {posts.length === 1 ? "entrada" : "entradas"}
          </p>
          <form method="get" className="flex items-center gap-2">
            <select
              name="month"
              defaultValue={month}
              className="border-2 border-inkwell/15 bg-white px-3 py-2 font-body text-sm"
            >
              {MONTHS_ES.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              name="year"
              defaultValue={year}
              className="border-2 border-inkwell/15 bg-white px-3 py-2 font-body text-sm"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button className="btn-ghost text-sm px-4 py-2">Ver</button>
          </form>
        </div>
      </div>

      <GazettePage
        familyName={family.name}
        familyCode={family.code}
        recipientName={recipient?.nickname || recipient?.name?.split(" ")[0] || "la familia"}
        recipientTerm={recipient?.term_of_endearment || "abuela"}
        recipientCity={recipient?.city || ""}
        monthLabel={monthLabel}
        year={year}
        posts={postsForPage}
      />
    </div>
  );
}
