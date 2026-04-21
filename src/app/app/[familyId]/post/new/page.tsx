import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "./post-form";

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = await params;

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

  const { data: family } = await supabase
    .from("families")
    .select("name")
    .eq("id", familyId)
    .single();
  const { data: recipients } = await supabase
    .from("recipients")
    .select("nickname, name, term_of_endearment")
    .eq("family_id", familyId)
    .limit(1);
  const abuela = recipients?.[0];
  const abuelaName = abuela?.nickname || abuela?.name?.split(" ")[0] || "la abuela";

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/app/${familyId}`}
        className="inline-flex items-center gap-2 font-body italic text-tobacco hover:text-inkwell mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la gaceta
      </Link>

      <header className="mb-10">
        <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-2">
          Nueva contribución
        </p>
        <h1 className="font-display text-display-lg font-black mb-3 leading-tight">
          <span className="italic font-normal">Una página para</span>{" "}
          <span className="font-black">{abuelaName}.</span>
        </h1>
        <p className="font-body italic text-body-lg text-tobacco">
          Entre {3} y {5} fotos y un mensaje. Irán a la gaceta de {family?.name}.
        </p>
      </header>

      <div className="bg-white border-2 border-inkwell/10 p-8 shadow-photo">
        <PostForm familyId={familyId} />
      </div>
    </div>
  );
}
