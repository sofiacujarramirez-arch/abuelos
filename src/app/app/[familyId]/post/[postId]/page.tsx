import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import { DeletePostButton } from "./delete-button";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ familyId: string; postId: string }>;
}) {
  const { familyId, postId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, message, created_at, event_date, status, author_id, family_id, photos(storage_path, display_order, width, height)")
    .eq("id", postId)
    .maybeSingle();
  if (error || !post || post.family_id !== familyId) notFound();

  const { data: membership } = await supabase
    .from("memberships")
    .select("role, display_name, relationship")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) notFound();

  const { data: authorMembership } = await supabase
    .from("memberships")
    .select("display_name, relationship")
    .eq("family_id", familyId)
    .eq("user_id", post.author_id)
    .maybeSingle();

  const photos = (post.photos as { storage_path: string; display_order: number }[] | null) ?? [];
  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
  const signedUrls = await getSignedPhotoUrls(sorted.map((p) => p.storage_path));

  const canEdit = post.author_id === user.id || membership.role === "owner" || membership.role === "admin";

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/app/${familyId}`}
        className="inline-flex items-center gap-2 font-body italic text-tobacco hover:text-inkwell mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al muro
      </Link>

      <article className="bg-white border-2 border-inkwell/10 shadow-photo overflow-hidden">
        {sorted.length > 0 && (
          <div className="bg-inkwell/10">
            {sorted.map((p, i) => {
              const url = signedUrls[p.storage_path];
              if (!url) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-full object-contain bg-cream"
                />
              );
            })}
          </div>
        )}

        <div className="p-8">
          {post.status === "draft" && (
            <span className="inline-block pill pop-letter mb-4">Borrador</span>
          )}
          {authorMembership && (
            <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-3">
              {authorMembership.display_name}
              {authorMembership.relationship && (
                <span className="italic normal-case font-normal"> · {authorMembership.relationship}</span>
              )}
            </p>
          )}
          <p className="font-body text-body-lg text-inkwell whitespace-pre-wrap leading-relaxed">
            {post.message || <span className="italic text-tobacco">(sin mensaje)</span>}
          </p>
          <p className="font-body italic text-sm text-tobacco mt-6">
            {new Date(post.event_date || post.created_at).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </article>

      {canEdit && (
        <div className="flex gap-3 mt-6">
          <Link
            href={`/app/${familyId}/post/${postId}/edit`}
            className="btn-ghost inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" /> Editar
          </Link>
          <DeletePostButton familyId={familyId} postId={postId} />
        </div>
      )}
    </div>
  );
}
