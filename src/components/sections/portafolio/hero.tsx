"use client"

import { motion } from "motion/react"

import { CATEGORY_LABELS, type ProjectCategory } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

const easeOut = [0.16, 1, 0.3, 1] as const

const categories = Object.entries(CATEGORY_LABELS) as ["todos" | ProjectCategory, string][]

interface PortfolioHeroProps {
	activeCategory: "todos" | ProjectCategory
	onCategoryChange: (category: "todos" | ProjectCategory) => void
}

export function PortfolioHero({ activeCategory, onCategoryChange }: PortfolioHeroProps) {
	return (
		<section className="relative h-full overflow-hidden pt-28 sm:pt-36 lg:pt-44">
			<div className="z-10 mx-auto flex max-w-6xl flex-col items-start justify-center px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
						Nuestro Trabajo
					</h1>
					<p className="text-muted-foreground mt-4 max-w-2xl text-xl">
						Proyectos reales que transforman la manera en que las organizaciones trabajan con
						tecnología y datos.
					</p>
				</motion.div>

				<motion.div
					className="mt-8 flex flex-wrap gap-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
				>
					{categories.map(([key, label]) => (
						<motion.button
							key={key}
							onClick={() => onCategoryChange(key)}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
							className={cn(
								"bg-muted text-foreground hover:bg-foreground hover:text-background cursor-pointer rounded-md px-5 py-2.5 text-sm font-medium transition-all duration-300",
								{
									"bg-foreground text-background rounded-[50px]": activeCategory === key,
								}
							)}
						>
							{label}
						</motion.button>
					))}
				</motion.div>
			</div>
		</section>
	)
}
