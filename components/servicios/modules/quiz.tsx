"use client"

import { Kicker } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { useStaggerEntrance } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Capacitaciones — exposure diagnosis.
 *
 * The hero visual is already an interactive program configurator (tool ×
 * level), so this module deliberately does NOT return a program tier: it
 * measures how exposed the team is today — key-person risk, manual hours and
 * external dependency. Every question reads current state; none asks what the
 * team would like to achieve, because an aspiration must not move the
 * diagnosis of where they actually stand.
 * ------------------------------------------------------------------------ */

/** One reading of the exposure panel, filled in as its question is answered. */
type Meter = {
	/** Row label in the live panel. */
	label: string
	/** Readout per answer, indexed by the option that was picked. */
	readouts: [string, string, string]
}

type Question = {
	q: string
	meter: Meter
	/** Ordered worst → best; the index is also the risk score for the answer. */
	options: string[]
}

const QUESTIONS: Question[] = [
	{
		q: "Si la persona que arma el informe se toma vacaciones, ¿qué pasa?",
		meter: {
			label: "Persona crítica",
			readouts: ["Bloqueante", "Cuello de botella", "Ninguna"],
		},
		options: [
			"El informe no sale hasta que vuelve",
			"Sale, pero tarda el doble",
			"Cualquiera del equipo lo saca igual",
		],
	},
	{
		q: "¿Cuántas horas al mes se van armando reportes a mano?",
		meter: {
			label: "Horas manuales",
			readouts: ["Más de 20 h", "5 a 20 h", "Menos de 5 h"],
		},
		options: ["Más de 20 horas", "Entre 5 y 20 horas", "Menos de 5 horas"],
	},
	{
		q: "Cuando necesitan un análisis nuevo, ¿a quién recurren?",
		meter: {
			label: "Dependencia externa",
			readouts: ["Alta", "Media", "Baja"],
		},
		options: [
			"A un proveedor externo",
			"A la única persona que sabe",
			"Lo resuelve quien lo necesita",
		],
	},
]

/** Risk per answer: index 0 is the worst case, so it carries the most weight. */
const RISK_BY_OPTION = [2, 1, 0]
const MAX_RISK = QUESTIONS.length * 2

type Diagnosis = {
	level: string
	tone: "high" | "mid" | "low"
	headline: string
	desc: string
}

const DIAGNOSES: Diagnosis[] = [
	{
		level: "Exposición baja",
		tone: "low",
		headline: "El conocimiento ya está repartido",
		desc: "Tu equipo no depende de una sola persona ni de un tercero para mirar sus números. Una capacitación acá no sirve para tapar un hoyo: sirve para subir el techo, con herramientas que hoy no están usando.",
	},
	{
		level: "Exposición media",
		tone: "mid",
		headline: "Funciona, pero con un cuello de botella",
		desc: "Los reportes salen, aunque siempre por el mismo camino y con más trabajo manual del que corresponde. Es el punto donde capacitar rinde más: hay base sobre la cual construir y todavía hay mucho tiempo que recuperar.",
	},
	{
		level: "Exposición alta",
		tone: "high",
		headline: "La operación depende de una sola persona",
		desc: "Si esa persona falta, el equipo se queda sin información para decidir. Antes de sumar herramientas nuevas, la prioridad es que más de una persona sepa sostener los reportes que ya existen.",
	},
]

function diagnose(risk: number): Diagnosis {
	if (risk <= 1) return DIAGNOSES[0] as Diagnosis
	if (risk <= 4) return DIAGNOSES[1] as Diagnosis
	return DIAGNOSES[2] as Diagnosis
}

/* ---- Live exposure panel ------------------------------------------------ */

function MeterRow({
	label,
	readout,
	weight,
	answered,
}: {
	label: string
	readout: string
	/** 0 = healthy, 2 = worst; drives how much of the bar is filled. */
	weight: number
	answered: boolean
}): ReactNode {
	return (
		<div className="px-2.5 py-2">
			<div className="flex items-baseline justify-between gap-2">
				<span className="text-[10px] leading-snug">{label}</span>
				<span
					className={cn(
						"text-[10px] font-medium tabular-nums",
						!answered && "text-muted-foreground",
						// A clean reading is a result, not a risk: it gets the company colour.
						answered && (weight === 0 ? "text-brand-green-text" : "text-foreground")
					)}
				>
					{answered ? readout : "—"}
				</span>
			</div>
			<div className="bg-border/60 mt-1 h-1 w-full rounded-full">
				<motion.div
					className={cn(
						"h-1 rounded-full",
						weight === 0 ? "bg-brand-green" : weight >= 2 ? "bg-primary" : "bg-primary/50"
					)}
					initial={false}
					// A healthy answer keeps a short mark rather than an empty track, so
					// the row still reads as answered.
					animate={{ width: answered ? `${(weight / 2) * 100 || 10}%` : "0%" }}
					transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>
		</div>
	)
}

/* ---- Module ------------------------------------------------------------- */

