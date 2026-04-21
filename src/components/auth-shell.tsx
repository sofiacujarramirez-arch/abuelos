import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";

export function AuthShell({
  title,
  italic,
  subtitle,
  children,
  footer,
}: {
  title: string;
  italic: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Brand side */}
      <aside className="hidden md:flex bg-envelope text-parchment p-12 flex-col justify-between">
        <BrandMark tone="light" size="lg" />
        <blockquote>
          <p className="font-display italic text-3xl lg:text-4xl leading-tight mb-6">
            &ldquo;Cada mes espero el periódico de la familia más que las novelas.&rdquo;
          </p>
          <footer className="font-body uppercase tracking-widest text-xs font-semibold text-envelope-tint">
            — Abuela Teresa, Bogotá
          </footer>
        </blockquote>
        <p className="font-body italic text-sm text-envelope-tint">
          Hecho con cariño para la diáspora.
        </p>
      </aside>

      {/* Form side */}
      <section className="flex flex-col justify-center px-6 md:px-16 py-12 bg-parchment">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden mb-12">
            <BrandMark size="md" />
          </div>
          <h1 className="font-display text-display-md font-black mb-3 leading-tight">
            <span className="italic font-normal">{italic}</span>{" "}
            <span className="font-black">{title}</span>
          </h1>
          {subtitle && (
            <p className="font-body italic text-body text-tobacco mb-10">{subtitle}</p>
          )}
          {children}
          {footer && <div className="mt-8 text-center font-body text-tobacco">{footer}</div>}
        </div>
      </section>
    </main>
  );
}
