"use client"

import { ChevronDown, ChevronRightIcon } from "lucide-react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { useRef, useState, type ReactNode } from "react"

const easeOut = [0.16, 1, 0.3, 1] as const

const faqs = [
	{
		question: "¿Qué tipo de empresas atienden?",
		answer:
			"Trabajamos con empresas de todos los tamaños, desde startups hasta organizaciones consolidadas. Nuestras soluciones se adaptan a las necesidades específicas de cada cliente, sin importar su industria o complejidad.",
	},
	{
		question: "¿Cuánto tiempo toma implementar una solución?",
		answer:
			"Depende del alcance del proyecto. Un dashboard puede estar listo en 1-2 semanas, mientras que una aplicación Power Platform más compleja puede tomar 4-6 semanas. Siempre entregamos cronogramas claros antes de comenzar.",
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
			"Agenda una llamada de diagnóstico gratuita. En 30 minutos entenderemos tus necesidades y te propondremos un plan de acción. Sin compromisos, solo una conversación para explorar cómo podemos ayudarte.",
	},
]

function FAQItem({
	faq,
	index,
	isOpen,
	onToggle,
}: {
	faq: (typeof faqs)[0]
	index: number
	isOpen: boolean
	onToggle: () => void
}): ReactNode {
	return (
		<motion.div
			className="border-foreground/10 border-b last:border-b-0"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.5, delay: index * 0.05, ease: easeOut }}
		>
			<button
				onClick={onToggle}
				className="group flex w-full items-center justify-between py-6 text-left"
			>
				<span className="text-foreground pr-8 text-lg font-medium md:text-xl">{faq.question}</span>
				<motion.div
					className="text-foreground/50 shrink-0"
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3, ease: easeOut }}
				>
					<ChevronDown className="h-5 w-5" />
				</motion.div>
			</button>
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: easeOut }}
						className="overflow-hidden"
					>
						<p className="text-muted-foreground pb-6 text-base leading-relaxed">{faq.answer}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export function FAQ(): ReactNode {
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const headerRef = useRef<HTMLDivElement>(null)
	const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 })

	const handleToggle = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<section className="bg-foreground rounded-4xl px-6 py-16 md:py-32">
			<div className="mx-auto max-w-3xl">
				<motion.div
					ref={headerRef}
					className="mb-12 text-center md:mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h2 className="text-background text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
						Preguntas Frecuentes
					</h2>
				</motion.div>

				<motion.div
					className="bg-background rounded-2xl px-6 py-2 md:px-10"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					{faqs.map((faq, index) => (
						<FAQItem
							key={faq.question}
							faq={faq}
							index={index}
							isOpen={openIndex === index}
							onToggle={() => handleToggle(index)}
						/>
					))}
				</motion.div>

				<motion.div
					className="mt-12 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
				>
					<p className="text-background/60 mb-6 text-base">
						¿Tienes más preguntas? Estamos aquí para ayudarte.
					</p>
					<a
						href="mailto:contacto@ingsimple.cl"
						className="group bg-background text-foreground inline-flex items-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium shadow-lg transition-all duration-500 ease-out hover:rounded-[50px]"
					>
						<span>Contáctanos</span>
						<span className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
							<ChevronRightIcon className="relative left-px h-4 w-4" />
						</span>
					</a>
				</motion.div>
			</div>
		</section>
	)
}
