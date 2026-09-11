"use client"

import { useInView } from "motion/react"
import { useRef, type ReactNode } from "react"

// Holds the logo's draw-on-load animation paused until the wrapper is well
// inside the viewport, then lets it play once. The CSS lives in globals.css
// under "Logo draw-on-load"; this only flips the `data-draw` state.
//
// The bottom margin keeps the trace from starting the moment the logo peeks
// over the bottom edge, where nobody is looking yet. It is in px, not %, so it
// stays reachable on tall viewports: at max scroll the footer logo always sits
// at least ~470px above the bottom edge (columns + bottom bar below it).
export function LogoInView({ children }: { children: ReactNode }): ReactNode {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true, amount: 0.6, margin: "0px 0px -240px 0px" })
	return (
		<span ref={ref} data-draw={inView ? "in-view" : "wait"} className="inline-flex">
			{children}
		</span>
	)
}
