"use client";

import { useI18n } from "@/components/Providers";
import type { Project } from "@/lib/data";
import { Card, Icon, PageHeader } from "@/components/ui";

export default function SettingsView({
  project,
}: {
  project: Project | null;
}) {
  const {
    t,
    lang,
    theme,
    setLang,
    setTheme,
  } = useI18n();

  const statusLabel =
    project?.status?.trim().toLowerCase() === "active"
      ? t({ ar: "نشط", en: "Active" })
      : project?.status ||
        t({ ar: "غير محدد", en: "Unknown" });

  return (
    <>
      <PageHeader
        title={t({
          ar: "الإعدادات",
          en: "Settings",
        })}
        subtitle={t({
          ar: "اللغة والمظهر ومعلومات المشروع",
          en: "Language, appearance and project information",
        })}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title={t({
            ar: "اللغة",
            en: "Language",
          })}
          subtitle={t({
            ar: "يتغير اتجاه الواجهة تلقائيًا",
            en: "Interface direction changes automatically",
          })}
        >
          <div className="flex flex-wrap gap-2 p-6">
            <button
              type="button"
              className="btn"
              aria-pressed={lang === "ar"}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
            <button
              type="button"
              className="btn"
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>
        </Card>

        <Card
          title={t({
            ar: "المظهر",
            en: "Appearance",
          })}
          subtitle={t({
            ar: "يُحفظ على جهازك",
            en: "Saved on this device",
          })}
        >
          <div className="flex flex-wrap gap-2 p-6">
            <button
              type="button"
              className="btn"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <Icon name="sun" size={16} />
              {t({ ar: "فاتح", en: "Light" })}
            </button>

            <button
              type="button"
              className="btn"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <Icon name="moon" size={16} />
              {t({ ar: "داكن", en: "Dark" })}
            </button>
          </div>
        </Card>

        <Card
          title={t({
            ar: "معلومات المشروع",
            en: "Project information",
          })}
          subtitle={t({
            ar: "بيانات المشروع الحالي",
            en: "Current project data",
          })}
          className="lg:col-span-2"
        >
          {project ? (
            <dl className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-teal-soft px-4 py-3">
                <dt className="text-mut">
                  {t({ ar: "اسم المشروع", en: "Project" })}
                </dt>
                <dd className="mt-1 font-head font-semibold">
                  {project.name}
                </dd>
              </div>

              <div className="rounded-2xl bg-teal-soft px-4 py-3">
                <dt className="text-mut">
                  {t({ ar: "المعرّف", en: "Slug" })}
                </dt>
                <dd
                  dir="ltr"
                  className="mt-1 font-head font-semibold"
                >
                  {project.slug}
                </dd>
              </div>

              <div className="rounded-2xl bg-teal-soft px-4 py-3">
                <dt className="text-mut">
                  {t({ ar: "الحالة", en: "Status" })}
                </dt>
                <dd className="mt-1 font-head font-semibold">
                  {statusLabel}
                </dd>
              </div>

              <div className="rounded-2xl bg-teal-soft px-4 py-3">
                <dt className="text-mut">
                  {t({ ar: "مقدم الخدمة", en: "Powered by" })}
                </dt>
                <dd className="mt-1 font-head font-semibold">
                  Automed
                </dd>
              </div>

              {project.description && (
                <div className="rounded-2xl bg-teal-soft px-4 py-3 sm:col-span-2 lg:col-span-4">
                  <dt className="text-mut">
                    {t({ ar: "الوصف", en: "Description" })}
                  </dt>
                  <dd className="mt-1 leading-6">
                    {project.description}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="p-6 text-sm text-mut">
              {t({
                ar: "لا توجد بيانات للمشروع الحالي.",
                en: "No project information is available.",
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
