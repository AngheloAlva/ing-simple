"use client"

import { createContext, useContext, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Whether a diagram should be running, published by whatever card frames it
 * so the diagram can react without its section becoming a client component.
 * The frame decides what activates it: hover and focus in one section, plain
 * on-screen visibility in another.
 * ------------------------------------------------------------------------ */

const DiagramActiveContext = createContext<boolean>(false)

/** True while the surrounding card considers the diagram engaged. */
export function useDiagramActive(): boolean {
	return useContext(DiagramActiveContext)
}

export function DiagramActiveProvider({
	active,
	children,
}: {
	active: boolean
	children: ReactNode
}): ReactNode {
	return <DiagramActiveContext.Provider value={active}>{children}</DiagramActiveContext.Provider>
}
