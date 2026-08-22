"use client"

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react"
import { useReducedMotion } from "@/lib/motion"

interface GradientTextProps {
	children: ReactNode
	className?: string
	colors?: string[]
	animationSpeed?: number
	showBorder?: boolean
	direction?: "horizontal" | "vertical" | "diagonal"
	pauseOnHover?: boolean
	yoyo?: boolean
	/** Render as a span so it can sit inside a heading or paragraph. */
	inline?: boolean
}

export default function GradientText({
	children,
	className = "",
	colors = ["#5227FF", "#FF9FFC", "#B497CF"],
	animationSpeed = 8,
	showBorder = false,
	direction = "horizontal",
	pauseOnHover = false,
	yoyo = true,
	inline = false,
}: GradientTextProps) {
	const prefersReducedMotion = useReducedMotion()
	const [isPaused, setIsPaused] = useState(false)
	const progress = useMotionValue(0)
	const elapsedRef = useRef(0)
	const lastTimeRef = useRef<number | null>(null)

	const animationDuration = animationSpeed * 1000

	useAnimationFrame((time) => {
		if (prefersReducedMotion || isPaused) {
			lastTimeRef.current = null
			return
		}

		if (lastTimeRef.current === null) {
			lastTimeRef.current = time
			return
		}

		const deltaTime = time - lastTimeRef.current
		lastTimeRef.current = time
		elapsedRef.current += deltaTime

		if (yoyo) {
			const fullCycle = animationDuration * 2
			const cycleTime = elapsedRef.current % fullCycle

			if (cycleTime < animationDuration) {
				progress.set((cycleTime / animationDuration) * 100)
			} else {
				progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100)
			}
		} else {
			// Continuously increase position for seamless looping
			progress.set((elapsedRef.current / animationDuration) * 100)
		}
	})

	useEffect(() => {
		elapsedRef.current = 0
		// Reduced motion parks the gradient mid-sweep: still a blend of every
		// colour, just not moving. Position 0 would show only the first colour.
		progress.set(prefersReducedMotion ? 50 : 0)
	}, [animationSpeed, yoyo, prefersReducedMotion])

	const backgroundPosition = useTransform(progress, (p) => {
		if (direction === "horizontal") {
			return `${p}% 50%`
		} else if (direction === "vertical") {
			return `50% ${p}%`
		} else {
			// For diagonal, move only horizontally to avoid interference patterns
			return `${p}% 50%`
		}
	})

	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) setIsPaused(true)
	}, [pauseOnHover])

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) setIsPaused(false)
	}, [pauseOnHover])

	const gradientAngle =
		direction === "horizontal"
			? "to right"
			: direction === "vertical"
				? "to bottom"
				: "to bottom right"
	// Duplicate first color at the end for seamless looping
	const gradientColors = [...colors, colors[0]].join(", ")

	const gradientStyle = {
		backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
		backgroundSize:
			direction === "horizontal"
				? "300% 100%"
				: direction === "vertical"
					? "100% 300%"
					: "300% 300%",
		backgroundRepeat: "repeat",
	}

	const Root = inline ? motion.span : motion.div
	const Layer = inline ? motion.span : motion.div
	const rootClassName = inline
		? `relative inline-flex max-w-fit flex-row items-center justify-center overflow-hidden font-medium ${showBorder ? "px-2 py-1" : ""} ${className}`
		: `relative mx-auto flex max-w-fit cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 ${showBorder ? "px-2 py-1" : ""} ${className}`

	return (
		<Root
			className={rootClassName}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{showBorder && (
				<Layer
					className="pointer-events-none absolute inset-0 z-0 rounded-[1.25rem]"
					style={{ ...gradientStyle, backgroundPosition }}
				>
					<span
						className="absolute z-[-1] rounded-[1.25rem] bg-black"
						style={{
							width: "calc(100% - 2px)",
							height: "calc(100% - 2px)",
							left: "50%",
							top: "50%",
							transform: "translate(-50%, -50%)",
						}}
					/>
				</Layer>
			)}
			<Layer
				className="relative z-2 inline-block bg-clip-text text-transparent"
				style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: "text" }}
			>
				{children}
			</Layer>
		</Root>
	)
}
