"use client"

import { motion, type MotionProps, type Transition, type Variants } from "motion/react"
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"

function subscribeToReducedMotion(callback: () => void): () => void {
	const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
	mediaQuery.addEventListener("change", callback)
	return () => mediaQuery.removeEventListener("change", callback)
}

function getReducedMotionSnapshot(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot(): boolean {
	return false
}

const ReducedMotionContext = createContext<boolean>(false)

export function useReducedMotion(): boolean {
	return useContext(ReducedMotionContext)
}

export function ReducedMotionProvider({ children }: { children: ReactNode }): ReactNode {
	const prefersReducedMotion = useSyncExternalStore(
		subscribeToReducedMotion,
		getReducedMotionSnapshot,
		getReducedMotionServerSnapshot
	)

	return (
		<ReducedMotionContext.Provider value={prefersReducedMotion}>
			{children}
		</ReducedMotionContext.Provider>
	)
}

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
}

export const fadeInUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

export const fadeInDown: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: { opacity: 1, y: 0 },
}

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
}

export const staggerContainer: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

export const reducedMotionVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
}

export const defaultTransition = {
	duration: 0.3,
	ease: [0.4, 0, 0.2, 1] as const,
}

/** Soft "ease-out-quint" curve for entrance animations. */
export const softEase = [0.22, 1, 0.36, 1] as const

export const springTransition = {
	type: "spring" as const,
	stiffness: 300,
	damping: 30,
}

type MotionDivProps = {
	variants?: Variants
	children?: ReactNode
	className?: string
} & MotionProps

export function MotionDiv({
	variants = fadeInUp,
	children,
	className,
	...props
}: MotionDivProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	const activeVariants = prefersReducedMotion ? reducedMotionVariants : variants
	const activeTransition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={activeVariants}
			transition={activeTransition}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}

export function MotionSection({
	variants = fadeInUp,
	children,
	className,
	...props
}: MotionDivProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	const activeVariants = prefersReducedMotion ? reducedMotionVariants : variants
	const activeTransition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	return (
		<motion.section
			initial="hidden"
			animate="visible"
			variants={activeVariants}
			transition={activeTransition}
			className={className}
			{...props}
		>
			{children}
		</motion.section>
	)
}

export function StaggerContainer({
	children,
	className,
	...props
}: {
	children: ReactNode
	className?: string
} & MotionProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={prefersReducedMotion ? reducedMotionVariants : staggerContainer}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}

export function StaggerItem({
	children,
	className,
	...props
}: {
	children: ReactNode
	className?: string
} & MotionProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	return (
		<motion.div
			variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}

/**
 * Reveals its children once they scroll into view (animates a single time).
 * Use for below-the-fold sections where an on-load animation would be unseen.
 */
export function InView({
	variants = fadeInUp,
	children,
	className,
	transition,
	...props
}: MotionDivProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	const activeVariants = prefersReducedMotion ? reducedMotionVariants : variants
	const activeTransition = prefersReducedMotion
		? { duration: 0.01 }
		: (transition ?? { duration: 0.7, ease: softEase })

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-80px" }}
			variants={activeVariants}
			transition={activeTransition}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}

/** Shared viewport for once-only scroll entrances. */
export const inViewViewport = { once: true, margin: "-80px" } as const

const staticContainer: Variants = { hidden: {}, visible: {} }

type StaggerEntrance = {
	/** Variants for the wrapper that owns the stagger. */
	container: Variants
	/** Variants for each staggered child. */
	item: Variants
	/** Transition to pass alongside `item` (variants carry none). */
	itemTransition: Transition
	viewport: typeof inViewViewport
}

/**
 * Entrance recipe for a section that staggers its own children once it
 * scrolls into view. Put `container` on the wrapper with
 * `initial="hidden" whileInView="visible"` and `item` on every child that
 * should enter; plain DOM elements in between do not break the propagation,
 * so headers and list items can share one stagger.
 */
export function useStaggerEntrance(stagger = 0.08): StaggerEntrance {
	const prefersReducedMotion = useReducedMotion()

	return useMemo(() => {
		if (prefersReducedMotion) {
			return {
				container: staticContainer,
				item: reducedMotionVariants,
				itemTransition: { duration: 0.01 },
				viewport: inViewViewport,
			}
		}
		return {
			container: {
				hidden: {},
				visible: { transition: { staggerChildren: stagger } },
			},
			item: fadeInUp,
			itemTransition: { duration: 0.6, ease: softEase },
			viewport: inViewViewport,
		}
	}, [prefersReducedMotion, stagger])
}

/**
 * In-view counterpart of `StaggerContainer`: children enter staggered the
 * first time the wrapper scrolls into view instead of on mount. Pair with
 * `useStaggerEntrance().item` (or `StaggerItem`) on the children.
 */
export function StaggerInView({
	children,
	className,
	stagger,
	...props
}: {
	children: ReactNode
	className?: string
	stagger?: number
} & MotionProps): ReactNode {
	const { container, viewport } = useStaggerEntrance(stagger)

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={viewport}
			variants={container}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}
