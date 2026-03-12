"use client"

import { motion } from "motion/react"
import { useState } from "react"

import { CATEGORY_LABELS } from "@/lib/portfolio-data"

import ModalCards from "@/components/shared/modal-cards"

import type { ProjectData, ProjectCategory } from "@/lib/portfolio-data"
import type { CardData } from "@/components/shared/modal-cards"

const easeOut = [0.16, 1, 0.3, 1] as const

interface PortfolioProjectGridProps {
	projects: ProjectData[]
}

function mapToCardData(project: ProjectData): CardData {
	const card: CardData = {
		id: project.id,
		imageUrl: project.imageUrl,
		title: project.title,
		description: project.fullDescription,
		shortDescription: project.shortDescription,
		category: CATEGORY_LABELS[project.category as ProjectCategory],
		technologies: project.technologies,
	}
	if (project.gradientColor) card.gradientColor = project.gradientColor
	if (project.liveUrl) card.liveUrl = project.liveUrl
	if (project.githubUrl) card.githubUrl = project.githubUrl
	return card
}

export function PortfolioProjectGrid({ projects }: PortfolioProjectGridProps) {
	const [visibleCount, setVisibleCount] = useState(6)

	const visibleProjects = projects.slice(0, visibleCount)
	const hasMore = visibleCount < projects.length

	return (
		<section className="mx-auto max-w-6xl px-4 pb-16 xl:px-0">
			<ModalCards
				cards={visibleProjects.map(mapToCardData)}
				animationVariant="scale"
				gradientColor="#14b8a6"
			/>

			{hasMore && (
				<motion.div
					className="mt-8 flex justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.3, ease: easeOut }}
				>
					<button
						onClick={() => setVisibleCount((prev) => prev + 6)}
						className="group bg-foreground text-background inline-flex cursor-pointer items-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg"
					>
						<span>Ver más proyectos</span>
						<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M6 3L11 8L6 13"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					</button>
				</motion.div>
			)}
		</section>
	)
}
