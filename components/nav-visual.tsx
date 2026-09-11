import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Preview artwork for the navbar services dropdown.
 *
 * Duotone without a second asset: the tile paints a flat brand colour and the
 * greyscaled photo sits on top in `mix-blend-mode: luminosity`, so the result
 * keeps the photo's lightness and takes the backdrop's hue. One PNG per
 * service covers both themes and both accent colours.
 *
 * The tile is scoped to the active service via `data-service`: it always
 * reads `--brand-blue`, but that token is redefined by the
 * `[data-service="<slug>"]` override in `app/globals.css`, so the wash
 * becomes that service's accent instead of brand blue. The nav chrome
 * outside this tile is untouched and stays brand blue.
 */
export function NavVisual({
  src,
  alt,
  slug,
}: {
  src: string;
  alt: string;
  /** Active service in the dropdown; scopes the tint to its accent colour. A
   * slug without an override falls back to brand blue. */
  slug: string;
}): ReactNode {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      data-service={slug}
      style={{ backgroundColor: "var(--brand-blue)" }}
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
