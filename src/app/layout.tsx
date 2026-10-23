import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { zain } from "./fonts";
import "./globals.css";
import "./theme.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const brandDescription =
  "تابع الطلبات والأنشطة ومؤشرات أداء عملك في لوحة تحكم واحدة، واعرف ما يحدث في عملك بسهولة ووضوح دون الحاجة إلى خبرة تقنية.";

export const metadata: Metadata = {
  metadataBase: new URL("https://automed-dashboard.vercel.app"),
  title: {
    default: "Automed Dashboard | تابع أعمالك",
    template: "%s | Automed Dashboard",
  },
  description: brandDescription,
  applicationName: "Automed",
  keywords: [
    "Automed",
    "لوحة تحكم Automed",
    "إدارة الطلبات",
    "متابعة أنشطة العمل",
    "تحليلات الأعمال",
    "مؤشرات الأداء",
    "متابعة الفريق",
  ],
  openGraph: {
    type: "website",
    siteName: "Automed",
    title: "Automed Dashboard | تابع أعمالك",
    description:
      "تابع الطلبات والأنشطة ومؤشرات أداء عملك في لوحة تحكم واحدة، واعرف ما يحدث في عملك بسهولة ووضوح دون الحاجة إلى خبرة تقنية.",
    url: "https://automed-dashboard.vercel.app",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Automed — تابع أعمالك، وفّر وقتك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automed Dashboard | تابع أعمالك",
    description: brandDescription,
    images: ["/og.jpg"],
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
    <html className={zain.variable} lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
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
