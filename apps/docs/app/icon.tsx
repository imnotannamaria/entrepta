import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#09090B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={28}
        height={28}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="entrepta"
      >
        <rect x="3" y="6" width="22" height="3" rx="1" fill="#FAFAFA" />
        <rect x="3" y="13" width="14" height="3" rx="1" fill="#FAFAFA" opacity="0.85" />
        <rect x="3" y="20" width="22" height="3" rx="1" fill="#FAFAFA" opacity="0.55" />
        <circle cx="27" cy="14.5" r="2.2" fill="#7C6BFF" />
      </svg>
    </div>,
    { ...size }
  );
}
