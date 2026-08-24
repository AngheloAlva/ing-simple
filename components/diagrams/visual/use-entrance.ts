"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

/**
 * Plays a visual's entrance once, when it scrolls into view: `stage` climbs
 * from 0 to `stageMs.length`, one step per timestamp. With reduced motion the
 * final stage is reported straight away. Pass a module-level `stageMs`.
 */
export function useEntrance(
	stageMs: number[],
	reduced: boolean
): { ref: RefObject<HTMLDivElement | null>; stage: number } {
	const ref = useRef<HTMLDivElement>(null)
	const [played, setPlayed] = useState(0)

	useEffect(() => {
		const el = ref.current
		if (!el || reduced) return
		const timers: number[] = []
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0]?.isIntersecting) return
				observer.disconnect()
				stageMs.forEach((ms, i) => {
					timers.push(window.setTimeout(() => setPlayed(i + 1), ms))
				})
			},
			{ threshold: 0.35 }
		)
		observer.observe(el)
		return () => {
			observer.disconnect()
			timers.forEach((id) => window.clearTimeout(id))
		}
	}, [reduced, stageMs])

	return { ref, stage: reduced ? stageMs.length : played }
}
