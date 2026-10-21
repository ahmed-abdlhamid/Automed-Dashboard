"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/Providers";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { Icon } from "@/components/ui";

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
      <aside className="login-showcase" dir={isArabic ? "rtl" : "ltr"} style={{ background: "radial-gradient(ellipse at 72% 48%, rgba(125,205,187,.22), transparent 38%), radial-gradient(ellipse at 10% 100%, rgba(15,102,95,.28), transparent 42%), linear-gradient(135deg, #155f59 0%, #1a7872 48%, #104e49 100%)" }}>
        <div className="showcase-glow showcase-glow-one" />
        <div className="showcase-glow showcase-glow-two" />
        <div className="showcase-grid" aria-hidden="true" />

        <div className="showcase-controls" dir="ltr" aria-label="Display preferences">
          <div className="showcase-control-group" aria-label="Language">
            <button type="button" className={"showcase-control-option " + (lang === "ar" ? "is-active" : "")} onClick={() => { if (lang !== "ar") toggleLang(); }} aria-pressed={lang === "ar"}>AR</button>
            <button type="button" className={"showcase-control-option " + (lang === "en" ? "is-active" : "")} onClick={() => { if (lang !== "en") toggleLang(); }} aria-pressed={lang === "en"}>EN</button>
          </div>
          <div className="showcase-control-group" aria-label="Color theme">
            <button type="button" className={"showcase-control-option " + (theme === "light" ? "is-active" : "")} onClick={() => { if (theme !== "light") toggleTheme(); }} aria-label={t({ ar: "الوضع الفاتح", en: "Light mode" })} aria-pressed={theme === "light"}><Icon name="sun" size={16} /></button>
            <button type="button" className={"showcase-control-option " + (theme === "dark" ? "is-active" : "")} onClick={() => { if (theme !== "dark") toggleTheme(); }} aria-label={t({ ar: "الوضع الداكن", en: "Dark mode" })} aria-pressed={theme === "dark"}><Icon name="moon" size={16} /></button>
          </div>
        </div>

        <div className="showcase-inner">
          <div className="showcase-main">
            <div className="showcase-copy">
              <h1>
                {t({ ar: "أحوّل المهام المتكررة", en: "Turn repetitive work" })}
                <span>{t({ ar: "إلى أنظمة ذكية.", en: "into intelligent systems." })}</span>
              </h1>

              <p className="showcase-description">
                {t({
                  ar: "حلول ذكية تساعد شغلك يمشي بسلاسة.",
                  en: "Smart solutions that keep your business moving.",
                })}
              </p>

              <div className="showcase-features">
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="automation" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "وكلاء ذكاء اصطناعي", en: "AI Agents" })}</span>
                                  </div>
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="pulse" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "أتمتة المهام", en: "Smart Automation" })}</span>
                                  </div>
                <div className="showcase-feature">
                  <span className="showcase-feature-icon"><Icon name="analytics" size={22} /></span>
                  <span className="showcase-feature-title">{t({ ar: "تحليل الأعمال", en: "Business Analysis" })}</span>
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

        </div>
      </aside>

      <section className="login-panel" dir={isArabic ? "rtl" : "ltr"}>
        <div className="login-card">
          <div className="login-heading">
            <h2>{t({ ar: "مرحبًا بك في عائلتنا", en: "Welcome to our family" })}</h2>
            <p>{t({ ar: "سجّل دخولك وكمّل رحلتك مع Automed", en: "Sign in and continue your journey with Automed" })}</p>
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
