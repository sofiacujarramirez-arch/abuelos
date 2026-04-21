import { Users, Globe2, Gift, Shield, Sparkles, Printer } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Hasta 60 familiares",
    body: "Tíos, primos, ahijados, comadres — todos pueden contribuir. Una familia, una gaceta, una abuela sonriendo.",
  },
  {
    icon: Globe2,
    title: "Hecho para la diáspora",
    body: "Paga en USD, EUR o CAD. Impreso y enviado dentro de Colombia, sin aduanas ni demoras. En 2026 llegamos a México y Perú.",
  },
  {
    icon: Gift,
    title: "Regala suscripciones",
    body: "Sorpréndela el Día del Abuelo (28 de julio) o en su cumpleaños. Tarjeta digital bonita, activada en la fecha que tú elijas.",
  },
  {
    icon: Shield,
    title: "Privado y sin anuncios",
    body: "Las fotos de tu familia no salen de nuestra red. Cumplimos con la ley de Habeas Data de Colombia y con GDPR. Sin anuncios, nunca.",
  },
  {
    icon: Sparkles,
    title: "Recordatorios amables",
    body: "Avisamos a la familia tres días antes del cierre — y te recordamos cuando ha habido un mes calladito. La gaceta nunca queda vacía.",
  },
  {
    icon: Printer,
    title: "Guarda cada edición",
    body: "Descarga los PDFs de las gacetas anteriores para siempre. A fin de año, empastamos las 12 en un anuario de tapa dura.",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-20">
          <span className="pill pop-envelope mb-6">Por qué nos quieren las familias</span>
          <h2 className="font-display text-display-lg font-black">
            <span className="italic font-normal">Pequeños detalles,</span>{" "}
            <span className="font-black">pensados para las abuelas.</span>
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
