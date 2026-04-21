"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function JoinByCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) {
      setError("Escribe el código de la familia.");
      return;
    }
    startTransition(() => {
      router.push(`/invite/${encodeURIComponent(cleaned)}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">
          Código de familia
        </span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-4 font-display text-2xl font-bold tracking-widest text-center uppercase focus:outline-none transition"
          placeholder="CUJAR-8472"
        />
      </label>

      {error && (
        <div className="bg-envelope-tint border-l-4 border-envelope p-4 font-body text-body text-envelope">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
      >
        {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</> : "Continuar"}
      </button>
    </form>
  );
}
