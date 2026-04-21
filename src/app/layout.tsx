import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "mi familia — una gaceta familiar, impresa con cariño",
  description:
    "Tu familia, en papel. Fotos y mensajes de todos — entregados a tu abuela en una gaceta mensual. Hecho para la diáspora latina.",
  openGraph: {
    title: "mi familia",
    description: "Tu familia, en papel.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
