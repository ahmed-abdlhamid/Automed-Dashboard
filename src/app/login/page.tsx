"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { Icon } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, theme, toggleLang, toggleTheme } =
    useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (signInError) {
      console.error(
        "Supabase login error:",
        signInError
      );

      setError(
        lang === "ar"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : "Invalid email or password."
      );

      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] items-center justify-center">
        <section className="xcard w-full max-w-md p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <img
                src={cfg.brand.logo.light}
                alt={cfg.brand.name}
                className="logo-light h-9 w-auto"
              />

              <img
                src={cfg.brand.logo.dark}
                alt={cfg.brand.name}
                className="logo-dark h-9 w-auto"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="ctl"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <Icon
                  name={
                    theme === "dark"
                      ? "sun"
                      : "moon"
                  }
                  size={17}
                />
              </button>

              <button
                type="button"
                className="ctl"
                onClick={toggleLang}
                aria-label="Toggle language"
              >
                {lang === "ar" ? "EN" : "AR"}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-head text-2xl font-bold">
              {t({
                ar: "مرحبًا بك",
                en: "Welcome back",
              })}
            </h1>

            <p className="mt-2 text-sm leading-6 text-mut">
              {t({
                ar: "سجل الدخول للوصول إلى لوحة التحكم.",
                en: "Sign in to access your dashboard.",
              })}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                {t({
                  ar: "البريد الإلكتروني",
                  en: "Email",
                })}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
                className="w-full rounded-[14px] border border-line bg-card px-4 py-3 text-sm outline-none transition-all focus:border-orange"
                placeholder="name@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                {t({
                  ar: "كلمة المرور",
                  en: "Password",
                })}
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
                className="w-full rounded-[14px] border border-line bg-card px-4 py-3 text-sm outline-none transition-all focus:border-orange"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="rounded-[14px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[14px] bg-orange px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? t({
                    ar: "جاري تسجيل الدخول...",
                    en: "Signing in...",
                  })
                : t({
                    ar: "تسجيل الدخول",
                    en: "Sign in",
                  })}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}