"use client"

import { Kicker } from "@/components/corner-plus"
import { PanelReportability } from "@/components/panels/reportability"
import { softEase, useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Anatomía de un dashboard — the report on the right, its zones listed on
 * the left. A highlight box frames the active zone over the report. The
 * active zone advances on its own every few seconds until the visitor picks
 * one; then the tour is theirs.
 * ------------------------------------------------------------------------ */

const AUTOPLAY_MS = 5000

type Zone = {
	id: string
	label: string
	title: string
	desc: string
	/** Highlight box over the report body, in percentages (lg viewports). */
	box: { top: string; left: string; width: string; height: string }
}

const ZONES: Zone[] = [
	{
		id: "kpis",
		label: "KPIs",
		title: "Indicadores ejecutivos de un vistazo",
		desc: "Los números que la gerencia necesita, arriba y sin buscar: plan, gestión, desviación y proyección. Definimos contigo cuáles son y contra qué meta se comparan.",
		box: { top: "8.5%", left: "1.2%", width: "97.5%", height: "14.6%" },
	},
	{
		id: "tendencia",
		label: "Tendencia",
		title: "La historia detrás del número",
		desc: "Plan vs. gestión mes a mes, con proyección al cierre. No solo cuánto llevas: hacia dónde vas si nada cambia. Ideal para anticiparse, no para lamentarse.",
		box: { top: "23.6%", left: "1.2%", width: "65%", height: "38.2%" },
	},
	{
		id: "desviaciones",
		label: "Desviaciones",
		title: "Dónde se abre la brecha",
		desc: "El puente plan → gestión muestra qué áreas explican la diferencia y cuánto aporta cada una. Se acabó el 'ver quién sabe por qué estamos abajo'.",
		box: { top: "23.6%", left: "66.3%", width: "32.5%", height: "38.2%" },
	},
	{
		id: "detalle",
		label: "Detalle",
		title: "Del resumen al detalle en un click",
		desc: "Cada área con su ejecución y desviación. Los tableros se navegan con drill-down: partes en la foto general y llegas a la fila que explica el problema.",
		box: { top: "62.3%", left: "1.2%", width: "97.5%", height: "36%" },
	},
	{
		id: "filtros",
		label: "Filtros",
		title: "Una fuente, muchas vistas",
		desc: "Escenario, período, área: cada persona filtra el mismo modelo de datos y ve su versión, sin duplicar planillas ni pedirle el archivo a nadie.",
		box: { top: "0.6%", left: "0.6%", width: "98.8%", height: "5.6%" },
	},
]

function ReportStatus(): ReactNode {
	return (
		<div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-[10px] font-medium">
			<span
				className="h-1.5 w-1.5 rounded-full"
				style={{ background: "var(--brand-green)" }}
				aria-hidden="true"
			/>
			<span>Actualizado hace 5 min</span>
		</div>
	)
}

/** The hero's frame dialect: hairline border, small radius, soft shadow. */
function ReportFrame({
	title,
	subtitle,
	status,
	children,
}: {
	title: string
	subtitle: string
	status: ReactNode
	children: ReactNode
}): ReactNode {
	return (
		<div className="border-border bg-background text-foreground overflow-hidden rounded-sm border shadow-xl shadow-black/6">
			<div className="border-border flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-3.5 py-2.5">
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold tracking-tight">{title}</p>
					<p className="text-muted-foreground truncate text-[10px]">{subtitle}</p>
				</div>
				{status}
			</div>
			{children}
		</div>
	)
}

export function ModuleAnatomy(): ReactNode {
	const reduced = useReducedMotion()
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	const [activeIndex, setActiveIndex] = useState(0)
	const [userPicked, setUserPicked] = useState(false)
	const listRef = useRef<HTMLDivElement | null>(null)
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
	const inView = useInView(listRef, { amount: 0.6 })

	const active = ZONES[activeIndex] ?? (ZONES[0] as Zone)
	const autoplay = !reduced && !userPicked && inView

	// Auto-advance while the visitor has not picked a zone and the zone list is
	// mostly on screen. Re-arms on every change of the active zone so the bar and the
	// timer share the same clock.
	useEffect(() => {
		if (!autoplay) return
		const id = window.setTimeout(() => {
			setActiveIndex((i) => (i + 1) % ZONES.length)
		}, AUTOPLAY_MS)
		return () => window.clearTimeout(id)
	}, [autoplay, activeIndex])

	const pick = useCallback((index: number, focus = false) => {
		const next = ((index % ZONES.length) + ZONES.length) % ZONES.length
		setUserPicked(true)
		setActiveIndex(next)
		if (focus) tabRefs.current[next]?.focus()
	}, [])

	const onTabKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, index: number) => {
			const handlers: Record<string, () => void> = {
				ArrowDown: () => pick(index + 1, true),
				ArrowUp: () => pick(index - 1, true),
				Home: () => pick(0, true),
				End: () => pick(ZONES.length - 1, true),
			}
			const handler = handlers[event.key]
			if (handler === undefined) return
			event.preventDefault()
			handler()
		},
		[pick]
	)

	const quick = { duration: 0.01 }
	const fade = reduced ? quick : { duration: 0.35, ease: softEase }
	const expand = reduced ? quick : { duration: 0.3, ease: softEase }

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-12"
			>
				{/* Heading */}
				<div className="order-1 lg:col-start-1 lg:row-start-1">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>Anatomía de un dashboard</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						Recorre un tablero real,{" "}
						<span className="font-sans font-semibold tracking-tight">pieza por pieza</span>
					</motion.h2>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base"
					>
						Este es el tipo de reporte que construimos. Explora cada zona y mira qué resuelve.
					</motion.p>
				</div>

				{/* Report */}
				<motion.div
					variants={item}
					transition={itemTransition}
					className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
				>
					<ReportFrame
						title="Ejecución presupuestaria"
						subtitle="Power BI · Ejercicio 2026 · CLP MM"
						status={<ReportStatus />}
					>
						<div className="relative">
							<PanelReportability />

							{/* Zone highlight — desktop only; percentages track the lg layout */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 hidden lg:block"
							>
								<AnimatePresence initial={false}>
									<motion.div
										key={active.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={fade}
										className="border-primary/70 bg-primary/[0.04] absolute border-2"
										style={active.box}
									>
										<span className="border-primary absolute -top-px -left-px h-2 w-2 border-t-2 border-l-2" />
										<span className="border-primary absolute -top-px -right-px h-2 w-2 border-t-2 border-r-2" />
										<span className="border-primary absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2" />
										<span className="border-primary absolute -right-px -bottom-px h-2 w-2 border-r-2 border-b-2" />
									</motion.div>
								</AnimatePresence>
							</div>
						</div>
					</ReportFrame>
				</motion.div>

				{/* Zones */}
				<motion.div
					variants={item}
					transition={itemTransition}
					ref={listRef}
					role="tablist"
					aria-orientation="vertical"
					aria-label="Zonas del dashboard"
					className="border-border order-3 border-b lg:col-start-1 lg:row-start-2"
				>
					{ZONES.map((zone, index) => {
						const isActive = index === activeIndex
						const tabId = `anatomy-tab-${zone.id}`
						const panelId = `anatomy-panel-${zone.id}`
						return (
							<div
								key={zone.id}
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
										{String(index + 1).padStart(2, "0")} · {zone.label}
									</span>
									<span
										className={cn(
											"text-base font-medium tracking-tight transition-colors duration-200",
											isActive
												? "text-foreground"
												: "text-muted-foreground group-hover:text-foreground"
										)}
									>
										{zone.title}
									</span>
								</button>

								<AnimatePresence initial={false}>
									{isActive && (
										<motion.div
											key="desc"
											id={panelId}
											role="tabpanel"
											aria-labelledby={tabId}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={expand}
											className="overflow-hidden"
										>
											<p className="text-muted-foreground max-w-md pr-4 pb-4 pl-4 text-sm leading-relaxed">
												{zone.desc}
											</p>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Autoplay cue: fills over the dwell time, gone once the visitor picks. */}
								{autoplay && isActive ? (
									<motion.span
										key={zone.id}
										aria-hidden="true"
										className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 origin-left"
										initial={{ scaleX: 0 }}
										animate={{ scaleX: 1 }}
										transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
									/>
								) : null}
							</div>
						)
					})}
				</motion.div>
			</motion.div>
		</section>
	)
}
