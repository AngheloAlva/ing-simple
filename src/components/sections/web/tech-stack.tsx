"use client"

import { motion } from "motion/react"
import HoverPreview from "@/components/shared/hover-preview"
import type { HoverTarget } from "@/components/shared/hover-preview"

const targets: HoverTarget[] = [
	{
		text: "Next.js",
		imageUrl:
			"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
		linkUrl: "https://nextjs.org",
		altText: "Next.js framework",
	},
	{
		text: "React",
		imageUrl:
			"https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop",
		linkUrl: "https://react.dev",
		altText: "React library",
	},
	{
		text: "TypeScript",
		imageUrl:
			"https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&auto=format&fit=crop",
		linkUrl: "https://www.typescriptlang.org",
		altText: "TypeScript language",
	},
	{
		text: "Tailwind CSS",
		imageUrl:
			"https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=400&auto=format&fit=crop",
		linkUrl: "https://tailwindcss.com",
		altText: "Tailwind CSS framework",
	},
	{
		text: "Vercel",
		imageUrl:
			"https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
		linkUrl: "https://vercel.com",
		altText: "Vercel platform",
	},
]

export function WebTechStack() {
	return (
		<section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32 dark:bg-neutral-950">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-12 text-center md:mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="mb-4 text-3xl font-normal text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
					>
						Tecnologías que usamos
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mx-auto max-w-2xl text-lg text-neutral-600 sm:text-xl dark:text-neutral-400"
					>
						Herramientas modernas para resultados excepcionales
					</motion.p>
				</div>

				{/* HoverPreview Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mx-auto max-w-4xl"
				>
					<HoverPreview
						content="Desarrollamos con {0} y {1} para crear interfaces rápidas y escalables. Usamos {2} para código robusto y libre de errores. Estilizamos con {3} para diseños modernos y responsivos. Desplegamos en {4} para máxima velocidad y disponibilidad global."
						targets={targets}
						imagePosition="above"
						imageWidth={280}
						imageHeight={200}
						imageBorderRadius="1rem"
						showImageShadow={true}
						className="text-xl leading-relaxed font-medium text-neutral-700 sm:text-2xl md:text-3xl lg:text-4xl dark:text-neutral-300"
						targetClassName="text-purple-600 underline decoration-purple-300 decoration-2 underline-offset-4 hover:text-pink-600 hover:decoration-pink-300 dark:text-purple-400 dark:decoration-purple-700 dark:hover:text-pink-400 dark:hover:decoration-pink-700"
						targetPadding={6}
						enterSpeed={0.25}
						exitSpeed={0.15}
						maxRotation={8}
						maxOffset={12}
					/>
				</motion.div>
			</div>
		</section>
	)
}
