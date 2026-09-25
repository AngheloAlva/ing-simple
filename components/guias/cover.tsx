import { IllustrationPlate } from "@/components/illustration-plate"
import { GUIA_COVER_PREFIX, viewTransitionName } from "@/lib/view-transitions"
import { ViewTransition, type ReactNode } from "react"

/**
 * The cover under the nav, in the illustration register. Framed with the site's
 * chrome (border, `rounded-sm`) inside the page container — never edge-to-edge
 * without a frame, per `DESIGN.md`.
 *
 * Two things here are load-bearing. There is no height cap: `aspect-video` and the
 * asset's own 16:9 are the same ratio, so the drawing is never cropped, and a
 * `max-h` would make the box wider than the drawing and reintroduce exactly the
 * crop the assets are composed to avoid. And `priority` stays on the plate, which
 * forwards it, because the cover is the guide's LCP element.
 *
 * The credit chip lives outside the plate, in a wrapper that owns the radius: `IllustrationPlate`
 * renders its own children-free frame and does not take overlay children.
 */
export function GuiaCover({
	src,
	alt,
	slug,
	credito,
}: {
	src: string
	alt: string
	slug: string
	credito?: string
}): ReactNode {
	return (
		<div className="mx-auto max-w-360 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10">
			<div className="relative overflow-hidden rounded-sm">
				<ViewTransition
					name={viewTransitionName(GUIA_COVER_PREFIX, slug)}
					share="morph"
					default="none"
				>
					<IllustrationPlate
						src={src}
						alt={alt}
						priority
						sizes="100vw"
						className="object-cover"
						frame="border-border aspect-video w-full border"
					/>
				</ViewTransition>

				{credito !== undefined ? (
					<>
						<div
							aria-hidden="true"
							className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
						/>
						<span className="absolute right-3 bottom-3 font-mono text-[10px] tracking-[0.1em] text-white uppercase">
							{credito}
						</span>
					</>
				) : null}
			</div>
		</div>
	)
}
