import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contacto@ingsimple.cl"

interface ContactBody {
	nombre: string
	email: string
	mensaje: string
	servicio?: string
	fechaPreferida?: string
	horaPreferida?: string
}

function validateEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as ContactBody

		const { nombre, email, mensaje, servicio, fechaPreferida, horaPreferida } = body

		if (!nombre || nombre.length < 2) {
			return NextResponse.json(
				{ error: "El nombre debe tener al menos 2 caracteres." },
				{ status: 400 }
			)
		}

		if (!email || !validateEmail(email)) {
			return NextResponse.json({ error: "Email inválido." }, { status: 400 })
		}

		if (!mensaje || mensaje.length < 10) {
			return NextResponse.json(
				{ error: "El mensaje debe tener al menos 10 caracteres." },
				{ status: 400 }
			)
		}

		const meetingInfo =
			fechaPreferida || horaPreferida
				? `\n\nPreferencia de reunión:\n- Fecha: ${fechaPreferida ?? "No especificada"}\n- Hora: ${horaPreferida ?? "No especificada"}\n(Nota: estas son preferencias, se confirmará disponibilidad)`
				: ""

		await resend.emails.send({
			from: "IngSimple <noreply@ingsimple.cl>",
			to: [CONTACT_EMAIL],
			subject: `Nuevo contacto: ${nombre}${servicio ? ` - ${servicio}` : ""}`,
			text: `Nombre: ${nombre}\nEmail: ${email}\n${servicio ? `Servicio: ${servicio}\n` : ""}Mensaje:\n${mensaje}${meetingInfo}`,
		})

		await resend.emails.send({
			from: "IngSimple <noreply@ingsimple.cl>",
			to: [email],
			subject: "Recibimos tu mensaje - IngSimple",
			text: `Hola ${nombre},\n\nGracias por contactarnos. Recibimos tu mensaje y te responderemos a la brevedad.\n\nEquipo IngSimple`,
		})

		return NextResponse.json({ success: true })
	} catch {
		return NextResponse.json(
			{ error: "Error al enviar el mensaje. Intentá de nuevo más tarde." },
			{ status: 500 }
		)
	}
}
