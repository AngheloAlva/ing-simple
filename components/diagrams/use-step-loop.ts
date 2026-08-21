"use client"

import { useEffect, useState } from "react"

/* --------------------------------------------------------------------------
 * The step driver shared by the site's diagrams: walk a sequence, hold on the
 * finished picture, start over. Every diagram used to carry its own copy of
 * this timer chain.
 * ------------------------------------------------------------------------ */

export type StepLoop = {
	/** 0..steps-1 while playing; equals `steps` while holding the finished state. */
	index: number
	cycle: number
}

export function useStepLoop({
	active,
	steps,
	duration,
	pauseMs,
}: {
	active: boolean
	steps: number
	/** Milliseconds per step, or a function of the step index. */
	duration: number | ((index: number) => number)
	/** How long the finished picture is held before replaying. */
	pauseMs: number
}): StepLoop | null {
	const [loop, setLoop] = useState<StepLoop | null>(null)

	useEffect(() => {
		if (!active || steps <= 0) {
			setLoop(null)
			return
		}

		let cancelled = false
		const timers: ReturnType<typeof setTimeout>[] = []

		const advance = (index: number, cycle: number) => {
			if (cancelled) return
			setLoop({ index, cycle })

			const isHolding = index >= steps
			const wait = isHolding ? pauseMs : typeof duration === "function" ? duration(index) : duration

			timers.push(
				setTimeout(() => {
					if (cancelled) return
					if (isHolding) return advance(0, cycle + 1)
					advance(index + 1, cycle)
				}, wait)
			)
		}

		advance(0, 0)

		return () => {
			cancelled = true
			timers.forEach(clearTimeout)
		}
	}, [active, steps, duration, pauseMs])

	return loop
}
