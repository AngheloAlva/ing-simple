export interface HomeFaqItem {
	question: string
	answer: string
}

/**
 * Home page FAQ content. Lives here (not in `components/faq.tsx`, which is
 * a client component) so it stays server-safe and can also feed the
 * FAQPage JSON-LD rendered from `app/page.tsx`.
 */
export const HOME_FAQ: HomeFaqItem[] = [
	{
		question: "¿Qué tipo de empresas atienden?",
		answer:
			"Trabajamos con empresas en Chile que necesitan reportes en Power BI, automatizar procesos, desarrollar sitios o sistemas web, o capacitar a sus equipos. Conversamos sobre tu necesidad para definir juntos el alcance del trabajo.",
	},
	{
		question: "¿Cuánto tiempo toma implementar una solución?",
		answer:
			"El tiempo depende del alcance de cada proyecto, por eso no damos un plazo único para todas las soluciones. Construimos los reportes y sitios web contigo: puedes participar y ver los avances desde las primeras etapas hasta completar el trabajo.",
	},
	{
		question: "¿Las capacitaciones son presenciales o online?",
		answer:
			"Ofrecemos ambas modalidades. Las sesiones online son ideales para equipos distribuidos, mientras que las presenciales funcionan mejor para grupos pequeños en una misma ubicación. Adaptamos el formato a tus necesidades.",
	},
	{
		question: "¿Necesito tener conocimientos técnicos previos?",
		answer:
			"No es necesario. Nuestro enfoque es hacer la tecnología accesible. Te acompañamos desde lo básico hasta el dominio de las herramientas, adaptando el ritmo a tu nivel de conocimiento previo.",
	},
	{
		question: "¿Cómo puedo comenzar a trabajar con ustedes?",
		answer:
			"Escríbenos desde la página de contacto con tu situación. Recibes una confirmación al instante y en menos de 24 horas hábiles te respondemos con un diagnóstico y los siguientes pasos. Sin compromiso.",
	},
]
