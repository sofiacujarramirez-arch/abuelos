import Link from "next/link";
import { Heart } from "lucide-react";

type Tone = "dark" | "light";
type Size = "sm" | "md" | "lg";

const SIZE_TEXT: Record<Size, string> = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
};
const SIZE_ICON: Record<Size, string> = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
};

export function BrandMark({
  tone = "dark",
  size = "md",
  href = "/",
  asLink = true,
  className = "",
}: {
  tone?: Tone;
  size?: Size;
  href?: string;
  asLink?: boolean;
  className?: string;
}) {
  const textColor = tone === "light" ? "text-parchment" : "text-inkwell";
  const heartColor = tone === "light" ? "fill-parchment text-parchment" : "fill-envelope text-envelope";

  const content = (
    <span
      className={`inline-flex items-center gap-2 font-display font-black ${SIZE_TEXT[size]} ${textColor} ${className}`}
    >
      <Heart className={`${SIZE_ICON[size]} ${heartColor}`} strokeWidth={0} />
      <span>mi familia</span>
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href={href} className="inline-block">
      {content}
    </Link>
  );
}
