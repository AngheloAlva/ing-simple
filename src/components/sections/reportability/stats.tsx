"use client"

import { ChevronRightIcon } from "lucide-react"
import { easeOut, motion } from "motion/react"

const chartData = [
	{
		label: "Ahorro de tiempo en reportes",
		percentage: 70,
		color: "bg-blue-500",
	},
	{
		label: "Mejora en toma de decisiones",
		percentage: 20,
		color: "bg-yellow-400",
	},
	{
		label: "Reducción de errores manuales",
		percentage: 10,
		color: "bg-sky-300 dark:bg-sky-300",
	},
]

export default function ReportabilityStats() {
	return (
		<section className="bg-background w-full px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
					<div className="flex flex-col gap-8 sm:gap-10">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-foreground text-4xl leading-[1.20] font-medium tracking-tight sm:text-5xl md:text-6xl xl:text-7xl"
						>
							Nuestros clientes ahorran hasta un{" "}
							<span className="font-bold text-blue-600">70%</span> del tiempo que dedicaban a crear
							reportes manuales
						</motion.h1>

						<motion.a
							href="#"
							className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-blue-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-blue-600/40 sm:w-fit"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
						>
							<span>Quiero optimizar mis reportes</span>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</motion.a>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="border-muted flex flex-col gap-6 rounded-3xl border p-6 shadow-lg"
					>
						<h3 className="text-foreground text-xl font-medium tracking-tight sm:text-2xl">
							Impacto en Nuestros Clientes
						</h3>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="flex h-100 flex-col overflow-hidden rounded-md sm:h-125 lg:h-150"
						>
							{chartData.map((item, index) => (
								<div
									key={index}
									className={`${item.color} flex items-start justify-between gap-2 px-6 py-6 sm:px-8 md:px-10`}
									style={{ flexGrow: item.percentage }}
								>
									<span className="text-lg font-medium tracking-tight text-white sm:text-xl md:text-2xl">
										{item.label}
									</span>
									<span className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
										{item.percentage}%
									</span>
								</div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
