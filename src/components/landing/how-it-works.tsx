import { Camera, Newspaper, Mailbox } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Camera,
    kicker: "Todos comparten",
    title: "Fotos, notas de voz, cariños",
    body: "Invita a tíos, primos, nietos, amigos — hasta 60 personas. Cada uno publica desde su celular durante el mes. Fotos de los nietos, el último paseo, cumpleaños, momentos chiquitos.",
  },
  {
    n: "02",
    icon: Newspaper,
    kicker: "Armamos la gaceta",
    title: "Un periódico familiar impreso",
    body: "El primer lunes de cada mes, nuestros editores maquetan todo en una gaceta bonita de 12 páginas. Tipografía grande. Fotos cálidas. Sin apps para la abuela — solo un papel que puede tener en las manos.",
  },
  {
    n: "03",
    icon: Mailbox,
    kicker: "Llega a su puerta",
    title: "Enviada a Colombia, con cariño",
    body: "Impresa en Bogotá y entregada por mensajero a cualquier dirección en Colombia — Barranquilla, Pasto, o la finca en Santander. Ella la abre con su tinto y te lee.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <span className="pill pop-letter mb-6">Cómo funciona</span>
          <h2 className="font-display text-display-lg font-black mb-6">
            <span className="italic font-normal">Tres pasos.</span>{" "}
            <span className="font-black">Una abuela feliz.</span>
          </h2>
          <p className="font-body italic text-body-lg text-tobacco max-w-xl">
            Pensado para familias ocupadas y repartidas por el mundo — y para abuelos que no deberían necesitar un smartphone para sentirse queridos.
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
