import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export default function CheckEmailPage() {
  return (
    <AuthShell
      italic="Revisa tu"
      title="correo."
      subtitle="Te enviamos un enlace para confirmar tu cuenta. Abre el correo desde tu teléfono o computadora para continuar."
      footer={
        <p>
          ¿No te llegó?{" "}
          <Link href="/signup" className="font-semibold text-inkwell hover:text-envelope underline decoration-2 underline-offset-4">
            Intenta de nuevo
          </Link>
        </p>
      }
    >
      <div className="flex flex-col items-center text-center py-12 border-2 border-dashed border-inkwell/20 bg-white/40">
        <Mail className="w-16 h-16 text-tobacco mb-6" strokeWidth={1.25} />
        <p className="font-display italic text-2xl text-inkwell">
          Se fue volando hacia tu bandeja.
        </p>
      </div>
    </AuthShell>
  );
}
