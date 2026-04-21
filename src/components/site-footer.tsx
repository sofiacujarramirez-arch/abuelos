import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="bg-inkwell text-parchment mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandMark tone="light" size="lg" />
            </div>
            <p className="font-body italic text-lg text-parchment/80 max-w-sm">
              Tu familia, en papel. Una gaceta mensual que une abuelas y nietos a través de océanos y generaciones.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wide">Producto</h4>
            <ul className="space-y-2 font-body text-parchment/80">
              <li><Link href="#how" className="hover:text-gold transition">Cómo funciona</Link></li>
              <li><Link href="#gazette" className="hover:text-gold transition">La gaceta</Link></li>
              <li><Link href="#pricing" className="hover:text-gold transition">Precios</Link></li>
              <li><Link href="/gift" className="hover:text-gold transition">Regalar suscripción</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wide">Nosotros</h4>
            <ul className="space-y-2 font-body text-parchment/80">
              <li><Link href="/about" className="hover:text-gold transition">Nuestra historia</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition">Contacto</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition">Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition">Términos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-parchment/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-parchment/60">
            © {new Date().getFullYear()} mi familia — Hecho con cariño para la diáspora.
          </p>
          <p className="font-body italic text-sm text-parchment/60">
            Bogotá · Miami · Madrid · Toronto
          </p>
        </div>
      </div>
    </footer>
  );
}
