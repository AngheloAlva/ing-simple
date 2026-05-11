"use client"

import { useEffect, useState } from "react"

import type { ProjectData } from "@/lib/portfolio-data"

export function useProjectModal() {
	const [selected, setSelected] = useState<ProjectData | null>(null)
	const [mounted, setMounted] = useState(false)

	// eslint-disable-next-line react-hooks/set-state-in-effect
	useEffect(() => setMounted(true), [])

	useEffect(() => {
		if (!selected) return
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setSelected(null)
		}
		document.addEventListener("keydown", handleEscape)
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", handleEscape)
			document.body.style.overflow = ""
		}
	}, [selected])

	return {
		selected,
		open: (project: ProjectData) => setSelected(project),
		close: () => setSelected(null),
		mounted,
	}
}
