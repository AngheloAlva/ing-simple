"use client"

import { animate, motion } from "motion/react"
import { useEffect, useRef } from "react"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyMetricsProps {
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

function CountUp({ metric, duration = 2.2 }: { metric: ParsedMetric; duration?: number }) {
	const ref = useRef<HTMLSpanElement | null>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const controls = animate(0, metric.target, {
			duration,
			ease: [0.33, 1, 0.68, 1],
			onUpdate: (v) => {
				let numeric: string
				if (metric.decimals > 0) {
					numeric = v.toFixed(metric.decimals)
				} else {
					numeric = Math.round(v).toString()
				}
				if (metric.usePad) numeric = numeric.padStart(metric.padLength, "0")
				el.textContent = `${metric.prefix}${numeric}${metric.suffix}`
			},
		})
		return () => controls.stop()
	}, [metric, duration])

	return <span ref={ref}>{metric.original}</span>
}

const palette = [
	{ bg: "#00B8A3", fg: "#1C3835" },
	{ bg: "#000C8F", fg: "#808AFF" },
	{ bg: "#0090B8", fg: "#1C3238" },
	{ bg: "#00668F", fg: "#80DBFF" },
]

export function CaseStudyMetrics({ caseStudy }: CaseStudyMetricsProps) {
	const metrics = caseStudy.metrics.map((m) => ({ ...m, parsed: parseMetric(m.value) }))

	return (
		<section className="bg-background flex w-full items-start px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-12 max-w-2xl sm:mb-16">
					<motion.span
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4 }}
						className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
					>
						07 — Cómo impacta hoy
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-foreground mt-4 text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl md:text-6xl"
					>
						La plataforma <em className="font-serif italic">en operación</em>
					</motion.h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
					{metrics.map((metric, i) => {
						const color = palette[i % palette.length]!
						return (
							<motion.div
								key={metric.label}
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 * i }}
								whileHover={{ y: -4 }}
								className="flex min-h-70 flex-col justify-between rounded-2xl p-6 sm:min-h-85 sm:p-8"
								style={{ backgroundColor: color.bg, color: color.fg }}
							>
								<span className="text-4xl font-medium tracking-tight tabular-nums sm:text-5xl md:text-6xl">
									<CountUp metric={metric.parsed} />
								</span>
								<div className="flex flex-col gap-2">
									<span className="text-sm leading-snug font-medium sm:text-base">
										{metric.label}
									</span>
									{metric.caption && (
										<span className="text-xs leading-relaxed opacity-70">{metric.caption}</span>
									)}
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
