import { Users, Globe2, Gift, Shield, Sparkles, Printer } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Up to 60 family members",
    body: "Tíos, primos, ahijados, comadres — todos pueden contribuir. One family, one gazette, one abuela smiling.",
  },
  {
    icon: Globe2,
    title: "Built for the diaspora",
    body: "Pay in USD, EUR, or CAD. Printed and shipped inside Colombia, so no customs, no delays. Expanding to Mexico and Peru in 2026.",
  },
  {
    icon: Gift,
    title: "Gift subscriptions",
    body: "Surprise her on Día del Abuelo (July 28) or her birthday. Beautiful digital card, activated on the date you choose.",
  },
  {
    icon: Shield,
    title: "Private and ad-free",
    body: "Your family photos never leave our network. Complies with Colombia's Habeas Data law and GDPR. No ads, ever.",
  },
  {
    icon: Sparkles,
    title: "Smart reminders",
    body: "We nudge the family three days before close — and remind you when she&apos;s had a quiet month. The gazette stays full.",
  },
  {
    icon: Printer,
    title: "Keep every edition",
    body: "Download PDFs of past gazettes forever. At year-end, we can bind all 12 into a hardcover anuario.",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <span className="pill pop-envelope mb-6">Why families love it</span>
          <h2 className="font-display text-display-lg font-black">
            <span className="italic font-normal">Small details,</span>{" "}
            <span className="font-black">made for grandmothers.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {features.map((f) => (
            <div key={f.title} className="border-t-2 border-inkwell pt-6">
              <f.icon className="w-8 h-8 text-tobacco mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 leading-tight">
                {f.title}
              </h3>
              <p className="font-body text-body text-inkwell/80 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
