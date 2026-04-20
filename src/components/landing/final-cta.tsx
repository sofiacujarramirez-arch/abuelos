import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-display text-display-xl font-black mb-8 leading-none">
          <span className="italic font-normal">She&apos;s waiting</span>
          <br />
          <span className="font-black">by the window.</span>
        </h2>
        <p className="font-body italic text-body-lg md:text-2xl text-tobacco max-w-2xl mx-auto mb-12 leading-relaxed">
          Start her gazette today. Your first edition ships within two weeks —
          just in time for next month&apos;s café with the vecinas.
        </p>
        <Link href="/signup" className="btn-primary">
          Start her gazette <ArrowRight className="w-6 h-6" />
        </Link>
        <p className="mt-8 font-body text-base text-tobacco">
          Free to cancel. No commitment. Pay in USD, EUR, or COP.
        </p>
      </div>
    </section>
  );
}
