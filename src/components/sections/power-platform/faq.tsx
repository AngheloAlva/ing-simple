"use client"

import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function PowerPlatformFAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const faqs = [
		{
			question: "¿Qué es Power Platform?",
			answer:
				"Power Platform es un conjunto de herramientas de Microsoft que incluye Power BI, Power Apps, Power Automate y Power Pages. Permite crear aplicaciones, automatizar procesos y visualizar datos sin necesidad de programación tradicional.",
		},
		{
			question: "¿Necesito saber programar para usar Power Platform?",
			answer:
				"No. Power Platform está diseñado para usuarios de negocio con enfoque low-code/no-code. Nosotros nos encargamos de las configuraciones avanzadas y tu equipo puede mantener y modificar las soluciones con capacitación básica.",
		},
		{
			question: "¿Cuánto tiempo toma implementar una solución?",
			answer:
				"Depende de la complejidad. Soluciones simples como dashboards o formularios pueden estar listas en 1-2 semanas. Proyectos más complejos con múltiples integraciones suelen tomar entre 4-8 semanas.",
		},
		{
			question: "¿Se integra con los sistemas que ya tenemos?",
			answer:
				"Sí. Power Platform tiene más de 1000 conectores nativos para integrar con SAP, Salesforce, Google Workspace, bases de datos SQL, APIs REST y prácticamente cualquier sistema empresarial.",
		},
		{
			question: "¿Necesitamos licencias adicionales de Microsoft?",
			answer:
				"Depende de tu plan actual de Microsoft 365. Muchas funcionalidades básicas ya están incluidas. Te asesoramos sobre el licenciamiento óptimo para tu caso, maximizando lo que ya tenés.",
		},
		{
			question: "¿Ofrecen soporte post-implementación?",
			answer:
				"Sí. Incluimos un período de soporte y estabilización después de cada implementación. También ofrecemos planes de soporte continuo para mantenimiento, mejoras y capacitación del equipo.",
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
							Todo lo que necesitas saber sobre nuestras soluciones con Power Platform.
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
										<ChevronDown className="group-hover:text-muted-foreground text-foreground h-5 w-5 sm:h-6 sm:w-6" />
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
