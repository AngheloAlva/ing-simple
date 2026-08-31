"use client"

import {
	AUDIT,
	DEVICES,
	OUTCOMES,
	PAGES,
	SITE,
	type Device,
	type Page,
	type Score,
} from "@/components/diagrams/site/data"
import { DATA_TRANSITION, EASE, GREEN, GREEN_TEXT } from "@/components/diagrams/visual/constants"
import { Figure } from "@/components/diagrams/visual/figure"
import { VisualFrame } from "@/components/diagrams/visual/frame"
import type { InputSpec } from "@/components/diagrams/visual/input-card"
import { Tile } from "@/components/diagrams/visual/tile"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
	ArrowRight,
	Check,
	Globe,
	Lock,
	Monitor,
	Mountain,
	Palette,
	Smartphone,
	Workflow,
} from "lucide-react"
import { motion } from "motion/react"
import { useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Desarrollo Web — a corporate site in production with the client's own
 * process built into it: the quote request that used to live in email and
 * WhatsApp is now a form that lands in the CRM with a response commitment.
 * The preview is navigable and reflows per device; the audit it ships with
 * and the business numbers sit next to it.
 * ------------------------------------------------------------------------ */

const INPUTS: InputSpec[] = [
	{ id: "brand", label: "Marca y contenido", meta: "Logo, textos, fotos", icon: Palette },
	{
		id: "process",
		label: "Tu proceso",
		meta: "Correo y WhatsApp",
		icon: Workflow,
	},
	{ id: "domain", label: "Dominio", meta: `${SITE.domain} · SSL`, icon: Globe },
]

const STAGE_MS = [600, 1350, 2100]

/* ------------------------------------ site -------------------------------- */

/** One block of the previewed site, entering in reading order. */
function Block({
	index,
	show,
	reduced,
	className,
	children,
}: {
	index: number
	show: boolean
	reduced: boolean
	className?: string
	children: ReactNode
}): ReactNode {
	return (
		<motion.div
			className={className}
			initial={reduced ? false : { opacity: 0, y: 6 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.08 }}
		>
			{children}
		</motion.div>
	)
}

function SiteInicio({
	mobile,
	show,
	reduced,
	onQuote,
}: {
	mobile: boolean
	show: boolean
	reduced: boolean
	onQuote: () => void
}): ReactNode {
	return (
		<div className="space-y-2.5">
			<Block index={1} show={show} reduced={reduced}>
				<div
					className={cn(
						"grid gap-2",
						mobile ? "grid-cols-1" : "grid-cols-[1.1fr_1fr] items-center"
					)}
				>
					<div>
						<p
							className={cn(
								"font-semibold tracking-tight text-balance",
								mobile ? "text-[12px]" : "text-[13px]"
							)}
						>
							{SITE.hero.title}
						</p>
						<p className="text-muted-foreground mt-1 text-[9px] leading-snug">{SITE.hero.text}</p>
						<button
							type="button"
							onClick={onQuote}
							className="focus-ring bg-primary text-primary-foreground mt-1.5 rounded-sm px-2 py-1 text-[9px] font-medium transition-opacity hover:opacity-90"
						>
							{SITE.hero.cta}
						</button>
					</div>
					<div
						className={cn(
							"bg-primary/10 text-primary flex items-center justify-center rounded-sm",
							mobile ? "h-12" : "h-16"
						)}
						aria-hidden="true"
					>
						<Mountain className="h-5 w-5" strokeWidth={1.5} />
					</div>
				</div>
			</Block>
			<Block index={2} show={show} reduced={reduced}>
				<div className={cn("grid gap-1.5", mobile ? "grid-cols-1" : "grid-cols-3")}>
					{SITE.tours.map((tour) => (
						<div
							key={tour.name}
							className="border-border hover:border-primary/60 rounded-sm border px-2 py-1.5 transition-colors"
						>
							<p className="truncate text-[9px] font-medium">{tour.name}</p>
							<p className="text-muted-foreground truncate text-[8px]">{tour.meta}</p>
						</div>
					))}
				</div>
			</Block>
		</div>
	)
}

function SiteTours({
	mobile,
	show,
	reduced,
}: {
	mobile: boolean
	show: boolean
	reduced: boolean
}): ReactNode {
	return (
		<div className="space-y-1.5">
			<Block index={1} show={show} reduced={reduced}>
				<p className="text-[12px] font-semibold tracking-tight">Tours</p>
			</Block>
			{SITE.tours.map((tour, i) => (
				<Block key={tour.name} index={i + 2} show={show} reduced={reduced}>
					<div className="border-border hover:border-primary/60 flex items-center gap-2 rounded-sm border px-2 py-1.5 transition-colors">
						<span
							className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-sm"
							aria-hidden="true"
						>
							<Mountain className="h-3 w-3" strokeWidth={1.5} />
						</span>
						<span className="min-w-0 flex-1">
							<span className="block truncate text-[9px] font-medium">{tour.name}</span>
							<span className="text-muted-foreground block truncate text-[8px]">{tour.meta}</span>
						</span>
						{!mobile && <span className="text-[9px] font-medium tabular-nums">{tour.price}</span>}
					</div>
				</Block>
			))}
		</div>
	)
}

function SiteCotizar({
	mobile,
	show,
	reduced,
	sent,
	onSend,
}: {
	mobile: boolean
	show: boolean
	reduced: boolean
	sent: boolean
	onSend: () => void
}): ReactNode {
	if (sent) {
		return (
			<motion.div
				className="flex h-full flex-col items-center justify-center text-center"
				initial={reduced ? false : { opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, ease: EASE }}
			>
				<span
					className="text-brand-green-foreground flex h-7 w-7 items-center justify-center rounded-full"
					style={{ background: GREEN }}
					aria-hidden="true"
				>
					<Check className="h-4 w-4" strokeWidth={2.5} />
				</span>
				<p className="mt-2 text-[11px] font-semibold">{SITE.quote.success}</p>
				<p className="text-muted-foreground mt-1 max-w-[220px] text-[9px] leading-snug">
					{SITE.quote.successText}
				</p>
			</motion.div>
		)
	}
	return (
		<div className="space-y-1.5">
			<Block index={1} show={show} reduced={reduced}>
				<p className="text-[12px] font-semibold tracking-tight">Cotiza tu tour</p>
			</Block>
			<div className={cn("grid gap-1.5", mobile ? "grid-cols-1" : "grid-cols-2")}>
				{SITE.quote.fields.map((field, i) => (
					<Block key={field} index={i + 2} show={show} reduced={reduced}>
						<div className="border-border bg-muted/30 rounded-sm border px-2 py-1">
							<p className="text-muted-foreground text-[8px]">{field}</p>
							<p className="h-2.5" />
						</div>
					</Block>
				))}
			</div>
			<Block index={6} show={show} reduced={reduced}>
				<button
					type="button"
					onClick={onSend}
					className="focus-ring bg-primary text-primary-foreground w-full rounded-sm py-1.5 text-[9px] font-medium transition-opacity hover:opacity-90"
				>
					{SITE.quote.submit}
				</button>
			</Block>
		</div>
	)
}

/* ----------------------------------- audit -------------------------------- */

function ScoreRing({
	score,
	show,
	reduced,
	index,
}: {
	score: Score
	show: boolean
	reduced: boolean
	index: number
}): ReactNode {
	return (
		<motion.div
			className="flex flex-col items-center"
			initial={reduced ? false : { opacity: 0, y: 6 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.08 }}
		>
			<div className="relative h-10 w-10 shrink-0">
				<svg viewBox="0 0 40 40" className="h-full w-full -rotate-90" aria-hidden="true">
					<circle cx={20} cy={20} r={16} stroke="var(--border)" strokeWidth={3} fill="none" />
					<motion.circle
						cx={20}
						cy={20}
						r={16}
						stroke={GREEN}
						strokeWidth={3}
						strokeLinecap="round"
						fill="none"
						pathLength={1}
						strokeDasharray="1 1"
						initial={{ strokeDashoffset: 1 }}
						animate={{ strokeDashoffset: show ? 1 - score.value / 100 : 1 }}
						transition={{
							...DATA_TRANSITION,
							duration: reduced ? 0 : 0.9,
							delay: reduced ? 0 : 0.1 + index * 0.08,
						}}
					/>
				</svg>
				<span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums">
					<Figure
						value={score.value}
						format={(v) => `${Math.round(v)}`}
						active={show}
						reduced={reduced}
					/>
				</span>
			</div>
			<p className="text-muted-foreground mt-1 text-[10px] font-medium">{score.name}</p>
		</motion.div>
	)
}

/* --------------------------------- solution ------------------------------- */

const DEVICE_ICONS = { Escritorio: Monitor, Móvil: Smartphone } as const

export function WebSolution(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)

	const [device, setDevice] = useState<Device>("Escritorio")
	const [page, setPage] = useState<Page>("Inicio")
	const [sent, setSent] = useState(false)

	const mobile = device === "Móvil"
	const audit = AUDIT[device]
	const showSite = stage >= 1
	const showAudit = stage >= 2
	const showOutcomes = stage >= 3

	const goTo = (next: Page) => {
		setPage(next)
		setSent(false)
	}

	const path = page === "Inicio" ? "" : page.toLowerCase()

	return (
		<VisualFrame
			containerRef={ref}
			inputs={INPUTS}
			stage={stage}
			reduced={reduced}
			title={`${SITE.brand} · sitio + cotizador`}
			subtitle={`${SITE.domain} · Next.js · en producción`}
			status={
				<div className="flex shrink-0 items-center gap-1" role="group" aria-label="Vista">
					{DEVICES.map((d) => {
						const Icon = DEVICE_ICONS[d]
						return (
							<Tile
								key={d}
								active={d === device}
								onClick={() => setDevice(d)}
								className="flex items-center gap-1.5 px-2"
							>
								<Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
								{d}
							</Tile>
						)
					})}
				</div>
			}
		>
			<div className="space-y-3 p-3">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
					{/* Browser preview */}
					<div className="border-border flex flex-col overflow-hidden rounded-sm border">
						<div className="border-border bg-muted/30 flex items-center gap-2 border-b px-2 py-1.5">
							<Lock className="text-muted-foreground h-2.5 w-2.5" aria-hidden="true" />
							<span className="text-muted-foreground truncate text-[9px] tabular-nums">
								{SITE.domain}/{path}
							</span>
						</div>
						<div className="bg-muted/20 flex flex-1 items-start justify-center p-2">
							<motion.div
								key={`${device}-${page}`}
								className={cn(
									"bg-background border-border flex min-h-[214px] flex-col rounded-sm border",
									mobile ? "w-[168px]" : "w-full"
								)}
								initial={reduced ? false : { opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, ease: EASE }}
							>
								<Block index={0} show={showSite} reduced={reduced}>
									<nav
										className="border-border flex items-center justify-between border-b px-2.5 py-1.5"
										aria-label={`Navegación de ${SITE.brand}`}
									>
										<span className="flex items-center gap-1 text-[9px] font-semibold">
											<Mountain
												className="text-primary h-3 w-3"
												strokeWidth={2}
												aria-hidden="true"
											/>
											{!mobile && SITE.brand}
										</span>
										<span className={cn("flex", mobile ? "gap-2" : "gap-2.5")}>
											{PAGES.map((item) => (
												<button
													key={item}
													type="button"
													aria-current={item === page ? "page" : undefined}
													onClick={() => goTo(item)}
													className={cn(
														"focus-ring text-[8px] underline decoration-1 underline-offset-2 transition-colors",
														item === page
															? "text-foreground decoration-primary font-medium"
															: "text-muted-foreground decoration-muted-foreground/50 hover:text-foreground hover:decoration-primary"
													)}
												>
													{item}
												</button>
											))}
										</span>
									</nav>
								</Block>
								<div className="flex-1 p-2.5">
									{page === "Inicio" && (
										<SiteInicio
											mobile={mobile}
											show={showSite}
											reduced={reduced}
											onQuote={() => goTo("Cotizar")}
										/>
									)}
									{page === "Tours" && (
										<SiteTours mobile={mobile} show={showSite} reduced={reduced} />
									)}
									{page === "Cotizar" && (
										<SiteCotizar
											mobile={mobile}
											show={showSite}
											reduced={reduced}
											sent={sent}
											onSend={() => setSent(true)}
										/>
									)}
								</div>
							</motion.div>
						</div>
					</div>

					{/* Audit */}
					<div className="border-border rounded-sm border p-3">
						<div className="flex items-center justify-between text-[11px]">
							<p className="font-medium">Auditoría</p>
							<p className="text-muted-foreground text-[10px]">{device}</p>
						</div>
						<div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2.5">
							{audit.scores.map((score, i) => (
								<ScoreRing
									key={`${device}-${score.name}`}
									score={score}
									show={showAudit}
									reduced={reduced}
									index={i}
								/>
							))}
						</div>
						<p className="text-muted-foreground mt-3 text-[10px] font-medium tracking-wide">
							Web Vitals
						</p>
						<div className="mt-1.5 grid grid-cols-3 gap-1.5">
							{audit.vitals.map((vital, i) => (
								<motion.div
									key={`${device}-${vital.name}`}
									className="border-border rounded-sm border px-2 py-1.5"
									initial={reduced ? false : { opacity: 0, y: 6 }}
									animate={showAudit ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
									transition={{
										duration: reduced ? 0 : 0.35,
										ease: EASE,
										delay: reduced ? 0 : 0.4 + i * 0.08,
									}}
								>
									<p className="text-muted-foreground text-[9px]">{vital.name}</p>
									<p
										className="text-[11px] font-semibold tabular-nums"
										style={vital.ok ? { color: GREEN_TEXT } : {}}
									>
										{vital.value}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* What changed for the business: the old site against the new one */}
				<div className="border-border rounded-sm border p-2.5">
					<div className="flex items-center justify-between px-0.5 text-[11px]">
						<p className="font-medium">Resultados del cambio</p>
						<p className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
							Sitio anterior
							<ArrowRight className="h-3 w-3" aria-hidden="true" />
							<span className="font-medium" style={{ color: GREEN_TEXT }}>
								Sitio nuevo
							</span>
						</p>
					</div>
					<div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
						{OUTCOMES.map((outcome, i) => (
							<motion.div
								key={outcome.label}
								className="bg-muted/30 min-w-0 rounded-sm px-2.5 py-2"
								initial={reduced ? false : { opacity: 0, y: 6 }}
								animate={showOutcomes ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
								transition={{
									duration: reduced ? 0 : 0.35,
									ease: EASE,
									delay: reduced ? 0 : i * 0.09,
								}}
							>
								<p className="text-muted-foreground truncate text-[10px] font-medium tracking-wide">
									{outcome.label}
								</p>
								<div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
									<span className="min-w-0">
										<span className="text-muted-foreground block text-[8px] tracking-wide uppercase">
											Antes
										</span>
										<span className="text-muted-foreground block truncate text-[12px] font-medium tabular-nums">
											{outcome.before}
										</span>
									</span>
									<ArrowRight className="text-muted-foreground h-3 w-3" aria-hidden="true" />
									<span className="min-w-0">
										<span className="text-muted-foreground block text-[8px] tracking-wide uppercase">
											Ahora
										</span>
										<span
											className="block truncate text-sm font-semibold tabular-nums"
											style={{ color: GREEN_TEXT }}
										>
											{showOutcomes ? (
												<Figure
													value={outcome.after}
													format={outcome.format}
													active={showOutcomes}
													reduced={reduced}
												/>
											) : (
												"—"
											)}
										</span>
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</VisualFrame>
	)
}
