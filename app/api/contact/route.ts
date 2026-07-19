import { NextResponse } from "next/server";
import { Resend } from "resend";

// Sender must be a domain verified in Resend (SPF/DKIM for ingsimple.cl).
const FROM = "IngSimple <noreply@ingsimple.cl>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  nombre?: string;
  email?: string;
  empresa?: string;
  servicio?: string;
  mensaje?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  let data: ContactPayload;
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const nombre = data.nombre?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const empresa = data.empresa?.trim() ?? "";
  const servicio = data.servicio?.trim() ?? "";
  const mensaje = data.mensaje?.trim() ?? "";

  // Server-side revalidation — never trust the client.
  if (nombre.length < 2) {
    return NextResponse.json(
      { error: "El nombre debe tener al menos 2 caracteres." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido." },
      { status: 400 }
    );
  }
  if (mensaje.length < 10) {
    return NextResponse.json(
      { error: "El mensaje debe tener al menos 10 caracteres." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "El servicio de correo no está configurado." },
      { status: 500 }
    );
  }

  const contactEmail = process.env.CONTACT_EMAIL ?? "contacto@ingsimple.cl";
  const servicioLabel = servicio || "No especificado";
  const resend = new Resend(apiKey);

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
    });

    if (internal.error) {
      return NextResponse.json(
        { error: "Error al enviar el mensaje. Intenta de nuevo más tarde." },
        { status: 502 }
      );
    }

    // 2) Confirmation to the person who reached out.
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Recibimos tu mensaje — IngSimple",
      text: `Hola ${nombre},\n\nGracias por contactarnos. Recibimos tu mensaje y te responderemos a la brevedad.\n\nEquipo IngSimple`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Intenta de nuevo más tarde." },
      { status: 500 }
    );
  }
}
