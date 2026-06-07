"use client"

import { useCallback, useMemo, useState } from "react"

import { portfolioProjects } from "@/lib/portfolio-data"

import { PAGE_SIZE, type FilterValue } from "./constants"

const portfolioBase = portfolioProjects.filter((p) => !p.isProduction)

export function useProjectsFilter() {
	const [active, setActive] = useState<FilterValue>("todos")
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	const filtered = useMemo(
		() => (active === "todos" ? portfolioBase : portfolioBase.filter((p) => p.category === active)),
		[active]
	)

	const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
	const hasMore = visibleCount < filtered.length

	const setFilter = useCallback((next: FilterValue) => {
		setActive(next)
		setVisibleCount(PAGE_SIZE)
	}, [])

	const loadMore = useCallback(() => setVisibleCount((prev) => prev + PAGE_SIZE), [])

	return { active, setFilter, visible, hasMore, loadMore, total: filtered.length }
}
