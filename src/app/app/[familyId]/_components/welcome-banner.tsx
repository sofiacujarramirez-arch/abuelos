"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function WelcomeBanner({ familyCode }: { familyCode: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-garden text-parchment p-6 md:p-8 mb-10">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-parchment/70 hover:text-parchment"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>
      <p className="font-body uppercase tracking-widest text-xs text-garden-tint font-semibold mb-2">
        Tu familia está creada
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-black mb-3 leading-tight">
        <span className="italic font-normal">Ya se escucha</span>{" "}
        <span className="font-black">la imprenta.</span>
      </h2>
      <p className="font-body italic text-body-lg text-parchment/90 max-w-2xl">
        Comparte el código{" "}
        <span className="font-display not-italic font-bold bg-parchment text-garden px-3 py-1">
          {familyCode}
        </span>{" "}
        con tu familia para que empiecen a contribuir a la primera gaceta.
      </p>
    </div>
  );
}
