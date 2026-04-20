"use client";

import { useState, useTransition } from "react";
import { joinFamilyAction } from "./actions";

const RELATIONSHIPS = [
  "nieto", "nieta", "hijo", "hija", "yerno", "nuera",
  "sobrino", "sobrina", "primo", "prima", "ahijado", "ahijada",
  "amigo de la familia", "otro",
];

export function JoinForm({ familyId }: { familyId: string }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await joinFamilyAction(fd);
          if (result && "error" in result) setError(result.error);
        });
      }}
      className="space-y-6"
    >
      <input type="hidden" name="familyId" value={familyId} />

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">
          ¿Cómo te llama la abuela?
        </span>
        <input
          type="text"
          name="displayName"
          required
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
          placeholder="Sofi"
        />
      </label>

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">
          Tu relación con ella
        </span>
        <select
          name="relationship"
          required
          defaultValue=""
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
        >
          <option value="" disabled>Elige una relación</option>
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      {error && (
        <div className="bg-envelope-tint border-l-4 border-envelope p-4 font-body text-body text-envelope">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? "Uniéndote..." : "Entrar a la familia"}
      </button>
    </form>
  );
}
