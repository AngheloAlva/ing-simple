"use client"

import { Kicker } from "@/components/corner-plus"
import { INCLUDE_GLYPHS } from "@/components/servicios/include-glyphs"
import type { IncludesVariant } from "@/components/servicios/modules/registry"
import { softEase, useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import type { ServiceInclude } from "@/lib/services"
import { Zap } from "lucide-react"
import { motion, type Transition, type Variants } from "motion/react"
import { useState, type CSSProperties, type ReactNode } from "react"

const PANEL_RADIUS = "2px"

/** Deterministic decorative bar heights per card (no runtime randomness). */
const SPARK_SETS = [
	[40, 65, 50, 80, 60, 90],
	[30, 55, 70, 45, 85, 65],
	[60, 40, 75, 55, 90, 70],
	[50, 80, 45, 70, 55, 85],
	[70, 50, 85, 60, 40, 75],
	[45, 70, 55, 90, 65, 80],
]

/** One sparkline bar that grows to its height once the card is in view. */
function SparkBar({ height, index }: { height: number; index: number }): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const target = `${height}%`

	// The bar inherits "hidden"/"visible" from the card's stagger, so it needs
	// no viewport of its own; the per-bar delay draws the chart left to right.
	const variants = prefersReducedMotion
		? { hidden: { height: target }, visible: { height: target } }
		: {
				hidden: { height: 0 },
				visible: {
					height: target,
					transition: { duration: 0.5, ease: softEase, delay: 0.2 + index * 0.06 },
				},
			}

	return (
		<motion.span
			variants={variants}
			className="w-1 rounded-t-sm bg-current"
			style={{ opacity: 0.35 + index * 0.12 }}
		/>
	)
}

/**
 * One dashboard card. Hover is tracked here (not via a `whileHover` label)
 * because a variant label on the card would make it its own variant root and
 * cut off the entrance it inherits from the section's stagger.
 */
function DashboardCard({
	entry,
	index,
	item,
	itemTransition,
}: {
	entry: ServiceInclude
	index: number
	item: Variants
	itemTransition: Transition
}): ReactNode {
	const [hovered, setHovered] = useState(false)
	const bars = SPARK_SETS[index % SPARK_SETS.length] ?? []
	const Glyph = entry.glyph ? INCLUDE_GLYPHS[entry.glyph] : undefined

	return (
		<motion.article
			variants={item}
			transition={itemTransition}
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
			className="border-border bg-background hover:border-primary/40 rounded-sm border p-6 transition-colors duration-200 sm:p-7"
		>
			<div className="flex items-start justify-between gap-4">
				<p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
					{String(index + 1).padStart(2, "0")}
				</p>
				<div
					className="text-primary flex h-7 w-10 shrink-0 items-end justify-end gap-[3px]"
					aria-hidden="true"
				>
					{Glyph ? (
						<Glyph hovered={hovered} />
					) : (
						bars.map((height, j) => <SparkBar key={j} height={height} index={j} />)
					)}
				</div>
			</div>
			<h3 className="mt-3 text-base font-semibold tracking-tight">{entry.title}</h3>
			<p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">{entry.desc}</p>
		</motion.article>
	)
}

/**
 * Reportabilidad — KPI-style dashboard tiles. Each card carries an
 * identifying glyph (see `include-glyphs.tsx`) when the include declares one,
 * otherwise a decorative mini chart.
 */
function DashboardLayout({ items }: { items: ServiceInclude[] }): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{items.map((entry, i) => (
				<DashboardCard
					key={entry.title}
					entry={entry}
					index={i}
					item={item}
					itemTransition={itemTransition}
				/>
			))}
		</div>
	)
}

/** Capacitaciones — a course curriculum: full-width numbered module rows. */
function SyllabusLayout({ items }: { items: ServiceInclude[] }): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	return (
		<div className="border-border mx-auto max-w-4xl border-t">
			{items.map((entry, i) => (
				<motion.article
					key={entry.title}
					variants={item}
					transition={itemTransition}
					className="border-border hover:border-primary/40 grid gap-2 border-b border-dotted py-6 transition-colors duration-200 sm:grid-cols-[110px_1fr_1.2fr] sm:items-baseline sm:gap-6 sm:py-7"
				>
					<p className="text-primary text-xs font-medium tracking-widest uppercase">
						Módulo {String(i + 1).padStart(2, "0")}
					</p>
					<h3 className="text-base font-semibold tracking-tight">{entry.title}</h3>
					<p className="text-muted-foreground text-sm leading-relaxed">{entry.desc}</p>
				</motion.article>
			))}
		</div>
	)
}

