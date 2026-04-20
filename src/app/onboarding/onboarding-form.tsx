"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { createFamilyAction } from "./actions";

const TERMS = [
  { value: "abuela", label: "abuela" },
  { value: "abuelita", label: "abuelita" },
  { value: "nona", label: "nona" },
  { value: "tita", label: "tita" },
  { value: "mamita", label: "mamita" },
  { value: "abuelo", label: "abuelo" },
  { value: "abuelito", label: "abuelito" },
  { value: "papito", label: "papito" },
];

const RELATIONSHIPS = [
  "nieto", "nieta", "hijo", "hija", "yerno", "nuera",
  "sobrino", "sobrina", "bisnieto", "bisnieta", "otro",
];

export function OnboardingForm({ defaultDisplayName }: { defaultDisplayName: string }) {
  const [term, setTerm] = useState("abuela");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setError(undefined);
        startTransition(async () => {
          const result = await createFamilyAction(fd);
          if (result && "error" in result) setError(result.error);
        });
      }}
      className="space-y-12"
    >
      {/* Section: family */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-2">
          <span className="italic font-normal">Tu</span> familia
        </h2>
        <p className="font-body italic text-body text-tobacco mb-6">
          El nombre bajo el que aparecerá el periódico.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Apellido o nombre de la familia" required>
            <input name="familyName" required placeholder="Familia Cujar" className={inputClass} />
          </Field>
          <Field label="Tu nombre en la familia" required>
            <input name="yourDisplayName" required defaultValue={defaultDisplayName} placeholder="Sofía" className={inputClass} />
          </Field>
          <Field label="Tu relación con ella">
            <select name="yourRelationship" className={inputClass} defaultValue="">
              <option value="" disabled>Elige...</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* Section: term of endearment */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-2">
          ¿Cómo <span className="italic font-normal">le dices?</span>
        </h2>
        <p className="font-body italic text-body text-tobacco mb-6">
          Escogemos el tono de la portada con esto.
        </p>

        <div className="flex flex-wrap gap-2">
          {TERMS.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="termOfEndearment"
                value={t.value}
                checked={term === t.value}
                onChange={() => setTerm(t.value)}
                className="sr-only peer"
              />
              <span className={`pill border-2 transition ${term === t.value ? "bg-inkwell text-parchment border-inkwell" : "bg-white text-inkwell border-inkwell/20 hover:border-inkwell"}`}>
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Section: recipient */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-2">
          Tu <span className="italic font-normal">{term}</span>
        </h2>
        <p className="font-body italic text-body text-tobacco mb-6">
          Para quién es el periódico y a dónde se lo mandamos.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label={`Nombre completo de tu ${term}`} required>
            <input name="recipientName" required placeholder="Carmen Rosa López" className={inputClass} />
          </Field>
          <Field label="Como le dices de cariño">
            <input name="recipientNickname" placeholder={`${term} Carmen`} className={inputClass} />
          </Field>
          <Field label="Cumpleaños (opcional)">
            <input type="date" name="birthDate" className={inputClass} />
          </Field>
        </div>

        <div className="mt-8 space-y-6">
          <Field label="Dirección (calle y número)" required>
            <input name="addressLine1" required placeholder="Calle 70 #12-34" className={inputClass} />
          </Field>
          <Field label="Apartamento, barrio, referencias (opcional)">
            <input name="addressLine2" placeholder="Apto 501, Barrio Chicó" className={inputClass} />
          </Field>

          <div className="grid md:grid-cols-3 gap-6">
            <Field label="Ciudad" required>
              <input name="city" required placeholder="Bogotá" className={inputClass} />
            </Field>
            <Field label="Departamento / Provincia">
              <input name="department" placeholder="Cundinamarca" className={inputClass} />
            </Field>
            <Field label="Código postal">
              <input name="postalCode" placeholder="110231" className={inputClass} />
            </Field>
          </div>

          <Field label="País">
            <select name="country" defaultValue="CO" className={inputClass}>
              <option value="CO">Colombia</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="PE">Perú</option>
              <option value="CL">Chile</option>
              <option value="EC">Ecuador</option>
              <option value="US">Estados Unidos</option>
              <option value="ES">España</option>
            </select>
          </Field>
        </div>
      </section>

      {error && (
        <div className="bg-envelope-tint border-l-4 border-envelope p-4 font-body text-body text-envelope">
          {error}
        </div>
      )}

      <div className="pt-4">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60 disabled:cursor-wait">
          {pending ? "Creando..." : "Crear la familia"} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="mt-4 font-body italic text-sm text-tobacco">
          Con esto también empiezan 14 días gratis. Puedes cancelar cuando quieras.
        </p>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body text-base font-semibold text-inkwell mb-2 block">
        {label}{required && <span className="text-envelope"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-white border-2 border-inkwell/15 focus:border-inkwell px-4 py-3 font-body text-body focus:outline-none transition";
