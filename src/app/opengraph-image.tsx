import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/data/content";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = path.join(process.cwd(), "node_modules/@fontsource/space-grotesk/files");

export default async function OpengraphImage() {
  const [bold, medium, photo] = await Promise.all([
    readFile(path.join(fontDir, "space-grotesk-latin-700-normal.woff")),
    readFile(path.join(fontDir, "space-grotesk-latin-500-normal.woff")),
    readFile(path.join(process.cwd(), "public/images/kaushal.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#171716", color: "#f5f4f0", fontFamily: "Space Grotesk", padding: "72px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 56 }}>
          <div style={{ display: "flex", fontSize: 22, color: "#bdbcb6", letterSpacing: "-0.01em" }}>{"{{ /AI & FULL-STACK DEVELOPMENT }}"}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.95 }}>Kaushal</div>
            <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.95 }}>Shahare.</div>
            <div style={{ marginTop: 32, fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>{`${site.role}.`}</div>
            <div style={{ marginTop: 18, fontSize: 24, fontWeight: 500, color: "#bdbcb6", lineHeight: 1.35, maxWidth: 600 }}>
              Reliable AI products: cost, safety and trust.
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#bdbcb6" }}>{site.url.replace("https://", "")}</div>
        </div>
        <div style={{ display: "flex", width: 380, height: 486, alignSelf: "center", borderRadius: 18, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} alt="" width={380} height={486} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
