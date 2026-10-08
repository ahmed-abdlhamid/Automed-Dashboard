import type { Bilingual } from "@/components/Providers";
import type { IconName } from "@/components/ui";

export type NavItem = {
  href: string;
  icon: IconName;
  label: Bilingual;
};

export const dashboardConfig = {
  brand: {
    name: "Automed",

    logo: {
      light: "/automed-logo-light.png",
      dark: "/automed-logo-dark.png",
    },
  },

  project: {
    id: "247aef2b-1994-4951-a2b2-ba9b7c549692",

    name: {
      ar: "Krokett",
      en: "Krokett",
    } as Bilingual,

    currency: "EGP",
  },

  nav: [
    {
      href: "/",
      icon: "home",
      label: {
        ar: "الرئيسية",
        en: "Overview",
      },
    },

    {
      href: "/orders",
      icon: "orders",
      label: {
        ar: "الطلبات",
        en: "Orders",
      },
    },

    {
      href: "/analytics",
      icon: "analytics",
      label: {
        ar: "التحليلات",
        en: "Analytics",
      },
    },

    {
      href: "/automation",
      icon: "automation",
      label: {
        ar: "الأتمتة",
        en: "Automation",
      },
    },

    {
      href: "/activity",
      icon: "activity",
      label: {
        ar: "النشاط",
        en: "Activity",
      },
    },

    {
      href: "/settings",
      icon: "settings",
      label: {
        ar: "الإعدادات",
        en: "Settings",
      },
    },
  ] as NavItem[],

  hero: {
    badge: {
      ar: "النظام يعمل بشكل طبيعي",
      en: "Everything is running normally",
    },

    titleBefore: {
      ar: "شغلك يمشي،",
      en: "Your systems run.",
    },

    titleAccent: {
      ar: "وإنت تركز على المهم.",
      en: "You focus on what matters.",
    },

    text: {
      ar: "تابع العمليات والأداء من مساحة واحدة، مصممة حول الأنظمة اللي Automed بيبنيها لشغلك.",
      en: "Monitor operations and performance from one workspace built around the systems Automed creates for your business.",
    },
  } as Record<string, Bilingual>,
};