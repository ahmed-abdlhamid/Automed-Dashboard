"use client";

import { useI18n } from "@/components/Providers";
import type { Project } from "@/lib/data";
import {
  Card,
  Icon,
  PageHeader,
} from "@/components/ui";

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
      ? t({
          ar: "نشط",
          en: "Active",
        })
      : project?.status ||
        t({
          ar: "غير محدد",
          en: "Unknown",
        });

  return (
    <div className="settings-page">
      <PageHeader
        title={t({
          ar: "الإعدادات",
          en: "Settings",
        })}
        subtitle={t({
          ar: "تحكم في تجربة الواجهة ومعلومات المشروع الحالي",
          en: "Control your interface experience and current project information",
        })}
      />

      <div className="settings-grid">
        <Card
          className="settings-preference-card"
          title={t({
            ar: "تفضيلات الواجهة",
            en: "Interface preferences",
          })}
          subtitle={t({
            ar: "تخصيص طريقة عرض لوحة التحكم",
            en: "Customize how the dashboard looks and feels",
          })}
        >
          <div className="settings-preferences">
            <div className="settings-preference">
              <div className="settings-preference-heading">
                <div className="settings-preference-icon">
                  <Icon name="sun" size={17} />
                </div>

                <div>
                  <strong>
                    {t({
                      ar: "المظهر",
                      en: "Appearance",
                    })}
                  </strong>

                  <span>
                    {t({
                      ar: "اختر الوضع المناسب لك",
                      en: "Choose your preferred theme",
                    })}
                  </span>
                </div>
              </div>

              <div className="settings-segmented">
                <button
                  type="button"
                  className={
                    theme === "light"
                      ? "settings-segment active"
                      : "settings-segment"
                  }
                  aria-pressed={theme === "light"}
                  onClick={() =>
                    setTheme("light")
                  }
                >
                  <Icon name="sun" size={15} />

                  {t({
                    ar: "فاتح",
                    en: "Light",
                  })}
                </button>

                <button
                  type="button"
                  className={
                    theme === "dark"
                      ? "settings-segment active"
                      : "settings-segment"
                  }
                  aria-pressed={theme === "dark"}
                  onClick={() =>
                    setTheme("dark")
                  }
                >
                  <Icon name="moon" size={15} />

                  {t({
                    ar: "داكن",
                    en: "Dark",
                  })}
                </button>
              </div>
            </div>

            <div className="settings-preference">
              <div className="settings-preference-heading">
                <div className="settings-preference-icon settings-preference-icon-teal">
                  <Icon
                    name="analytics"
                    size={17}
                  />
                </div>

                <div>
                  <strong>
                    {t({
                      ar: "لغة الواجهة",
                      en: "Interface language",
                    })}
                  </strong>

                  <span>
                    {t({
                      ar: "يمكنك التبديل بين العربية والإنجليزية",
                      en: "Switch between Arabic and English",
                    })}
                  </span>
                </div>
              </div>

              <div className="settings-segmented">
                <button
                  type="button"
                  className={
                    lang === "ar"
                      ? "settings-segment active"
                      : "settings-segment"
                  }
                  aria-pressed={lang === "ar"}
                  onClick={() =>
                    setLang("ar")
                  }
                >
                  العربية
                </button>

                <button
                  type="button"
                  className={
                    lang === "en"
                      ? "settings-segment active"
                      : "settings-segment"
                  }
                  aria-pressed={lang === "en"}
                  onClick={() =>
                    setLang("en")
                  }
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className="settings-project-card"
          title={t({
            ar: "المشروع الحالي",
            en: "Current project",
          })}
          subtitle={t({
            ar: "المشروع الذي تعمل عليه الآن",
            en: "The project you are currently working with",
          })}
        >
          {project ? (
            <div className="settings-project-content">
              <div className="settings-project-hero">
                <div className="settings-project-logo">
                  <span>
                    {project.name
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>

                <div>
                  <strong>
                    {project.name}
                  </strong>

                  <span dir="ltr">
                    {project.slug}
                  </span>
                </div>

                <div className="settings-project-status">
                  <span />
                  {statusLabel}
                </div>
              </div>

              {project.description && (
                <p className="settings-project-description">
                  {project.description}
                </p>
              )}

              <div className="settings-project-meta">
                <div>
                  <span>
                    {t({
                      ar: "المعرّف",
                      en: "Project ID",
                    })}
                  </span>

                  <strong dir="ltr">
                    {project.id}
                  </strong>
                </div>

                <div>
                  <span>
                    {t({
                      ar: "الحالة",
                      en: "Status",
                    })}
                  </span>

                  <strong>
                    {statusLabel}
                  </strong>
                </div>

                <div>
                  <span>
                    {t({
                      ar: "مقدم الخدمة",
                      en: "Powered by",
                    })}
                  </span>

                  <strong>
                    Automed
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="settings-empty">
              <Icon
                name="settings"
                size={20}
              />

              <p>
                {t({
                  ar: "لا توجد بيانات للمشروع الحالي.",
                  en: "No project information is available.",
                })}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="settings-footer-note">
        <div>
          <Icon
            name="pulse"
            size={17}
          />
        </div>

        <span>
          {t({
            ar: "يتم حفظ تفضيلات المظهر واللغة على هذا الجهاز فقط.",
            en: "Appearance and language preferences are saved on this device.",
          })}
        </span>
      </div>
    </div>
  );
}