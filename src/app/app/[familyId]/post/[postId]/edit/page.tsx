import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import { EditPostForm } from "./edit-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ familyId: string; postId: string }>;
}) {
  const { familyId, postId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("id, message, event_date, status, author_id, family_id, photos(storage_path, display_order, width, height)")
    .eq("id", postId)
    .maybeSingle();
  if (!post || post.family_id !== familyId) notFound();

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) notFound();

  const canEdit = post.author_id === user.id || membership.role === "owner" || membership.role === "admin";
  if (!canEdit) redirect(`/app/${familyId}/post/${postId}`);

  const photos = ((post.photos as { storage_path: string; display_order: number; width: number | null; height: number | null }[] | null) ?? [])
    .sort((a, b) => a.display_order - b.display_order);
  const signedUrls = await getSignedPhotoUrls(photos.map((p) => p.storage_path));
  const initialPhotos = photos
    .map((p) => ({
      path: p.storage_path,
      url: signedUrls[p.storage_path],
      width: p.width,
      height: p.height,
    }))
    .filter((p) => !!p.url);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/app/${familyId}/post/${postId}`}
        className="inline-flex items-center gap-2 font-body italic text-tobacco hover:text-inkwell mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Cancelar edición
      </Link>

      <header className="mb-10">
        <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-2">
          {post.status === "draft" ? "Editando borrador" : "Editando publicación"}
        </p>
        <h1 className="font-display text-display-lg font-black mb-3 leading-tight">
          <span className="italic font-normal">Corrige</span>{" "}
          <span className="font-black">lo que haga falta.</span>
        </h1>
      </header>

      <div className="bg-white border-2 border-inkwell/10 p-8 shadow-photo">
        <EditPostForm
          familyId={familyId}
          postId={postId}
          initialMessage={post.message}
          initialEventDate={post.event_date}
          initialStatus={post.status}
          initialPhotos={initialPhotos}
        />
      </div>
    </div>
  );
}
