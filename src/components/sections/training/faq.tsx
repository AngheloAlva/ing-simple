"use client"

import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function TrainingFAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const faqs = [
		{
			question: "¿En qué herramientas ofrecen capacitación?",
			answer:
				"Ofrecemos capacitación en Power BI, Power Apps, Excel avanzado, Power Automate y otras herramientas del ecosistema Microsoft 365. También podemos adaptar el contenido a herramientas específicas de tu organización.",
		},
		{
			question: "¿Las capacitaciones son presenciales o virtuales?",
			answer:
				"Ofrecemos ambas modalidades. Las sesiones pueden ser presenciales en tu oficina, virtuales en vivo por Teams/Zoom, o un formato híbrido. Nos adaptamos a la dinámica de tu equipo.",
		},
		{
			question: "¿Se necesitan conocimientos previos?",
			answer:
				"Depende del programa. Tenemos niveles desde principiante hasta avanzado. Antes de cada capacitación hacemos un diagnóstico para adaptar el contenido al nivel real de los participantes.",
		},
		{
			question: "¿Cuánto dura cada programa de capacitación?",
			answer:
				"Varía según el programa y la profundidad. Desde talleres intensivos de medio día hasta programas completos de varias semanas. Diseñamos la duración según tus objetivos y disponibilidad.",
		},
		{
			question: "¿Entregan material y certificados?",
			answer:
				"Sí. Cada participante recibe material de apoyo, ejercicios prácticos y un certificado de participación al completar el programa. También incluimos guías de referencia rápida para uso diario.",
		},
		{
			question: "¿Ofrecen capacitación para nivel intermedio o avanzado?",
			answer:
				"Absolutamente. Muchas empresas nos contactan porque su equipo ya usa las herramientas pero no aprovecha todo su potencial. Nuestros programas intermedios y avanzados están diseñados para llevarlos al siguiente nivel.",
		},
	]

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	return (
		<section className="bg-background flex min-h-screen w-full items-start px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16 xl:gap-20">
					{/* Left Column - Header */}
					<div className="flex flex-col space-y-2 lg:sticky lg:top-24 lg:self-start">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-foreground text-3xl leading-tight font-medium sm:text-4xl md:text-5xl lg:text-6xl"
						>
							Preguntas Frecuentes
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-muted-foreground max-w-[25ch] text-base leading-relaxed sm:text-lg"
						>
							Todo lo que necesitas saber sobre nuestras capacitaciones y programas de formación.
						</motion.p>
					</div>

					{/* Right Column - Accordion */}
					<div className="flex flex-col">
						{faqs.map((faq, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
								className={`border-muted-foreground/50 border-b ${index === 0 ? "border-t" : ""}`}
							>
								<button
									onClick={() => toggleFAQ(index)}
									className="group flex w-full items-start justify-between gap-4 py-6 text-left sm:py-8"
								>
									<span className="text-foreground group-hover:text-muted-foreground text-base font-medium transition-colors duration-200 sm:text-lg">
										{faq.question}
									</span>
									<motion.div
										animate={{ rotate: openIndex === index ? 180 : 0 }}
										transition={{ duration: 0.3, ease: "easeInOut" }}
										className="mt-1 shrink-0"
									>
										<ChevronDown className="text-foreground group-hover:text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
									</motion.div>
								</button>

								<AnimatePresence initial={false}>
									{openIndex === index && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												height: { duration: 0.3, ease: "easeInOut" },
												opacity: { duration: 0.2, ease: "easeInOut" },
											}}
											className="overflow-hidden"
										>
											<div className="pr-8 pb-6 sm:pb-8">
												<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
													{faq.answer}
												</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
