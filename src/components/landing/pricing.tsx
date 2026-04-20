import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Mensual",
    italic: "The family classic",
    price: "$12",
    cadence: "/ month",
    summary: "One gazette a month, delivered anywhere in Colombia.",
    features: ["28 messages per edition", "12 pages", "Free shipping in Colombia", "PDF archive forever"],
    cta: "Start mensual",
    featured: false,
  },
  {
    name: "Mensual +",
    italic: "For the big family",
    price: "$16",
    cadence: "/ month",
    summary: "A fuller gazette with room for every nieto to say hi.",
    features: ["36 messages per edition", "16 pages", "Full-page portraits", "Free shipping in Colombia", "PDF archive forever"],
    cta: "Start mensual +",
    featured: true,
  },
  {
    name: "Quincenal",
    italic: "Twice the love",
    price: "$22",
    cadence: "/ month",
    summary: "Two gazettes per month. Because once isn&apos;t enough.",
    features: ["28 messages × 2 editions", "12 pages each", "Free shipping in Colombia", "Priority printing"],
    cta: "Start quincenal",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-letter text-parchment">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="pill bg-letter-tint text-letter mb-6">Pricing</span>
          <h2 className="font-display text-display-lg font-black mb-6">
            <span className="italic font-normal">Simple plans.</span>{" "}
            <span className="font-black">Cancel anytime.</span>
          </h2>
          <p className="font-body italic text-body-lg text-parchment/80">
            Pay in USD, EUR, or COP. The family kitty lets tíos and primos split the bill.
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
                  Most chosen
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
          Want the big gesture? Our <strong className="not-italic font-semibold">Semanal</strong> plan delivers a new gazette every week — $38/mo.
        </p>
      </div>
    </section>
  );
}
