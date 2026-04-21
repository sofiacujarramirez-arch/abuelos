"use client";

import { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";

export function SharePanel({
  publicUrl,
  whatsappText,
}: {
  publicUrl: string;
  whatsappText: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${whatsappText}\n\n${publicUrl}`)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleCopy}
        className="btn-ghost text-sm px-4 py-2 inline-flex items-center gap-2"
        aria-label="Copiar link"
      >
        {copied ? <Check className="w-4 h-4 text-garden" /> : <Link2 className="w-4 h-4" />}
        {copied ? "¡Copiado!" : "Copiar link"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm px-4 py-2 inline-flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  );
}
