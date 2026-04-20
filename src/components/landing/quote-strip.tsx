export function QuoteStrip() {
  return (
    <section className="bg-envelope text-parchment py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-display italic text-3xl md:text-5xl leading-tight font-normal mb-8">
          &ldquo;Cada mes espero el periódico de la familia más que las
          novelas. Es lo más bonito que llega a mi casa.&rdquo;
        </p>
        <div className="rule-bar bg-parchment mx-auto mb-6"></div>
        <p className="font-body uppercase tracking-widest text-sm font-semibold text-envelope-tint">
          — Abuela Teresa, Bogotá · 78 años · 14 nietos
        </p>
      </div>
    </section>
  );
}
