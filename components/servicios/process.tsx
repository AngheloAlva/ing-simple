"use client"

import { Kicker } from "@/components/corner-plus"
import { FallbackPanel, PROCESS_PANELS } from "@/components/servicios/process-panels"
import { softEase, useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import type { ServiceStep } from "@/lib/services"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Cómo trabajamos — the mirror of Anatomy: the artefact on the left, the
 * steps on the right. Each step is a tab; picking one crossfades the panel.
 * Nothing advances on its own, so the page alternates between a section
 * that moves by itself and one that waits for the visitor.
 * ------------------------------------------------------------------------ */

/** Frame height on lg: fixed so the section never jumps between panels. */
const FRAME_HEIGHT_CLASS = "lg:h-[400px]"

function pad(index: number): string {
	return String(index + 1).padStart(2, "0")
}

export function ServicioProcess({
	slug,
	steps,
}: {
	slug: string
	steps: ServiceStep[]
}): ReactNode {
	const reduced = useReducedMotion()
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	const [activeIndex, setActiveIndex] = useState(0)
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

	const pick = useCallback(
		(index: number, focus = false) => {
			const next = ((index % steps.length) + steps.length) % steps.length
			setActiveIndex(next)
			if (focus) tabRefs.current[next]?.focus()
		},
		[steps.length]
	)

	const onTabKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, index: number) => {
			const handlers: Record<string, () => void> = {
				ArrowDown: () => pick(index + 1, true),
				ArrowUp: () => pick(index - 1, true),
				Home: () => pick(0, true),
				End: () => pick(steps.length - 1, true),
			}
			const handler = handlers[event.key]
			if (handler === undefined) return
			event.preventDefault()
			handler()
		},
		[pick, steps.length]
	)

	const active = steps[activeIndex]
	if (active === undefined) return null

	const Panel = PROCESS_PANELS[slug]?.[activeIndex]

	const quick = { duration: 0.01 }
	const fade = reduced ? quick : { duration: 0.3, ease: softEase }
	const expand = reduced ? quick : { duration: 0.3, ease: softEase }
	const panelId = `process-panel-${slug}`

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div variants={container} initial="hidden" whileInView="visible" viewport={viewport}>
				{/* Heading */}
				<div className="max-w-2xl">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>Cómo trabajamos</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						Un proceso claro,{" "}
						<span className="font-sans font-semibold tracking-tight">sin sorpresas</span>
					</motion.h2>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base"
					>
						Las mismas cinco etapas en cada proyecto. Elige una y mira qué pasa en ella.
					</motion.p>
				</div>

				{/* Body: panel left, steps right */}
				<div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:items-start lg:gap-12">
					<motion.div variants={item} transition={itemTransition} className="min-w-0">
						<div
							className={cn(
								"border-border bg-background text-foreground flex flex-col overflow-hidden rounded-sm border shadow-xl shadow-black/6",
								FRAME_HEIGHT_CLASS
							)}
						>
							<div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-3.5 py-2.5">
								<p className="truncate text-[11px] font-medium tabular-nums">
									<span className="text-primary">Paso {pad(activeIndex)}</span>
									<span className="text-muted-foreground"> · </span>
									{active.title}
								</p>
								<span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
									{activeIndex + 1} / {steps.length}
								</span>
							</div>
							<div
								id={panelId}
								role="tabpanel"
								aria-labelledby={`process-tab-${slug}-${activeIndex}`}
								className="relative min-h-0 flex-1"
							>
								<AnimatePresence mode="popLayout" initial={false}>
									<motion.div
										key={activeIndex}
										initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
										transition={fade}
										className="h-full p-4 sm:p-5"
									>
										{Panel ? <Panel /> : <FallbackPanel steps={steps} active={activeIndex} />}
									</motion.div>
								</AnimatePresence>
							</div>
						</div>
					</motion.div>

					<div
						role="tablist"
						aria-orientation="vertical"
						aria-label="Etapas del proceso"
						className="border-border border-b"
					>
						{steps.map((step, index) => {
							const isActive = index === activeIndex
							const tabId = `process-tab-${slug}-${index}`
							return (
								<motion.div
									key={step.title}
									variants={item}
									transition={itemTransition}
									className={cn(
										"border-border relative border-t border-l-2 transition-colors duration-200",
										isActive ? "border-l-primary" : "border-l-transparent"
									)}
								>
									<button
										ref={(el) => {
											tabRefs.current[index] = el
										}}
										type="button"
										role="tab"
										id={tabId}
										aria-selected={isActive}
										aria-controls={panelId}
										tabIndex={isActive ? 0 : -1}
										onClick={() => pick(index)}
										onKeyDown={(event) => onTabKeyDown(event, index)}
										className="focus-ring group flex w-full flex-col items-start gap-1 py-4 pr-2 pl-4 text-left"
									>
										<span
											className={cn(
												"text-[11px] font-medium tracking-wide uppercase tabular-nums transition-colors duration-200",
												isActive ? "text-primary" : "text-muted-foreground"
											)}
										>
											Paso {pad(index)}
										</span>
										<span
											className={cn(
												"text-base font-medium tracking-tight transition-colors duration-200",
												isActive
													? "text-foreground"
													: "text-muted-foreground group-hover:text-foreground"
											)}
										>
											{step.title}
										</span>
									</button>

									<AnimatePresence initial={false}>
										{isActive && (
											<motion.div
												key="desc"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={expand}
												className="overflow-hidden"
											>
												<p className="text-muted-foreground max-w-md pr-4 pb-4 pl-4 text-sm leading-relaxed">
													{step.desc}
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							)
						})}
					</div>
				</div>
			</motion.div>
		</section>
	)
}
