import fs from "node:fs/promises";
import path from "node:path";
import { VERSION_LABEL } from "@/lib/version";
import { ImageResponse } from "next/og";

/**
 * The share image every page gets, 1200 by 630: the logo, an eyebrow, a serif
 * title with an italic brand phrase, a line of text and the status bar. The
 * fonts are vendored TTFs (satori reads neither woff2 nor Google's CSS), so the
 * images build with no network.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = {
  canvas: "#09090B",
  primary: "#FAFAFA",
  secondary: "#A1A1AA",
  muted: "#8A8A92",
  border: "#27272A",
  brand: "#7C6BFF",
  brandText: "#9B8EFF",
  onBrand: "#09090B",
};

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

async function fonts() {
  const read = (file: string) => fs.readFile(path.join(FONT_DIR, file));
  const [serif, serifItalic, mono, monoMedium] = await Promise.all([
    read("newsreader-regular.ttf"),
    read("newsreader-italic.ttf"),
    read("jetbrains-mono-regular.ttf"),
    read("jetbrains-mono-medium.ttf"),
  ]);
  return [
    { name: "Newsreader", data: serif, style: "normal" as const, weight: 400 as const },
    { name: "Newsreader", data: serifItalic, style: "italic" as const, weight: 400 as const },
    { name: "JetBrains Mono", data: mono, style: "normal" as const, weight: 400 as const },
    { name: "JetBrains Mono", data: monoMedium, style: "normal" as const, weight: 500 as const },
  ];
}

export type OgContent = {
  eyebrow: string;
  /** The plain part of the title. */
  title: string;
  /** The italic, brand-colored part that follows it. */
  emphasis?: string;
  description: string;
  /** Left of the status bar, such as a command. */
  command: string;
};

export async function ogImage({ eyebrow, title, emphasis, description, command }: OgContent) {
  const long = title.length + (emphasis?.length ?? 0) > 34;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: INK.canvas,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(124,107,255,0.28), rgba(9,9,11,0) 55%), radial-gradient(circle at 100% 100%, rgba(124,107,255,0.12), rgba(9,9,11,0) 45%)",
        fontFamily: "JetBrains Mono",
        color: INK.primary,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 0" }}>
        {/* logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
            <div style={{ width: 34, height: 5, borderRadius: 2, background: INK.primary }} />
            <div
              style={{
                width: 22,
                height: 5,
                borderRadius: 2,
                background: INK.primary,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                width: 34,
                height: 5,
                borderRadius: 2,
                background: INK.primary,
                opacity: 0.55,
              }}
            />
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: INK.brand,
              marginLeft: -4,
            }}
          />
          <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: 40, marginLeft: 6 }}>
            entrepta<span style={{ color: INK.brand }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              padding: "4px 10px",
              border: `1px solid ${INK.border}`,
              borderRadius: 6,
              fontSize: 18,
              color: INK.muted,
            }}
          >
            {VERSION_LABEL}
          </div>
        </div>

        {/* eyebrow, title, text */}
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 56 }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: INK.brandText,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Newsreader",
              fontSize: long ? 72 : 96,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{title}</span>
            {emphasis && <span style={{ fontStyle: "italic", color: INK.brand }}>{emphasis}</span>}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 980,
              fontSize: 26,
              lineHeight: 1.45,
              color: INK.secondary,
            }}
          >
            {description}
          </div>
        </div>
      </div>

      {/* status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          padding: "0 72px",
          background: INK.brand,
          color: INK.onBrand,
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        <span>{command}</span>
        <span>entrepta.vercel.app</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() }
  );
}
