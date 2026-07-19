import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CornerPlus, Kicker } from "@/components/corner-plus";
import { InView } from "@/lib/motion";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Política de Privacidad",
  description:
    "Cómo Ingeniería Simple SpA trata los datos personales que recibe a través del sitio y el formulario de contacto, de acuerdo con la Ley N° 19.628.",
  path: "/privacidad",
});

const VIGENCIA = "19 de julio de 2026";

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <section className="border-t border-border py-8 sm:py-10">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(n).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-4 pl-0 text-sm leading-relaxed text-muted-foreground sm:text-base sm:pl-8 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#2f80ff]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadPage(): ReactNode {
  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="mx-auto w-full max-w-[1440px] px-5 pt-20 sm:px-8 sm:pt-24 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <Kicker>Legal</Kicker>
            <h1 className="mt-5 text-balance font-serif text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl">
              Política de Privacidad
            </h1>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              Última actualización: {VIGENCIA}
            </p>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
              En <strong className="font-medium text-foreground">Ingeniería
              Simple SpA</strong> (&ldquo;IngSimple&rdquo;) tratamos los datos
              personales que recibimos a través de este sitio y del formulario de
              contacto con responsabilidad y transparencia, de acuerdo con la Ley
              N° 19.628 sobre Protección de la Vida Privada. Esta política explica
              qué datos recolectamos, con qué finalidad, por cuánto tiempo y qué
              derechos tienes sobre ellos.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <Section n={1} title="Responsable del tratamiento">
              <p>
                El responsable del tratamiento de tus datos personales es:
              </p>
              <div className="relative border border-border p-6">
                <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
                <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Razón social
                    </dt>
                    <dd className="mt-1 text-foreground">
                      Ingeniería Simple SpA
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      RUT
                    </dt>
                    <dd className="mt-1 text-foreground">77.933.173-3</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Domicilio
                    </dt>
                    <dd className="mt-1 text-foreground">Santiago, Chile</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Contacto
                    </dt>
                    <dd className="mt-1">
                      <a href="mailto:contacto@ingsimple.cl">
                        contacto@ingsimple.cl
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </Section>

            <Section n={2} title="Datos que recolectamos">
              <p>
                Solo tratamos los datos que nos entregas voluntariamente a través
                del formulario de contacto:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Empresa u organización (opcional)</li>
                <li>Servicio de interés (opcional)</li>
                <li>El contenido del mensaje que nos escribes</li>
              </ul>
              <p>
                No recolectamos datos sensibles ni construimos perfiles con fines
                publicitarios. El sitio utiliza almacenamiento local del navegador
                únicamente para recordar preferencias funcionales, como el tema
                claro u oscuro.
              </p>
            </Section>

            <Section n={3} title="Finalidad del tratamiento">
              <p>Usamos tus datos exclusivamente para:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Responder tu consulta o solicitud.</li>
                <li>
                  Elaborar y enviarte una propuesta cuando corresponda.
                </li>
                <li>
                  Dar seguimiento a la conversación comercial que iniciaste.
                </li>
              </ul>
              <p>
                No utilizamos tus datos para finalidades distintas a las aquí
                indicadas sin tu consentimiento previo.
              </p>
            </Section>

            <Section n={4} title="Base de legitimidad">
              <p>
                El tratamiento se funda en tu consentimiento, que otorgas al
                completar y enviar el formulario de contacto, y en nuestro interés
                legítimo de responder y gestionar tu solicitud. Puedes retirar tu
                consentimiento en cualquier momento escribiéndonos a{" "}
                <a href="mailto:contacto@ingsimple.cl">contacto@ingsimple.cl</a>.
              </p>
            </Section>

            <Section n={5} title="Plazo de conservación">
              <p>
                Conservamos tus datos durante el tiempo necesario para gestionar tu
                consulta y la eventual relación comercial que derive de ella. Una
                vez cumplida esa finalidad, los eliminamos o anonimizamos, salvo que
                debamos conservarlos por obligaciones legales o contables.
              </p>
            </Section>

            <Section n={6} title="Destinatarios y transferencias internacionales">
              <p>
                No vendemos ni cedemos tus datos a terceros. Para el envío de los
                correos del formulario de contacto utilizamos a{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resend
                </a>
                , un proveedor de infraestructura de correo con servidores en el
                extranjero, que actúa como encargado de tratamiento y solo procesa
                los datos necesarios para entregar esos mensajes. Esto puede
                implicar una transferencia internacional de datos, sujeta a las
                garantías de seguridad de dicho proveedor.
              </p>
            </Section>

            <Section n={7} title="Derechos del titular">
              <p>
                De acuerdo con la Ley N° 19.628, puedes ejercer en todo momento tus
                derechos sobre tus datos personales:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-medium text-foreground">Acceso:</strong>{" "}
                  conocer qué datos tuyos tratamos.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Rectificación:
                  </strong>{" "}
                  corregir datos inexactos o desactualizados.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Cancelación:
                  </strong>{" "}
                  solicitar la eliminación de tus datos.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Oposición:
                  </strong>{" "}
                  oponerte a un tratamiento determinado.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Bloqueo:</strong>{" "}
                  suspender el tratamiento mientras se resuelve una solicitud.
                </li>
              </ul>
              <p>
                Para ejercerlos, escríbenos a{" "}
                <a href="mailto:contacto@ingsimple.cl">contacto@ingsimple.cl</a>.
                Responderemos tu solicitud en los plazos que establece la ley.
              </p>
            </Section>

            <Section n={8} title="Seguridad">
              <p>
                Aplicamos medidas técnicas y organizativas razonables para proteger
                tus datos frente a accesos no autorizados, pérdida o alteración.
                Ningún sistema es completamente infalible, pero trabajamos para
                mantener un nivel de seguridad acorde a la naturaleza de los datos
                que tratamos.
              </p>
            </Section>

            <Section n={9} title="Cookies y tecnologías similares">
              <p>
                Este sitio no utiliza cookies de seguimiento ni de publicidad de
                terceros. Solo empleamos almacenamiento local estrictamente
                funcional para recordar preferencias como el tema visual. Si en el
                futuro incorporamos herramientas de analítica, actualizaremos esta
                política y, cuando corresponda, solicitaremos tu consentimiento.
              </p>
            </Section>

            <Section n={10} title="Cambios a esta política">
              <p>
                Podemos actualizar esta política para reflejar cambios legales,
                técnicos u operativos. Publicaremos la versión vigente en esta misma
                página, indicando la fecha de última actualización. Te recomendamos
                revisarla periódicamente.
              </p>
            </Section>

            <Section n={11} title="Reclamos">
              <p>
                Si consideras que el tratamiento de tus datos no se ajusta a la
                normativa vigente, puedes escribirnos primero a{" "}
                <a href="mailto:contacto@ingsimple.cl">contacto@ingsimple.cl</a>{" "}
                para resolverlo directamente, o presentar un reclamo ante la
                autoridad competente en materia de protección de datos personales.
              </p>
            </Section>
          </div>
        </section>
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
