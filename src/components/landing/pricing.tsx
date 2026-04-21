import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Mensual",
    italic: "El clásico familiar",
    price: "$12",
    cadence: "/ mes",
    summary: "Una gaceta al mes, entregada en cualquier parte de Colombia.",
    features: ["28 mensajes por edición", "12 páginas", "Envío gratis en Colombia", "Archivo PDF para siempre"],
    cta: "Empezar mensual",
    featured: false,
  },
  {
    name: "Mensual +",
    italic: "Para la familia grande",
    price: "$16",
    cadence: "/ mes",
    summary: "Una gaceta más llena, con espacio para que cada nieto salude.",
    features: ["36 mensajes por edición", "16 páginas", "Retratos a página completa", "Envío gratis en Colombia", "Archivo PDF para siempre"],
    cta: "Empezar mensual +",
    featured: true,
  },
  {
    name: "Quincenal",
    italic: "El doble de cariño",
    price: "$22",
    cadence: "/ mes",
    summary: "Dos gacetas al mes. Porque una sola no alcanza.",
    features: ["28 mensajes × 2 ediciones", "12 páginas cada una", "Envío gratis en Colombia", "Impresión prioritaria"],
    cta: "Empezar quincenal",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-letter text-parchment">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="pill bg-letter-tint text-letter mb-6">Precios</span>
          <h2 className="font-display text-display-lg font-black mb-6">
            <span className="italic font-normal">Planes sencillos.</span>{" "}
            <span className="font-black">Cancela cuando quieras.</span>
          </h2>
          <p className="font-body italic text-body-lg text-parchment/80">
            Paga en USD, EUR o COP. La vaquita familiar deja que tíos y primos se repartan el costo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-10 flex flex-col ${
                p.featured
                  ? "bg-parchment text-inkwell shadow-photo-lg relative"
                  : "bg-letter text-parchment border-2 border-parchment/30"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-4 left-10 pill bg-envelope text-parchment">
                  El más elegido
                </span>
              )}
              <p className="font-body italic text-sm uppercase tracking-widest mb-2 opacity-80">
                {p.italic}
              </p>
              <h3 className="font-display text-4xl font-black mb-4">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-6xl font-black">{p.price}</span>
                <span className="font-body italic text-lg opacity-70">{p.cadence}</span>
              </div>
              <p
                className="font-body italic text-body mb-8 opacity-90"
                dangerouslySetInnerHTML={{ __html: p.summary }}
              />
              <ul className="space-y-3 font-body text-body mb-10 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-1" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`text-center py-4 font-body font-semibold tracking-wide transition ${
                  p.featured
                    ? "bg-inkwell text-parchment hover:bg-tobacco"
                    : "bg-parchment text-letter hover:bg-cream"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="font-body italic text-center text-parchment/70 mt-12">
          ¿Quieres el gesto grande? Nuestro plan <strong className="not-italic font-semibold">Semanal</strong> entrega una gaceta nueva cada semana — $38/mes.
        </p>
      </div>
    </section>
  );
}
