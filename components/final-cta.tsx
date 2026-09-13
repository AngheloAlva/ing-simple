"use client"

import AsciiRipple from "@/components/react-bits/ascii-ripple"
import { CutButton } from "@/components/cut-button"
import { softEase, useReducedMotion } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import { usePathname } from "next/navigation"
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
	visible: { transition: { staggerChildren: 0.12 } },
}

const staticContainer: Variants = { hidden: {}, visible: {} }

const item: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

const DEFAULT_TITLE = "¿Qué proceso te quita más tiempo hoy?"
const DEFAULT_BODY =
	"Cuéntanos tu situación y en menos de 24 horas hábiles te respondemos con un diagnóstico y por dónde empezar."

export const finalCtaRippleColors = {
	text: "var(--muted-foreground)",
	ripple: "var(--primary)",
	trough: "var(--primary)",
} as const

const RIPPLE_TEXT_BY_PATH = [
	["/servicios/reportabilidad", "datos claros para decidir mejor dashboards que trabajan contigo"],
	["/servicios/capacitaciones", "equipos que aprenden haciendo conocimiento que se queda"],
	["/servicios/desarrollo-web", "software que acompaña procesos reales y equipos que avanzan"],
	["/servicios/automatizaciones", "menos tareas manuales más tiempo para el trabajo que importa"],
	["/guias", "ideas claras para mejorar procesos y tomar mejores decisiones"],
	["/casos", "procesos que cambian resultados que se sostienen en el tiempo"],
	["/contacto", "conversemos sobre el trabajo que quieres simplificar"],
] as const

export function rippleTextForPathname(pathname: string): string {
	return (
		RIPPLE_TEXT_BY_PATH.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
		"procesos simples equipos que avanzan trabajo mejor conectado"
	)
}

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
	const pathname = usePathname()
	const prefersReducedMotion = useReducedMotion()
	const rippleText = rippleTextForPathname(pathname)

	const itemTransition = prefersReducedMotion
		? { duration: 0.01 }
		: { duration: 0.7, ease: softEase }

	return (
		<section className="relative isolate mb-32 overflow-hidden sm:mb-44">
			<div
				aria-hidden="true"
				className="absolute inset-y-0 left-1/2 z-0 w-full max-w-360 -translate-x-1/2 px-5 sm:px-8 lg:px-10"
			>
				{mounted && (
					<AsciiRipple
						rain={0.5}
						dither={1}
						speed={0.1}
						interactive
						vignette={0.5}
						damping={0.035}
						lineHeight={1.5}
						text={rippleText}
						textOpacity={0.35}
						className="h-full w-full"
						textColor={finalCtaRippleColors.text}
						rippleColor={finalCtaRippleColors.ripple}
						troughColor={finalCtaRippleColors.trough}
					/>
				)}
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
				<motion.div
					variants={prefersReducedMotion ? staticContainer : container}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="relative mx-auto flex max-w-2xl flex-col items-center py-28 text-center sm:py-36 lg:py-44"
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-1/2 z-[-1] hidden h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2 dark:block"
						style={{
							background:
								"radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 55%, transparent 72%)",
						}}
					/>

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
		</section>
	)
}
