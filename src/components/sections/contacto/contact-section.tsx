"use client"

import { useRef, useState, type SubmitEvent, type ReactNode } from "react"
import { ChevronRight, Loader2, Mail, MapPin } from "lucide-react"
import { addDays, format, isBefore, startOfDay } from "date-fns"
import { DayPicker } from "react-day-picker"
import { es } from "date-fns/locale"
import { motion } from "motion/react"

import {
	fadeInUp,
	staggerContainer,
	reducedMotionVariants,
	defaultTransition,
	useReducedMotion,
} from "@/lib/motion"

const SERVICIOS = [
	"Desarrollo Web",
	"Reportabilidad",
	"Power Platform",
	"Capacitaciones",
	"Otro",
] as const

const TIME_SLOTS = Array.from({ length: 40 }, (_, i) => {
	const hour = Math.floor(i / 4) + 9
	const minute = (i % 4) * 15
	return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
})

type FormStatus = "idle" | "sending" | "success" | "error"

interface ContactFormData {
	nombre: string
	email: string
	servicio: string
	fechaPreferida: string
	horaPreferida: string
	mensaje: string
}

function validateForm(data: ContactFormData): string | null {
	if (data.nombre.length < 2) return "El nombre debe tener al menos 2 caracteres."
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Ingresá un email válido."
	if (data.mensaje.length < 10) return "El mensaje debe tener al menos 10 caracteres."
	return null
}

const inputStyles =
	"w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"

const tomorrow = addDays(startOfDay(new Date()), 1)
const maxDate = addDays(new Date(), 30)

