import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-display text-display-xl font-black mb-8 leading-none">
          <span className="italic font-normal">Ella está esperando</span>
          <br />
          <span className="font-black">asomada a la ventana.</span>
        </h2>
        <p className="font-body italic text-body-lg md:text-2xl text-tobacco max-w-2xl mx-auto mb-12 leading-relaxed">
          Empieza su gaceta hoy. La primera edición sale en menos de dos semanas —
          justo a tiempo para el tinto del próximo mes con las vecinas.
        </p>
        <Link href="/signup" className="btn-primary">
          Empezar su gaceta <ArrowRight className="w-6 h-6" />
        </Link>
        <p className="mt-8 font-body text-base text-tobacco">
          Cancelas cuando quieras. Sin compromiso. Paga en USD, EUR o COP.
        </p>
      </div>
    </section>
  );
}
