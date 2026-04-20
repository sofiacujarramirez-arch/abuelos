"use client";

import { useState, useTransition } from "react";
import { signupAction } from "./actions";

export function SignupForm({ inviteToken }: { inviteToken?: string }) {
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await signupAction(fd);
          if (result && "error" in result) setError(result.error);
        });
      }}
      className="space-y-6"
    >
      {inviteToken && <input type="hidden" name="inviteToken" value={inviteToken} />}

      <label className="block">
        <span className="font-body text-base font-semibold text-inkwell mb-2 block">Tu nombre</span>
        <input
          type="text"
          name="fullName"
          required
          autoComplete="name"
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
          placeholder="Sofía Cujar"
        />
      </label>

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
          autoComplete="new-password"
          minLength={8}
          className="w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition"
          placeholder="Mínimo 8 caracteres"
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
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="font-body italic text-sm text-tobacco text-center">
        Al continuar aceptas nuestros términos y política de privacidad.
      </p>
    </form>
  );
}
