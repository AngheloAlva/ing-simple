"use client"

import { CornerPlus } from "@/components/corner-plus"
import { useReducedMotion } from "@/lib/motion"
import { portfolioProjects } from "@/lib/portfolio-data"
import { animate, useInView } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

const CASES = portfolioProjects.filter((project) => project.isFlagship && project.caseStudy)

// Client and year stats only count production cases, so draft placeholders
// ("Cliente por confirmar") never appear as real client companies.
const PRODUCTION_CASES = CASES.filter((project) => project.isProduction !== false)

const UNIQUE_CLIENTS = new Set(PRODUCTION_CASES.map((project) => project.caseStudy!.clientName))
	.size

const FIRST_YEAR = Math.min(
	...PRODUCTION_CASES.map((project) =>
		Number(/20\d{2}/.exec(project.caseStudy!.inProductionSince)?.[0] ?? Infinity)
	)
)

type Stat = {
	value: number
	from?: number
	prefix?: string
	suffix?: string
	label: string
}

const STATS: Stat[] = [
	{ value: CASES.length, label: "Casos de estudio" },
	{ value: UNIQUE_CLIENTS, label: "Empresas cliente" },
	{ value: FIRST_YEAR, from: FIRST_YEAR - 12, label: "En producción desde" },
]

const EASE = [0.22, 1, 0.36, 1] as const

function StatNumber({
	value,
	from,
	prefix,
	suffix,
	inView,
	reduce,
	delay,
}: {
	value: number
	from: number
	prefix: string
	suffix: string
	inView: boolean
	reduce: boolean
	delay: number
}): ReactNode {
	const [display, setDisplay] = useState(from)

	useEffect(() => {
		if (!inView) return
		if (reduce) {
			const raf = requestAnimationFrame(() => setDisplay(value))
			return () => cancelAnimationFrame(raf)
		}
		const controls = animate(from, value, {
			duration: 1.6,
			delay,
			ease: EASE,
			onUpdate: (latest) => setDisplay(latest),
		})
		return () => controls.stop()
	}, [inView, reduce, from, value, delay])

	return (
		<span className="block font-serif text-5xl leading-none font-normal tracking-[-0.02em] tabular-nums sm:text-6xl">
			<span aria-hidden="true">{`${prefix}${Math.round(display)}${suffix}`}</span>
			<span className="sr-only">{`${prefix}${value}${suffix}`}</span>
		</span>
	)
}

export function CasosStats(): ReactNode {
	const reduce = useReducedMotion()
	const panelRef = useRef<HTMLDivElement>(null)
	const inView = useInView(panelRef, { once: true, margin: "-80px" })

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div
				ref={panelRef}
				className="border-border relative grid grid-cols-1 rounded-sm border sm:grid-cols-3"
			>
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				{STATS.map((stat, i) => (
					<div
						key={stat.label}
						className={`relative px-6 py-9 sm:px-8 sm:py-11 ${
							i > 0 ? "border-border border-t sm:border-t-0 sm:border-l" : ""
						}`}
					>
						<StatNumber
							value={stat.value}
							from={stat.from ?? 0}
							prefix={stat.prefix ?? ""}
							suffix={stat.suffix ?? ""}
							inView={inView}
							reduce={reduce}
							delay={i * 0.12}
						/>
						<p className="text-muted-foreground mt-3 text-sm sm:text-base">{stat.label}</p>
					</div>
				))}
			</div>
		</section>
	)
}
