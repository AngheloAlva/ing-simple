"use client"

import { Kicker } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion, useInView, type Variants } from "motion/react"
import { Eye, History, Layout, Tag } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Desarrollo Web — the module that shows what "a medida" actually means. A
 * process described in the client's own words is broken down into the pieces
 * of software that hold it up: the screen, the state it lands in, who can see
 * it and what stays on the record. It is the survey we run in week one, made
 * legible before anyone signs anything.
 * ------------------------------------------------------------------------ */

/** Dwell time per step while the visitor has not taken over. */
const AUTOPLAY_MS = 3000

const EASE = [0.22, 1, 0.36, 1] as const

type Step = {
	/** The step as the client tells it, in business language. */
	step: string
	actor: string
	/** What it becomes once it is software. */
	screen: string
	state: string
	role: string
	record: string
}

type Process = {
	id: string
	label: string
	/** Shown next to the selector, so the example is anchored to a real area. */
	context: string
	steps: Step[]
}

const PROCESSES: Process[] = [
	{
		id: "aprobaciones",
		label: "Aprobación de solicitudes",
		context: "Administración y finanzas",
		steps: [
			{
				step: "Alguien necesita algo y lo pide",
				actor: "Solicitante",
				screen:
					"Un formulario con los campos que tu proceso exige, no los que trae un software genérico",
				state: "Borrador",
				role: "Solo quien la creó",
				record: "quién la abrió y a qué hora",
			},
			{
				step: "Su jefatura la revisa",
				actor: "Aprobador",
				screen: "Una bandeja de pendientes ordenada por antigüedad, no una casilla de correo",
				state: "En revisión",
				role: "El aprobador de esa área",
				record: "cuánto lleva esperando una respuesta",
			},
			{
				step: "Se aprueba o se devuelve con observaciones",
				actor: "Aprobador",
				screen: "Una acción con comentario obligatorio cuando se devuelve",
				state: "Aprobada",
				role: "Aprobador y solicitante",
				record: "quién decidió, cuándo y con qué argumento",
			},
			{
				step: "El equipo la ejecuta y la cierra",
				actor: "Ejecutor",
				screen: "El detalle con checklist y adjuntos de respaldo",
				state: "Cerrada",
				role: "Todos los involucrados",
				record: "la evidencia con la que se dio por cerrada",
			},
		],
	},
	{
		id: "ordenes",
		label: "Órdenes de trabajo en terreno",
		context: "Operaciones y mantención",
		steps: [
			{
				step: "Se detecta una falla o una tarea",
				actor: "Supervisor",
				screen: "Creación rápida desde el teléfono, con foto y ubicación",
				state: "Abierta",
				role: "Supervisor del turno",
				record: "dónde y a qué hora se reportó",
			},
			{
				step: "Se asigna a una cuadrilla",
				actor: "Planificador",
				screen: "Un planificador que muestra la carga real de cada equipo",
				state: "Asignada",
				role: "Planificación y la cuadrilla",
				record: "a quién se asignó y con qué prioridad",
			},
			{
				step: "La cuadrilla ejecuta en terreno",
				actor: "Cuadrilla",
				screen: "Vista móvil con checklist, materiales y firma, que funciona sin señal",
				state: "En ejecución",
				role: "La cuadrilla asignada",
				record: "horas reales y materiales consumidos",
			},
			{
				step: "Se valida y se cierra",
				actor: "Supervisor",
				screen: "Revisión con la evidencia fotográfica al lado del checklist",
				state: "Cerrada",
				role: "Supervisión y gerencia",
				record: "quién validó el trabajo terminado",
			},
		],
	},
	{
		id: "cotizaciones",
		label: "Cotizaciones a clientes",
		context: "Área comercial",
		steps: [
			{
				step: "Entra una consulta comercial",
				actor: "Cliente",
				screen: "El formulario del sitio cae directo al sistema, sin pasar por una casilla",
				state: "Nueva",
				role: "El equipo comercial",
				record: "de qué campaña o canal llegó",
			},
			{
				step: "Se arma la propuesta",
				actor: "Comercial",
				screen: "Un constructor con tus precios y los descuentos que cada cargo puede aplicar",
				state: "En preparación",
				role: "Comercial y su jefatura",
				record: "el margen con el que se cotizó",
			},
			{
				step: "El cliente la revisa",
				actor: "Cliente",
				screen: "Un enlace público con fecha de vencimiento, sin pedirle crear una cuenta",
				state: "Enviada",
				role: "El cliente, sin clave",
				record: "cuándo la abrió y cuántas veces",
			},
			{
				step: "Se cierra el trato",
				actor: "Comercial",
				screen: "Aceptación en línea que abre la orden en operaciones automáticamente",
				state: "Aceptada",
				role: "Comercial y operaciones",
				record: "la versión exacta que el cliente aceptó",
			},
		],
	},
]

