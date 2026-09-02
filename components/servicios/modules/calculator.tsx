"use client"

import { Kicker } from "@/components/corner-plus"
import type { ModuleProps } from "@/components/servicios/modules/types"
import { CutButton } from "@/components/cut-button"
import { useReducedMotion } from "@/lib/motion"
import { motion, useSpring, useTransform } from "motion/react"
import { useEffect, type CSSProperties, type ReactNode } from "react"
import { useState } from "react"

/* --------------------------------------------------------------------------
 * Automatizaciones — the module that puts a number on the problem the hero
 * shows running. Two controls, one figure, and a year of workdays drawn as a
 * grid so the figure stops being an abstraction.
 * ------------------------------------------------------------------------ */

/** Share of repetitive work realistically automatable in a first wave. */
const AUTOMATABLE = 0.7
const WEEKS_PER_YEAR = 47 // subtracting vacations and holidays
const WORKDAYS_PER_WEEK = 5
const HOURS_PER_WORKDAY = 8
const WORKDAYS_PER_YEAR = WEEKS_PER_YEAR * WORKDAYS_PER_WEEK

/**
 * A range input wearing the site's chrome. The native control keeps its
 * keyboard and screen-reader behaviour; only the track and thumb are redrawn.
 * The fill is a gradient stop driven by `--pct`, because a range input has no
 * element for the filled part of its track.
 */
function SliderRow({
	id,
	label,
	value,
	min,
	max,
	unit,
	onChange,
}: {
	id: string
	label: string
	value: number
	min: number
	max: number
	unit: string
	onChange: (value: number) => void
}): ReactNode {
	const pct = ((value - min) / (max - min)) * 100

	return (
		<div>
			<div className="flex items-baseline justify-between gap-4">
				<label htmlFor={id} className="text-sm font-medium">
					{label}
				</label>
				<span className="text-primary shrink-0 text-sm font-semibold whitespace-nowrap tabular-nums">
					{value} {unit}
				</span>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				value={value}
				aria-valuetext={`${value} ${unit}`}
				onChange={(e) => onChange(Number(e.target.value))}
				style={{ "--pct": `${pct}%` } as CSSProperties}
				className={[
					"focus-ring mt-3 h-5 w-full cursor-pointer appearance-none bg-transparent",
					// Track
					"[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full",
					"[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--primary)_var(--pct),var(--border)_var(--pct))]",
					"[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full",
					"[&::-moz-range-track]:bg-[linear-gradient(to_right,var(--primary)_var(--pct),var(--border)_var(--pct))]",
					// Thumb: square with the chrome radius, lifted onto the 4px track
					"[&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5",
					"[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm",
					"[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:ring-background",
					"[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:transition-transform",
					"hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-110",
					"[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-sm",
					"[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0",
				].join(" ")}
			/>
			<div className="text-muted-foreground mt-1 flex justify-between text-[11px] tabular-nums">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	)
}

function AnimatedNumber({ value }: { value: number }): ReactNode {
	const spring = useSpring(value, { stiffness: 120, damping: 22 })
	useEffect(() => {
		spring.set(value)
	}, [spring, value])
	const display = useTransform(spring, (v) => Math.round(v).toLocaleString("es-CL"))
	return <motion.span>{display}</motion.span>
}

/**
 * One working year of a single person, a cell per day, filled column by column
 * so what comes back reads as whole weeks rather than scattered hours.
 */
