import { Camera, Newspaper, Mailbox } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Camera,
    kicker: "Everyone shares",
    title: "Photos, voice notes, cariños",
    body: "Invite tíos, primos, nietos, amigos — hasta 60 personas. Each one posts from their phone during the month. Photos of the grandkids, the last trip, birthdays, little moments.",
  },
  {
    n: "02",
    icon: Newspaper,
    kicker: "We craft the gazette",
    title: "A printed family newspaper",
    body: "On the first Monday of every month, our editors lay out everything into a beautiful 12-page gazette. Big fonts. Warm photos. No apps for abuela — just a paper she can hold.",
  },
  {
    n: "03",
    icon: Mailbox,
    kicker: "It lands at her door",
    title: "Mailed to Colombia, with love",
    body: "Printed in Bogotá and delivered by courier to any address in Colombia — Barranquilla, Pasto, or the finca in Santander. She opens it with her café and reads you.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <span className="pill pop-letter mb-6">How it works</span>
          <h2 className="font-display text-display-lg font-black mb-6">
            <span className="italic font-normal">Three steps.</span>{" "}
            <span className="font-black">One happy abuela.</span>
          </h2>
          <p className="font-body italic text-body-lg text-tobacco max-w-xl">
            Designed for busy families scattered across borders — and for grandparents who shouldn&apos;t need a smartphone to feel loved.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="font-display text-8xl md:text-9xl font-black text-gold/50 leading-none mb-4">
                {s.n}
              </div>
              <s.icon className="w-10 h-10 text-inkwell mb-6" strokeWidth={1.5} />
              <p className="font-body italic text-tobacco uppercase tracking-wider text-sm font-semibold mb-3">
                {s.kicker}
              </p>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {s.title}
              </h3>
              <p className="font-body text-body text-inkwell/80 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
