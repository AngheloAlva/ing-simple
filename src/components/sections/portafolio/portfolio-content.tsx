"use client"

import { useState, useMemo } from "react"

import { portfolioProjects, type ProjectCategory } from "@/lib/portfolio-data"

import { PortfolioProjectGrid } from "@/components/sections/portafolio/project-grid"
import { PortfolioHero } from "@/components/sections/portafolio/hero"

export function PortfolioContent() {
	const [activeCategory, setActiveCategory] = useState<"todos" | ProjectCategory>("todos")

	const filteredProjects = useMemo(
		() =>
			activeCategory === "todos"
				? portfolioProjects
				: portfolioProjects.filter((p) => p.category === activeCategory),
		[activeCategory]
	)

	return (
		<div className="space-y-10">
			<PortfolioHero activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
			<PortfolioProjectGrid key={activeCategory} projects={filteredProjects} />
		</div>
	)
}
