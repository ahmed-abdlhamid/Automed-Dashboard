"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/Providers";
import { Icon } from "@/components/ui";
import "./login.css";

const styles = {
  art: "automed-login-art",
  contactArrow: "automed-login-contactArrow",
  content: "automed-login-content",
  controls: "automed-login-controls",
  copy: "automed-login-copy",
  error: "automed-login-error",
  eye: "automed-login-eye",
  field: "automed-login-field",
  footer: "automed-login-footer",
  forgot: "automed-login-forgot",
  form: "automed-login-form",
  formContainer: "automed-login-formContainer",
  frame: "automed-login-frame",
  heading: "automed-login-heading",
  help: "automed-login-help",
  hint: "automed-login-hint",
  illustration: "automed-login-illustration",
  page: "automed-login-page",
  panel: "automed-login-panel",
  password: "automed-login-password",
  selected: "automed-login-selected",
  submit: "automed-login-submit",
  submitArrow: "automed-login-submitArrow",
  thumb: "automed-login-thumb",
  toggle: "automed-login-toggle",
  welcome: "automed-login-welcome",
} as const;

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
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) {
        setError(t({ ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", en: "Invalid email or password." }));
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError(t({ ar: "تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.", en: "Unable to connect. Check your connection and try again." }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page} data-theme={theme} dir="ltr">
      <div className={styles.frame}>
        <header className={styles.controls}>
          <button type="button" role="switch" aria-checked={isArabic} aria-label={t({ ar: "تغيير اللغة إلى الإنجليزية", en: "Switch language to Arabic" })} onClick={toggleLang} className={styles.toggle} data-position={isArabic ? "right" : "left"}>
            <span className={styles.thumb} aria-hidden="true" />
            <span className={!isArabic ? styles.selected : undefined}>EN</span>
            <span className={isArabic ? styles.selected : undefined}>ع</span>
          </button>
          <button type="button" role="switch" aria-checked={theme === "dark"} aria-label={t({ ar: "الوضع الداكن", en: "Dark mode" })} onClick={toggleTheme} className={styles.toggle} data-position={theme === "dark" ? "right" : "left"}>
            <span className={styles.thumb} aria-hidden="true" />
            <span className={theme === "light" ? styles.selected : undefined}><Icon name="sun" size={17} /></span>
            <span className={theme === "dark" ? styles.selected : undefined}><Icon name="moon" size={17} /></span>
          </button>
        </header>

        <div className={styles.content}>
          <section className={styles.welcome} dir={isArabic ? "rtl" : "ltr"} aria-labelledby="welcome-title">
            <div className={styles.copy}>
              <h1 id="welcome-title">{t({ ar: "مرحبًا بك", en: "Welcome to" })}<br /><span>{t({ ar: "في عائلة Automed", en: "the Automed family" })}</span></h1>
              <p>{t({ ar: "شغلك ماشي بذكاء، وبياناتك قدامك بوضوح. تابع أداء أعمالك وتحكّم في أنظمتك من مكان واحد.", en: "Your business running smarter, your numbers clearer. Track performance and manage your automations in one place." })}</p>
            </div>
            <div className={styles.art} aria-hidden="true">
              <Image src="/login-automation-3d.webp" alt="" width={1024} height={1024} preload sizes="(max-width: 700px) 90vw, 48vw" className={styles.illustration} />
            </div>
          </section>

          <section className={styles.panel} dir={isArabic ? "rtl" : "ltr"} aria-labelledby="login-title">
            <div className={styles.formContainer}>
              <div className={styles.heading}>
                <h2 id="login-title">{t({ ar: "تسجيل الدخول", en: "Sign in" })}</h2>
                <p>{t({ ar: "سجّل دخولك وكمّل رحلتك مع Automed", en: "Sign in and continue your journey with Automed" })}</p>
              </div>
              <form className={styles.form} onSubmit={handleSubmit} aria-busy={loading}>
                <div className={styles.field}>
                  <label htmlFor="email">{t({ ar: "البريد الإلكتروني", en: "Email address" })}</label>
                  <input id="email" type="email" autoComplete="email" required dir="ltr" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="password">{t({ ar: "كلمة المرور", en: "Password" })}</label>
                  <div className={styles.password}>
                    <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="••••••••" />
                    <button type="button" className={styles.eye} onClick={() => setShowPassword(visible => !visible)} aria-pressed={showPassword} aria-label={t({ ar: showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور", en: showPassword ? "Hide password" : "Show password" })}><Icon name={showPassword ? "eyeOff" : "eye"} size={19} /></button>
                  </div>
                </div>
                <button type="button" className={styles.forgot} onClick={() => setShowRecoveryHint(visible => !visible)} aria-expanded={showRecoveryHint} aria-controls="recovery-hint">{t({ ar: "هل نسيت كلمة المرور؟", en: "Forgot password?" })}</button>
                {showRecoveryHint && <p className={styles.hint} id="recovery-hint" role="status">{t({ ar: "تواصل مع إدارة Automed لمساعدتك في استعادة الدخول إلى حسابك.", en: "Contact Automed support for help restoring access to your account." })}</p>}
                {error && <p className={styles.error} role="alert">{error}</p>}
                <button type="submit" className={styles.submit} disabled={loading}>
                  <span>{loading ? t({ ar: "جاري تسجيل الدخول…", en: "Signing in…" }) : t({ ar: "تسجيل الدخول", en: "Sign in" })}</span>
                  <span className={styles.submitArrow} aria-hidden="true">{isArabic ? "←" : "→"}</span>
                </button>
              </form>
              <div className={styles.help}>
                <span>{t({ ar: "محتاج مساعدة؟", en: "Need help?" })}</span>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">{t({ ar: "تواصل معنا", en: "Contact us" })}<span className={styles.contactArrow} aria-hidden="true"><Icon name="arrowUpRight" size={16} /></span></a>
              </div>
            </div>
          </section>
        </div>
        <footer className={styles.footer}>© {new Date().getFullYear()} Automed. {t({ ar: "جميع الحقوق محفوظة", en: "All rights reserved" })}</footer>
      </div>
    </main>
  );
}
