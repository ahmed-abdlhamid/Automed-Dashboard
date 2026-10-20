"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/Providers";
import { Icon } from "@/components/ui";

function ServiceIcon({ type }: { type: "agents" | "automation" | "analysis" }) {
  if (type === "agents") {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="1.7"/><path d="M9 11h.01M15 11h.01M9 14.5h6M12 3v3M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
  }
  if (type === "automation") {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="1.7"/><path d="M3 9V5h4M17 3h4v4M21 15v4h-4M7 21H3v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 18.5h18M5 15l4-4 3 2 6-7 2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="6" r="1.4" fill="#FC9038"/></svg>;
}

function AutomationArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]" aria-hidden="true">
      <div className="absolute -inset-10 rounded-full bg-[#0F665F]/20 blur-3xl" />
      <svg viewBox="0 0 620 390" className="relative w-full overflow-visible">
        <defs>
          <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F665F" stopOpacity=".08" />
            <stop offset="100%" stopColor="#0F665F" stopOpacity=".48" />
          </linearGradient>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2BA99A" stopOpacity=".25" />
            <stop offset="100%" stopColor="#2BA99A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="currentColor" strokeOpacity=".08" strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => <path key={"h"+i} d={`M30 ${55+i*43} H590`} />)}
          {Array.from({ length: 10 }, (_, i) => <path key={"v"+i} d={`M${55+i*56} 35 V330`} />)}
        </g>
        <path d="M40 286 C90 270 105 220 155 238 S225 260 270 188 S355 205 398 135 S485 155 570 62 L570 330 L40 330 Z" fill="url(#area)" />
        <path d="M40 286 C90 270 105 220 155 238 S225 260 270 188 S355 205 398 135 S485 155 570 62" fill="none" stroke="#16877C" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M40 310 C115 300 125 270 190 280 S300 240 350 258 S455 220 570 188" fill="none" stroke="#FC9038" strokeOpacity=".85" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round" />
        <g>
          <rect x="42" y="43" width="154" height="74" rx="16" fill="var(--surface-solid)" stroke="var(--line)" />
          <circle cx="64" cy="66" r="5" fill="#FC9038" />
          <path d="M59 91h46M59 101h78" stroke="currentColor" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
          <rect x="421" y="224" width="151" height="76" rx="16" fill="var(--surface-solid)" stroke="var(--line)" />
          <circle cx="444" cy="247" r="5" fill="#16877C" />
          <path d="M439 271h42M439 282h74" stroke="currentColor" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
          <rect x="365" y="34" width="173" height="62" rx="15" fill="var(--surface-solid)" stroke="var(--line)" />
          <path d="M385 67l9-9 8 5 13-15" fill="none" stroke="#16877C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M425 58h90M425 69h62" stroke="currentColor" strokeOpacity=".15" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g fill="var(--surface-solid)" stroke="#16877C" strokeWidth="2">
          <circle cx="155" cy="238" r="6" /><circle cx="270" cy="188" r="6" /><circle cx="398" cy="135" r="6" /><circle cx="570" cy="62" r="6" />
        </g>
        <circle cx="270" cy="188" r="15" fill="#16877C" fillOpacity=".12" />
        <circle cx="398" cy="135" r="15" fill="#16877C" fillOpacity=".12" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, theme, toggleLang, toggleTheme } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryHint, setShowRecoveryHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      console.error("Supabase login error:", signInError);
      setError(t({ ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", en: "Invalid email or password." }));
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[#0F665F]/[0.08] blur-3xl" />
        <div className="absolute -bottom-52 left-[28%] h-[440px] w-[440px] rounded-full bg-[#FC9038]/[0.045] blur-3xl" />
      </div>

      <div className="absolute right-5 top-5 z-20 flex items-center gap-2 sm:right-8 sm:top-7">
        <button type="button" onClick={toggleLang} className="grid h-10 min-w-11 place-items-center rounded-xl border border-line bg-card/80 px-3 text-xs font-semibold text-ink shadow-sm transition hover:border-teal hover:text-teal" aria-label="Toggle language">
          {lang === "ar" ? "EN" : "AR"}
        </button>
        <button type="button" onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card/80 text-ink shadow-sm transition hover:border-teal hover:text-teal" aria-label="Toggle theme">
          <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </button>
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 pb-12 pt-24 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-16 lg:py-16">
        <section className="order-2 flex w-full flex-col justify-center lg:order-1" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="mx-auto w-full max-w-[410px]">
            <div className="mb-9">
              <div className="mb-4 h-1 w-12 rounded-full bg-[#FC9038]" />
              <h1 className="font-head text-3xl font-bold tracking-tight sm:text-[34px]">
                {t({ ar: "مرحبًا بعودتك", en: "Welcome back" })}
              </h1>
              <p className="mt-3 text-sm text-mut">
                {t({ ar: "سجّل الدخول إلى حسابك", en: "Sign in to your account" })}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  {t({ ar: "البريد الإلكتروني", en: "Email address" })}
                </label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required dir="ltr" placeholder="name@example.com" className="w-full rounded-xl border border-line bg-card/70 px-4 py-3.5 text-left text-sm outline-none transition placeholder:text-mut/70 focus:border-teal focus:ring-4 focus:ring-teal/10" />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  {t({ ar: "كلمة المرور", en: "Password" })}
                </label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required dir="ltr" placeholder="••••••••" className="w-full rounded-xl border border-line bg-card/70 px-4 py-3.5 pe-12 text-left text-sm outline-none transition placeholder:text-mut/70 focus:border-teal focus:ring-4 focus:ring-teal/10" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-mut transition hover:text-teal" aria-label={t({ ar: showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور", en: showPassword ? "Hide password" : "Show password" })} aria-pressed={showPassword}>
                    <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                  </button>
                </div>
                <div className="mt-2 text-end">
                  <button type="button" className="text-xs text-mut transition hover:text-teal" onClick={() => setShowRecoveryHint((visible) => !visible)} aria-expanded={showRecoveryHint}>
                    {t({ ar: "هل نسيت كلمة المرور؟", en: "Forgot password?" })}
                  </button>
                </div>
                {showRecoveryHint && <p className="mt-2 rounded-lg bg-teal-soft px-3 py-2 text-xs leading-6 text-mut" role="status">{t({ ar: "استعادة كلمة المرور هتكون متاحة قريبًا. حاليًا تواصل مع إدارة Automed للمساعدة.", en: "Password recovery will be available soon. Please contact Automed support for now." })}</p>}
              </div>

              {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>}

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F665F] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,102,95,0.18)] transition hover:bg-[#0B514C] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? t({ ar: "جاري تسجيل الدخول...", en: "Signing in..." }) : t({ ar: "تسجيل الدخول", en: "Sign in" })}
                <span aria-hidden="true" className="text-base">{lang === "ar" ? "←" : "→"}</span>
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-mut">
              {t({ ar: "ليس لديك حساب؟", en: "Don’t have an account?" })}{" "}
              <span className="font-semibold text-teal">{t({ ar: "تواصل معنا", en: "Contact us" })}</span>
            </p>
          </div>
        </section>

        <section className="order-1 flex min-w-0 flex-col items-center justify-center lg:order-2" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="w-full max-w-[650px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal/15 bg-teal/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FC9038]" />
              AUTOMED · INTELLIGENT SYSTEMS
            </div>
            <h2 className="max-w-[620px] font-head text-3xl font-bold leading-[1.45] tracking-tight sm:text-4xl lg:text-[42px]">
              {t({ ar: "أحوّل المهام المتكررة إلى أنظمة ذكية.", en: "Turn repetitive tasks into intelligent systems." })}
            </h2>
            <p className="mt-4 max-w-[480px] text-sm leading-7 text-mut sm:text-base">
              {t({ ar: "حلول ذكية تساعد شغلك يمشي بسلاسة.", en: "Smart solutions that keep your business moving." })}
            </p>

            <div className="mt-5 sm:mt-1">
              <AutomationArtwork />
            </div>

            <div className="mx-auto mt-1 grid max-w-[570px] grid-cols-3 gap-2 sm:gap-4">
              {([
                { type: "agents" as const, ar: "وكلاء الذكاء الاصطناعي", en: "AI Agents" },
                { type: "automation" as const, ar: "الأتمتة الذكية", en: "Smart Automation" },
                { type: "analysis" as const, ar: "تحليل الأعمال", en: "Business Analysis" },
              ]).map((service) => (
                <div key={service.type} className="flex min-w-0 flex-col items-center gap-2 text-center">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-teal/15 bg-teal/5 text-teal sm:h-11 sm:w-11">
                    <span className="h-5 w-5"><ServiceIcon type={service.type} /></span>
                  </span>
                  <span className="text-[10px] font-medium leading-5 text-mut sm:text-xs">{t({ ar: service.ar, en: service.en })}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