/** One row of the translation: what the business step becomes in software. */
function TranslationRow({
	icon: Icon,
	label,
	variants,
	children,
}: {
	icon: typeof Layout
	label: string
	variants: Variants
	children: ReactNode
}): ReactNode {
	return (
		<motion.div
			variants={variants}
			className="border-border/60 flex gap-3 border-b py-3 last:border-b-0"
		>
			<span
				className="border-border/60 text-muted-foreground mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-sm border"
				aria-hidden="true"
			>
				<Icon className="h-3 w-3" strokeWidth={1.75} />
			</span>
			<div className="min-w-0">
				<p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
					{label}
				</p>
				<p className="mt-1 text-[13px] leading-snug">{children}</p>
			</div>
		</motion.div>
	)
}

export function ModuleProcessToSystem(): ReactNode {
	const [processIndex, setProcessIndex] = useState(0)
	const [stepIndex, setStepIndex] = useState(0)
	const [userPicked, setUserPicked] = useState(false)
	const reduced = useReducedMotion()
	const frameRef = useRef<HTMLDivElement | null>(null)
	const inView = useInView(frameRef, { amount: 0.4 })

	const process = PROCESSES[processIndex]!
	const step = process.steps[stepIndex]!
	const isLastStep = stepIndex === process.steps.length - 1

	// Walk the steps on its own while the visitor is watching and has not taken
	// over. Re-arms on every step change, so the cue bar and the timer run off
	// the same clock.
	const autoplay = !reduced && !userPicked && inView
	useEffect(() => {
		if (!autoplay) return
		const id = window.setTimeout(() => {
			setStepIndex((i) => (i + 1) % process.steps.length)
		}, AUTOPLAY_MS)
		return () => window.clearTimeout(id)
	}, [autoplay, stepIndex, process.steps.length])

	const selectProcess = useCallback((index: number): void => {
		setUserPicked(true)
		setProcessIndex(index)
		setStepIndex(0)
	}, [])

	const selectStep = useCallback((index: number): void => {
		setUserPicked(true)
		setStepIndex(index)
	}, [])

	// The translation rows land one after another rather than as one block, so
	// the eye reads screen → state → who → record in that order.
	const rowsContainer: Variants = reduced
		? { hidden: {}, visible: {} }
		: { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } } }
	const rowItem: Variants = reduced
		? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
		: {
				hidden: { opacity: 0, y: 8 },
				visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
			}

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<Kicker>De tu proceso a tu sistema</Kicker>
				<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					Tu operación,{" "}
					<span className="font-sans font-semibold tracking-tight">traducida a software</span>
				</h2>
				<p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
					Elige un proceso y recorre sus pasos: cada uno se convierte en una pantalla, un estado y
					un permiso concretos. Esto es exactamente lo que hacemos en el levantamiento, antes de
					escribir una línea de código.
				</p>
			</div>

			<div
				ref={frameRef}
				className="border-border bg-background mx-auto max-w-5xl overflow-hidden rounded-sm border shadow-xl shadow-black/6"
			>
				{/* Chrome — process selector */}
				<div className="border-border flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3.5 py-2.5">
					<p className="text-[11px] font-medium">Proceso</p>
					<div className="flex flex-wrap items-center gap-1.5">
						{PROCESSES.map((entry, index) => (
							<button
								key={entry.id}
								type="button"
								onClick={() => selectProcess(index)}
								aria-pressed={index === processIndex}
								className={cn(
									"focus-ring rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors duration-200",
									index === processIndex
										? "border-primary/30 bg-primary/10 text-primary"
										: "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
								)}
							>
								{entry.label}
							</button>
						))}
					</div>
					<span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
						{process.context}
					</span>
				</div>

				<div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
					{/* Left — the process as the client tells it */}
					<div className="border-border border-b p-6 sm:p-8 lg:border-r lg:border-b-0">
						<p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
							Como lo cuentas tú
						</p>
						<ol className="mt-4 space-y-1.5">
							{process.steps.map((entry, index) => {
								const active = index === stepIndex
								return (
									<li key={entry.step}>
										<button
											type="button"
											onClick={() => selectStep(index)}
											aria-current={active ? "step" : undefined}
											className={cn(
												"focus-ring relative flex w-full items-start gap-3 overflow-hidden rounded-sm border p-3 text-left transition-colors duration-200",
												active
													? "border-primary/30 bg-primary/5"
													: "hover:bg-muted/50 border-transparent"
											)}
										>
											<span
												className={cn(
													"mt-px grid h-5 w-5 shrink-0 place-items-center rounded-sm text-[10px] font-semibold tabular-nums transition-colors duration-200",
													active
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												)}
												aria-hidden="true"
											>
												{index + 1}
											</span>
											<span className="min-w-0">
												<span
													className={cn(
														"block text-[13px] leading-snug font-medium",
														!active && "text-muted-foreground"
													)}
												>
													{entry.step}
												</span>
												<span className="text-muted-foreground mt-0.5 block text-[11px]">
													{entry.actor}
												</span>
											</span>

											{/* Dwell cue: fills over the step's time, gone once the visitor picks. */}
											{autoplay && active ? (
												<motion.span
													key={`${process.id}-${index}`}
													aria-hidden="true"
													className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 origin-left"
													initial={{ scaleX: 0 }}
													animate={{ scaleX: 1 }}
													transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
												/>
											) : null}
										</button>
									</li>
								)
							})}
						</ol>
					</div>

					{/* Right — the same step, once it is software */}
					<div className="bg-muted/25 p-6 sm:p-8">
						<p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
							Como queda construido
						</p>
						<motion.div
							key={`${process.id}-${stepIndex}`}
							variants={rowsContainer}
							initial="hidden"
							animate="visible"
							className="mt-3"
						>
							<TranslationRow icon={Layout} label="Pantalla" variants={rowItem}>
								{step.screen}
							</TranslationRow>
							<TranslationRow icon={Tag} label="Estado en que queda" variants={rowItem}>
								<span
									className={cn(
										"inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium",
										isLastStep
											? "border-brand-green/50 bg-brand-green/15 text-brand-green-text"
											: "border-primary/30 bg-primary/5 text-primary"
									)}
								>
									{step.state}
								</span>
							</TranslationRow>
							<TranslationRow icon={Eye} label="Quién lo ve" variants={rowItem}>
								{step.role}
							</TranslationRow>
							<TranslationRow icon={History} label="Queda registrado" variants={rowItem}>
								{step.record}
							</TranslationRow>
						</motion.div>
					</div>
				</div>

				{/* The states, end to end — the pipeline the process now runs on */}
				<div className="border-border border-t p-6 sm:px-8 sm:py-7">
					<div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
							El ciclo completo
						</p>
						<p className="text-muted-foreground text-[11px]">
							Nada avanza sin dejar rastro de quién lo movió
						</p>
					</div>
					<ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
						{process.steps.map((entry, index) => {
							const active = index === stepIndex
							const isLast = index === process.steps.length - 1
							return (
								<li key={entry.state} className="flex items-center gap-1.5">
									<span
										className={cn(
											"rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors duration-200",
											!active && "border-border/60 text-muted-foreground",
											active &&
												isLast &&
												"border-brand-green/50 bg-brand-green/15 text-brand-green-text",
											active && !isLast && "border-primary/30 bg-primary/10 text-primary"
										)}
									>
										{entry.state}
									</span>
									{!isLast ? (
										<span className="bg-border h-px w-4 shrink-0" aria-hidden="true" />
									) : null}
								</li>
							)
						})}
					</ol>
				</div>

				{/* Closing action */}
				<div className="border-border flex flex-wrap items-center justify-between gap-4 border-t px-6 py-5 sm:px-8">
					<p className="text-muted-foreground max-w-md text-xs leading-relaxed">
						Tu proceso real no es ninguno de estos tres, y ese es justamente el punto: el sistema se
						construye sobre el tuyo.
					</p>
					<CutButton variant="solid" icon="arrow" href="/contacto">
						Traduzcamos tu proceso
					</CutButton>
				</div>
			</div>
		</section>
	)
}
