"use client"

import { Activity, Code2, Handshake, Rocket, TestTube, type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
	motion,
	useTransform,
	useMotionValue,
	useMotionValueEvent,
	type MotionValue,
} from "motion/react"

import type { CaseStudy, CaseStudyMilestone, CaseStudyMilestoneIcon } from "@/lib/portfolio-data"

interface CaseStudyTimelineProps {
	caseStudy: CaseStudy
}

const ICON_MAP: Record<CaseStudyMilestoneIcon, LucideIcon> = {
	kickoff: Handshake,
	build: Code2,
	beta: TestTube,
	launch: Rocket,
	current: Activity,
}

function Node({
	progress,
	at,
	Icon,
	isCurrent,
}: {
	progress: MotionValue<number>
	at: number
	Icon: LucideIcon
	isCurrent: boolean
}) {
	const start = Math.max(0, at - 0.12)
	const mid = Math.min(1, at + 0.02)
	const scale = useTransform(progress, [start, mid], [0.6, 1])
	const opacity = useTransform(progress, [start, mid], [0.25, 1])
	const ringOpacity = useTransform(progress, [start, mid], [0, 1])
	const [reached, setReached] = useState(false)

	useMotionValueEvent(progress, "change", (v) => {
		setReached(v >= mid - 0.001)
	})

	return (
		<div className="relative grid place-items-center">
			<span className="bg-background absolute h-14 w-14 rounded-full" />
			<motion.span
				style={{ opacity: ringOpacity }}
				className="ring-muted absolute h-14 w-14 rounded-full ring-[6px]"
			/>
			{(reached || isCurrent) && (
				<motion.span
					aria-hidden
					className={`absolute h-12 w-12 rounded-full ${isCurrent ? "bg-accent" : "bg-ring"}`}
					initial={{ scale: 1, opacity: 0.5 }}
					animate={{ scale: 1.8, opacity: 0 }}
					transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
				/>
			)}
			<motion.span
				style={{ scale, opacity }}
				animate={
					reached
						? isCurrent
							? { backgroundColor: "var(--accent)", color: "#ffffff" }
							: { backgroundColor: "var(--ring)", color: "#ffffff" }
						: {}
				}
				transition={{ duration: 0.35 }}
				className="bg-foreground text-background relative grid h-12 w-12 place-items-center rounded-full"
			>
				<Icon className="h-5 w-5" />
			</motion.span>
		</div>
	)
}

function Card({ milestone }: { milestone: CaseStudyMilestone }) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-20%" }}
			transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			className="border-border bg-background w-full overflow-hidden rounded-2xl border p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] sm:p-6"
		>
			<span className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
				{milestone.date}
			</span>
			<h3 className="text-foreground mt-2 text-base font-semibold sm:text-lg">{milestone.title}</h3>
			<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{milestone.description}</p>
		</motion.article>
	)
}

export function CaseStudyTimeline({ caseStudy }: CaseStudyTimelineProps) {
	const timeline = caseStudy.timeline
	const ref = useRef<HTMLDivElement>(null)
	const firstNodeRef = useRef<HTMLDivElement>(null)
	const lastNodeRef = useRef<HTMLDivElement>(null)
	const scrollYProgress = useMotionValue(0)
	const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 })

	useEffect(() => {
		const el = ref.current
		if (!el) return
		let raf = 0
		const tick = () => {
			const container = ref.current
			const first = firstNodeRef.current
			const last = lastNodeRef.current
			if (container && first && last) {
				const win = container.ownerDocument.defaultView ?? window
				const vh = win.innerHeight || container.ownerDocument.documentElement.clientHeight
				const containerRect = container.getBoundingClientRect()
				const firstRect = first.getBoundingClientRect()
				const lastRect = last.getBoundingClientRect()
				const firstCenterY = firstRect.top + firstRect.height / 2
				const lastCenterY = lastRect.top + lastRect.height / 2
				const activate = vh * 0.55
				const span = lastCenterY - firstCenterY
				if (span > 0) {
					const p = (activate - firstCenterY) / span
					scrollYProgress.set(Math.min(1, Math.max(0, p)))
				}
				const top = firstCenterY - containerRect.top
				const height = lastCenterY - firstCenterY
				setLineBounds((prev) =>
					prev.top === top && prev.height === height ? prev : { top, height }
				)
			}
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [scrollYProgress])

	const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

	if (!timeline || timeline.length === 0) return null

	return (
		<section className="bg-muted/40 relative flex w-full items-start overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
				<motion.span
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
				>
					06 — Línea de tiempo
				</motion.span>

				<motion.h2
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-foreground mt-4 max-w-xl text-center text-3xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl"
				>
					Del kickoff a hoy
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 8 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-muted-foreground mt-5 max-w-sm text-center text-base"
				>
					Tres meses de desarrollo, visitas en planta y más de un año en producción continua.
				</motion.p>

				<div ref={ref} className="relative mt-16 w-full sm:mt-24">
					<div
						aria-hidden
						style={{ top: lineBounds.top, height: lineBounds.height }}
						className="border-border absolute left-1/2 w-px -translate-x-1/2 border-l border-dashed"
					/>
					<motion.div
						aria-hidden
						style={{
							top: lineBounds.top,
							height: lineBounds.height,
							scaleY: lineScale,
							transformOrigin: "top",
						}}
						className="bg-ring absolute left-1/2 w-px -translate-x-1/2"
					/>

					<div className="flex flex-col gap-12 sm:gap-16">
						{timeline.map((milestone, i) => {
							const Icon = ICON_MAP[milestone.icon]
							const side: "left" | "right" = i % 2 === 0 ? "left" : "right"
							const at = i / Math.max(1, timeline.length - 1)
							const isFirst = i === 0
							const isLast = i === timeline.length - 1
							return (
								<div
									key={`${milestone.date}-${milestone.title}`}
									className="relative flex flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-8 lg:gap-x-12"
								>
									<div className="hidden md:col-start-1 md:block">
										{side === "left" && <Card milestone={milestone} />}
									</div>
									<div
										ref={isFirst ? firstNodeRef : isLast ? lastNodeRef : undefined}
										className="relative z-10 md:col-start-2"
									>
										<Node
											progress={scrollYProgress}
											at={at}
											Icon={Icon}
											isCurrent={!!milestone.isCurrent}
										/>
									</div>
									<div className="hidden md:col-start-3 md:block">
										{side === "right" && <Card milestone={milestone} />}
									</div>
									<div className="mt-6 w-full md:hidden">
										<Card milestone={milestone} />
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
