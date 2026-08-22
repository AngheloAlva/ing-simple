import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Preview artwork for the navbar services dropdown.
 *
 * Duotone without a second asset: the tile paints a flat brand colour and the
 * greyscaled photo sits on top in `mix-blend-mode: luminosity`, so the result
 * keeps the photo's lightness and takes the backdrop's hue. One PNG per
 * service covers both themes and both accent colours.
 */
export function NavVisual({
  src,
  alt,
  tone,
}: {
  src: string;
  alt: string;
  /** Brand colour the photo is tinted with. */
  tone: "blue" | "green";
}): ReactNode {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundColor:
          tone === "blue" ? "var(--brand-blue)" : "var(--brand-green)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={1254}
        height={1254}
        sizes="316px"
        className="h-full w-full object-cover opacity-90 mix-blend-luminosity grayscale"
      />
    </div>
  );
}
