import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="w-full border-b-2 border-inkwell/10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-black text-2xl md:text-3xl text-inkwell">
          <span className="italic font-normal">I Love my</span> abuela
        </Link>
        <div className="hidden md:flex items-center gap-8 font-body text-base text-tobacco">
          <Link href="#how" className="hover:text-inkwell transition">How it works</Link>
          <Link href="#gazette" className="hover:text-inkwell transition">The gazette</Link>
          <Link href="#pricing" className="hover:text-inkwell transition">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline font-body text-base text-inkwell hover:text-tobacco transition">
            Sign in
          </Link>
          <Link href="/signup" className="bg-inkwell text-parchment px-5 py-2.5 font-body font-semibold text-sm tracking-wide hover:bg-tobacco transition">
            Start a gazette
          </Link>
        </div>
      </div>
    </nav>
  );
}
