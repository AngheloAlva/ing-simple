"use client"

import { AnimatePresence } from "motion/react"

import { FilterBar } from "./filter-bar"
import { FlagshipProjectCard } from "./flagship-project-card"
import { GridHeader } from "./grid-header"
import { LoadMoreButton } from "./load-more-button"
import { ProjectCard } from "./project-card"
import { ProjectModal } from "./project-modal"
import { useProjectModal } from "./use-project-modal"
import { useProjectsFilter } from "./use-projects-filter"

export function PortfolioProjectGrid() {
	const { active, setFilter, visible, hasMore, loadMore, total } = useProjectsFilter()
	const { selected, open, close, mounted } = useProjectModal()

	return (
		<section className="bg-background flex w-full items-start px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<GridHeader />

				<FilterBar active={active} onChange={setFilter} total={total} />

				<div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
					<AnimatePresence mode="popLayout" initial={false}>
						{visible.map((p) =>
							p.isFlagship && p.caseStudy ? (
								<FlagshipProjectCard key={p.id} project={p} />
							) : (
								<ProjectCard key={p.id} project={p} onSelect={open} />
							)
						)}
					</AnimatePresence>
				</div>

				{hasMore && <LoadMoreButton onClick={loadMore} />}
			</div>

			{mounted && <ProjectModal selected={selected} onClose={close} />}
		</section>
	)
}
