import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JoinByCodeForm } from "./join-by-code-form";

export default function JoinByCodePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/app"
        className="inline-flex items-center gap-2 font-body italic text-tobacco hover:text-inkwell mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <header className="mb-10">
        <p className="font-body uppercase tracking-widest text-xs text-tobacco font-semibold mb-2">
          Unirme a una familia
        </p>
        <h1 className="font-display text-display-lg font-black mb-3 leading-tight">
          <span className="italic font-normal">Entra con el</span>{" "}
          <span className="font-black">código.</span>
        </h1>
        <p className="font-body italic text-body-lg text-tobacco">
          Pídele a quien creó la gaceta el código de la familia (ej: CUJAR-8472).
        </p>
      </header>

      <div className="bg-white border-2 border-inkwell/10 p-8 shadow-photo">
        <JoinByCodeForm />
      </div>
    </div>
  );
}