function YearGrid({ recovered }: { recovered: number }): ReactNode {
	const reduced = useReducedMotion()

	return (
		<div
			className="grid grid-flow-col grid-rows-5 gap-[2px] sm:gap-[3px]"
			style={{ gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(0, 1fr))` }}
			aria-hidden="true"
		>
			{Array.from({ length: WORKDAYS_PER_YEAR }, (_, i) => (
				<motion.span
					key={i}
					className="bg-border aspect-square rounded-[1px]"
					animate={{ backgroundColor: i < recovered ? "var(--brand-green)" : "var(--border)" }}
					transition={
						reduced ? { duration: 0 } : { duration: 0.25, delay: Math.min(i, 60) * 0.004 }
					}
				/>
			))}
		</div>
	)
}

export function ModuleCalculator({ contactHref }: ModuleProps): ReactNode {
	const [people, setPeople] = useState(5)
	const [hours, setHours] = useState(6)

	const yearlyRecoverable = people * hours * WEEKS_PER_YEAR * AUTOMATABLE
	const daysPerPerson = Math.round((hours * WEEKS_PER_YEAR * AUTOMATABLE) / HOURS_PER_WORKDAY)

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<Kicker>Calculadora de horas</Kicker>
				<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					¿Cuánto te cuesta{" "}
					<span className="font-sans font-semibold tracking-tight">el trabajo repetitivo?</span>
				</h2>
				<p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
					Mueve los controles y mira cuántas horas podría recuperar tu equipo cada año.
				</p>
			</div>

			<div className="border-border bg-background mx-auto max-w-4xl overflow-hidden rounded-sm border shadow-xl shadow-black/6">
				<div className="border-border flex items-center justify-between gap-3 border-b px-3.5 py-2.5">
					<p className="truncate text-[11px] font-medium">Calculadora de horas recuperables</p>
					<span className="text-muted-foreground shrink-0 text-[10px]">Estimación referencial</span>
				</div>

				<div className="grid lg:grid-cols-[1fr_1.1fr]">
					{/* Inputs */}
					<div className="border-border flex flex-col justify-center gap-10 border-b p-8 sm:p-10 lg:border-r lg:border-b-0">
						<SliderRow
							id="calc-people"
							label="Personas que hacen tareas repetitivas"
							value={people}
							min={1}
							max={50}
							unit={people === 1 ? "persona" : "personas"}
							onChange={setPeople}
						/>
						<SliderRow
							id="calc-hours"
							label="Horas a la semana que pierde cada una"
							value={hours}
							min={1}
							max={20}
							unit={hours === 1 ? "hora" : "horas"}
							onChange={setHours}
						/>
						<p className="text-muted-foreground text-xs leading-relaxed">
							Copiar datos entre sistemas, armar el mismo informe, perseguir aprobaciones, digitar
							lo que llega por correo…
						</p>
					</div>

					{/* Result */}
					<div className="flex flex-col items-center justify-center p-8 text-center sm:p-10">
						<p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
							Horas recuperables al año
						</p>
						<p
							className="text-brand-green-text mt-3 font-serif text-6xl leading-none font-normal tracking-tight tabular-nums sm:text-7xl"
							aria-hidden="true"
						>
							<AnimatedNumber value={yearlyRecoverable} />
						</p>
						<p className="text-muted-foreground mt-4 text-sm" aria-hidden="true">
							Son{" "}
							<span className="text-foreground font-semibold tabular-nums">{daysPerPerson}</span>{" "}
							jornadas al año que le devuelves a cada persona
						</p>
						{/*
						 * The figure above animates frame by frame, so it is hidden from
						 * assistive tech and announced once per settled value instead.
						 */}
						<p className="sr-only" aria-live="polite">
							{Math.round(yearlyRecoverable).toLocaleString("es-CL")} horas recuperables al año:{" "}
							{daysPerPerson} jornadas por persona.
						</p>
						<div className="mt-8">
							<CutButton variant="solid" icon="arrow" href={contactHref}>
								Hagamos el número real
							</CutButton>
						</div>
					</div>
				</div>

				{/* One person's working year, and how much of it comes back */}
				<div className="border-border border-t p-6 sm:px-10 sm:py-7">
					<div className="mb-3 flex items-baseline justify-between gap-4">
						<p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
							El año laboral de una persona
						</p>
						<p className="text-[11px] font-medium tabular-nums">
							<span className="text-brand-green-text">{daysPerPerson}</span>
							<span className="text-muted-foreground">
								{" "}
								de {WORKDAYS_PER_YEAR} días recuperados
							</span>
						</p>
					</div>
					<YearGrid recovered={daysPerPerson} />
					<p className="text-muted-foreground mt-3 text-[11px] leading-relaxed">
						Cada cuadro es un día de trabajo; cada columna, una semana. Asume que un{" "}
						{Math.round(AUTOMATABLE * 100)} % del trabajo repetitivo es automatizable en una primera
						etapa, sobre {WEEKS_PER_YEAR} semanas laborales al año.
					</p>
				</div>
			</div>
		</section>
	)
}
