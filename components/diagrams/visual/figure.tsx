"use client"

import { DATA_TRANSITION } from "@/components/diagrams/visual/constants"
import { animate } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

/** A number that glides from its previous value to the next one. */
export function Figure({
	value,
	format,
	active,
	reduced,
}: {
	value: number
	format: (v: number) => string
	active: boolean
	reduced: boolean
}): ReactNode {
	const [shown, setShown] = useState(0)
	const current = useRef(0)

	useEffect(() => {
		if (!active || reduced) return
		const controls = animate(current.current, value, {
			...DATA_TRANSITION,
			onUpdate: (v) => {
				current.current = v
				setShown(v)
			},
		})
		return () => controls.stop()
	}, [value, active, reduced])

	return <>{format(reduced ? value : shown)}</>
}
