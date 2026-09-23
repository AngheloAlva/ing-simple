import Image from "next/image"
import type { ReactNode } from "react"

/**
 * Full-bleed cover photo under the nav. Framed with the site's chrome
 * (border, `rounded-sm`) inside the page container — never edge-to-edge
 * without a frame, per `DESIGN.md`. Today a photographic frame; the
 * illustration register replaces it (see `odd/tasks/guias-cover-plates.md`).
 */
export function GuiaCover({
	src,
	alt,
	credito,
}: {
	src: string
	alt: string
	credito?: string
}): ReactNode {
	return (
		<div className="mx-auto max-w-360 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10">
			<div className="border-border relative aspect-video max-h-[60vh] w-full overflow-hidden rounded-sm border">
				<Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />

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
