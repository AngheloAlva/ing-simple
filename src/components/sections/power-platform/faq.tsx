"use client"

import { motion, AnimatePresence } from "motion/react"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const faqs = [
	{
		q: "¿Qué es Power Platform?",
		a: "Power Platform es un conjunto de herramientas de Microsoft que incluye Power BI, Power Apps, Power Automate y Power Pages. Permite crear aplicaciones, automatizar procesos y visualizar datos sin necesidad de programación tradicional.",
	},
	{
		q: "¿Necesito saber programar para usar Power Platform?",
		a: "No. Power Platform está diseñado para usuarios de negocio con enfoque low-code/no-code. Nosotros nos encargamos de las configuraciones avanzadas y tu equipo puede mantener y modificar las soluciones con capacitación básica.",
	},
	{
		q: "¿Cuánto tiempo toma implementar una solución?",
		a: "Depende de la complejidad. Soluciones simples como dashboards o formularios pueden estar listas en 1-2 semanas. Proyectos más complejos con múltiples integraciones suelen tomar entre 4-8 semanas.",
	},
	{
		q: "¿Se integra con los sistemas que ya tenemos?",
		a: "Sí. Power Platform tiene más de 1000 conectores nativos para integrar con SAP, Salesforce, Google Workspace, bases de datos SQL, APIs REST y prácticamente cualquier sistema empresarial.",
	},
	{
		q: "¿Necesitamos licencias adicionales de Microsoft?",
		a: "Depende de tu plan actual de Microsoft 365. Muchas funcionalidades básicas ya están incluidas. Te asesoramos sobre el licenciamiento óptimo para tu caso, maximizando lo que ya tenés.",
	},
	{
		q: "¿Ofrecen soporte post-implementación?",
		a: "Sí. Incluimos un período de soporte y estabilización después de cada implementación. También ofrecemos planes de soporte continuo para mantenimiento, mejoras y capacitación del equipo.",
	},
]

export default function PowerPlatformFAQ() {
	const [open, setOpen] = useState(0)

	return (
		<section className="bg-background relative w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-y-0 right-0 left-0 px-4 sm:px-6 lg:px-8"
			>
				<div className="relative mx-auto h-full w-full max-w-6xl">
					<div className="grid h-full grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
						<div className="relative hidden lg:block">
							<div className="border-border absolute inset-y-0 left-0 w-px border-l border-dashed" />
						</div>
						<div className="relative">
							<div className="border-border absolute inset-y-0 left-0 w-px border-l border-dashed" />
							<div className="border-border absolute inset-y-0 right-0 w-px border-l border-dashed" />
						</div>
					</div>
				</div>
			</div>

			<div className="relative mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
					<div className="relative flex flex-col gap-6 pl-6">
						<motion.span
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground relative text-xs tracking-[0.2em] uppercase"
						>
							<span
								aria-hidden
								className="bg-muted-foreground absolute top-1/2 -left-6.75 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full lg:block"
							/>
							FAQ
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-foreground text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl"
						>
							Preguntas Frecuentes
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-muted-foreground max-w-sm text-sm leading-relaxed sm:text-base"
						>
							Todo lo que necesitás saber sobre nuestras soluciones con Power Platform. ¿Te quedan
							dudas? Nuestro equipo está a un mensaje de distancia.
						</motion.p>
					</div>

					<div className="relative">
						<div className="flex flex-col">
							{faqs.map((faq, i) => {
								const isOpen = open === i
								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4, delay: 0.05 * i }}
										className={`relative py-7 pr-4 pl-6 sm:py-9 ${
											i !== faqs.length - 1 ? "border-border border-b border-dashed" : ""
										}`}
									>
										<button
											onClick={() => setOpen(isOpen ? -1 : i)}
											className="flex w-full cursor-pointer items-start gap-4 text-left sm:gap-6"
										>
											<span className="text-muted-foreground relative mt-1.5 text-[11px] tracking-wider tabular-nums">
												<span
													aria-hidden
													className="bg-muted-foreground absolute top-1/2 -left-6.75 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
												/>
												Q{i + 1}
											</span>
											<span className="text-foreground flex-1 text-base font-medium sm:text-lg">
												{faq.q}
											</span>
											<span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
												{isOpen ? (
													<Minus className="text-foreground h-4 w-4" />
												) : (
													<Plus className="text-foreground h-4 w-4" />
												)}
											</span>
										</button>
										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
													className="overflow-hidden"
												>
													<div className="flex items-start gap-4 pt-4 sm:gap-6">
														<span
															aria-hidden
															className="invisible mt-1.5 text-[11px] tracking-wider tabular-nums"
														>
															Q{i + 1}
														</span>
														<p className="text-muted-foreground max-w-3xl flex-1 pr-12 text-sm leading-relaxed sm:text-base">
															{faq.a}
														</p>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
