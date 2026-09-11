"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState, type ReactNode } from "react"

import { isStillVisible } from "@/components/guias/cover-relief-state"
import { ReliefBoundary } from "@/components/guias/relief-boundary"
import { useReducedMotion } from "@/lib/motion"

const PixelSculpt = dynamic(() => import("@/components/react-bits/pixel-sculpt"), {
	ssr: false,
})

/**
 * Themed backdrop for the interactive relief: matches the container, not the
 * canvas, so the transparent still and the sculpture read identically in
 * both themes.
 */
const BACKDROP = "bg-[#E0DCD7] dark:bg-muted"

/**
 * Cover for guides with an interactive pixel-relief (`portadaRelieve` in the
 * frontmatter). Mirrors `GuiaCover`'s frame, but stacks the transparent still
 * (carries LCP) under `PixelSculpt` (mounted only without reduced motion,
 * faded in once its tile field has drawn). The still is hidden only after that
 * fade ends, so raised tiles never reveal a second copy underneath. On no
 * WebGL, a load error, or a thrown chunk, the sculpture renders nothing and
 * the still shows again — never the gray source photo.
 */
export function GuiaCoverRelieve({
	src,
	stillSrc,
	alt,
	credito,
	removeBackground = true,
}: {
	/** Source photo sampled into the tile field (`portadaRelieve`). */
	src: string
	/** Transparent still of the sculpture at rest (`portada`). */
	stillSrc: string
	alt: string
	credito?: string
	/** Key out the source background (`portadaRelieveRecorte`). Off for full-frame photos. */
	removeBackground?: boolean
}): ReactNode {
	const reducedMotion = useReducedMotion()
	const [sculptReady, setSculptReady] = useState(false)

	return (
		<div className="mx-auto max-w-360 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10">
			<div
				className={`border-border relative aspect-video max-h-[60vh] w-full overflow-hidden rounded-sm border ${BACKDROP}`}
			>
				{/* 16:9 stage that covers the frame: the still (captured at 16:9) and the
				    sculpture (whose camera fits the whole slab into its canvas) share one
				    box, so the slab keeps the same size when they cross-fade even when
				    `max-h-[60vh]` makes the frame wider than 16:9. */}
				<div className="absolute inset-x-0 top-1/2 aspect-video w-full -translate-y-1/2">
					<Image
						src={stillSrc}
						alt={alt}
						fill
						priority
						sizes="100vw"
						className={`object-contain transition-[visibility] duration-500 ${isStillVisible({ sculptReady, reducedMotion }) ? "visible" : "invisible"}`}
					/>

					{reducedMotion ? null : (
						<ReliefBoundary onError={() => setSculptReady(false)}>
							<PixelSculpt
								src={src}
								resolution={140}
								removeBackground={removeBackground}
								backgroundColor="transparent"
								tilt={32}
								scale={1}
								fallbackSrc={null}
								onReady={() => setSculptReady(true)}
								onError={() => setSculptReady(false)}
								className={`absolute inset-0 transition-opacity duration-500 ${sculptReady ? "opacity-100" : "opacity-0"}`}
							/>
						</ReliefBoundary>
					)}
				</div>

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
