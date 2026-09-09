"use client"

import {
	fadeInUp,
	reducedMotionVariants,
	softEase,
	useReducedMotion,
	useStaggerEntrance,
} from "@/lib/motion"
import { motion } from "motion/react"
import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	useContext,
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
} from "react"

/**
 * Client-only pieces of the guide MDX component map (`mdx-components.tsx`):
 * everything here needs its own hooks (stagger timing, reduced motion), so it
 * cannot stay in the server module that `lib/guias/render.tsx` compiles
 * against. Everything else in that module renders these — or the plain
 * `InView` from `lib/motion` — as children, which stays perfectly RSC-safe.
 */

/**
 * Set to `true` inside any container that already reveals itself as ONE unit
 * (`Nota`, `Paso`, `Blockquote`, a `Checklist` item, a table cell, a plain
 * `li`). Nested prose inside those — typically a single `<p>` from the MDX
 * compiler — reads this and renders plain instead of wrapping in its own
 * `InView`: two independent scroll-triggered reveals stacked on top of each
 * other left the inner one stuck (a different viewport margin, or simply a
 * different frame) while the outer container had already finished, which
 * read as a card with a title and a blank body.
 */
const RevealDisabledContext = createContext(false)

/** Article prose reveals sooner than a page section: it should appear as the
 * reader scrolls it in, not a third of the screen later. */
export const ARTICLE_VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const

function useRevealEnabled(): boolean {
	return !useContext(RevealDisabledContext)
}

/**
 * Marks its children as already revealed by an ancestor container, so the
 * `p`/`pre`/`li`/table-cell components below render plain instead of
 * queuing up a second, independent scroll reveal. A Server Component
 * (`Nota` in `mdx-components.tsx`) cannot render `RevealDisabledContext.Provider`
 * directly — a bare `Context.Provider` accessed off a value imported from a
 * `"use client"` module doesn't survive the RSC boundary as a component — so
 * this small named component is the thing a server file actually renders.
 */
export function RevealDisabled({ children }: { children: ReactNode }): ReactNode {
	return <RevealDisabledContext.Provider value={true}>{children}</RevealDisabledContext.Provider>
}

/** `p` inside guide MDX bodies: reveals on scroll, unless nested in a container that already reveals as a unit. */
export function MdxP(props: ComponentPropsWithoutRef<"p">): ReactNode {
	const enabled = useRevealEnabled()

	if (!enabled) {
		return <p className="mt-4 text-[15px] leading-relaxed sm:text-base" {...props} />
	}

	return (
		<motion.div
			className="mt-4"
			initial="hidden"
			whileInView="visible"
			viewport={ARTICLE_VIEWPORT}
			variants={fadeInUp}
			transition={{ duration: 0.4, ease: softEase }}
		>
			<p className="text-[15px] leading-relaxed sm:text-base" {...props} />
		</motion.div>
	)
}

/** `pre` (code block): same reveal-or-plain rule as `MdxP`. */
export function MdxPre(props: ComponentPropsWithoutRef<"pre">): ReactNode {
	const enabled = useRevealEnabled()
	const className =
		"border-border bg-muted/40 overflow-x-auto rounded-sm border p-4 font-mono text-sm leading-relaxed [&>code]:rounded-none [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0"

	if (!enabled) {
		return <pre className={`mt-6 ${className}`} {...props} />
	}

	return (
		<motion.div
			className="mt-6"
			initial="hidden"
			whileInView="visible"
			viewport={ARTICLE_VIEWPORT}
			variants={fadeInUp}
			transition={{ duration: 0.4, ease: softEase }}
		>
			<pre className={className} {...props} />
		</motion.div>
	)
}

/** Plain markdown `li`: a container in its own right — nested prose inside it renders plain. */
export function MdxLi(props: ComponentPropsWithoutRef<"li">): ReactNode {
	return (
		<RevealDisabledContext.Provider value={true}>
			<li className="pl-1" {...props} />
		</RevealDisabledContext.Provider>
	)
}

/** Table cell: also a container — a GFM table cell is inline-only in practice, but this stays safe if that ever changes. */
export function MdxTd(props: ComponentPropsWithoutRef<"td">): ReactNode {
	return (
		<RevealDisabledContext.Provider value={true}>
			<td className="px-3 py-2 align-top" {...props} />
		</RevealDisabledContext.Provider>
	)
}

export function MdxTh(props: ComponentPropsWithoutRef<"th">): ReactNode {
	return (
		<RevealDisabledContext.Provider value={true}>
			<th className="px-3 py-2 text-left font-semibold" {...props} />
		</RevealDisabledContext.Provider>
	)
}

interface PasoProps {
	titulo: string
	numero?: number
	children: ReactNode
}

