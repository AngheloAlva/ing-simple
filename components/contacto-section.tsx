"use client"

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useInView } from "motion/react"
import { useReducedMotion } from "@/lib/motion"
import { CheckIcon } from "@/components/icons/animated/animated-check"
import type { AnimatedIconHandle } from "@/components/icons/animated/types"
import { Mail, MapPin, Clock, ChevronDown } from "lucide-react"
import { CornerPlus } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import GradientText from "@/components/gradient-text"
import { brandGradient } from "@/lib/gradient"
import { SERVICES } from "@/lib/services"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mirrors the server-side limits in app/api/contact/route.ts.
const LIMITS = {
	nombre: 80,
	email: 120,
	empresa: 80,
	servicio: 60,
	mensaje: 2000,
} as const

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
const errorClass = "text-destructive mt-1.5 text-xs"

type Status = "idle" | "sending" | "success" | "error"

interface FormState {
	nombre: string
	email: string
	empresa: string
	servicio: string
	mensaje: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const FIELD_ORDER: (keyof FormState)[] = ["nombre", "email", "empresa", "servicio", "mensaje"]

const EMPTY: FormState = {
	nombre: "",
	email: "",
	empresa: "",
	servicio: "",
	mensaje: "",
}

function validate(form: FormState): FieldErrors {
	const errors: FieldErrors = {}
	const nombre = form.nombre.trim()
	const email = form.email.trim()
	const empresa = form.empresa.trim()
	const mensaje = form.mensaje.trim()

	if (nombre.length < 2) errors.nombre = "El nombre debe tener al menos 2 caracteres."
	else if (nombre.length > LIMITS.nombre)
		errors.nombre = `El nombre no puede superar los ${LIMITS.nombre} caracteres.`

	if (!EMAIL_RE.test(email)) errors.email = "Ingresa un correo electrónico válido."
	else if (email.length > LIMITS.email)
		errors.email = `El correo no puede superar los ${LIMITS.email} caracteres.`

	if (empresa.length > LIMITS.empresa)
		errors.empresa = `La empresa no puede superar los ${LIMITS.empresa} caracteres.`

	if (mensaje.length < 10) errors.mensaje = "El mensaje debe tener al menos 10 caracteres."
	else if (mensaje.length > LIMITS.mensaje)
		errors.mensaje = `El mensaje no puede superar los ${LIMITS.mensaje} caracteres.`

	return errors
}

/** The classes and ARIA wiring an invalid field carries. */
function fieldProps(id: keyof FormState, error: string | undefined, extra = "") {
	return {
		id,
		"name": id,
		"aria-invalid": Boolean(error),
		"aria-describedby": error ? `${id}-error` : undefined,
		"className": `${fieldClass} ${error ? "border-destructive" : ""} ${extra}`.trim(),
	}
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

interface ContactoSectionProps {
	/** Service `shortName` preselected in the form, e.g. when arriving from a service page. */
	initialServicio?: string
}

export function ContactoSection({ initialServicio = "" }: ContactoSectionProps = {}) {
	const [form, setForm] = useState<FormState>({ ...EMPTY, servicio: initialServicio })
	const [website, setWebsite] = useState("")
	const [status, setStatus] = useState<Status>("idle")
	const [errors, setErrors] = useState<FieldErrors>({})
	const [serverError, setServerError] = useState("")

	const set =
		(key: keyof FormState) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			const value = e.target.value
			setForm((prev) => ({ ...prev, [key]: value }))
			setErrors((prev) => {
				if (!prev[key]) return prev
				const next = { ...prev }
				delete next[key]
				return next
			})
		}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const fieldErrors = validate(form)
		const firstInvalid = FIELD_ORDER.find((key) => fieldErrors[key])
		if (firstInvalid) {
			setErrors(fieldErrors)
			document.getElementById(firstInvalid)?.focus()
			return
		}

		setStatus("sending")
		setServerError("")

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...form, website }),
			})

			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as {
					error?: string
				} | null
				setServerError(body?.error ?? "Error al enviar el mensaje. Intenta de nuevo más tarde.")
				setStatus("error")
				return
			}

			setForm({ ...EMPTY, servicio: initialServicio })
			setStatus("success")
		} catch {
			setServerError("Error al enviar el mensaje. Intenta de nuevo más tarde.")
			setStatus("error")
		}
	}

	return (
		<section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1440px] items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
			<div className="grid w-full items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
				{/* Left — context */}
				<div>
					<h1 className="font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]">
						Tú pones el problema,{" "}
						<GradientText
							inline
							className="font-sans font-semibold tracking-tight"
							colors={brandGradient}
							animationSpeed={6}
						>
							nosotros la propuesta
						</GradientText>
					</h1>
					<p className="text-muted-foreground mt-5 max-w-md text-[15px] leading-relaxed sm:text-base">
						Sin llamadas de venta ni formularios eternos. Nos escribes, y en menos de 24 horas
						hábiles te respondemos con un diagnóstico y los siguientes pasos.
					</p>

					<p className="text-foreground mt-12 text-sm font-semibold tracking-tight">
						Qué esperar de la conversación
					</p>
					<ul className="mt-4 space-y-3">
						{EXPECTATIVAS.map((text, i) => (
							<Expectativa key={text} text={text} index={i} />
						))}
					</ul>

					<div className="border-border mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-dotted pt-8">
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
						<div className="flex items-center gap-3 text-sm">
							<Clock className="text-muted-foreground h-4 w-4" aria-hidden="true" />
							<span className="text-muted-foreground">Lun–Vie, 9:00 a 18:00 (CLT)</span>
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

							<div className="mt-8 grid gap-5">
								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<label htmlFor="nombre" className={labelClass}>
											Nombre completo <span className="text-brand-blue">*</span>
										</label>
										<input
											{...fieldProps("nombre", errors.nombre)}
											type="text"
											autoComplete="name"
											placeholder="Tu nombre y apellido"
											maxLength={LIMITS.nombre}
											value={form.nombre}
											onChange={set("nombre")}
											required
										/>
										{errors.nombre ? (
											<p id="nombre-error" className={errorClass}>
												{errors.nombre}
											</p>
										) : null}
									</div>
									<div>
										<label htmlFor="email" className={labelClass}>
											Email <span className="text-brand-blue">*</span>
										</label>
										<input
											{...fieldProps("email", errors.email)}
											type="email"
											autoComplete="email"
											placeholder="nombre@empresa.cl"
											maxLength={LIMITS.email}
											value={form.email}
											onChange={set("email")}
											required
										/>
										{errors.email ? (
											<p id="email-error" className={errorClass}>
												{errors.email}
											</p>
										) : null}
									</div>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<label htmlFor="empresa" className={labelClass}>
											Empresa
										</label>
										<input
											{...fieldProps("empresa", errors.empresa)}
											type="text"
											autoComplete="organization"
											placeholder="Nombre de tu empresa"
											maxLength={LIMITS.empresa}
											value={form.empresa}
											onChange={set("empresa")}
										/>
										{errors.empresa ? (
											<p id="empresa-error" className={errorClass}>
												{errors.empresa}
											</p>
										) : null}
									</div>
									<div>
										<label htmlFor="servicio" className={labelClass}>
											Servicio de interés
										</label>
										<div className="relative">
											<select
												{...fieldProps(
													"servicio",
													errors.servicio,
													`cursor-pointer appearance-none pr-10 ${
														form.servicio === "" ? "text-muted-foreground" : ""
													}`
												)}
												value={form.servicio}
												onChange={set("servicio")}
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
										{...fieldProps("mensaje", errors.mensaje, "resize-none")}
										rows={5}
										maxLength={LIMITS.mensaje}
										value={form.mensaje}
										onChange={set("mensaje")}
										required
										placeholder="Cuéntanos brevemente sobre tu proyecto o consulta"
									/>
									<div className="mt-1.5 flex items-start justify-between gap-4">
										{errors.mensaje ? (
											<p id="mensaje-error" className="text-destructive text-xs">
												{errors.mensaje}
											</p>
										) : (
											<span />
										)}
										<span
											className="text-muted-foreground shrink-0 font-mono text-[11px] tabular-nums"
											aria-live="polite"
										>
											{form.mensaje.length} / {LIMITS.mensaje}
										</span>
									</div>
								</div>
							</div>

							{/* Honeypot: invisible to people, tempting to bots. */}
							<div
								className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
								aria-hidden="true"
							>
								<label htmlFor="website">Sitio web</label>
								<input
									id="website"
									name="website"
									type="text"
									tabIndex={-1}
									autoComplete="off"
									value={website}
									onChange={(e) => setWebsite(e.target.value)}
								/>
							</div>

							{status === "error" && serverError ? (
								<p
									role="alert"
									className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-sm border px-4 py-3 text-sm"
								>
									{serverError}
								</p>
							) : null}

							<p className="text-muted-foreground mt-5 text-xs leading-relaxed">
								Usamos tus datos únicamente para responder a esta consulta. Al enviar aceptas
								nuestra{" "}
								<Link
									href="/privacidad"
									className="hover:text-foreground underline underline-offset-2"
								>
									política de privacidad
								</Link>
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
