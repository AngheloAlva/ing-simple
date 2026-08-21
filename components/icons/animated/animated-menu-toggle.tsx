"use client"

import { softEase, useReducedMotion } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * Hamburger that folds into a close mark.
 *
 * Built from three positioned bars rather than an SVG because the two
 * outer bars have to travel AND rotate at once: interpolating `d` between
 * a horizontal run and a diagonal one is not something path animation can
 * do, and rotating SVG children depends on `transform-box` support that
 * plain elements do not need.
 *
 * The middle bar only fades. Scaling it looked tidier in isolation, but
 * it finished after the two rotating bars had already landed, leaving a
 * visibly short bar behind for a beat — so width stays fixed.
 *
 * State-driven, not hover-driven, so it takes `open` instead of the
 * imperative handle the other animated icons expose.
 */

const BAR = "absolute left-0 h-0.5 w-full rounded-full bg-current"

/**
 * Bar offsets inside the 18px box: spread when closed, stacked when open.
 *
 * Every value here is a whole pixel, and the bars are 2px rather than 1.5px,
 * on purpose. A 1.5px bar sitting at a fractional offset gets its ink split
 * unevenly across two device pixel rows, so the three bars antialias to
 * visibly different weights — the bottom one reads thinner than the rest
 * even though all three measure the same. Integers keep them identical.
 */
const TOP = 3
const MIDDLE = 8
const BOTTOM = 13

export function MenuToggleIcon({ open }: { open: boolean }): ReactNode {
	const reduced = useReducedMotion()
	const transition = reduced ? { duration: 0 } : { duration: 0.32, ease: softEase }

	return (
		<span aria-hidden="true" className="relative block h-4.5 w-4.5">
			<motion.span
				className={BAR}
				initial={false}
				animate={open ? { top: MIDDLE, rotate: 45 } : { top: TOP, rotate: 0 }}
				transition={transition}
			/>
			<motion.span
				className={BAR}
				style={{ top: MIDDLE }}
				initial={false}
				animate={{ opacity: open ? 0 : 1 }}
				transition={reduced ? transition : { duration: 0.16, ease: "linear" }}
			/>
			<motion.span
				className={BAR}
				initial={false}
				animate={open ? { top: MIDDLE, rotate: -45 } : { top: BOTTOM, rotate: 0 }}
				transition={transition}
			/>
		</span>
	)
}
