"use client"

import { useReducedMotion } from "@/lib/motion"
import { motion, type MotionStyle, type Variants } from "motion/react"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Staggered entrance shared by every diagram on the site: a picture that
 * assembles one part at a time instead of landing finished, so it is read in
 * the order it was meant to be read.
 * ------------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const

/** Default entrance: a short lift into place. */
export const revealItem: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/** For the beat that should land rather than arrive — a cut, a verdict. */
export const revealPop: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE } },
}

/** Movement stripped out, presence kept. */
const revealInstant: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.01 } },
}

/**
 * One beat of an entrance. Wrap parts that already drive their own `animate`
 * — an explicit animate prop opts an element out of variant inheritance, so
 * the reveal has to live on a wrapper around it.
 */
export function Reveal({
	children,
	className,
	style,
	pop = false,
	"aria-hidden": ariaHidden,
}: {
	"children": ReactNode
	"className"?: string
	"style"?: MotionStyle
	"pop"?: boolean
	/** Decorative wrappers keep their aria-hidden when they become a Reveal. */
	"aria-hidden"?: boolean
}): ReactNode {
	const prefersReduced = useReducedMotion()

	return (
		<motion.div
			className={className}
			{...(style ? { style } : {})}
			{...(ariaHidden ? { "aria-hidden": true } : {})}
			variants={prefersReduced ? revealInstant : pop ? revealPop : revealItem}
		>
			{children}
		</motion.div>
	)
}

/** Container that plays its `Reveal` descendants one after the other. */
export function RevealGroup({
	children,
	className,
	stagger = 0.085,
	delay = 0.26,
}: {
	children: ReactNode
	className?: string
	stagger?: number
	delay?: number
}): ReactNode {
	const prefersReduced = useReducedMotion()

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "0px 0px -12% 0px" }}
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: prefersReduced ? 0 : stagger,
						delayChildren: prefersReduced ? 0 : delay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	)
}
