"use client"

import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function ReportabilityFAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0)

	const faqs = [
		{
			question: "¿Qué herramienta usan para los dashboards?",
			answer:
				"Trabajamos principalmente con Microsoft Power BI, la herramienta líder en visualización de datos empresariales. Es potente, flexible y se integra nativamente con Excel, SQL Server, SharePoint y otros servicios de Microsoft.",
		},
		{
			question: "¿Puedo conectar mis datos de Excel, ERP o CRM?",
			answer:
				"Sí. Power BI permite conectar múltiples fuentes de datos: archivos Excel, bases de datos SQL, APIs de sistemas ERP y CRM, Google Sheets, SharePoint y muchas más. Centralizamos toda tu información en un solo dashboard.",
		},
		{
			question: "¿El dashboard se actualiza automáticamente?",
			answer:
				"Sí. Configuramos actualizaciones automáticas programadas para que tus datos estén siempre al día. Dependiendo de la fuente, puede ser en tiempo real, cada hora o diariamente según tus necesidades.",
		},
		{
			question: "¿Necesito licencia de Power BI?",
			answer:
				"Para visualizar dashboards compartidos sí se requiere una licencia Power BI Pro (incluida en Microsoft 365 E5) o Power BI Premium. Te asesoramos sobre la mejor opción según el tamaño de tu equipo.",
		},
		{
			question: "¿Incluyen capacitación en el uso del dashboard?",
			answer:
				"Siempre. Cada proyecto incluye sesiones de capacitación para que tu equipo pueda usar el dashboard con autonomía, aplicar filtros, exportar datos y entender las métricas. No entregamos herramientas sin enseñar a usarlas.",
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
					<div className="flex flex-col space-y-2 lg:sticky lg:top-28 lg:self-start">
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
							Todo lo que necesitas saber sobre nuestro servicio de reportabilidad y dashboards.
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
								className={`border-muted-foreground border-b ${index === 0 ? "border-t" : ""}`}
							>
								<button
									onClick={() => toggleFAQ(index)}
									className="group flex w-full items-start justify-between gap-4 py-6 text-left sm:py-8"
								>
									<span className="group-hover:text-foreground/60 text-foreground text-base font-medium transition-colors duration-200 sm:text-lg">
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
