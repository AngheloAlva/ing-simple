"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { Kicker } from "@/components/corner-plus"
import type { CaseStudy, CaseStudyMilestone, CaseStudyMilestoneIcon } from "@/lib/portfolio-data"
import { useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { Activity, Code2, Handshake, Rocket, TestTube, type LucideIcon } from "lucide-react"
import {
	motion,
	useInView,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
	type MotionValue,
} from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

interface DetailTimelineProps {
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
	reduce,
}: {
	progress: MotionValue<number>
	at: number
	Icon: LucideIcon
	isCurrent: boolean
	reduce: boolean
}): ReactNode {
	const start = Math.max(0, at - 0.12)
	const mid = Math.min(1, at + 0.02)
	const scale = useTransform(progress, [start, mid], [0.6, 1])
	const opacity = useTransform(progress, [start, mid], [0.25, 1])
	const [reached, setReached] = useState(false)

	useMotionValueEvent(progress, "change", (v) => {
		setReached(v >= mid - 0.001)
	})

	const isActive = reduce || reached || isCurrent
	// Green appears once on the page: the node that marks "today".
	const activeClass = isCurrent
		? "bg-brand-green text-primary-foreground"
		: "bg-primary text-primary-foreground"

	return (
		<div className="relative grid place-items-center">
			{/* Mask so the rail does not show through the node */}
			<span className="bg-background absolute h-14 w-14 rounded-sm" />
			<span className="border-border absolute h-14 w-14 rounded-sm border" />
			{isActive && !reduce ? (
				<motion.span
					aria-hidden="true"
					className={`absolute h-12 w-12 rounded-sm ${isCurrent ? "bg-brand-green" : "bg-primary"}`}
					initial={{ scale: 1, opacity: 0.4 }}
					animate={{ scale: 1.8, opacity: 0 }}
					transition={{
						duration: 1.6,
						repeat: isCurrent ? Infinity : 0,
						ease: "easeOut",
					}}
				/>
			) : null}
			<motion.span
				{...(reduce ? {} : { style: { scale, opacity } })}
				transition={{ duration: 0.35 }}
				className={`relative grid h-12 w-12 place-items-center rounded-sm transition-colors duration-300 ${
					isActive ? activeClass : "bg-foreground text-background"
				}`}
			>
				<Icon className="h-5 w-5" aria-hidden="true" />
			</motion.span>
		</div>
	)
}

function Card({ milestone }: { milestone: CaseStudyMilestone }): ReactNode {
	const { item, itemTransition, viewport } = useStaggerEntrance()
	return (
		<motion.article
			initial="hidden"
			whileInView="visible"
			viewport={viewport}
			variants={item}
			transition={itemTransition}
			className="border-border bg-background w-full rounded-sm border p-5 sm:p-6"
		>
			<span className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
				{milestone.date}
			</span>
			<h3 className="text-foreground mt-2 text-base font-semibold tracking-tight sm:text-lg">
				{milestone.title}
			</h3>
			<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{milestone.description}</p>
		</motion.article>
	)
}

export function DetailTimeline({ caseStudy }: DetailTimelineProps): ReactNode {
	const timeline = caseStudy.timeline
	const reduce = useReducedMotion()
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "timeline")
	const ref = useRef<HTMLDivElement>(null)
	const firstNodeRef = useRef<HTMLDivElement>(null)
	const lastNodeRef = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { margin: "-10% 0px" })
	const scrollYProgress = useMotionValue(0)
	const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 })

	useEffect(() => {
		const measure = () => {
			const container = ref.current
			const first = firstNodeRef.current
			const last = lastNodeRef.current
			if (!container || !first || !last) return
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
				scrollYProgress.set(reduce ? 1 : Math.min(1, Math.max(0, p)))
			}
			const top = firstCenterY - containerRect.top
			const height = lastCenterY - firstCenterY
			setLineBounds((prev) => (prev.top === top && prev.height === height ? prev : { top, height }))
		}

		// Reduced motion: final state, measured once and on resize, no loop.
		if (reduce) {
			measure()
			window.addEventListener("resize", measure)
			return () => window.removeEventListener("resize", measure)
		}

		// The loop only runs while the section is on screen.
		if (!inView) return

		let raf = 0
		const tick = () => {
			measure()
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [scrollYProgress, reduce, inView])

	const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

	if (!timeline || timeline.length === 0) return null

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="relative mx-auto flex w-full flex-col items-center">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={item}
					transition={itemTransition}
					className="flex flex-col items-center text-center"
				>
					<Kicker>Línea de tiempo</Kicker>
					<DetailH2 lead={headline.lead} emphasis={headline.emphasis} className="text-center" />
					{headline.standfirst ? (
						<p className="text-muted-foreground mt-4 max-w-md text-center text-sm leading-relaxed sm:text-base">
							{headline.standfirst}
						</p>
					) : null}
				</motion.div>

				<div ref={ref} className="relative mt-16 w-full sm:mt-24">
					<div
						aria-hidden="true"
						style={{ top: lineBounds.top, height: lineBounds.height }}
						className="border-border absolute left-1/2 w-px -translate-x-1/2 border-l border-dashed"
					/>
					<motion.div
						aria-hidden="true"
						style={{
							top: lineBounds.top,
							height: lineBounds.height,
							scaleY: reduce ? 1 : lineScale,
							transformOrigin: "top",
						}}
						className="bg-primary absolute left-1/2 w-px -translate-x-1/2"
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
										{side === "left" ? <Card milestone={milestone} /> : null}
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
											reduce={reduce}
										/>
									</div>
									<div className="hidden md:col-start-3 md:block">
										{side === "right" ? <Card milestone={milestone} /> : null}
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
