"use client"

import { CornerPlus } from "@/components/corner-plus"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

type QA = { question: string; answer: string }

const FAQS: QA[] = [
	{
		question: "¿Qué tipo de empresas atienden?",
		answer:
			"Trabajamos con empresas de todos los tamaños, desde startups hasta organizaciones consolidadas. Nuestras soluciones se adaptan a las necesidades específicas de cada cliente, sin importar su industria o complejidad.",
	},
	{
		question: "¿Cuánto tiempo toma implementar una solución?",
		answer:
			"Depende del alcance del proyecto. Un dashboard puede estar listo en 1-2 semanas, mientras que una automatización que cruza varios sistemas puede tomar 4-6 semanas. Siempre entregamos cronogramas claros antes de comenzar.",
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

const EASE = [0.22, 1, 0.36, 1] as const

function FaqItem({
	item,
	isOpen,
	onToggle,
	index,
}: {
	item: QA
	isOpen: boolean
	onToggle: () => void
	index: number
}): ReactNode {
	const panelId = `faq-panel-${index}`
	const buttonId = `faq-button-${index}`

	return (
		// The divider is driven by the index, not by `:first-child`: the two
		// decorative CornerPlus marks are the accordion's real first children,
		// so a position-based variant paints a rule above the first question.
		<div className={`border-border border-dotted ${index > 0 ? "border-t" : ""}`}>
			<h3>
				<button
					id={buttonId}
					type="button"
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={onToggle}
					className="focus-ring flex w-full items-center justify-between gap-6 py-5 pr-1 text-left lg:py-6 lg:pl-12"
				>
					<span className="text-base font-medium tracking-tight sm:text-lg">{item.question}</span>
					<motion.span
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.3, ease: EASE }}
						className="text-muted-foreground shrink-0"
					>
						<ChevronDown className="h-5 w-5" aria-hidden="true" />
					</motion.span>
				</button>
			</h3>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						id={panelId}
						role="region"
						aria-labelledby={buttonId}
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4, ease: EASE }}
						className="overflow-hidden"
					>
						<p className="text-muted-foreground max-w-xl pr-6 pb-6 text-sm leading-relaxed lg:pl-12">
							{item.answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export function Faq(): ReactNode {
	const [openIndex, setOpenIndex] = useState<number | null>(0)
	const accordionRef = useRef<HTMLDivElement | null>(null)
	const [minHeight, setMinHeight] = useState<number | undefined>(undefined)

	useEffect(() => {
		const node = accordionRef.current
		if (node === null) return

		let peak = 0
		let width = node.offsetWidth

		const observer = new ResizeObserver(() => {
			if (node.offsetWidth !== width) {
				width = node.offsetWidth
				peak = 0
				setMinHeight(undefined)
				return
			}
			const next = node.offsetHeight
			if (next > peak) {
				peak = next
				setMinHeight(next)
			}
		})

		observer.observe(node)
		return () => observer.disconnect()
	}, [])

	return (
		<section className="mx-auto max-w-360 px-5 pb-32 sm:px-8 sm:pb-44 lg:px-10">
			<div className="border-border relative grid border-y lg:grid-cols-[0.85fr_1.15fr]">
				{/* Outer frame corners */}
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				{/* Left: heading */}
				<div className="border-border border-b py-10 lg:border-r lg:border-b-0 lg:py-16 lg:pr-12">
					<h2 className="font-serif text-4xl leading-[1.05] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]">
						Preguntas frecuentes
					</h2>
					<p className="text-muted-foreground mt-6 max-w-sm text-sm leading-relaxed sm:text-base">
						Todo lo que necesitas saber para empezar. ¿No encuentras tu respuesta? Escríbenos y te
						ayudamos.
					</p>
				</div>

				{/* Right: accordion */}
				<div
					ref={accordionRef}
					className="relative"
					style={minHeight !== undefined ? { minHeight } : undefined}
				>
					{/* Plus marks where the divider meets the frame */}
					<CornerPlus className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
					<CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
					{FAQS.map((item, i) => (
						<FaqItem
							key={item.question}
							item={item}
							index={i}
							isOpen={openIndex === i}
							onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
