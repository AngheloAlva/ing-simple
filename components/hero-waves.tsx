"use client"

import { softEase, useReducedMotion } from "@/lib/motion"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { motion } from "motion/react"

import AsciiWaves from "@/components/ascii-waves"

import type { ReactNode } from "react"

function useIsMounted(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false
	)
}

export function HeroWaves({
	videoUrl = "/sample-video-2.mp4",
}: {
	videoUrl?: string
} = {}): ReactNode {
	const mounted = useIsMounted()
	const { resolvedTheme } = useTheme()
	const prefersReducedMotion = useReducedMotion()

	if (!mounted) return null

	const color = resolvedTheme === "dark" ? "#ffffff" : "#0a0a0a"
	const isDark = resolvedTheme === "dark"
	const targetOpacity = isDark ? 1 : 0.85

	return (
		<motion.div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 -z-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: targetOpacity }}
			transition={
				prefersReducedMotion ? { duration: 0.01 } : { duration: 1.6, ease: softEase, delay: 0.1 }
			}
		>
			<AsciiWaves
				speed={0.01}
				color={color}
				noiseScale={5}
				intensity={0.8}
				elementSize={9}
				waveTension={0.8}
				videoUrl={videoUrl}
				characters=" .:-+*=%@#"
				className="opacity-80 dark:opacity-60"
			/>
		</motion.div>
	)
}