export function ContactSection(): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const formRef = useRef<HTMLFormElement>(null)
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMsg, setErrorMsg] = useState("")
	const [selectedDate, setSelectedDate] = useState<Date | undefined>()
	const [selectedTime, setSelectedTime] = useState("")

	const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const stagger = prefersReducedMotion ? reducedMotionVariants : staggerContainer
	const transition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const formData: ContactFormData = {
			nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value.trim(),
			email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
			servicio: (form.elements.namedItem("servicio") as HTMLSelectElement).value,
			fechaPreferida: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
			horaPreferida: selectedTime,
			mensaje: (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value.trim(),
		}

		const validationError = validateForm(formData)
		if (validationError) {
			setStatus("error")
			setErrorMsg(validationError)
			return
		}

		setStatus("sending")
		setErrorMsg("")

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})

			if (!res.ok) {
				const data = (await res.json()) as { error?: string }
				throw new Error(data.error ?? "Error al enviar")
			}

			setStatus("success")
			setSelectedDate(undefined)
			setSelectedTime("")
			form.reset()
		} catch (err) {
			setStatus("error")
			setErrorMsg(err instanceof Error ? err.message : "Error al enviar el mensaje.")
		}
	}

	return (
		<section className="bg-background relative min-h-screen overflow-hidden py-20 md:py-32">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				{/* Header — Title (left) + contact info (right) */}
				<div className="mb-12 flex flex-col items-end justify-between gap-10 lg:flex-row">
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={stagger}
						transition={transition}
					>
						<motion.span
							variants={variants}
							transition={transition}
							className="text-accent mb-2 block text-sm font-medium tracking-wider uppercase"
						>
							Contacto
						</motion.span>
						<motion.h1
							variants={variants}
							transition={transition}
							className="text-foreground mb-4 text-3xl font-bold md:text-5xl"
						>
							Conversemos sobre tu proyecto
						</motion.h1>
						<motion.p
							variants={variants}
							transition={transition}
							className="text-muted-foreground max-w-md text-lg"
						>
							Contanos qué necesitás y te ayudamos a encontrar la solución más simple y efectiva
							para tu organización.
						</motion.p>
					</motion.div>

					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={stagger}
						transition={transition}
						className="flex flex-col gap-5 lg:items-end"
					>
						<motion.a
							variants={variants}
							transition={transition}
							href="mailto:contacto@ingsimple.cl"
							className="group flex items-center gap-3"
						>
							<span className="bg-foreground group-hover:bg-accent text-background flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300">
								<Mail className="h-8 w-8" strokeWidth={1} />
							</span>
							<div>
								<p className="text-muted-foreground text-xs">Email</p>
								<p className="text-foreground group-hover:text-accent font-medium transition-colors">
									contacto@ingsimple.cl
								</p>
							</div>
						</motion.a>

						<motion.div
							variants={variants}
							transition={transition}
							className="flex items-center gap-3"
						>
							<span className="bg-foreground text-background flex h-12 w-12 items-center justify-center rounded-xl">
								<MapPin className="h-8 w-8" strokeWidth={1} />
							</span>
							<div>
								<p className="text-muted-foreground text-xs">Ubicación</p>
								<p className="text-foreground font-medium">Santiago, Chile</p>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Form — Two cards side by side */}
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={
						prefersReducedMotion
							? reducedMotionVariants
							: { hidden: { opacity: 0 }, visible: { opacity: 1 } }
					}
					transition={
						prefersReducedMotion ? { duration: 0.01 } : { ...defaultTransition, delay: 0.2 }
					}
				>
					<form ref={formRef} onSubmit={handleSubmit}>
						<div className="flex flex-col gap-5 lg:flex-row">
							{/* Card 1 — Datos básicos */}
							<div className="bg-muted flex min-w-0 flex-1 flex-col rounded-2xl p-6 md:p-8">
								<div className="text-foreground mb-5 text-base font-medium">Tu mensaje</div>
								<div className="flex flex-1 flex-col space-y-5">
									{/* Nombre */}
									<div>
										<label
											htmlFor="nombre"
											className="text-foreground mb-1.5 block text-sm font-medium"
										>
											Nombre *
										</label>
										<input
											type="text"
											id="nombre"
											name="nombre"
											required
											minLength={2}
											placeholder="Tu nombre"
											className={inputStyles}
										/>
									</div>

									{/* Email */}
									<div>
										<label
											htmlFor="email"
											className="text-foreground mb-1.5 block text-sm font-medium"
										>
											Email *
										</label>
										<input
											type="email"
											id="email"
											name="email"
											required
											placeholder="tu@email.com"
											className={inputStyles}
										/>
									</div>

									{/* Servicio */}
									<div>
										<label
											htmlFor="servicio"
											className="text-foreground mb-1.5 block text-sm font-medium"
										>
											Servicio de interés
										</label>
										<select id="servicio" name="servicio" defaultValue="" className={inputStyles}>
											<option value="" disabled>
												Seleccioná un servicio
											</option>
											{SERVICIOS.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</div>

									{/* Mensaje */}
									<div className="flex-1">
										<label
											htmlFor="mensaje"
											className="text-foreground mb-1.5 block text-sm font-medium"
										>
											Mensaje *
										</label>
										<textarea
											id="mensaje"
											name="mensaje"
											required
											minLength={10}
											rows={4}
											placeholder="Contanos sobre tu proyecto o consulta..."
											className={inputStyles + " resize-none lg:min-h-[120px]"}
										/>
									</div>
								</div>
							</div>

							{/* Card 2 — Agendar reunión */}
							<div className="bg-muted flex w-full flex-col rounded-2xl p-6 md:p-8 lg:w-fit">
								<div className="text-foreground mb-5 text-base font-medium">
									Agendar reunión{" "}
									<span className="text-muted-foreground font-normal">(opcional)</span>
								</div>

								<div className="flex flex-1 flex-col space-y-5">
									{/* Calendario */}
									<div className="border-border bg-background w-fit rounded-lg border p-3">
										<DayPicker
											mode="single"
											locale={es}
											selected={selectedDate}
											onSelect={setSelectedDate}
											disabled={(date) => isBefore(date, tomorrow) || date > maxDate}
											classNames={{
												root: "text-foreground w-fit relative",
												months: "flex flex-col",
												month_caption:
													"flex justify-center items-center h-10 font-medium capitalize",
												nav: "flex items-center justify-between absolute inset-x-0 top-0 h-10 px-1",
												button_previous:
													"h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
												button_next:
													"h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
												weekdays: "grid grid-cols-7 mb-1",
												weekday: "text-muted-foreground text-xs font-medium text-center py-1",
												weeks: "grid gap-1",
												week: "grid grid-cols-7",
												day: "text-center text-sm",
												day_button:
													"h-9 w-9 rounded-md transition-colors hover:bg-accent/10 inline-flex items-center justify-center",
												selected: "bg-accent text-white rounded-md font-medium",
												disabled: "text-muted-foreground/40 cursor-not-allowed",
												today: "font-bold text-accent",
												outside: "text-muted-foreground/30",
												month_grid: "relative",
											}}
										/>
									</div>

									{/* Hora */}
									<div>
										<label
											htmlFor="hora"
											className="text-foreground mb-1.5 block text-sm font-medium"
										>
											Hora preferida
										</label>
										<select
											id="hora"
											value={selectedTime}
											onChange={(e) => setSelectedTime(e.target.value)}
											className={inputStyles}
										>
											<option value="">Seleccioná un horario</option>
											{TIME_SLOTS.map((t) => (
												<option key={t} value={t}>
													{t} hrs
												</option>
											))}
										</select>
									</div>

									<p className="text-muted-foreground text-xs">
										Estas son preferencias. <br /> Te contactaremos para confirmar disponibilidad.
									</p>
								</div>
							</div>
						</div>

						{/* Status messages + Submit */}
						<div className="mt-6 flex flex-wrap items-center justify-end gap-4">
							<button
								type="submit"
								disabled={status === "sending"}
								className="bg-accent shadow-accent/25 hover:shadow-accent/40 group inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl disabled:opacity-60 sm:w-auto"
							>
								<span>{status === "sending" ? "Enviando..." : "Enviar mensaje"}</span>
								<span className="text-accent flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
									{status === "sending" ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<ChevronRight className="relative left-px h-4 w-4" />
									)}
								</span>
							</button>

							{status === "success" && (
								<p className="text-sm font-medium text-emerald-500">
									Mensaje enviado con éxito. Te responderemos a la brevedad.
								</p>
							)}
							{status === "error" && errorMsg && (
								<p className="text-sm font-medium text-red-500">{errorMsg}</p>
							)}
						</div>
					</form>
				</motion.div>
			</div>
		</section>
	)
}
