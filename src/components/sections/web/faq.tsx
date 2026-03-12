"use client"

import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function WebFAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const faqs = [
		{
			question: "¿Qué tecnologías utilizan para desarrollar sitios web?",
			answer:
				"Trabajamos con Next.js, React, TypeScript y Tailwind CSS para crear sitios modernos, rápidos y escalables. Elegimos la tecnología según las necesidades de cada proyecto para garantizar el mejor resultado.",
		},
		{
			question: "¿Cuánto tiempo toma desarrollar un sitio web?",
			answer:
				"Depende de la complejidad del proyecto. Una landing page puede estar lista en 1-2 semanas, un sitio corporativo en 3-4 semanas, y proyectos más complejos como portales o aplicaciones web entre 6-10 semanas.",
		},
		{
			question: "¿El sitio web será responsivo y se verá bien en celulares?",
			answer:
				"Absolutamente. Todos nuestros sitios se diseñan con un enfoque mobile-first, garantizando una experiencia óptima en celulares, tablets y computadores. Probamos en múltiples dispositivos antes de entregar.",
		},
		{
			question: "¿Incluyen hosting y dominio en el servicio?",
			answer:
				"Asesoramos en la mejor opción de hosting según tu proyecto y configuramos todo lo necesario. El costo del hosting y dominio es independiente del desarrollo, pero nos encargamos de dejarlo todo funcionando.",
		},
		{
			question: "¿Puedo administrar el contenido de mi sitio yo mismo?",
			answer:
				"Sí. Según el tipo de proyecto, implementamos paneles de administración o CMS que te permiten actualizar textos, imágenes y contenido sin necesidad de saber programar. Además, te capacitamos para que puedas hacerlo con confianza.",
		},
		{
			question: "¿Ofrecen soporte después del lanzamiento?",
			answer:
				"Sí, ofrecemos soporte post-lanzamiento que incluye corrección de errores, ajustes menores y asesoría técnica. También ofrecemos planes de mantenimiento mensual para actualizaciones continuas y mejoras.",
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
					<div className="flex flex-col space-y-4 lg:sticky lg:top-24 lg:self-start">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="text-foreground text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl"
						>
							Preguntas Frecuentes
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-muted-foreground max-w-[25ch] text-base leading-relaxed sm:text-lg"
						>
							Todo lo que necesitas saber sobre nuestro servicio de desarrollo web.
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
								className={`border-border border-b ${index === 0 ? "border-t" : ""}`}
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
										<ChevronDown className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
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
