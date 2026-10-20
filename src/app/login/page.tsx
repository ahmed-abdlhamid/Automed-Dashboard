"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { Icon } from "@/components/ui";

const CONTACT_EMAIL = "automed.official@gmail.com";
const CONTACT_PHONE = "01021804181";
const WHATSAPP_URL = "https://wa.me/201021804181";

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, theme, toggleLang, toggleTheme } = useI18n();
  const isArabic = lang === "ar";

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
      setError(
        t({
          ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          en: "Invalid email or password.",
        })
      );
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="login-experience" dir="ltr">
      <aside className="login-showcase" dir={isArabic ? "rtl" : "ltr"}>
        <div className="showcase-glow showcase-glow-one" />
        <div className="showcase-glow showcase-glow-two" />
        <div className="showcase-grid" aria-hidden="true" />

        <div className="showcase-inner">
          <header className="showcase-header">
            <a className="showcase-brand" href="https://automed-info.vercel.app/" aria-label="Automed">
              <img src="/automed-logo-dark.png" alt="Automed" />
            </a>
          </header>

          <div className="showcase-main">
            <div className="showcase-copy">
              <span className="showcase-eyebrow">
                <span className="showcase-eyebrow-dot" />
                {t({ ar: "حلول ذكية للأعمال", en: "INTELLIGENT BUSINESS SOLUTIONS" })}
              </span>

              <h1>
                {t({ ar: "حوّل المهام المتكررة", en: "Turn repetitive work" })}
                <span>{t({ ar: "لأنظمة ذكية", en: "into intelligent systems" })}</span>
              </h1>

              <p className="showcase-description">
                {t({
                  ar: "أصمّم وأبني أنظمة أتمتة ذكية تتولّى المهام اليومية المتكررة في شغلك، من الرد على العملاء وتسجيل الطلبات لمتابعة العمليات الداخلية، وتشتغل على القنوات اللي فريقك بيستخدمها فعلًا. النتيجة وقت أوفر وأخطاء أقل وشغل بيمشي بانتظام وإنت مركّز على نمو شغلك، مع دعم مستمر بعد التسليم.",
                  en: "I design and build intelligent automation systems that handle repetitive day-to-day work—from customer replies and order logging to internal operations—using the channels your team already works with. The result: more time, fewer errors, smoother operations, and ongoing support after delivery.",
                })}
              </p>

              <div className="showcase-features">
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="automation" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "وكلاء ذكاء اصطناعي", en: "AI Agents" })}</span>
                  <span className="showcase-feature-caption">{t({ ar: "مهام تنفّذ بذكاء", en: "Work that runs smarter" })}</span>
                </div>
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="pulse" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "أتمتة المهام", en: "Smart Automation" })}</span>
                  <span className="showcase-feature-caption">{t({ ar: "وقت أقل ومجهود أقل", en: "Less manual work" })}</span>
                </div>
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="analytics" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "لوحات متابعة", en: "Business Insights" })}</span>
                  <span className="showcase-feature-caption">{t({ ar: "قرارات أوضح", en: "Clearer decisions" })}</span>
                </div>
              </div>
            </div>

            <div className="showcase-visual" aria-hidden="true">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-core">
                <span className="visual-core-symbol">A</span>
                <span className="visual-core-pulse" />
              </div>
              <div className="visual-card visual-card-top">
                <span className="visual-card-icon"><Icon name="check" size={16} /></span>
                <span>{t({ ar: "المهام المتكررة", en: "Repetitive tasks" })}</span>
                <b>↗</b>
              </div>
              <div className="visual-dashboard">
                <div className="visual-dashboard-bar"><i /><i /><i /></div>
                <div className="visual-dashboard-content">
                  <div className="visual-dashboard-sidebar"><span /><span /><span /><span /></div>
                  <div className="visual-dashboard-main">
                    <div className="visual-dashboard-heading" />
                    <div className="visual-stats"><span /><span /><span /></div>
                    <div className="visual-chart">
                      <i /><i /><i /><i /><i /><i /><i />
                    </div>
                  </div>
                </div>
              </div>
              <div className="visual-card visual-card-bottom">
                <span className="visual-mini-bars"><i /><i /><i /><i /></span>
                <span><small>{t({ ar: "أداء الأعمال", en: "Business performance" })}</small><b>+32%</b></span>
              </div>
              <span className="visual-floating-dot dot-one" />
              <span className="visual-floating-dot dot-two" />
              <span className="visual-floating-dot dot-three" />
            </div>
          </div>

          <footer className="showcase-footer">
            <div className="showcase-contact-cards">
              <a href={`mailto:${CONTACT_EMAIL}`} className="showcase-contact-card">
                <span className="showcase-contact-card-icon showcase-contact-card-email" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M3 5.5h18v13H3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m4 6.5 8 6.2 8-6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                </span>
                <span className="showcase-contact-card-text" dir="ltr">{CONTACT_EMAIL}</span>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="showcase-contact-card">
                <span className="showcase-contact-card-icon showcase-contact-card-whatsapp" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.87 9.87 0 0 0-8.46 14.96L2.2 22l5.2-1.36A9.94 9.94 0 0 0 12.04 22h.01A10 10 0 0 0 12.04 2Zm0 18.18a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.09.81.83-3.01-.2-.31a8.2 8.2 0 1 1 6.96 3.84Zm4.51-6.15c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.97-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.17 1.75 2.67 4.23 3.74.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.47-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z"/></svg>
                </span>
                <span className="showcase-contact-card-text" dir="ltr">{CONTACT_PHONE}</span>
              </a>
            </div>
            <div className="showcase-bottom-brand">
              <img src="/automed-logo-dark.png" alt="Automed" />
              <span>{t({ ar: "وفّر وقتك", en: "Save Your Time" })}</span>
            </div>
          </footer>
        </div>
      </aside>

      <section className="login-panel" dir={isArabic ? "rtl" : "ltr"}>
        <div className="login-panel-controls">
          <button type="button" className="login-utility-button" onClick={toggleLang} aria-label={t({ ar: "Switch to English", en: "التغيير إلى العربية" })}>
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <button type="button" className="login-utility-button login-theme-button" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>
        </div>

        <div className="login-card">
          <div className="login-card-brand">
            <img
              src={theme === "dark" ? cfg.brand.logo.dark : cfg.brand.logo.light}
              alt={cfg.brand.name}
              className="login-brand-logo"
            />
          </div>

          <div className="login-heading">
            <h2>{t({ ar: "مرحبًا بعودتك", en: "Welcome back" })}</h2>
            <p>{t({ ar: "سجّل الدخول للمتابعة في لوحة التحكم", en: "Sign in to continue to your dashboard" })}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">{t({ ar: "البريد الإلكتروني", en: "Email address" })}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                placeholder={t({ ar: "أدخل بريدك الإلكتروني", en: "Enter your email address" })}
                dir="ltr"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">{t({ ar: "كلمة المرور", en: "Password" })}</label>
              <div className="login-password-field" dir={isArabic ? "rtl" : "ltr"}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••"
                  dir={isArabic ? "rtl" : "ltr"}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={t({
                    ar: showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور",
                    en: showPassword ? "Hide password" : "Show password",
                  })}
                  aria-pressed={showPassword}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={19} />
                </button>
              </div>
              <div className="login-recovery-row">
                <button type="button" className="login-forgot-link" onClick={() => setShowRecoveryHint((visible) => !visible)} aria-expanded={showRecoveryHint}>
                  {t({ ar: "هل نسيت كلمة المرور؟", en: "Forgot password?" })}
                </button>
              </div>
              {showRecoveryHint && (
                <p className="login-recovery-hint" role="status">
                  {t({
                    ar: "استعادة كلمة المرور هتكون متاحة قريبًا. حاليًا تواصل مع إدارة Automed للمساعدة.",
                    en: "Password recovery will be available soon. Please contact Automed support for now.",
                  })}
                </p>
              )}
            </div>

            {error && <div className="login-error" role="alert">{error}</div>}

            <button type="submit" disabled={loading} className="login-submit-button">
              {loading
                ? t({ ar: "جاري تسجيل الدخول...", en: "Signing in..." })
                : t({ ar: "تسجيل الدخول", en: "Sign in" })}
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </button>
          </form>

          <div className="login-bottom-contact">
            <span>{t({ ar: "ليس لديك حساب؟", en: "Need a system for your business?" })}</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              {t({ ar: "تواصل معنا", en: "Talk to us" })}
              <Icon name="arrowUpRight" size={14} />
            </a>
          </div>
        </div>

        <p className="login-panel-footnote">© {new Date().getFullYear()} Automed. {t({ ar: "جميع الحقوق محفوظة", en: "All rights reserved" })}</p>
      </section>
    </main>
  );
}
