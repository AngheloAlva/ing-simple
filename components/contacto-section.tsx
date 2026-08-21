"use client"

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { useInView } from "motion/react"
import { useReducedMotion } from "@/lib/motion"
import { CheckIcon } from "@/components/icons/animated/animated-check"
import type { AnimatedIconHandle } from "@/components/icons/animated/types"
import { Mail, MapPin, ChevronDown } from "lucide-react"
import { CornerPlus, Kicker } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { SERVICES } from "@/lib/services"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Service options come from the single source of truth (includes the
// "Automatizaciones" rename), plus a catch-all.
const SERVICE_OPTIONS = [...SERVICES.map((s) => s.shortName), "Otro"]

const EXPECTATIVAS = [
	"Diagnóstico claro y sin tecnicismos de tu situación actual",
	"Propuesta concreta con alcance, plazos y rangos de inversión",
	"Ejemplos reales de proyectos similares ya en producción",
	"Respuesta directa sobre soporte, capacitación y mantenimiento",
]

const fieldClass =
	"w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus-visible:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
const labelClass = "mb-2 block text-sm font-medium text-foreground"

type Status = "idle" | "sending" | "success" | "error"

interface FormState {
	nombre: string
	email: string
	empresa: string
	servicio: string
	mensaje: string
}

const EMPTY: FormState = {
	nombre: "",
	email: "",
	empresa: "",
	servicio: "",
	mensaje: "",
}

/**
 * A ticked-off promise. The check draws itself when the row scrolls into
 * view rather than on hover: this is a list you read, not one you point at,
 * and a cue nobody can find is not a cue.
 */
function Expectativa({ text, index }: { text: string; index: number }): ReactNode {
	const rowRef = useRef<HTMLLIElement>(null)
	const iconRef = useRef<AnimatedIconHandle>(null)
	const reduced = useReducedMotion()
	const inView = useInView(rowRef, { once: true, margin: "0px 0px -15% 0px" })

	useEffect(() => {
		if (!inView || reduced) return
		const id = setTimeout(() => iconRef.current?.startAnimation(), index * 120)
		return () => clearTimeout(id)
	}, [inView, reduced, index])

	return (
		<li ref={rowRef} className="flex gap-3">
			<span className="text-brand-blue mt-0.5 shrink-0" aria-hidden="true">
				<CheckIcon ref={iconRef} size={16} className="flex" />
			</span>
			<span className="text-muted-foreground text-sm leading-relaxed">{text}</span>
		</li>
	)
}

/** Draws once, on the frame the success panel replaces the form. */
function SuccessCheck(): ReactNode {
	const iconRef = useRef<AnimatedIconHandle>(null)
	const reduced = useReducedMotion()

	useEffect(() => {
		if (reduced) return
		iconRef.current?.startAnimation()
	}, [reduced])

	return <CheckIcon ref={iconRef} size={24} className="flex" aria-hidden="true" />
}

export function ContactoSection() {
	const [form, setForm] = useState<FormState>(EMPTY)
	const [status, setStatus] = useState<Status>("idle")
	const [error, setError] = useState("")

	const set =
		(key: keyof FormState) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((prev) => ({ ...prev, [key]: e.target.value }))

	function validate(): string | null {
		if (form.nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres."
		if (!EMAIL_RE.test(form.email.trim())) return "Ingresa un correo electrónico válido."
		if (form.mensaje.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres."
		return null
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const validationError = validate()
		if (validationError) {
			setError(validationError)
			setStatus("error")
			return
		}

		setStatus("sending")
		setError("")

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			})

			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as {
					error?: string
				} | null
				setError(body?.error ?? "Error al enviar el mensaje. Intenta de nuevo más tarde.")
				setStatus("error")
				return
			}

			setForm(EMPTY)
			setStatus("success")
		} catch {
			setError("Error al enviar el mensaje. Intenta de nuevo más tarde.")
			setStatus("error")
		}
	}

	return (
		<section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
			<div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
				{/* Left — context */}
				<div>
					<Kicker>Contacto</Kicker>
					<h1 className="mt-5 font-serif text-4xl leading-[1.08] font-normal tracking-[-0.01em] text-balance sm:text-5xl">
						Conversemos sobre tu <span className="text-brand-blue">próximo proyecto</span>
					</h1>
					<p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed text-pretty sm:text-lg">
						Cuéntanos qué necesitas y construimos juntos la solución más simple y efectiva para tu
						organización.
					</p>

					<p className="text-foreground mt-12 text-sm font-semibold tracking-tight">
						Qué esperar de la conversación
					</p>
					<ul className="mt-4 space-y-3">
						{EXPECTATIVAS.map((text, i) => (
							<Expectativa key={text} text={text} index={i} />
						))}
					</ul>

					<div className="border-border mt-12 flex flex-col gap-4 border-t border-dotted pt-8 sm:flex-row sm:gap-10">
						<a
							href="mailto:contacto@ingsimple.cl"
							className="group flex items-center gap-3 text-sm"
						>
							<Mail className="text-muted-foreground h-4 w-4" aria-hidden="true" />
							<span className="text-foreground group-hover:underline">contacto@ingsimple.cl</span>
						</a>
						<div className="flex items-center gap-3 text-sm">
							<MapPin className="text-muted-foreground h-4 w-4" aria-hidden="true" />
							<span className="text-muted-foreground">Santiago, Chile</span>
						</div>
					</div>
				</div>

				{/* Right — form panel */}
				<div className="border-border bg-card relative rounded-sm border p-6 sm:p-8 lg:p-10">
					<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
					<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

					{status === "success" ? (
						<div className="flex min-h-[420px] flex-col items-center justify-center text-center">
							<span className="border-brand-blue text-brand-blue grid h-12 w-12 place-items-center rounded-sm border">
								<SuccessCheck />
							</span>
							<p className="mt-6 font-serif text-2xl font-normal tracking-tight">Mensaje enviado</p>
							<p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
								Te responderemos a la brevedad. Revisa tu correo: te enviamos una confirmación.
							</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} noValidate>
							<h2 className="font-serif text-2xl font-normal tracking-tight sm:text-3xl">
								Cuéntanos sobre tu proyecto
							</h2>
							<p className="text-muted-foreground mt-2 text-sm">
								Respondemos en menos de 24 horas hábiles.
							</p>

							<div className="mt-8 grid gap-5">
								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<label htmlFor="nombre" className={labelClass}>
											Nombre completo <span className="text-brand-blue">*</span>
										</label>
										<input
											id="nombre"
											name="nombre"
											type="text"
											autoComplete="name"
											value={form.nombre}
											onChange={set("nombre")}
											required
											className={fieldClass}
										/>
									</div>
									<div>
										<label htmlFor="email" className={labelClass}>
											Email <span className="text-brand-blue">*</span>
										</label>
										<input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											value={form.email}
											onChange={set("email")}
											required
											className={fieldClass}
										/>
									</div>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<label htmlFor="empresa" className={labelClass}>
											Empresa
										</label>
										<input
											id="empresa"
											name="empresa"
											type="text"
											autoComplete="organization"
											value={form.empresa}
											onChange={set("empresa")}
											className={fieldClass}
										/>
									</div>
									<div>
										<label htmlFor="servicio" className={labelClass}>
											Servicio de interés
										</label>
										<div className="relative">
											<select
												id="servicio"
												name="servicio"
												value={form.servicio}
												onChange={set("servicio")}
												className={`${fieldClass} cursor-pointer appearance-none pr-10 ${
													form.servicio === "" ? "text-muted-foreground" : ""
												}`}
											>
												<option value="">Selecciona una opción</option>
												{SERVICE_OPTIONS.map((opt) => (
													<option key={opt} value={opt}>
														{opt}
													</option>
												))}
											</select>
											<ChevronDown
												className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
												aria-hidden="true"
											/>
										</div>
									</div>
								</div>

								<div>
									<label htmlFor="mensaje" className={labelClass}>
										Mensaje <span className="text-brand-blue">*</span>
									</label>
									<textarea
										id="mensaje"
										name="mensaje"
										rows={5}
										value={form.mensaje}
										onChange={set("mensaje")}
										required
										placeholder="Cuéntanos brevemente sobre tu proyecto o consulta"
										className={`${fieldClass} resize-none`}
									/>
								</div>
							</div>

							{status === "error" && error ? (
								<p
									role="alert"
									className="border-destructive/40 bg-destructive/10 text-destructive mt-4 border px-4 py-3 text-sm"
								>
									{error}
								</p>
							) : null}

							<p className="text-muted-foreground mt-5 text-xs leading-relaxed">
								Usamos tus datos únicamente para responder a esta consulta. Al enviar aceptas
								nuestra{" "}
								<a
									href="/privacidad"
									className="hover:text-foreground underline underline-offset-2"
								>
									política de privacidad
								</a>
								.
							</p>

							<div className="mt-6">
								<CutButton
									type="submit"
									variant="solid"
									icon="send"
									fullWidth
									disabled={status === "sending"}
									className="disabled:cursor-not-allowed disabled:opacity-60"
								>
									{status === "sending" ? "Enviando..." : "Enviar mensaje"}
								</CutButton>
							</div>
						</form>
					)}
				</div>
			</div>
		</section>
	)
}
