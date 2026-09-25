"use client"

import { features } from "@/lib/config"
import { shouldResetScroll } from "@/lib/scroll"
import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

const LENIS_OPTIONS = {
	duration: 1.6,
	easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	orientation: "vertical" as const,
	gestureOrientation: "vertical" as const,
	smoothWheel: true,
	wheelMultiplier: 1,
	touchMultiplier: 2,
}

const ANCHOR_OFFSET = -100

export function SmoothScroll({ children }: { children: ReactNode }): ReactNode {
	const pathname = usePathname()
	const lenisRef = useRef<Lenis | null>(null)
	const previousPathname = useRef(pathname)
	const isTraversal = useRef(false)

	useEffect(() => {
		if (!features.smoothScroll) return

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (prefersReducedMotion) return

		const lenis = new Lenis(LENIS_OPTIONS)
		lenisRef.current = lenis

		function raf(time: number): void {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}
		requestAnimationFrame(raf)

		function handleAnchorClick(event: MouseEvent): void {
			const target = event.target
			if (!(target instanceof Element)) return
			// A click is never a history traversal, so it clears one that was not
			// followed by a route change and would otherwise suppress the next reset.
			isTraversal.current = false
			const anchor = target.closest('a[href^="#"]')
			if (!anchor) return
			const href = anchor.getAttribute("href")
			if (!href || href === "#") return
			const element = document.querySelector(href)
			if (!element || !(element instanceof HTMLElement)) return
			event.preventDefault()
			lenis.scrollTo(element, { offset: ANCHOR_OFFSET })
		}

		// Back and forward are the one navigation whose correct position is the one
		// the visitor left, so the reset below has to be able to tell them apart.
		function handlePopState(): void {
			isTraversal.current = true
		}

		document.addEventListener("click", handleAnchorClick)
		window.addEventListener("popstate", handlePopState)
		return () => {
			document.removeEventListener("click", handleAnchorClick)
			window.removeEventListener("popstate", handlePopState)
			lenis.destroy()
			lenisRef.current = null
		}
	}, [])

	// `shouldResetScroll` explains why Next's own reset is not enough on its own.
	// React defers effects until a view transition has finished, so by the time this
	// runs Lenis has usually already written the previous position back onto the new
	// page. `immediate` is what cancels that animation — animating to the top from
	// wherever it ended up would show the visitor the wrong end of the new page
	// while it scrolled.
	useEffect(() => {
		const pathnameChanged = previousPathname.current !== pathname
		previousPathname.current = pathname

		const shouldReset = shouldResetScroll({
			pathnameChanged,
			isTraversal: isTraversal.current,
			hash: window.location.hash,
		})
		isTraversal.current = false

		if (shouldReset) lenisRef.current?.scrollTo(0, { immediate: true })
	}, [pathname])

	return <>{children}</>
}
