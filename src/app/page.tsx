import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import { QuoteStrip } from "@/components/landing/quote-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { GazetteShowcase } from "@/components/landing/gazette-showcase";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <QuoteStrip />
      <HowItWorks />
      <GazetteShowcase />
      <Features />
      <Pricing />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
