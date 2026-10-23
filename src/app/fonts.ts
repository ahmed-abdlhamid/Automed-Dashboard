import localFont from "next/font/local";

// Original user-supplied Zain files. Keep their SIL OFL alongside the assets.
export const zain = localFont({
  src: [
    { path: "./fonts/Zain-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Zain-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Zain-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-zain",
  display: "swap",
  // Fetch only the weights used by the route rather than preloading all TTFs.
  preload: false,
  fallback: ["Arial", "sans-serif"],
});
