import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { GazettePage } from "@/app/app/[familyId]/gaceta/gazette-page";

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

type EditionLookup = {
  edition_id: string;
  family_id: string;
  recipient_id: string;
  period_start: string;
  period_end: string;
};

async function loadGazette(slug: string) {
  const service = createServiceClient();

  const { data: lookup, error: lookupErr } = await service
    .rpc("lookup_gazette_by_slug", { slug_in: slug })
    .maybeSingle();
  if (lookupErr || !lookup) return null;
  const edition = lookup as EditionLookup;

  const periodStart = new Date(edition.period_start);
  const periodEnd = new Date(edition.period_end);
  const month = periodStart.getUTCMonth() + 1;
  const year = periodStart.getUTCFullYear();

  const [familyRes, recipientRes, membersRes, postsRes] = await Promise.all([
    service.from("families").select("name, code").eq("id", edition.family_id).single(),
    service.from("recipients").select("*").eq("id", edition.recipient_id).single(),
    service.from("memberships").select("user_id, display_name, relationship").eq("family_id", edition.family_id),
    service
      .from("posts")
      .select("id, message, created_at, event_date, author_id, photos(storage_path, display_order)")
      .eq("family_id", edition.family_id)
      .in("status", ["published", "in_gazette"])
      .gte("created_at", periodStart.toISOString())
      .lt("created_at", periodEnd.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  if (familyRes.error || !familyRes.data) return null;
  if (recipientRes.error || !recipientRes.data) return null;

  const family = familyRes.data;
  const recipient = recipientRes.data;
  const members = membersRes.data ?? [];
  const posts = postsRes.data ?? [];
  const authorsById = new Map(members.map((m) => [m.user_id, m]));

  const allPaths = posts.flatMap(
    (p) => ((p.photos as { storage_path: string; display_order: number }[] | null) ?? []).map((ph) => ph.storage_path),
  );
  const signed = allPaths.length
    ? await service.storage.from("family-photos").createSignedUrls(allPaths, 3600)
    : { data: [], error: null };
  const signedUrls: Record<string, string> = {};
  for (const row of signed.data ?? []) {
    if (row.path && row.signedUrl) signedUrls[row.path] = row.signedUrl;
  }

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

  return { family, recipient, postsForPage, month, year };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadGazette(slug);
  if (!data) return { title: "mi familia" };
  const monthLabel = MONTHS_ES[data.month - 1];
  const title = `La ${data.family.name} — ${monthLabel} ${data.year}`;
  const description = `Una gaceta familiar para ${data.recipient.term_of_endearment ?? "la abuela"} ${data.recipient.nickname ?? data.recipient.name?.split(" ")[0] ?? ""}.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "article" },
  };
}

export default async function PublicGazettePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadGazette(slug);
  if (!data) notFound();

  const { family, recipient, postsForPage, month, year } = data;
  const monthLabel = MONTHS_ES[month - 1];

  return (
    <div className="min-h-screen bg-parchment py-10 px-4 print:p-0">
      <GazettePage
        familyName={family.name}
        familyCode={family.code}
        recipientName={recipient.nickname || recipient.name?.split(" ")[0] || "la familia"}
        recipientTerm={recipient.term_of_endearment || "abuela"}
        recipientCity={recipient.city || ""}
        monthLabel={monthLabel}
        year={year}
        posts={postsForPage}
      />
    </div>
  );
}
