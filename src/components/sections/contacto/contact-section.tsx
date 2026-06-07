"use client"

import { useState, type SubmitEvent, type ReactNode } from "react"
import { Check, ChevronDown, ChevronRight, Loader2, Mail, MapPin } from "lucide-react"
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

const EXPECTATIVAS = [
	"Diagnóstico claro y sin tecnicismos de tu situación actual",
	"Propuesta concreta con alcance, plazos y rangos de inversión",
	"Ejemplos reales de proyectos similares ya en producción",
	"Respuesta directa sobre soporte, capacitación y mantenimiento",
] as const

type FormStatus = "idle" | "sending" | "success" | "error"

interface ContactFormData {
	nombre: string
	email: string
	empresa: string
	servicio: string
	mensaje: string
}

function validateForm(data: ContactFormData): string | null {
	if (data.nombre.length < 2) return "El nombre debe tener al menos 2 caracteres."
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Ingresá un email válido."
	if (data.mensaje.length < 10) return "El mensaje debe tener al menos 10 caracteres."
	return null
}

const fieldStyles =
	"w-full rounded-full border border-background/15 bg-background/5 px-5 py-3 text-sm text-background placeholder:text-background/50 focus:border-accent focus:bg-background/10 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-colors"

export function ContactSection(): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMsg, setErrorMsg] = useState("")

	const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const stagger = prefersReducedMotion ? reducedMotionVariants : staggerContainer
	const transition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const data: ContactFormData = {
			nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value.trim(),
			email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
			empresa: (form.elements.namedItem("empresa") as HTMLInputElement).value.trim(),
			servicio: (form.elements.namedItem("servicio") as HTMLSelectElement).value,
			mensaje: (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value.trim(),
		}

		const validationError = validateForm(data)
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
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const body = (await res.json()) as { error?: string }
				throw new Error(body.error ?? "Error al enviar")
			}

			setStatus("success")
			form.reset()
		} catch (err) {
			setStatus("error")
			setErrorMsg(err instanceof Error ? err.message : "Error al enviar el mensaje.")
		}
	}

	return (
		<section className="bg-background relative overflow-hidden py-20 md:py-32">
			<div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Columna izquierda — Info */}
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-80px" }}
						variants={stagger}
						transition={transition}
						className="flex flex-col gap-10"
					>
						<div>
							<motion.span
								variants={variants}
								transition={transition}
								className="text-accent mb-3 block text-sm font-medium tracking-wider uppercase"
							>
								Contacto
							</motion.span>
							<motion.h1
								variants={variants}
								transition={transition}
								className="text-foreground text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl md:text-6xl"
							>
								Conversemos sobre tu
								<br />
								<span className="text-accent">próximo proyecto</span>
							</motion.h1>
							<motion.p
								variants={variants}
								transition={transition}
								className="text-muted-foreground mt-5 max-w-md text-lg"
							>
								Contanos qué necesitás y armamos juntos la solución más simple y efectiva para tu
								organización.
							</motion.p>
						</div>

						<motion.div variants={variants} transition={transition} className="flex flex-col gap-4">
							<h3 className="text-foreground text-sm font-semibold">
								Qué esperar de la conversación
							</h3>
							<ul className="flex flex-col gap-3">
								{EXPECTATIVAS.map((item, i) => (
									<motion.li
										key={item}
										variants={variants}
										transition={
											prefersReducedMotion
												? { duration: 0.01 }
												: { ...defaultTransition, delay: 0.08 * i }
										}
										className="text-muted-foreground flex items-start gap-3 text-sm sm:text-base"
									>
										<span className="bg-accent/10 text-accent mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
											<Check className="h-3 w-3" strokeWidth={3} />
										</span>
										<span>{item}</span>
									</motion.li>
								))}
							</ul>
						</motion.div>

						<motion.div variants={variants} transition={transition} className="flex flex-col gap-5">
							<a href="mailto:contacto@ingsimple.cl" className="group flex items-center gap-3">
								<span className="bg-foreground group-hover:bg-accent text-background flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
									<Mail className="h-6 w-6" strokeWidth={1.5} />
								</span>
								<div>
									<p className="text-muted-foreground text-xs">Email</p>
									<p className="text-foreground group-hover:text-accent font-medium transition-colors">
										contacto@ingsimple.cl
									</p>
								</div>
							</a>

							<div className="flex items-center gap-3">
								<span className="bg-foreground text-background flex h-12 w-12 items-center justify-center rounded-xl">
									<MapPin className="h-6 w-6" strokeWidth={1.5} />
								</span>
								<div>
									<p className="text-muted-foreground text-xs">Ubicación</p>
									<p className="text-foreground font-medium">Santiago, Chile</p>
								</div>
							</div>
						</motion.div>
					</motion.div>

					{/* Columna derecha — Formulario */}
					<motion.form
						onSubmit={handleSubmit}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-80px" }}
						variants={variants}
						transition={
							prefersReducedMotion ? { duration: 0.01 } : { ...defaultTransition, delay: 0.1 }
						}
						className="bg-foreground flex flex-col gap-4 rounded-3xl p-6 shadow-xl sm:p-8 lg:sticky lg:top-24"
					>
						<div className="mb-2">
							<h2 className="text-background text-lg font-semibold sm:text-xl">
								Contanos sobre tu proyecto
							</h2>
							<p className="text-background/60 mt-1 text-sm">
								Respondemos en menos de 24 horas hábiles.
							</p>
						</div>

						<div>
							<label htmlFor="nombre" className="sr-only">
								Nombre completo
							</label>
							<input
								type="text"
								id="nombre"
								name="nombre"
								required
								minLength={2}
								placeholder="Nombre completo *"
								className={fieldStyles}
							/>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label htmlFor="email" className="sr-only">
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									placeholder="Email *"
									className={fieldStyles}
								/>
							</div>
							<div>
								<label htmlFor="empresa" className="sr-only">
									Empresa
								</label>
								<input
									type="text"
									id="empresa"
									name="empresa"
									placeholder="Empresa"
									className={fieldStyles}
								/>
							</div>
						</div>

						<div className="relative">
							<label htmlFor="servicio" className="sr-only">
								Servicio de interés
							</label>
							<select
								id="servicio"
								name="servicio"
								defaultValue=""
								className={fieldStyles + " appearance-none pr-10"}
							>
								<option value="" disabled className="bg-foreground text-background">
									Servicio de interés
								</option>
								{SERVICIOS.map((s) => (
									<option key={s} value={s} className="bg-foreground text-background">
										{s}
									</option>
								))}
							</select>
							<ChevronDown className="text-background/60 pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2" />
						</div>

						<div>
							<label htmlFor="mensaje" className="sr-only">
								Contanos sobre tu proyecto
							</label>
							<textarea
								id="mensaje"
								name="mensaje"
								required
								minLength={10}
								rows={5}
								placeholder="Contanos brevemente sobre tu proyecto o consulta *"
								className="border-background/15 bg-background/5 text-background placeholder:text-background/50 focus:border-accent focus:bg-background/10 focus:ring-accent/40 w-full resize-none rounded-3xl border px-5 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
							/>
						</div>

						<p className="text-background/60 text-xs leading-relaxed">
							Usamos tus datos únicamente para responder a esta consulta. Al enviar aceptás nuestra{" "}
							<a
								href="/privacidad"
								className="text-background underline underline-offset-2 hover:opacity-80"
							>
								política de privacidad
							</a>
							.
						</p>

						<motion.button
							type="submit"
							disabled={status === "sending"}
							whileHover={prefersReducedMotion ? { scale: 1 } : { scale: 1.01 }}
							whileTap={prefersReducedMotion ? { scale: 1 } : { scale: 0.99 }}
							className="bg-accent shadow-accent/25 hover:shadow-accent/40 group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-sm font-medium text-white shadow-lg transition-all duration-300 disabled:opacity-60"
						>
							<span>{status === "sending" ? "Enviando..." : "Enviar mensaje"}</span>
							<span className="text-accent flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
								{status === "sending" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="relative left-px h-4 w-4" />
								)}
							</span>
						</motion.button>

						{status === "success" && (
							<p className="text-sm font-medium text-emerald-400">
								Mensaje enviado. Te respondemos a la brevedad.
							</p>
						)}
						{status === "error" && errorMsg && (
							<p className="text-sm font-medium text-red-400">{errorMsg}</p>
						)}
					</motion.form>
				</div>
			</div>
		</section>
	)
}