/** One numbered step, staggered in by the `Pasos` list it belongs to. */
export function Paso({ titulo, numero, children }: PasoProps): ReactNode {
	const reduced = useReducedMotion()

	return (
		<motion.li
			className="flex gap-4"
			variants={reduced ? reducedMotionVariants : fadeInUp}
			transition={reduced ? { duration: 0.01 } : { duration: 0.5, ease: softEase }}
		>
			<span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-sm font-mono text-sm font-medium">
				{String(numero ?? 1).padStart(2, "0")}
			</span>
			<div className="min-w-0 pt-0.5">
				<p className="text-sm font-semibold tracking-tight sm:text-base">{titulo}</p>
				<div className="text-muted-foreground mt-1 text-[15px] leading-relaxed [&>p]:mt-0">
					<RevealDisabledContext.Provider value={true}>{children}</RevealDisabledContext.Provider>
				</div>
			</div>
		</motion.li>
	)
}

/** Wraps `Paso` children, numbers them in order, and staggers them into view. */
export function Pasos({ children }: { children: ReactNode }): ReactNode {
	const { container } = useStaggerEntrance()
	const items = Children.toArray(children).filter(isValidElement)

	return (
		<motion.ol
			className="mt-6 space-y-5"
			variants={container}
			initial="hidden"
			whileInView="visible"
			viewport={ARTICLE_VIEWPORT}
		>
			{items.map((child, index) =>
				cloneElement(child as ReactElement<PasoProps>, { key: index, numero: index + 1 })
			)}
		</motion.ol>
	)
}

/**
 * A markdown list wrapped in `<Checklist>`: renders with check glyphs and
 * staggers each item into view. Expects a single markdown list as its only
 * child (the README documents this shape); anything else falls back to a
 * plain, unstaggered render so an unusual guide body never breaks.
 */
export function Checklist({ children }: { children: ReactNode }): ReactNode {
	const { container, item, itemTransition } = useStaggerEntrance()

	const list = isValidElement<{ children?: ReactNode }>(children) ? children : null
	const items = list ? Children.toArray(list.props.children).filter(isValidElement) : []

	if (items.length === 0) {
		return (
			<div
				className={[
					"border-border bg-muted/40 mt-6 rounded-sm border p-5",
					"[&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pl-0",
					"[&_li]:flex [&_li]:items-start [&_li]:gap-2.5",
					"[&_li]:text-[15px] [&_li]:leading-relaxed sm:[&_li]:text-base",
					"[&_li]:before:text-primary [&_li]:before:mt-0.5 [&_li]:before:font-semibold [&_li]:before:content-['✓']",
				].join(" ")}
			>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			className="border-border bg-muted/40 mt-6 rounded-sm border p-5"
			variants={container}
			initial="hidden"
			whileInView="visible"
			viewport={ARTICLE_VIEWPORT}
		>
			<ul className="m-0 list-none space-y-3 pl-0">
				{items.map((child, index) => (
					<motion.li
						key={index}
						variants={item}
						transition={itemTransition}
						className="before:text-primary flex items-start gap-2.5 text-[15px] leading-relaxed before:mt-0.5 before:font-semibold before:content-['✓'] sm:text-base"
					>
						<RevealDisabledContext.Provider value={true}>
							{(child as ReactElement<{ children?: ReactNode }>).props.children}
						</RevealDisabledContext.Provider>
					</motion.li>
				))}
			</ul>
		</motion.div>
	)
}

/** Pull quote: the primary bar draws first, then the quote text fades in. */
export function Blockquote({ children, id }: ComponentPropsWithoutRef<"blockquote">): ReactNode {
	const reduced = useReducedMotion()
	const barTransition = reduced ? { duration: 0.01 } : { duration: 0.5, ease: softEase }
	const textTransition = reduced
		? { duration: 0.01 }
		: { duration: 0.5, ease: softEase, delay: 0.3 }

	return (
		<motion.blockquote
			id={id}
			className="text-muted-foreground my-10 text-xl leading-snug tracking-tight sm:text-2xl"
			initial="hidden"
			whileInView="visible"
			viewport={ARTICLE_VIEWPORT}
		>
			<motion.span
				aria-hidden="true"
				className="bg-primary mb-5 block h-0.5 w-8 origin-left"
				variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
				transition={barTransition}
			/>
			<motion.div
				className="[&>p]:mt-0 [&>p]:text-[length:inherit] [&>p]:leading-[inherit]"
				variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
				transition={textTransition}
			>
				<RevealDisabledContext.Provider value={true}>{children}</RevealDisabledContext.Provider>
			</motion.div>
		</motion.blockquote>
	)
}
