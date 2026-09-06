import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ingeniería Simple — Soluciones simples para un mundo digital complejo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_BLUE = "#003a8e";

function logoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), "public", "logo.svg"), "utf-8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function OpengraphImage() {
  const logo = logoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <img src={logo} alt="" width={220} height={162} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: BRAND_BLUE,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 600,
              color: "#0a0a0a",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            Soluciones simples para un mundo digital complejo
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#4b5563",
          }}
        >
          ingenieriasimple.cl · Reportabilidad · Automatizaciones · Desarrollo web · Capacitaciones
        </div>
      </div>
    ),
    { ...size },
  );
}
