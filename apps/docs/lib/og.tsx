import fs from "node:fs/promises";
import path from "node:path";
import { VERSION_LABEL } from "@/lib/version";
import { ImageResponse } from "next/og";

/**
 * The share image every page gets, 1200 by 630: the logo, an eyebrow, a serif
 * title with an italic brand phrase, a line of text and a footer line. The
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
};

const FONT_DIR = path.join(process.cwd(), "assets", "fonts");
const MARK = path.join(process.cwd(), "assets", "brand", "entrepta.png");

/** The mark as a data URL: satori draws an img from one with no network. */
async function markUrl() {
  const data = await fs.readFile(MARK);
  return `data:image/png;base64,${data.toString("base64")}`;
}

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
  /** Left of the footer line, such as the install command. */
  command: string;
};

export async function ogImage({ eyebrow, title, emphasis, description, command }: OgContent) {
  const long = title.length + (emphasis?.length ?? 0) > 26;
  const mark = await markUrl();
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
          {/* biome-ignore lint/a11y/useAltText: satori renders a picture, not a page */}
          <img src={mark} width={72} height={72} />
          <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: 40, marginLeft: 0 }}>
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

      {/* footer: the command and the address */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          padding: "0 72px",
          borderTop: `1px solid ${INK.border}`,
          color: INK.muted,
          fontSize: 20,
        }}
      >
        <span>{command}</span>
        <span>entrepta.vercel.app</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() }
  );
}
