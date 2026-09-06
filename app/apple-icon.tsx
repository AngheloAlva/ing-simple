import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BRAND_BLUE = "#003a8e";

/** The brand isotype recoloured white, as a data URI ImageResponse can embed. */
function whiteIsotypeDataUri(): string {
  const svg = readFileSync(join(process.cwd(), "public", "isotipo.svg"), "utf-8").replace(
    'fill="#00b764"',
    'fill="#ffffff"',
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_BLUE,
          borderRadius: 0,
        }}
      >
        <img src={whiteIsotypeDataUri()} alt="" width={144} height={144} />
      </div>
    ),
    { ...size },
  );
}
