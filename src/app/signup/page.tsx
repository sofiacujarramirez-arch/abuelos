import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;

  return (
    <AuthShell
      italic="Empieza"
      title="su gaceta."
      subtitle={
        invite
          ? "Te invitaron a una familia. Crea tu cuenta para unirte."
          : "Crea tu cuenta. En dos pasos empiezas el periódico mensual de tu abuela."
      }
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-inkwell hover:text-envelope underline decoration-2 underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <SignupForm inviteToken={invite} />
    </AuthShell>
  );
}
