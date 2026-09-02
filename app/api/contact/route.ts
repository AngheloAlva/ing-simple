import { NextResponse } from "next/server"
import { Resend } from "resend"
import { siteConfig } from "@/lib/metadata"

// Sender must be a domain verified in Resend (SPF/DKIM for ingsimple.cl).
const FROM = "IngSimple <noreply@ingsimple.cl>"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Field limits, enforced after trim. Mirrored by `maxLength` on the form.
const LIMITS = {
	nombre: 80,
	email: 120,
	empresa: 80,
	servicio: 60,
	mensaje: 2000,
} as const

// Sliding-window rate limit per client IP. This map lives in module scope,
// so it is per-instance and best-effort on serverless: each warm instance
// keeps its own counters and a cold start resets them. Enough to blunt a
// naive script, not a substitute for an edge firewall rule.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const requestLog = new Map<string, number[]>()

function clientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for")
	if (forwarded) {
		const first = forwarded.split(",")[0]?.trim()
		if (first) return first
	}
	const real = request.headers.get("x-real-ip")?.trim()
	return real || "unknown"
}

/** Records the hit and reports whether the caller is over the limit. */
function isRateLimited(ip: string, now: number): boolean {
	const cutoff = now - RATE_LIMIT_WINDOW_MS
	const recent = (requestLog.get(ip) ?? []).filter((ts) => ts > cutoff)
	if (recent.length >= RATE_LIMIT_MAX) {
		requestLog.set(ip, recent)
		return true
	}
	recent.push(now)
	requestLog.set(ip, recent)
	return false
}

interface ContactPayload {
	nombre?: string
	email?: string
	empresa?: string
	servicio?: string
	mensaje?: string
	/** Honeypot. Hidden from people, filled by bots. */
	website?: string
}

function tooLong(field: string, limit: number): NextResponse {
	return NextResponse.json(
		{ error: `${field} no puede superar los ${limit} caracteres.` },
		{ status: 400 }
	)
}

export async function POST(request: Request): Promise<NextResponse> {
	if (isRateLimited(clientIp(request), Date.now())) {
		return NextResponse.json(
			{ error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
			{ status: 429 }
		)
	}

	let data: ContactPayload
	try {
		data = (await request.json()) as ContactPayload
	} catch {
		return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 })
	}

	// Honeypot tripped: pretend it worked and send nothing.
	if (typeof data.website === "string" && data.website.trim() !== "") {
		return NextResponse.json({ success: true })
	}

	const nombre = data.nombre?.trim() ?? ""
	const email = data.email?.trim() ?? ""
	const empresa = data.empresa?.trim() ?? ""
	const servicio = data.servicio?.trim() ?? ""
	const mensaje = data.mensaje?.trim() ?? ""

	// Server-side revalidation — never trust the client.
	if (nombre.length < 2) {
		return NextResponse.json(
			{ error: "El nombre debe tener al menos 2 caracteres." },
			{ status: 400 }
		)
	}
	if (nombre.length > LIMITS.nombre) return tooLong("El nombre", LIMITS.nombre)
	if (!EMAIL_RE.test(email)) {
		return NextResponse.json({ error: "Ingresa un correo electrónico válido." }, { status: 400 })
	}
	if (email.length > LIMITS.email) return tooLong("El correo", LIMITS.email)
	if (empresa.length > LIMITS.empresa) return tooLong("La empresa", LIMITS.empresa)
	if (servicio.length > LIMITS.servicio) return tooLong("El servicio", LIMITS.servicio)
	if (mensaje.length < 10) {
		return NextResponse.json(
			{ error: "El mensaje debe tener al menos 10 caracteres." },
			{ status: 400 }
		)
	}
	if (mensaje.length > LIMITS.mensaje) return tooLong("El mensaje", LIMITS.mensaje)

	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		return NextResponse.json(
			{ error: "El servicio de correo no está configurado." },
			{ status: 500 }
		)
	}

	const contactEmail = process.env.CONTACT_EMAIL ?? "contacto@ingsimple.cl"
	const servicioLabel = servicio || "No especificado"
	const resend = new Resend(apiKey)

	try {
		// 1) Internal notification to the IngSimple inbox.
		const internal = await resend.emails.send({
			from: FROM,
			to: contactEmail,
			replyTo: email,
			subject: `Nuevo contacto: ${nombre} — ${servicioLabel}`,
			text: [
				`Nombre: ${nombre}`,
				`Email: ${email}`,
				empresa ? `Empresa: ${empresa}` : null,
				`Servicio: ${servicioLabel}`,
				"",
				"Mensaje:",
				mensaje,
			]
				.filter((line): line is string => line !== null)
				.join("\n"),
		})

		if (internal.error) {
			return NextResponse.json(
				{ error: "Error al enviar el mensaje. Intenta de nuevo más tarde." },
				{ status: 502 }
			)
		}

		// 2) Confirmation to the person who reached out.
		await resend.emails.send({
			from: FROM,
			to: email,
			subject: "Recibimos tu mensaje — Ingeniería Simple",
			text: [
				`Hola ${nombre},`,
				"",
				"Gracias por escribirnos. Recibimos tu mensaje y ya lo estamos revisando.",
				"Te respondemos en menos de 24 horas hábiles.",
				"",
				"Tu mensaje:",
				mensaje,
				"",
				"Equipo Ingeniería Simple",
				siteConfig.url,
			].join("\n"),
		})

		return NextResponse.json({ success: true })
	} catch {
		return NextResponse.json(
			{ error: "Error al enviar el mensaje. Intenta de nuevo más tarde." },
			{ status: 500 }
		)
	}
}
