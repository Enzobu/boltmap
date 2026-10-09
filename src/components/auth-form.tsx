"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    if (!response.ok) {
      setError(result.error ?? "Une erreur est survenue.");
      setPending(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <span className="brand">boltmap</span>
        <ThemeSwitch />
      </div>

      <section className="auth-card">
        <div className="auth-card__intro">
          <span className="eyebrow">{isLogin ? "Bon retour" : "Créer un compte"}</span>
          <h1>{isLogin ? "Retrouve chaque vis." : "Commence à tout cartographier."}</h1>
          <p>
            Codes courts, projets séparés, recherche instantanée. Rien de plus.
          </p>
        </div>

        <form className="form-stack" onSubmit={submit}>
          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="toi@exemple.fr"
            />
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <input
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={8}
              placeholder="8 caractères minimum"
            />
          </label>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button className="button button--primary button--wide" disabled={pending}>
            {pending ? (
              <LoaderCircle className="spin" size={17} aria-hidden="true" />
            ) : (
              <ArrowRight size={17} aria-hidden="true" />
            )}
            {isLogin ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <Link href={isLogin ? "/register" : "/login"}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </Link>
        </p>
      </section>
    </main>
  );
}
