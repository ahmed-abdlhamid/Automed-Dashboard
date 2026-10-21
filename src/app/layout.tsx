import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import "./theme.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const brandDescription =
  "Automed builds AI agents and automation systems for businesses. Organize requests, customer messages, and workflows while tracking business performance in one place.";

export const metadata: Metadata = {
  metadataBase: new URL("https://automed-dashboard.vercel.app"),
  title: {
    default: "Automed — Save Your Time",
    template: "%s | Automed",
  },
  description: brandDescription,
  applicationName: "Automed",
  keywords: [
    "Automed",
    "AI agents",
    "AI automation",
    "business automation",
    "workflow automation",
    "لوحة تحكم Automed",
    "أتمتة الأعمال",
    "وكلاء الذكاء الاصطناعي",
  ],
  openGraph: {
    type: "website",
    siteName: "Automed",
    title: "Automed — وفّر وقتك | Save Your Time",
    description:
      "نحوّل المهام المتكررة لأنظمة ذكية باستخدام الذكاء الاصطناعي، ونساعدك تنظّم شغلك وتتابع أداء أعمالك بوضوح.",
    url: "https://automed-dashboard.vercel.app",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Automed — وفّر وقتك | Save Your Time",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automed — Save Your Time",
    description: brandDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

// Apply the saved theme and language before the first paint.
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
