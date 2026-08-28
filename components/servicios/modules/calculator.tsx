"use client"

import { CutButton } from "@/components/cut-button"
import { motion, useSpring, useTransform } from "motion/react"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

const PANEL_RADIUS = "2px"

/** Share of repetitive work realistically automatable in a first wave. */
const AUTOMATABLE = 0.7
const WEEKS_PER_YEAR = 47 // subtracting vacations and holidays

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
	return (
		<div>
			<div className="flex items-baseline justify-between gap-4">
				<label htmlFor={id} className="text-sm font-medium">
					{label}
				</label>
				<span className="text-primary text-sm font-semibold tabular-nums">
					{value} {unit}
				</span>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="focus-ring mt-3 w-full"
				style={{ accentColor: "var(--primary)" } as CSSProperties}
			/>
			<div className="text-muted-foreground mt-1 flex justify-between text-[11px]">
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

export function ModuleCalculator(): ReactNode {
	const [people, setPeople] = useState(5)
	const [hours, setHours] = useState(6)
	const clip = { borderRadius: PANEL_RADIUS } as CSSProperties

	const weeklyTeam = people * hours
	const yearlyRecoverable = weeklyTeam * WEEKS_PER_YEAR * AUTOMATABLE
	const workdaysPerYear = yearlyRecoverable / 8

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<p className="text-muted-foreground text-sm font-medium">Calculadora de horas</p>
				<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					¿Cuánto te cuesta{" "}
					<span className="font-sans font-semibold tracking-tight">el trabajo repetitivo?</span>
				</h2>
				<p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
					Mueve los controles y mira cuántas horas podría recuperar tu equipo cada año.
				</p>
			</div>

			<div className="bg-border mx-auto max-w-4xl p-px" style={clip}>
				<div className="bg-background grid lg:grid-cols-[1fr_1.1fr]" style={clip}>
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
							className="text-primary mt-3 font-serif text-6xl leading-none font-normal tracking-tight tabular-nums sm:text-7xl"
							aria-live="polite"
						>
							<AnimatedNumber value={yearlyRecoverable} />
						</p>
						<p className="text-muted-foreground mt-4 text-sm">
							Equivale a{" "}
							<span className="text-foreground font-semibold tabular-nums">
								<AnimatedNumber value={workdaysPerYear} />
							</span>{" "}
							jornadas completas de trabajo
						</p>
						<div className="mt-8">
							<CutButton variant="solid" icon="arrow" href="/contacto">
								Recuperemos esas horas
							</CutButton>
						</div>
					</div>
				</div>
			</div>

			<p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed">
				Estimación referencial: asume que un {Math.round(AUTOMATABLE * 100)}% del trabajo repetitivo
				es automatizable en una primera etapa, sobre {WEEKS_PER_YEAR} semanas laborales al año.
			</p>
		</section>
	)
}
