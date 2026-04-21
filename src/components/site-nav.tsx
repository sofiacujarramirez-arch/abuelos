import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteNav() {
  return (
    <nav className="w-full border-b-2 border-inkwell/10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <BrandMark size="md" />
        <div className="hidden md:flex items-center gap-8 font-body text-base text-tobacco">
          <Link href="#how" className="hover:text-inkwell transition">Cómo funciona</Link>
          <Link href="#gazette" className="hover:text-inkwell transition">La gaceta</Link>
          <Link href="#pricing" className="hover:text-inkwell transition">Precios</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline font-body text-base text-inkwell hover:text-tobacco transition">
            Entrar
          </Link>
          <Link href="/signup" className="bg-inkwell text-parchment px-5 py-2.5 font-body font-semibold text-sm tracking-wide hover:bg-tobacco transition">
            Empezar
          </Link>
        </div>
      </div>
    </nav>
  );
}
