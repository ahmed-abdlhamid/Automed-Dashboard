import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import "./theme.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://automed-dashboard.vercel.app"),
  title: {
    default: "Automed Dashboard",
    template: "%s | Automed",
  },
  description:
    "Automed Dashboard — مساحة موحدة لمتابعة الطلبات والأداء والتحليلات وإدارة أنظمة الأتمتة.",
  applicationName: "Automed Dashboard",
  keywords: [
    "Automed",
    "Automed Dashboard",
    "AI automation",
    "business automation",
    "orders dashboard",
    "لوحة تحكم Automed",
    "أتمتة الأعمال",
  ],
  openGraph: {
    type: "website",
    siteName: "Automed",
    title: "Automed Dashboard",
    description:
      "تابع الطلبات والأداء والتحليلات وإدارة أنظمة الأتمتة من مساحة واحدة.",
    url: "https://automed-dashboard.vercel.app",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary",
    title: "Automed Dashboard",
    description:
      "تابع الطلبات والأداء والتحليلات وإدارة أنظمة الأتمتة من مساحة واحدة.",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// Runs before first paint: applies saved (or system) theme + language to <html>
const initScript = `
try {
  var d = document.documentElement;
  var t = localStorage.getItem("automed-theme");
  if (t !== "dark" && t !== "light") {
    t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var l = localStorage.getItem("automed-lang") === "en" ? "en" : "ar";
  d.dataset.theme = t;
  d.lang = l;
  d.dir = l === "ar" ? "rtl" : "ltr";
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Readex+Pro:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
