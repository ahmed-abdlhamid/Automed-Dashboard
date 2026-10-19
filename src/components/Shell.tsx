"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { useI18n } from "@/components/Providers";
import { adminIdentity } from "@/config/identity";
import { Icon } from "@/components/ui";
import type { Project } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function Shell({
  children,
  projects = [],
  currentProjectId,
  isAdmin = false,
}: {
  children: ReactNode;
  projects?: Project[];
  currentProjectId?: string;
  isAdmin?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectMenuOpen) return;

    const onDown = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setProjectMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);

    return () =>
      document.removeEventListener("mousedown", onDown);
  }, [projectMenuOpen]);

  const {
    t,
    lang,
    theme,
    toggleLang,
    toggleTheme,
  } = useI18n();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  const currentNav = cfg.nav.find((item) =>
    isActive(item.href)
  );

  const selectedProject =
    projects.find(
      (project) => project.id === currentProjectId
    ) ||
    projects.find(
      (project) => project.id === cfg.project.id
    ) ||
    projects[0];

  const handleProjectChange = (projectId: string) => {
    setProjectMenuOpen(false);

    document.cookie =
      `automed_project_id=${projectId}; ` +
      "path=/; " +
      "max-age=31536000; " +
      "samesite=lax";

    window.location.reload();
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/login";
  };

  const handleSidebarMouseEnter = () => {
    if (!sidebarPinned) {
      setExpanded(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!sidebarPinned) {
      setExpanded(false);
    }
  };

  const handleSidebarToggle = () => {
    if (sidebarPinned) {
      setSidebarPinned(false);
      setExpanded(false);
      return;
    }

    setSidebarPinned(true);
    setExpanded(true);
  };

  /*
   * Navigation is role-aware:
   *
   * Client:
   * - Overview
   * - Orders
   * - Analytics
   * - Activity
   * - Settings
   *
   * Admin:
   * - Overview
   * - Orders
   * - Analytics
   * - Automation
   * - Activity
   * - Users
   * - Settings
   */
  const navItems = [
    ...cfg.nav.filter(
      (item) =>
        isAdmin ||
        item.href !== "/automation"
    ),

    ...(isAdmin
      ? [
          {
            href: "/users",
            icon: "users" as const,
            label: {
              ar: "المستخدمون",
              en: "Users",
            },
          },
        ]
      : []),
  ];

  const navGroups = [
    {
      label: {
        ar: "مساحة العمل",
        en: "Workspace",
      },
      items: navItems.filter(
        (item) =>
          item.href === "/" ||
          item.href === "/orders" ||
          item.href === "/analytics"
      ),
    },

    ...(isAdmin
      ? [
          {
            label: {
              ar: "الأتمتة",
              en: "Automation",
            },
            items: navItems.filter(
              (item) =>
                item.href === "/automation"
            ),
          },
        ]
      : []),

    {
      label: {
        ar: "النشاط",
        en: "Activity",
      },
      items: navItems.filter(
        (item) =>
          item.href === "/activity"
      ),
    },

    {
      label: {
        ar: "الإدارة",
        en: "Management",
      },
      items: navItems.filter(
        (item) =>
          item.href === "/users" ||
          item.href === "/settings"
      ),
    },
  ].filter(
    (group) =>
      group.items.length > 0
  );

  return (
    <div className="dashboard-shell">
      <div
        onClick={() => setMobileOpen(false)}
        className={`mobile-backdrop ${
          mobileOpen
            ? "mobile-backdrop-open"
            : ""
        }`}
      />

      <aside
        data-expanded={expanded}
        data-pinned={sidebarPinned}
        data-mobile-open={mobileOpen}
        className="sidebar"
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="sidebar-top">
          <Link
            href="/"
            className="brand-lockup"
            onClick={() => setMobileOpen(false)}
            aria-label={cfg.brand.name}
          >
            <span
              className="brand-mark"
              aria-hidden="true"
            >
              <img
                src="/logo-icon.png"
                alt=""
                className="logo-light"
              />

              <img
                src="/logo-icon-on-dark.png"
                alt=""
                className="logo-dark"
              />
            </span>

            <span className="brand-full">
              <img
                src={cfg.brand.logo.light}
                alt={cfg.brand.name}
                className="logo-light"
              />

              <img
                src={cfg.brand.logo.dark}
                alt={cfg.brand.name}
                className="logo-dark"
              />
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={handleSidebarToggle}
          aria-pressed={sidebarPinned}
          aria-label={
            sidebarPinned
              ? t({
                  ar: "إلغاء تثبيت القائمة وطيها",
                  en: "Unpin and collapse sidebar",
                })
              : t({
                  ar: "تثبيت القائمة مفتوحة",
                  en: "Pin sidebar open",
                })
          }
          title={
            sidebarPinned
              ? t({
                  ar: "إلغاء التثبيت",
                  en: "Unpin sidebar",
                })
              : t({
                  ar: "تثبيت القائمة",
                  en: "Pin sidebar",
                })
          }
        >
          <Icon
            name="chevronLeft"
            size={16}
          />
        </button>

        <nav
          className="sidebar-nav"
          aria-label={t({
            ar: "التنقل الرئيسي",
            en: "Main navigation",
          })}
        >
          {navGroups.map((group) => (
            <div
              key={group.label.en}
              className="nav-group"
            >
              {expanded && (
                <p className="nav-group-label">
                  {t(group.label)}
                </p>
              )}

              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    setProjectMenuOpen(false);
                  }}
                  className="nav-link"
                  aria-current={
                    isActive(item.href)
                      ? "page"
                      : undefined
                  }
                  title={
                    expanded
                      ? undefined
                      : t(item.label)
                  }
                >
                  <span className="nav-icon">
                    <Icon
                      name={item.icon}
                      size={19}
                    />
                  </span>

                  <span className="nav-label">
                    {t(item.label)}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-dot" />

            <div className="sidebar-status-copy">
              <span>
                {t({
                  ar: "النظام متصل",
                  en: "System online",
                })}
              </span>

              <strong>
                {selectedProject?.name ||
                  "Automed"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="logout-button"
            title={
              expanded
                ? undefined
                : t({
                    ar: "تسجيل الخروج",
                    en: "Sign out",
                  })
            }
          >
            <Icon
              name="logout"
              size={18}
            />

            <span>
              {loggingOut
                ? t({
                    ar: "جاري تسجيل الخروج...",
                    en: "Signing out...",
                  })
                : t({
                    ar: "تسجيل الخروج",
                    en: "Sign out",
                  })}
            </span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-start">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label={t({
                ar: "فتح القائمة",
                en: "Open menu",
              })}
            >
              <Icon
                name="menu"
                size={18}
              />
            </button>

            <div className="topbar-page">
              <span className="topbar-kicker">
                Automed
              </span>

              <strong>
                {currentNav
                  ? t(currentNav.label)
                  : pathname === "/users"
                  ? t({
                      ar: "المستخدمون",
                      en: "Users",
                    })
                  : cfg.brand.name}
              </strong>
            </div>
          </div>

          <div className="topbar-actions">
            {isAdmin &&
              projects.length > 0 && (
                <div
                  className="project-picker"
                  ref={pickerRef}
                >
                  <button
                    type="button"
                    className="project-trigger"
                    onClick={() =>
                      setProjectMenuOpen(
                        (value) => !value
                      )
                    }
                    aria-expanded={
                      projectMenuOpen
                    }
                    aria-haspopup="listbox"
                  >
                    <span className="project-trigger-dot" />

                    <span className="project-trigger-name">
                      {selectedProject?.name ||
                        t({
                          ar: "اختر المشروع",
                          en: "Select project",
                        })}
                    </span>

                    <Icon
                      name="chevron"
                      size={15}
                    />
                  </button>

                  {projectMenuOpen && (
                    <div
                      className="project-menu"
                      role="listbox"
                    >
                      {projects.map(
                        (project) => {
                          const selected =
                            project.id ===
                            selectedProject?.id;

                          return (
                            <button
                              key={project.id}
                              type="button"
                              role="option"
                              aria-selected={
                                selected
                              }
                              className={`project-option ${
                                selected
                                  ? "project-option-active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleProjectChange(
                                  project.id
                                )
                              }
                            >
                              <span>
                                {project.name}
                              </span>

                              {selected && (
                                <span className="project-check">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}

            <button
              type="button"
              className="topbar-control"
              onClick={toggleTheme}
              aria-label={t({
                ar: "تغيير المظهر",
                en: "Toggle theme",
              })}
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
              className="topbar-control lang-control"
              onClick={toggleLang}
              aria-label={t({
                ar: "تغيير اللغة",
                en: "Toggle language",
              })}
            >
              {lang === "ar"
                ? "EN"
                : "AR"}
            </button>

            <div className="profile-chip">
              <span
                className="profile-avatar"
                aria-hidden="true"
              >
                {isAdmin ? (
                  Array.from(
                    t(adminIdentity.name)
                  )[0]?.toUpperCase()
                ) : (
                  <Icon
                    name="users"
                    size={17}
                  />
                )}
              </span>

              <div className="profile-meta">
                {isAdmin && (
                  <span className="profile-name">
                    <bdi>
                      {t(
                        adminIdentity.name
                      )}
                    </bdi>
                  </span>
                )}

                <span
                  className={
                    isAdmin
                      ? "profile-role"
                      : "profile-name"
                  }
                >
                  {isAdmin
                    ? t({
                        ar: "مسؤول",
                        en: "Admin",
                      })
                    : t({
                        ar: "عميل",
                        en: "Client",
                      })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>

        <footer className="dashboard-footer">
          © 2026 {cfg.brand.name} —{" "}
          {t({
            ar: "جميع الحقوق محفوظة",
            en: "All rights reserved",
          })}
        </footer>
      </div>
    </div>
  );
}