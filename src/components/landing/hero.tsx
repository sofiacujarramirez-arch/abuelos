import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-12 md:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Date line — newspaper nameplate vibes */}
        <div className="nameplate-border py-2 mb-12 md:mb-20">
          <div className="flex items-center justify-between font-body italic text-sm md:text-base text-tobacco">
            <span>Vol. I · No. 001</span>
            <span className="uppercase tracking-widest not-italic font-semibold text-xs md:text-sm">
              A family gazette — Established with love
            </span>
            <span className="hidden md:inline">Edición mensual</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Headline block */}
          <div className="lg:col-span-7 relative z-10">
            <span className="pill pop-envelope mb-8 animate-fade-up">
              <Heart className="w-4 h-4" /> For the diaspora
            </span>

            <h1 className="font-display text-display-xl font-black text-inkwell mb-8 animate-fade-up">
              <span className="italic font-normal">Your family,</span>
              <br />
              <span className="font-black">in print.</span>
            </h1>

            <p className="font-body italic text-xl md:text-2xl text-tobacco max-w-xl mb-10 leading-relaxed animate-fade-up">
              A monthly newspaper written by your whole family — photos, stories,
              cariños — delivered to <span className="not-italic font-semibold text-inkwell">your abuela&apos;s door</span> in Colombia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
              <Link href="/signup" className="btn-primary">
                Start her gazette <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how" className="btn-ghost">
                See how it works
              </Link>
            </div>

            <p className="mt-8 font-body text-base text-tobacco animate-fade-up">
              No apps for <span className="italic">abuela</span>. Just a beautiful paper,
              landing in her mailbox every month.
            </p>
          </div>

          {/* Photo collage */}
          <div className="lg:col-span-5 relative min-h-[500px]">
            <div className="photo-print-lg tilt-left absolute top-0 left-4 w-64 md:w-72">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-cream via-gold/40 to-tobacco/60">
                <Image
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80"
                  alt="Grandmother reading"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>
              <p className="font-body italic text-sm text-tobacco pt-3 text-center">
                Abuela Carmen, Medellín
              </p>
            </div>

            <div className="photo-print tilt-right absolute top-32 right-0 w-52 md:w-60 z-10">
              <div className="relative aspect-square bg-letter/20">
                <Image
                  src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=500&q=80"
                  alt="Family photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </div>
              <p className="font-body italic text-sm text-tobacco pt-2 text-center">
                Navidad, 2024
              </p>
            </div>

            <div className="photo-print tilt-left-sm absolute bottom-0 left-12 md:left-20 w-56 md:w-64">
              <div className="relative aspect-[4/3] bg-garden-tint">
                <Image
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&q=80"
                  alt="Children laughing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
              </div>
              <p className="font-body italic text-sm text-tobacco pt-2 text-center">
                Los nietos — Miami
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
