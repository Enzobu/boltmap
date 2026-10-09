import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  if (await getSession()) {
    redirect("/dashboard");
  }

  return <AuthForm mode="register" />;
}
