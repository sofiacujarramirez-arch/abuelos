"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Mail } from "lucide-react";

export function InvitePanel({
  familyCode,
  recipientName,
}: {
  familyCode: string;
  recipientName: string;
}) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/signup?invite=${familyCode}` : `/signup?invite=${familyCode}`;

  const waMessage = encodeURIComponent(
    `Te invito a unirte al álbum familiar para ${recipientName}, únete por medio de este link ${inviteUrl}`,
  );
  const emailSubject = encodeURIComponent(`Únete al álbum familiar para ${recipientName}`);
  const emailBody = encodeURIComponent(
    `Te invito a unirte al álbum familiar para ${recipientName}, únete por medio de este link ${inviteUrl}`,
  );

  async function copyCode() {
    await navigator.clipboard.writeText(familyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-cream p-6">
      <h3 className="font-display text-2xl font-bold mb-2">
        Invita a <span className="italic font-normal">los tuyos</span>
      </h3>
      <p className="font-body italic text-body text-tobacco mb-5">
        Mientras más sean, más llena la gaceta.
      </p>

      <button
        onClick={copyCode}
        className="w-full bg-white border-2 border-dashed border-inkwell/30 hover:border-inkwell transition px-4 py-4 font-display text-2xl font-black text-center flex items-center justify-center gap-3"
      >
        <span>{familyCode}</span>
        {copied ? <Check className="w-5 h-5 text-garden" /> : <Copy className="w-5 h-5 text-tobacco" />}
      </button>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <a
          href={`https://wa.me/?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-garden text-parchment py-3 font-body font-semibold text-sm tracking-wide text-center hover:bg-garden/90 transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <a
          href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
          className="bg-inkwell text-parchment py-3 font-body font-semibold text-sm tracking-wide text-center hover:bg-tobacco transition flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" /> Correo
        </a>
      </div>
    </div>
  );
}
