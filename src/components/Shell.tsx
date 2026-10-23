"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dashboardConfig as cfg } from "@/config/dashboard.config";
import { useI18n } from "@/components/Providers";
import { Icon } from "@/components/ui";
import type { Project } from "@/lib/data";
import Image from "next/image";
import "./workspace-shell.css";

function saveProjectPreference(projectId: string) {
  document.cookie = `automed_project_id=${encodeURIComponent(projectId)}; path=/; max-age=31536000; samesite=lax`;
}

export default function Shell({
  children,
  projects = [],
  currentProjectId,
  isAdmin = false,
  userName,
}: {
  children: ReactNode;
  projects?: Project[];
  currentProjectId?: string;
  isAdmin?: boolean;
  userName: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const pickerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const menuButton = menuRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebarRef.current?.querySelector<HTMLButtonElement>(".workspace-sidebar-close")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab") return;
      const elements = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)") ?? [])
        .filter(element => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener("change", onBreakpoint);
    document.addEventListener("keydown", onKey);
    return () => {
      desktop.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [mobileOpen]);

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

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProjectMenuOpen(false);
        pickerRef.current?.querySelector<HTMLButtonElement>(".workspace-project-trigger")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
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

    if (projectId === currentProjectId) return;
    saveProjectPreference(projectId);

    window.location.reload();
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase logout error:", error);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
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
    <div className="dashboard-shell workspace-shell">
      <div
        onClick={() => setMobileOpen(false)}
        className={`mobile-backdrop ${
          mobileOpen
            ? "mobile-backdrop-open"
            : ""
        }`}
      />

      <aside
        ref={sidebarRef}
        id="workspace-navigation"
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={t({ ar: "قائمة التنقل", en: "Navigation" })}
        data-expanded={expanded}
        data-pinned={sidebarPinned}
        data-mobile-open={mobileOpen}
        className="sidebar"
      >
        <button type="button" className="workspace-sidebar-close" onClick={() => setMobileOpen(false)}
          aria-label={t({ ar: "إغلاق القائمة", en: "Close navigation" })}><Icon name="close" size={18} /></button>
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
              <Image width={192} height={192} unoptimized
                src="/logo-icon.png"
                alt=""
                className="logo-light"
              />

              <Image width={192} height={192} unoptimized
                src="/logo-icon-on-dark.png"
                alt=""
                className="logo-dark"
              />
            </span>

            <span className="brand-full">
              <Image width={1480} height={325} unoptimized
                src={cfg.brand.logo.light}
                alt={cfg.brand.name}
                className="logo-light"
              />

              <Image width={1480} height={325} unoptimized
                src={cfg.brand.logo.dark}
                alt={cfg.brand.name}
                className="logo-dark"
              />
            </span>
          </Link>
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
        </div>

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
              {(expanded || mobileOpen) && (
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
        <header className="workspace-header">
          <div className="workspace-header-start">
            <button type="button" className="workspace-menu-button" ref={menuRef}
              aria-label={t({ ar: "فتح القائمة", en: "Open navigation" })}
              aria-expanded={mobileOpen} aria-controls="workspace-navigation" onClick={() => setMobileOpen(true)}>
              <Icon name="menu" size={20} />
            </button>
            <div className="workspace-project-picker" ref={pickerRef}>
              <span className="workspace-project-caption">{t({ ar: "المشروع الحالي", en: "Current project" })}</span>
              {isAdmin && projects.length > 1 ? <>
                <button type="button" className="workspace-project-trigger"
                  onClick={() => setProjectMenuOpen(value => !value)} aria-expanded={projectMenuOpen}
                  aria-haspopup="listbox" aria-controls="workspace-project-options">
                  <bdi>{selectedProject?.name ?? t({ ar: "اختر المشروع", en: "Select project" })}</bdi>
                  <Icon name="chevron" size={15} />
                </button>
                {projectMenuOpen && <div className="workspace-project-options" id="workspace-project-options" role="listbox"
                  aria-label={t({ ar: "المشاريع المتاحة", en: "Available projects" })}>
                  {projects.map(project => <button key={project.id} type="button" role="option"
                    aria-selected={project.id === selectedProject?.id} onClick={() => handleProjectChange(project.id)}>
                    <bdi>{project.name}</bdi>{project.id === selectedProject?.id && <Icon name="check" size={15} />}
                  </button>)}
                </div>}
              </> : <strong className="workspace-project-name" title={selectedProject?.name}><bdi>{selectedProject?.name ?? "Automed"}</bdi></strong>}
            </div>
          </div>
          <div className="workspace-header-end">
            <div className="workspace-tools">
              <button type="button" onClick={toggleTheme}
                aria-label={t({ ar: "تغيير المظهر", en: "Toggle theme" })} title={t({ ar: "تغيير المظهر", en: "Toggle theme" })}>
                <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
              </button>
              <button type="button" onClick={toggleLang} aria-label={t({ ar: "تغيير اللغة", en: "Toggle language" })}
                title={t({ ar: "تغيير اللغة", en: "Toggle language" })}>{lang === "ar" ? "EN" : "AR"}</button>
            </div>
            <Link href="/settings" className="workspace-user" title={userName}
              aria-label={t({ ar: `الإعدادات — ${userName}`, en: `Settings — ${userName}` })}>
              <span className="workspace-user-avatar" aria-hidden="true">{Array.from(userName.trim())[0]?.toUpperCase() ?? "?"}</span>
              <span className="workspace-user-copy"><strong><bdi>{userName}</bdi></strong>
                <span>{isAdmin ? t({ ar: "مدير المشروع", en: "Project admin" }) : t({ ar: "عميل", en: "Client" })}</span>
              </span>
            </Link>
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
