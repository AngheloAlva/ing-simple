"use client"

import AsciiWaves from "@/components/ascii-waves"
import { CutButton } from "@/components/cut-button"
import { softEase, useReducedMotion } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import { useSyncExternalStore, type ReactNode } from "react"

function useIsMounted(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false
	)
}

const container: Variants = {
	hidden: {},
	visible: { transition: { delayChildren: 0.08, staggerChildren: 0.14 } },
}

const staticContainer: Variants = { hidden: {}, visible: {} }

const item: Variants = {
	hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
	visible: { opacity: 1, y: 0, filter: "blur(0px)" },
}

const DEFAULT_TITLE = "¿Qué proceso te quita más tiempo hoy?"
const DEFAULT_BODY =
	"Cuéntanos tu situación y en menos de 24 horas hábiles te respondemos con un diagnóstico y por dónde empezar."

const finalCtaWavesProps = {
	characters: " .:-+*=%@#",
	elementSize: 9,
	noiseScale: 5,
	speed: 0.7,
	intensity: 0.7,
	waveTension: 0.5,
	waveTwist: 0.2,
	hasCursorInteraction: true,
	interactionIntensity: 2,
	invert: false,
	color: "var(--brand-tint)",
} as const

export function FinalCta({
	title = DEFAULT_TITLE,
	body = DEFAULT_BODY,
	href = "/contacto",
}: {
	title?: string
	body?: string
	/** Contact destination; service pages pass a preselecting `contactHref`. */
	href?: string
} = {}): ReactNode {
	const mounted = useIsMounted()
	const prefersReducedMotion = useReducedMotion()

	const itemTransition = prefersReducedMotion
		? { duration: 0.01 }
		: { duration: 0.5, ease: softEase }

	return (
		<section className="relative isolate overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-y-0 left-0 z-0 w-full"
				style={{
					maskImage:
						"linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
				}}
			>
				{mounted && <AsciiWaves {...finalCtaWavesProps} className="h-full w-full" />}
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-1 dark:hidden"
				style={{
					background:
						"radial-gradient(ellipse 52% 58% at center, var(--background) 0%, var(--background) 28%, color-mix(in srgb, var(--background) 92%, transparent) 42%, color-mix(in srgb, var(--background) 68%, transparent) 58%, transparent 78%)",
				}}
			/>

			<div className="pointer-events-none relative z-10 mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
				<div className="relative mx-auto flex max-w-2xl flex-col items-center py-28 text-center sm:py-36 lg:py-44">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-1/2 z-[-1] hidden h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2 dark:block"
						style={{
							background:
								"radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 55%, transparent 72%)",
						}}
					/>

					<motion.div
						variants={prefersReducedMotion ? staticContainer : container}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.35 }}
						className="flex flex-col items-center"
					>
						<motion.h2
							variants={item}
							transition={itemTransition}
							className="font-serif text-4xl leading-[1.08] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.75rem]"
						>
							{title}
						</motion.h2>

						<motion.p
							variants={item}
							transition={itemTransition}
							className="text-muted-foreground mt-5 max-w-md text-[15px] leading-relaxed text-balance sm:text-base"
						>
							{body}
						</motion.p>

						<motion.div
							variants={item}
							transition={itemTransition}
							className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3"
						>
							<CutButton variant="solid" icon="send" href={href}>
								Pide tu diagnóstico gratis
							</CutButton>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
