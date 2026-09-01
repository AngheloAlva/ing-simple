"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { Kicker } from "@/components/corner-plus"
import type { CaseStudy } from "@/lib/portfolio-data"
import { useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { animate, motion, useInView } from "motion/react"
import { useEffect, useRef, type ReactNode } from "react"

interface DetailMetricsProps {
	caseStudy: CaseStudy
}

interface ParsedMetric {
	prefix: string
	target: number
	suffix: string
	decimals: number
	usePad: boolean
	padLength: number
	original: string
}

function parseMetric(value: string): ParsedMetric {
	const match = value.match(/^([^\d.,-]*)([\d.,-]+)(.*)$/)
	if (!match || match[2] === undefined) {
		return {
			prefix: "",
			target: 0,
			suffix: value,
			decimals: 0,
			usePad: false,
			padLength: 0,
			original: value,
		}
	}
	const prefix = match[1] ?? ""
	const numericRaw = match[2]
	const suffix = match[3] ?? ""
	const numeric = numericRaw.replace(",", ".")
	const target = parseFloat(numeric) || 0
	const decimalPart = numeric.split(".")[1] ?? ""
	const decimals = decimalPart.length
	const intPart = (numeric.split(".")[0] ?? "").replace("-", "")
	const usePad = intPart.startsWith("0") && intPart.length > 1
	return {
		prefix,
		target,
		suffix,
		decimals,
		usePad,
		padLength: intPart.length,
		original: value,
	}
}

function CountUp({
	metric,
	inView,
	reduce,
	duration = 2.2,
}: {
	metric: ParsedMetric
	inView: boolean
	reduce: boolean
	duration?: number
}): ReactNode {
	const ref = useRef<HTMLSpanElement | null>(null)

	useEffect(() => {
		const el = ref.current
		if (!el || !inView) return

		const render = (v: number) => {
			let numeric: string
			if (metric.decimals > 0) {
				numeric = v.toFixed(metric.decimals)
			} else {
				numeric = Math.round(v).toString()
			}
			if (metric.usePad) numeric = numeric.padStart(metric.padLength, "0")
			el.textContent = `${metric.prefix}${numeric}${metric.suffix}`
		}

		if (reduce) {
			render(metric.target)
			return
		}

		const controls = animate(0, metric.target, {
			duration,
			ease: [0.33, 1, 0.68, 1],
			onUpdate: render,
		})
		return () => controls.stop()
	}, [metric, inView, reduce, duration])

	return <span ref={ref}>{metric.original}</span>
}

export function DetailMetrics({ caseStudy }: DetailMetricsProps): ReactNode {
	const reduce = useReducedMotion()
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "metrics")
	const gridRef = useRef<HTMLDivElement>(null)
	const inView = useInView(gridRef, { once: true, margin: "-80px" })

	const metrics = caseStudy.metrics.map((m) => ({
		...m,
		parsed: parseMetric(m.value),
	}))

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				variants={item}
				transition={itemTransition}
				className="mb-10 max-w-2xl sm:mb-12"
			>
				<Kicker>Resultados</Kicker>
				<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
				{headline.standfirst ? (
					<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
						{headline.standfirst}
					</p>
				) : null}
			</motion.div>

			<div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
				{metrics.map((metric, i) => (
					<motion.div
						key={metric.label}
						initial="hidden"
						whileInView="visible"
						viewport={viewport}
						variants={item}
						transition={{ ...itemTransition, delay: reduce ? 0 : 0.1 * i }}
						className="border-border bg-background relative flex flex-col gap-8 rounded-sm border p-6 sm:gap-10 sm:p-8"
					>
						{/* Restrained primary hairline */}
						<span aria-hidden="true" className="bg-primary absolute inset-x-0 top-0 h-0.5" />
						<span className="text-foreground block font-serif text-5xl leading-none font-normal tracking-[-0.02em] tabular-nums sm:text-6xl">
							<CountUp metric={metric.parsed} inView={inView} reduce={reduce} />
						</span>
						<div className="flex flex-col gap-2">
							<span className="text-foreground text-sm leading-snug font-medium sm:text-base">
								{metric.label}
							</span>
							{metric.caption ? (
								<span className="text-muted-foreground text-xs leading-relaxed">
									{metric.caption}
								</span>
							) : null}
						</div>
					</motion.div>
				))}
			</div>
		</section>
	)
}
