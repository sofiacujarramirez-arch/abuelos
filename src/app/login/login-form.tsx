"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await loginAction(fd);
          if (result && "error" in result) setError(result.error);
        });
      }}
      className="space-y-6"
    >
      <input type="hidden" name="next" value={next ?? "/app"} />

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">Correo</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
          placeholder="tu@email.com"
        />
      </label>

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">Contraseña</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          minLength={8}
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
          placeholder="••••••••"
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
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