/** Soluciones Web — every item lives inside a mini browser window. */
function BrowserLayout({ items }: { items: ServiceInclude[] }): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	return (
		<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{items.map((entry) => (
				<motion.article
					key={entry.title}
					variants={item}
					transition={itemTransition}
					className="border-border/60 bg-background hover:border-primary/40 overflow-hidden rounded-xl border shadow-lg shadow-black/[0.04] transition-colors duration-200"
				>
					<div className="border-border/60 flex items-center gap-1.5 border-b px-3 py-2">
						<span className="bg-border h-2 w-2 rounded-full" />
						<span className="bg-border h-2 w-2 rounded-full" />
						<span className="bg-primary/60 h-2 w-2 rounded-full" />
						<span className="bg-muted/60 text-muted-foreground ml-2 truncate rounded px-2 py-0.5 text-[10px]">
							ingsimple.cl/{entry.title.toLowerCase().split(" ")[0]}
						</span>
					</div>
					<div className="p-6">
						<h3 className="text-base font-semibold tracking-tight">{entry.title}</h3>
						<p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">{entry.desc}</p>
					</div>
				</motion.article>
			))}
		</div>
	)
}

/** Automatizaciones — a connected pipeline of steps running downward. */
function FlowLayout({ items }: { items: ServiceInclude[] }): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	return (
		<div className="mx-auto max-w-3xl">
			<ol className="border-border relative border-l border-dotted pl-8 sm:pl-10">
				{items.map((entry, i) => (
					<motion.li
						key={entry.title}
						variants={item}
						transition={itemTransition}
						className={`group relative ${i < items.length - 1 ? "pb-9" : ""}`}
					>
						<span
							className="border-primary/50 bg-background text-primary group-hover:border-primary absolute top-0.5 -left-8 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border transition-colors duration-200 sm:-left-10"
							aria-hidden="true"
						>
							<Zap className="h-3 w-3" strokeWidth={2} />
						</span>
						<div className="sm:flex sm:items-baseline sm:gap-6">
							<h3 className="text-base font-semibold tracking-tight sm:w-64 sm:shrink-0">
								{entry.title}
							</h3>
							<p className="text-muted-foreground mt-1.5 text-sm leading-relaxed sm:mt-0">
								{entry.desc}
							</p>
						</div>
					</motion.li>
				))}
			</ol>
		</div>
	)
}

const LAYOUTS: Record<IncludesVariant, ({ items }: { items: ServiceInclude[] }) => ReactNode> = {
	dashboard: DashboardLayout,
	syllabus: SyllabusLayout,
	browser: BrowserLayout,
	flow: FlowLayout,
}

/** Fallback for slugs without a registered variant: the cut-panel mosaic. */
function MosaicLayout({ items }: { items: ServiceInclude[] }): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()
	const clip = { borderRadius: PANEL_RADIUS } as CSSProperties

	return (
		<div className="bg-border p-px" style={clip}>
			<div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={clip}>
				{items.map((entry, i) => (
					<motion.article
						key={entry.title}
						variants={item}
						transition={itemTransition}
						className="bg-background p-7 sm:p-8 lg:p-10"
					>
						<p className="text-primary text-xs font-medium">{String(i + 1).padStart(2, "0")}</p>
						<h3 className="mt-3 text-base font-semibold tracking-tight">{entry.title}</h3>
						<p className="text-muted-foreground mt-3 text-sm leading-relaxed">{entry.desc}</p>
					</motion.article>
				))}
			</div>
		</div>
	)
}

export function ServicioIncludes({
	shortName,
	items,
	variant,
}: {
	shortName: string
	items: ServiceInclude[]
	variant?: IncludesVariant | undefined
}): ReactNode {
	const Layout = variant ? LAYOUTS[variant] : MosaicLayout
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	return (
		<section
			id="incluye"
			className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10"
		>
			<motion.div variants={container} initial="hidden" whileInView="visible" viewport={viewport}>
				<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>Qué incluye</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						Todo lo que cubre{" "}
						<span className="font-sans font-semibold tracking-tight">
							{shortName.toLowerCase()}
						</span>
					</motion.h2>
				</div>

				<Layout items={items} />
			</motion.div>
		</section>
	)
}
