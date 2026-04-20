import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-inkwell text-parchment mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="font-display text-3xl font-black mb-4">
              <span className="italic font-normal">I Love my</span> abuela
            </div>
            <p className="font-body italic text-lg text-parchment/80 max-w-sm">
              Your family, in print. A monthly gazette that brings joy across oceans and generations.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2 font-body text-parchment/80">
              <li><Link href="#how" className="hover:text-gold transition">How it works</Link></li>
              <li><Link href="#gazette" className="hover:text-gold transition">The gazette</Link></li>
              <li><Link href="#pricing" className="hover:text-gold transition">Pricing</Link></li>
              <li><Link href="/gift" className="hover:text-gold transition">Gift a subscription</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-4 uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 font-body text-parchment/80">
              <li><Link href="/about" className="hover:text-gold transition">Our story</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-parchment/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-parchment/60">
            © {new Date().getFullYear()} I Love my abuela — Hecho con cariño para la diáspora.
          </p>
          <p className="font-body italic text-sm text-parchment/60">
            Bogotá · Miami · Madrid · Toronto
          </p>
        </div>
      </div>
    </footer>
  );
}
