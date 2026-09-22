import Image from "next/image"
import { DUOTONE_CONTAINER } from "@/components/duotone"
import { cn } from "@/lib/utils"

import type { ReactNode } from "react"

// Calibrated for 3D renders sitting on a near-white ground: grayscale leaves
// them almost entirely white while mix-blend-color keeps the backdrop's
// luminosity, so the tonal range has to be compressed first or the shared
// values flatten every image into a solid blue rectangle.
const RENDER_FILTER =
	"object-cover [filter:grayscale(1)_contrast(1.2)_brightness(0.95)] dark:[filter:grayscale(1)_contrast(1.35)_brightness(0.4)]"

// A line drawing needs the opposite treatment. Compressing its range drives the
// ink down to pure black, and dark mode then composites that over a dark navy
// plate: measured at roughly 1.1:1 against the ground, which is invisible.
// Inverting in dark mode is the only arrangement that survives a dark ground,
// so the ink becomes the light mass and the filled areas become the dark ones.
// `object-contain` rather than `object-cover` because the assets are square: a
// 16/9 frame would crop 44% of the height and cut off the subject's feet.
// Contain costs nothing here, since a transparent asset has no background to
// letterbox. A call site that wants the opposite fit passes `object-cover` in
// `className`, which is merged last and wins.
const LINE_ART_FILTER =
	"object-contain [filter:grayscale(1)_contrast(1.1)] dark:[filter:grayscale(1)_contrast(1.1)_invert(1)]"

/**
 * The framed plate every illustration renders inside: the duotone ground, the
 * image, and the three blend layers that carry the artwork onto the site's
 * palette.
 *
 * The blend layers read `--illustration-tint` and `--illustration-veil`, whose
 * base values are the literal colours the stack was tuned around. Any element
 * carrying `data-service` remaps those tokens from that service's
 * `--brand-tint`, so the plate takes the page accent without the component
 * knowing anything about services.
 */
export function IllustrationPlate({
	src,
	sizes,
	alt = "",
	priority = false,
	lineArt = true,
	frame,
	className,
}: {
	src: string
	sizes: string
	alt?: string
	priority?: boolean
	/** Line-art assets skip the tonal compression calibrated for the renders. */
	lineArt?: boolean
	/** Frame classes owned by the call site: aspect ratio, margin, border. */
	frame?: string
	/** Merged last, so a call site can override the object fit. */
	className?: string
}): ReactNode {
	return (
		<div className={cn("relative w-full overflow-hidden", DUOTONE_CONTAINER, frame)}>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				priority={priority}
				className={cn(lineArt ? LINE_ART_FILTER : RENDER_FILTER, className)}
			/>
			<div className="absolute inset-0 bg-[var(--illustration-tint)] opacity-90 mix-blend-color" />
			<div className="absolute inset-0 bg-[var(--illustration-veil)] opacity-30 mix-blend-multiply dark:opacity-45" />
			<div className="absolute inset-0 bg-white opacity-15 mix-blend-screen dark:opacity-0" />
		</div>
	)
}
