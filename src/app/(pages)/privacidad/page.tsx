import { createMetadata } from "@/lib/metadata"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Política de Privacidad",
	description:
		"Cómo Ingeniería Simple SpA trata los datos personales que recibe a través del sitio y el formulario de contacto, de acuerdo con la Ley 19.628.",
	path: "/privacidad",
})

const VIGENCIA = "24 de mayo de 2026"

export default function PrivacidadPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<section className="bg-background py-20 md:py-32">
				<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
					<header className="mb-12">
						<span className="text-accent mb-3 block text-sm font-medium tracking-wider uppercase">
							Legal
						</span>
						<h1 className="text-foreground text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
							Política de Privacidad
						</h1>
						<p className="text-muted-foreground mt-4 text-sm">Última actualización: {VIGENCIA}</p>
					</header>

					<div className="text-foreground/90 space-y-10 text-base leading-relaxed">
						<p>
							En <strong>Ingeniería Simple SpA</strong> ("IngSimple", "nosotros") nos tomamos en
							serio la privacidad de las personas que se contactan con nosotros. Esta política
							explica qué datos recolectamos, con qué finalidad, durante cuánto tiempo los
							conservamos y qué derechos tenés sobre ellos, de acuerdo con la Ley N° 19.628 sobre
							Protección de la Vida Privada y demás normativa chilena aplicable.
						</p>

						<Section title="1. Responsable del tratamiento">
							<ul className="text-muted-foreground list-none space-y-1 text-sm">
								<li>
									<strong className="text-foreground">Razón social:</strong> Ingeniería Simple SpA
								</li>
								<li>
									<strong className="text-foreground">RUT:</strong> 77.933.173-3
								</li>
								<li>
									<strong className="text-foreground">Domicilio:</strong> Santiago, Chile
								</li>
								<li>
									<strong className="text-foreground">Email de contacto:</strong>{" "}
									<a href="mailto:contacto@ingsimple.cl" className="text-accent hover:underline">
										contacto@ingsimple.cl
									</a>
								</li>
							</ul>
						</Section>

						<Section title="2. Datos que recolectamos">
							<p>
								Solo recolectamos los datos que vos mismo nos entregás voluntariamente al usar el
								formulario de contacto de este sitio:
							</p>
							<ul className="text-muted-foreground list-disc space-y-1 pl-6">
								<li>Nombre completo</li>
								<li>Correo electrónico</li>
								<li>Empresa u organización (opcional)</li>
								<li>Servicio de interés (opcional)</li>
								<li>Contenido del mensaje que nos envíes</li>
							</ul>
							<p>
								No solicitamos datos sensibles (salud, origen étnico, creencias, situación
								socioeconómica, etc.). Te pedimos que no incluyas datos de ese tipo en el mensaje
								libre.
							</p>
						</Section>

						<Section title="3. Finalidad del tratamiento">
							<p>Usamos esos datos exclusivamente para:</p>
							<ul className="text-muted-foreground list-disc space-y-1 pl-6">
								<li>Responder a tu consulta o solicitud comercial.</li>
								<li>Coordinar reuniones o llamadas que tú mismo solicites.</li>
								<li>
									Enviarte una confirmación automática de que recibimos tu mensaje al email que
									indicaste.
								</li>
							</ul>
							<p>
								<strong>No usamos tus datos para marketing masivo</strong>, no los vendemos y no los
								compartimos con terceros con fines publicitarios.
							</p>
						</Section>

						<Section title="4. Base de legitimidad">
							<p>
								El tratamiento se realiza sobre la base de tu <strong>consentimiento</strong>,
								otorgado al enviar el formulario, conforme al artículo 4 de la Ley 19.628. Podés
								retirar ese consentimiento en cualquier momento (ver sección 7).
							</p>
						</Section>

						<Section title="5. Plazo de conservación">
							<p>
								Conservamos los datos durante el tiempo necesario para responder a tu consulta y, de
								avanzar la conversación, durante la vigencia de la relación comercial más un período
								razonable posterior por obligaciones legales o contables. Si tu consulta no deriva
								en una relación comercial, eliminamos los datos a los <strong>12 meses</strong>.
							</p>
						</Section>

						<Section title="6. Destinatarios y transferencias internacionales">
							<p>
								Para enviarte el email de confirmación y recibir tu mensaje en nuestra casilla
								utilizamos <strong>Resend</strong> (Resend Inc., con sede en Estados Unidos) como
								proveedor de envío transaccional. Esto implica una transferencia internacional de tu
								correo electrónico y del contenido del mensaje a un encargado de tratamiento ubicado
								fuera de Chile.
							</p>
							<p>
								Resend trata estos datos únicamente bajo nuestras instrucciones y con medidas de
								seguridad equivalentes. Podés revisar su política en{" "}
								<a
									href="https://resend.com/legal/privacy-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="text-accent hover:underline"
								>
									resend.com/legal/privacy-policy
								</a>
								.
							</p>
							<p>No compartimos tus datos con ningún otro tercero.</p>
						</Section>

						<Section title="7. Derechos del titular">
							<p>
								En tu calidad de titular de los datos, podés ejercer en cualquier momento los
								siguientes derechos:
							</p>
							<ul className="text-muted-foreground list-disc space-y-1 pl-6">
								<li>
									<strong className="text-foreground">Acceso:</strong> conocer qué datos tuyos
									tenemos.
								</li>
								<li>
									<strong className="text-foreground">Rectificación:</strong> corregir datos
									inexactos o incompletos.
								</li>
								<li>
									<strong className="text-foreground">Cancelación:</strong> solicitar la eliminación
									de tus datos.
								</li>
								<li>
									<strong className="text-foreground">Oposición:</strong> oponerte al tratamiento.
								</li>
								<li>
									<strong className="text-foreground">Bloqueo:</strong> suspender temporalmente el
									tratamiento.
								</li>
							</ul>
							<p>
								Para ejercer cualquiera de estos derechos, escribinos a{" "}
								<a href="mailto:contacto@ingsimple.cl" className="text-accent hover:underline">
									contacto@ingsimple.cl
								</a>{" "}
								indicando tu solicitud. Te responderemos dentro de un plazo máximo de{" "}
								<strong>2 días hábiles</strong>.
							</p>
						</Section>

						<Section title="8. Seguridad">
							<p>
								Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra
								accesos no autorizados, pérdida o alteración. Las comunicaciones con este sitio
								viajan cifradas mediante HTTPS/TLS y los emails se transmiten a través de
								proveedores con autenticación SPF/DKIM.
							</p>
							<p>
								Ningún sistema es 100% inviolable. En caso de incidente de seguridad que afecte tus
								datos personales, te lo notificaremos sin dilación indebida.
							</p>
						</Section>

						<Section title="9. Cookies y tecnologías similares">
							<p>
								Este sitio no utiliza cookies de seguimiento publicitario ni herramientas de
								analítica de terceros. Solo se emplean cookies estrictamente necesarias para el
								funcionamiento del sitio (por ejemplo, recordar tu preferencia de tema
								claro/oscuro).
							</p>
						</Section>

						<Section title="10. Cambios a esta política">
							<p>
								Podemos actualizar esta política para reflejar cambios legales, técnicos u
								operativos. La versión vigente siempre estará publicada en esta misma URL con la
								fecha de última actualización al inicio. Si los cambios son sustanciales, lo
								comunicaremos por los medios habituales.
							</p>
						</Section>

						<Section title="11. Reclamos">
							<p>
								Si considerás que el tratamiento de tus datos no cumple con la normativa vigente,
								podés presentar un reclamo ante los tribunales civiles competentes en Chile,
								conforme al procedimiento establecido en la Ley 19.628.
							</p>
						</Section>
					</div>
				</div>
			</section>
		</main>
	)
}

function Section({ title, children }: { title: string; children: ReactNode }): ReactNode {
	return (
		<section className="space-y-3">
			<h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
			{children}
		</section>
	)
}