export function ModuleQuiz(): ReactNode {
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	const [answers, setAnswers] = useState<number[]>([])
	const step = answers.length
	const done = step >= QUESTIONS.length
	const question = QUESTIONS[step]
	const risk = answers.reduce((total, option) => total + (RISK_BY_OPTION[option] ?? 0), 0)
	const diagnosis = diagnose(risk)

	// The result replaces the questions in place, so focus has to follow it or
	// a keyboard user is left on a button that no longer exists.
	const resultRef = useRef<HTMLParagraphElement>(null)
	const startedRef = useRef(false)
	useEffect(() => {
		if (done && startedRef.current) resultRef.current?.focus()
		if (!done) startedRef.current = true
	}, [done])

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div variants={container} initial="hidden" whileInView="visible" viewport={viewport}>
				<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>Diagnóstico exprés</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						¿Qué tan expuesto está{" "}
						<span className="font-sans font-semibold tracking-tight">tu equipo?</span>
					</motion.h2>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base"
					>
						Tres preguntas sobre cómo trabajan hoy. Sin correo de por medio.
					</motion.p>
				</div>

				<motion.div
					variants={item}
					transition={itemTransition}
					className="border-border bg-background mx-auto grid max-w-5xl overflow-hidden rounded-sm border lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
				>
					{/* Questions */}
					<div className="border-border/60 border-b p-6 sm:p-8 lg:border-r lg:border-b-0">
						<div className="flex items-center justify-between gap-3">
							<p className="text-muted-foreground text-xs font-medium">
								{done ? "Resultado" : `Pregunta ${step + 1} de ${QUESTIONS.length}`}
							</p>
							<div className="flex gap-1.5" aria-hidden="true">
								{QUESTIONS.map((entry, i) => (
									<span
										key={entry.q}
										className={cn(
											"h-1 w-8 transition-colors duration-300",
											i < step || done ? "bg-primary" : "bg-border"
										)}
									/>
								))}
							</div>
						</div>

						<div className="mt-6 min-h-[240px]">
							<AnimatePresence mode="wait">
								{!done && question ? (
									<motion.div
										key={`q-${step}`}
										initial={{ opacity: 0, x: 16 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -16 }}
										transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
									>
										<h3 className="text-base font-semibold tracking-tight text-balance sm:text-lg">
											{question.q}
										</h3>
										<div className="mt-5 flex flex-col gap-2.5">
											{question.options.map((option, index) => (
												<button
													key={option}
													type="button"
													onClick={() => setAnswers((prev) => [...prev, index])}
													className="focus-ring group border-border hover:border-primary hover:bg-primary/5 hover:text-primary flex items-center justify-between gap-4 rounded-sm border border-dotted px-4 py-3 text-left text-sm font-medium transition-colors hover:border-solid"
												>
													{option}
													<span
														aria-hidden="true"
														className="text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5"
													>
														→
													</span>
												</button>
											))}
										</div>
									</motion.div>
								) : (
									<motion.div
										key="result"
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
									>
										<p
											ref={resultRef}
											tabIndex={-1}
											className={cn(
												"focus-ring text-xs font-medium tracking-widest uppercase",
												diagnosis.tone === "low" ? "text-brand-green-text" : "text-primary"
											)}
										>
											{diagnosis.level}
										</p>
										<h3 className="mt-2.5 text-lg font-semibold tracking-tight text-balance sm:text-xl">
											{diagnosis.headline}
										</h3>
										<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
											{diagnosis.desc}
										</p>
										<div className="mt-6 flex flex-wrap items-center gap-3">
											<CutButton variant="solid" icon="arrow" href="/contacto">
												Conversemos el programa
											</CutButton>
											<button
												type="button"
												onClick={() => setAnswers([])}
												className="focus-ring text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
											>
												<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
												Repetir
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					{/* Live readout: fills in answer by answer, so the panel is never empty. */}
					<div className="bg-muted/30 flex flex-col p-6 sm:p-8">
						<div className="flex items-baseline justify-between gap-2">
							<p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
								Exposición del equipo
							</p>
							<span className="text-muted-foreground text-[10px] tabular-nums">
								{risk} / {MAX_RISK}
							</span>
						</div>

						<div className="border-border/60 bg-background divide-border/60 mt-2 divide-y rounded-sm border">
							{QUESTIONS.map((entry, index) => {
								const answer = answers[index]
								const answered = answer !== undefined
								return (
									<MeterRow
										key={entry.meter.label}
										label={entry.meter.label}
										readout={answered ? (entry.meter.readouts[answer] ?? "") : ""}
										weight={answered ? (RISK_BY_OPTION[answer] ?? 0) : 0}
										answered={answered}
									/>
								)
							})}
						</div>

						<p className="text-muted-foreground border-border/60 mt-auto border-t pt-2.5 text-[10px] leading-relaxed">
							{done
								? "Este es el punto de partida. El programa se define después, con el diagnóstico de nivel real del equipo."
								: "Cada respuesta completa una fila. Nada se envía ni se guarda."}
						</p>
					</div>
				</motion.div>

				{/* Single announcement point for both progress and result. */}
				<p aria-live="polite" className="sr-only">
					{done
						? `Resultado: ${diagnosis.level}. ${diagnosis.headline}.`
						: `Pregunta ${step + 1} de ${QUESTIONS.length}. ${question?.q ?? ""}`}
				</p>
			</motion.div>
		</section>
	)
}
