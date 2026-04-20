"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { logoutAction } from "@/app/app/actions";

type Family = { id: string; name: string; code: string; role: string };

export function AppNav({
  user,
  families,
}: {
  user: { email: string; name: string };
  families: Family[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentFamily = families.find((f) => pathname.startsWith(`/app/${f.id}`));

  return (
    <nav className="border-b-2 border-inkwell/10 bg-parchment sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/app" className="font-display font-black text-xl md:text-2xl shrink-0">
            <span className="italic font-normal">I Love my</span> abuela
          </Link>
          {currentFamily && (
            <>
              <span className="hidden md:inline text-inkwell/30">·</span>
              <span className="hidden md:inline font-body italic text-tobacco">
                {currentFamily.name}
              </span>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 font-body text-base text-inkwell hover:text-envelope transition"
          >
            <span className="hidden sm:inline">{user.name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white border-2 border-inkwell/10 shadow-photo-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-inkwell/10">
                <p className="font-body font-semibold text-inkwell">{user.name}</p>
                <p className="font-body italic text-sm text-tobacco truncate">{user.email}</p>
              </div>
              {families.length > 0 && (
                <div className="py-2 border-b border-inkwell/10">
                  <p className="px-4 py-1 font-body uppercase text-xs tracking-widest text-tobacco font-semibold">
                    Tus familias
                  </p>
                  {families.map((f) => (
                    <Link
                      key={f.id}
                      href={`/app/${f.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 font-body text-inkwell hover:bg-cream transition"
                    >
                      <span className="truncate">{f.name}</span>
                      <span className="font-body italic text-xs text-tobacco ml-2">{f.role}</span>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href="/onboarding"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 font-body text-inkwell hover:bg-cream transition"
              >
                <Plus className="w-4 h-4" /> Crear otra familia
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full text-left px-4 py-2 font-body text-envelope hover:bg-envelope-tint transition"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
