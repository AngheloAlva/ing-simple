"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"
import type { HTMLAttributes } from "react"
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react"

import { cn } from "@/lib/utils"

export interface CodeIconHandle {
	startAnimation: () => void
	stopAnimation: () => void
}

interface CodeIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number
}

/**
 * The two angle brackets pull apart and settle back, the way a chevron pair
 * reads as "expand". Each side mirrors the other so the icon stays balanced
 * on its centre at every frame.
 */
const BRACKET_VARIANTS: Variants = {
	normal: { x: 0 },
	animate: (direction: number) => ({
		x: [0, 2.5 * direction, 0],
		transition: { duration: 0.5, ease: "easeInOut" },
	}),
}

const SLASH_VARIANTS: Variants = {
	normal: { opacity: 1, pathLength: 1 },
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
		transition: { duration: 0.45, delay: 0.1 },
	},
}

const CodeIcon = forwardRef<CodeIconHandle, CodeIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation()
		const isControlledRef = useRef(false)

		useImperativeHandle(ref, () => {
			isControlledRef.current = true

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			}
		})

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (isControlledRef.current) {
					onMouseEnter?.(e)
				} else {
					controls.start("animate")
				}
			},
			[controls, onMouseEnter]
		)

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (isControlledRef.current) {
					onMouseLeave?.(e)
				} else {
					controls.start("normal")
				}
			},
			[controls, onMouseLeave]
		)

		return (
			<div
				className={cn(className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<motion.path
						animate={controls}
						custom={1}
						d="m16 18 6-6-6-6"
						initial="normal"
						variants={BRACKET_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={-1}
						d="m8 6-6 6 6 6"
						initial="normal"
						variants={BRACKET_VARIANTS}
					/>
					<motion.path
						animate={controls}
						d="m14.5 4-5 16"
						initial="normal"
						variants={SLASH_VARIANTS}
					/>
				</svg>
			</div>
		)
	}
)

CodeIcon.displayName = "CodeIcon"

export { CodeIcon }
