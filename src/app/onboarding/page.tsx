import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BrandMark } from "@/components/brand-mark";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // If user already has a family, send them straight to app
  const { data: existing } = await supabase
    .from("memberships")
    .select("family_id")
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    redirect(`/app/${existing[0].family_id}`);
  }

  const defaultName = (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <main className="min-h-screen bg-parchment">
      <header className="border-b-2 border-inkwell/10 bg-parchment">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <BrandMark size="md" />
          <div className="font-body italic text-sm text-tobacco">
            Paso 1 de 1
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="nameplate-border py-2 mb-10">
          <p className="font-body italic text-sm text-tobacco text-center uppercase tracking-widest">
            Vol. I · Edición número uno
          </p>
        </div>

        <h1 className="font-display text-display-lg font-black mb-4 leading-tight">
          <span className="italic font-normal">Creemos el</span>{" "}
          <span className="font-black">primer número.</span>
        </h1>
        <p className="font-body italic text-body-lg text-tobacco mb-12 max-w-xl">
          Cuéntanos de tu familia y de tu abuela. Con esto inauguramos su gaceta mensual.
        </p>

        <OnboardingForm defaultDisplayName={defaultName} />
      </div>
    </main>
  );
}
