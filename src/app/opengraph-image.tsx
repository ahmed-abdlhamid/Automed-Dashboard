import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Automed — Save Your Time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoUrl = "https://automed-dashboard.vercel.app/automed-logo-light.png";
  let logo: ArrayBuffer | null = null;
  try {
    const response = await fetch(logoUrl);
    if (response.ok) logo = await response.arrayBuffer();
  } catch {}

  const logoBase64 = logo ? btoa(Array.from(new Uint8Array(logo), (byte) => String.fromCharCode(byte)).join("")) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          background: "#062f2c",
          color: "#f7fbfa",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(125deg, #062f2c 0%, #0f665f 68%, #0b4944 100%)" }} />
        <div style={{ position: "absolute", right: -100, top: -170, width: 560, height: 560, borderRadius: 280, border: "1px solid rgba(116,230,211,.2)", display: "flex" }} />
        <div style={{ position: "absolute", right: 10, top: -90, width: 440, height: 440, borderRadius: 220, border: "1px solid rgba(116,230,211,.16)", display: "flex" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 440, height: 12, background: "#fc9038", transform: "rotate(-38deg)", transformOrigin: "bottom right", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", padding: "68px 82px", position: "relative" }}>
          {logo ? (
            <img src={`data:image/png;base64,${logoBase64}`} width="370" height="100" style={{ objectFit: "contain", objectPosition: "left center", marginBottom: 44 }} />
          ) : (
            <div style={{ display: "flex", color: "#f7fbfa", fontSize: 54, fontWeight: 800, marginBottom: 44 }}>AUTOMED</div>
          )}
          <div style={{ display: "flex", color: "#fc9038", fontSize: 21, fontWeight: 700, letterSpacing: 5, marginBottom: 20 }}>INTELLIGENT AUTOMATION</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 55, fontWeight: 800, lineHeight: 1.18, letterSpacing: -1 }}>
            <span>Save Your Time.</span>
            <span style={{ color: "#fc9038", marginTop: 10 }}>Make Work Smarter.</span>
          </div>
          <div style={{ display: "flex", color: "#d3e8e4", fontSize: 23, marginTop: 30, lineHeight: 1.5 }}>
            AI Agents · Smart Automation · Business Insights
          </div>
          <div style={{ display: "flex", marginTop: 45, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.2)", color: "#f7fbfa", fontSize: 19 }}>
            automed.official@gmail.com　·　01021804181
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
