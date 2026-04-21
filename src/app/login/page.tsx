import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <AuthShell
      italic="Bienvenido"
      title="de nuevo."
      subtitle="Entra a tu familia. Tu abuela ya te está esperando."
      footer={
        <p>
          ¿Primera vez por aquí?{" "}
          <Link href="/signup" className="font-semibold text-inkwell hover:text-envelope underline decoration-2 underline-offset-4">
            Crea tu familia
          </Link>
        </p>
      }
    >
      <LoginForm next={next} initialError={error} />
    </AuthShell>
  );
}
