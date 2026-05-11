"use client"

import { useCallback, useState, type ComponentType, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import {
	ZapIcon,
	CodeIcon,
	BookOpenIcon,
	PieChartIcon,
	LineChartIcon,
	BarChart3Icon,
	LayoutGridIcon,
	GraduationCapIcon,
} from "lucide-react"

const CLOUD_PATH =
	"M113.837 51.423v2.09q-.015 1.266-.18 2.52a26.23 26.23 0 0 1-21.27 22.37c-1.91.37-3.85.43-5.77.7h-60.08a6 6 0 0 0-.73-.14 28.6 28.6 0 0 1-7.93-1.57c-8.21-3.08-14.19-8.36-16.77-16.91a32.2 32.2 0 0 1-1.06-10.11 25.87 25.87 0 0 1 5.59-15.83 26.6 26.6 0 0 1 8.39-7 6.34 6.34 0 0 0 3.44-4.11q.196-.706.49-1.38c3.41-8.59 10.54-12.61 18.73-12.29a10 10 0 0 0 7.05-2.39 30.9 30.9 0 0 1 11.23-6.2 39 39 0 0 1 4.75-1 10.7 10.7 0 0 1 2.19-.17c2.33 0 6.09.21 6.68.33 12.19 2.64 21 9.22 24.91 21.46a6.9 6.9 0 0 0 4.04 4.56 26.52 26.52 0 0 1 14.73 16.4c.563 1.72.988 3.483 1.27 5.27a20.5 20.5 0 0 1 .3 3.4m-57 19.67h26.7a49 49 0 0 0 6.39-.4c9-1.12 16.14-9 16-17.93s-3.75-15.63-12.18-19.42a13.06 13.06 0 0 1-7.79-9.1 19.5 19.5 0 0 0-7.35-10.92c-5.47-4.19-11.57-6.3-18.53-5.14a24.1 24.1 0 0 0-12 6 13.9 13.9 0 0 1-10.73 3.58c-6-.49-10.22 2.31-12.19 8l-.35 1a12.9 12.9 0 0 1-5.07 6.69c-.91.62-1.86 1.17-2.81 1.74a17.45 17.45 0 0 0-8.51 12 26.5 26.5 0 0 0-.29 7.44 16.12 16.12 0 0 0 4.49 10.29c4.26 4.35 9.56 6.2 15.53 6.23 9.54-.03 19.09-.06 28.65-.06z"

const ACCENT = "#00b764"
const EASE = [0.16, 1, 0.3, 1] as const

const VIEW = 600
const CLOUD_SCALE = 3
const CLOUD_W = 114 * CLOUD_SCALE
const CLOUD_H = 80 * CLOUD_SCALE
const CLOUD_X = (VIEW - CLOUD_W) / 2
const CLOUD_Y = (VIEW - CLOUD_H) / 2

const TIMING = {
	cloudDelay: 2.9,
	cloudDuration: 1.2,
	brandDelay: 3.7,
	brandDuration: 0.5,
	haloDrawDelay: 4.1,
	haloDrawDuration: 0.8,
	itemsStartDelay: 4.7,
	itemStagger: 0.1,
	itemDuration: 0.45,
	outerSpin: 40,
	innerSpin: 32,
} as const

type Tone = "accent" | "ring"

const TONE_CLASSES: Record<Tone, { pill: string; icon: string }> = {
	accent: {
		pill: "border-accent/30 ring-accent/10 hover:border-accent/60",
		icon: "text-accent",
	},
	ring: {
		pill: "border-ring/30 ring-ring/10 hover:border-ring/60",
		icon: "text-ring",
	},
}

type HaloItem = {
	id: string
	label: string
	icon: ComponentType<{ className?: string }>
}

const outerItems: HaloItem[] = [
	{ id: "analisis", label: "Análisis de datos", icon: PieChartIcon },
	{ id: "power-apps", label: "Power Platform", icon: LayoutGridIcon },
	{ id: "dashboards", label: "Dashboards", icon: BarChart3Icon },
	{ id: "capacitaciones", label: "Capacitaciones", icon: BookOpenIcon },
]

const innerItems: HaloItem[] = [
	{ id: "formacion", label: "Formación", icon: GraduationCapIcon },
	{ id: "desarrollo", label: "Desarrollo Web", icon: CodeIcon },
	{ id: "reportes", label: "Reportes", icon: LineChartIcon },
	{ id: "automatizacion", label: "Automatización", icon: ZapIcon },
]

const INNER_TONES: Tone[] = ["ring", "accent", "ring", "accent"]
const OUTER_TONES: Tone[] = ["accent", "ring", "accent", "ring"]

type HaloProps = {
	items: HaloItem[]
	radiusPct: number
	duration: number
	direction: "cw" | "ccw"
	reduced: boolean
	startAngle?: number
	paused: boolean
	tones: Tone[]
	itemDelayOffset: number
	onItemHoverChange: (hovering: boolean) => void
}

function HaloItemPill({
	icon: Icon,
	label,
	tone,
	onHoverChange,
}: {
	icon: ComponentType<{ className?: string }>
	label: string
	tone: Tone
	onHoverChange: (hovering: boolean) => void
}): ReactNode {
	const t = TONE_CLASSES[tone]
	return (
		<div
			className={`group bg-background flex cursor-pointer items-center rounded-full border shadow-sm ring-4 transition-[box-shadow,border-color] duration-300 hover:shadow-md ${t.pill}`}
			onMouseEnter={() => onHoverChange(true)}
			onMouseLeave={() => onHoverChange(false)}
		>
			<div className="flex size-11 shrink-0 items-center justify-center md:size-14">
				<Icon className={`size-5 md:size-6 ${t.icon}`} />
			</div>
			<span className="text-foreground/85 max-w-0 overflow-hidden pr-0 text-sm font-medium whitespace-nowrap transition-[max-width,padding] duration-300 ease-out group-hover:max-w-40 group-hover:pr-4 group-hover:pl-1">
				{label}
			</span>
		</div>
	)
}

function Halo({
	items,
	radiusPct,
	duration,
	direction,
	reduced,
	startAngle = 0,
	paused,
	tones,
	itemDelayOffset,
	onItemHoverChange,
}: HaloProps): ReactNode {
	const haloAnim = direction === "cw" ? "halo-cw" : "halo-ccw"
	const counterAnim = direction === "cw" ? "halo-ccw" : "halo-cw"
	const size = `${radiusPct * 2}%`
	const playState = paused ? "paused" : "running"

	return (
		<div
			className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			style={{ width: size, height: size }}
		>
			<svg
				className="text-accent/40 absolute inset-0 h-full w-full -rotate-90"
				viewBox="0 0 100 100"
				fill="none"
				aria-hidden="true"
			>
				<motion.circle
					cx={50}
					cy={50}
					r={49.5}
					stroke="currentColor"
					strokeWidth={0.3}
					strokeDasharray="0.012 0.012"
					pathLength={1}
					initial={reduced ? false : { pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{
						delay: reduced ? 0 : TIMING.haloDrawDelay,
						duration: reduced ? 0 : TIMING.haloDrawDuration,
						ease: EASE,
					}}
				/>
			</svg>

			<div
				className="absolute inset-0"
				style={
					reduced
						? undefined
						: {
								animation: `${haloAnim} ${duration}s linear infinite`,
								animationPlayState: playState,
							}
				}
			>
				{items.map((item, i) => {
					const angle = startAngle + (i * 360) / items.length
					const rad = (angle * Math.PI) / 180
					const x = 50 + 50 * Math.cos(rad)
					const y = 50 + 50 * Math.sin(rad)

					const tone = tones[i % tones.length] ?? "accent"
					const itemDelay = TIMING.itemsStartDelay + itemDelayOffset + i * TIMING.itemStagger

					return (
						<motion.div
							key={item.id}
							className="pointer-events-auto absolute hover:z-20"
							style={{
								left: `${x}%`,
								top: `${y}%`,
								translate: "-50% -50%",
							}}
							initial={reduced ? false : { opacity: 0, scale: 0.6 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: reduced ? 0 : itemDelay,
								duration: reduced ? 0 : TIMING.itemDuration,
								ease: EASE,
							}}
						>
							<div
								style={
									reduced
										? undefined
										: {
												animation: `${counterAnim} ${duration}s linear infinite`,
												animationPlayState: playState,
											}
								}
							>
								<HaloItemPill
									icon={item.icon}
									label={item.label}
									tone={tone}
									onHoverChange={onItemHoverChange}
								/>
							</div>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

export function CloudNetwork(): ReactNode {
	const reduced = useReducedMotion() ?? false
	const [hoverCount, setHoverCount] = useState(0)
	const paused = hoverCount > 0

	const handleItemHoverChange = useCallback((hovering: boolean) => {
		setHoverCount((c) => Math.max(0, c + (hovering ? 1 : -1)))
	}, [])

	return (
		<div className="relative mx-auto aspect-square w-full max-w-lg">
			<svg
				viewBox={`0 0 ${VIEW} ${VIEW}`}
				className="absolute inset-0 h-full w-full"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				role="img"
				aria-label="Servicios de Ingeniería Simple"
			>
				<defs>
					<clipPath id="cloud-reveal">
						<motion.rect
							x={0}
							y={0}
							height={VIEW}
							initial={reduced ? false : { width: 0 }}
							animate={{ width: VIEW }}
							transition={{
								delay: reduced ? 0 : TIMING.cloudDelay,
								duration: reduced ? 0 : TIMING.cloudDuration,
								ease: EASE,
							}}
						/>
					</clipPath>
				</defs>

				<g clipPath="url(#cloud-reveal)">
					<g transform={`translate(${CLOUD_X} ${CLOUD_Y}) scale(${CLOUD_SCALE})`}>
						<path d={CLOUD_PATH} fill={ACCENT} fillRule="evenodd" />
					</g>
				</g>

				<motion.text
					x={VIEW / 2}
					y={VIEW / 2 + 45}
					textAnchor="middle"
					className="fill-foreground"
					initial={reduced ? false : { opacity: 0, scale: 0.92 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						delay: reduced ? 0 : TIMING.brandDelay,
						duration: reduced ? 0 : TIMING.brandDuration,
						ease: EASE,
					}}
					style={{
						fontSize: 30,
						fontWeight: 600,
						letterSpacing: "-0.02em",
						transformOrigin: `${VIEW / 2}px ${VIEW / 2}px`,
					}}
				>
					Ingeniería Simple
				</motion.text>
			</svg>

			<Halo
				items={innerItems}
				radiusPct={34}
				duration={TIMING.innerSpin}
				direction="ccw"
				reduced={reduced}
				startAngle={45}
				paused={paused}
				tones={INNER_TONES}
				itemDelayOffset={0}
				onItemHoverChange={handleItemHoverChange}
			/>
			<Halo
				items={outerItems}
				radiusPct={46}
				duration={TIMING.outerSpin}
				direction="cw"
				reduced={reduced}
				startAngle={-90}
				paused={paused}
				tones={OUTER_TONES}
				itemDelayOffset={0.15}
				onItemHoverChange={handleItemHoverChange}
			/>
		</div>
	)
}
