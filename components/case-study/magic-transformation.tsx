"use client"

import { motion, useInView } from "motion/react"
import {
	memo,
	useRef,
	useMemo,
	useState,
	useEffect,
	type ReactNode,
	type CSSProperties,
} from "react"

import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

const MT_DOC_STYLE_ID = "magic-transform-doc-keyframes"
const MT_DOC_STYLE_CSS = `@keyframes magic-transform-doc-slide {
  from { transform: translate3d(var(--mt-from), 0, 0); }
  to   { transform: translate3d(var(--mt-to), 0, 0); }
}`

const useDocSlideStyles = () => {
	useEffect(() => {
		if (typeof document === "undefined") return
		if (document.getElementById(MT_DOC_STYLE_ID)) return
		const el = document.createElement("style")
		el.id = MT_DOC_STYLE_ID
		el.textContent = MT_DOC_STYLE_CSS
		document.head.appendChild(el)
	}, [])
}

export interface MagicTransformDocument {
	/** Stable id used as React key. */
	id: string
}

export interface MagicTransformResult {
	/** Stable id used as React key. */
	id: string
	/** Label shown on the chip (e.g. "correo", "total"). */
	label: string
	/** Background color of the chip. */
	color: string
	/** Text color of the chip. */
	textColor?: string
}

export interface MagicTransformClassNames {
	root?: string
	document?: string
	axis?: string
	center?: string
	result?: string
	resultBody?: string
	particle?: string
}

export interface MagicTransformProps {
	/** Documents that scroll through the transformer. Defaults to 4 procedural docs. */
	documents?: MagicTransformDocument[]
	/** Result chips emitted on the right. Defaults to 5. */
	results?: MagicTransformResult[]
	/** Total height of the stage. */
	height?: number | string
	/** Total width of the stage. */
	width?: number | string
	/**
	 * The "beat" of the transformer in seconds. One full document slides in
	 * and is shredded every `documentDuration` seconds, and each beat triggers
	 * one chip + particle burst.
	 */
	documentDuration?: number
	/** Width of a single document card, in px. */
	documentWidth?: number
	/** Height of a single document card, in px. */
	documentHeight?: number
	/** Visible gap between adjacent documents in the stream, in px. Loops seamlessly. */
	documentGap?: number
	/** Color of the central axis line. Defaults to the primary token. */
	axisColor?: string
	/** Background color of the stage (transparent by default). */
	backgroundColor?: string
	/** Node rendered in the centre tile (the client logo on case pages). */
	centerContent?: ReactNode
	/** Pixel size of the center tile on the axis. */
	centerSize?: number
	/** Number of halftone confetti particles emitted from the axis. */
	particleCount?: number
	/** Granular className overrides. */
	classNames?: MagicTransformClassNames
	/** Pause all animations. */
	paused?: boolean
	/** Optional className applied to the root. */
	className?: string
	/** Optional inline style applied to the root. */
	style?: CSSProperties
}

const DEFAULT_DOCUMENTS: MagicTransformDocument[] = [
	{ id: "doc-0" },
	{ id: "doc-1" },
	{ id: "doc-2" },
	{ id: "doc-3" },
]

/** One hue, varied by opacity: the chips read as steps of the same accent. */
const primaryAt = (percent: number): string =>
	`color-mix(in srgb, var(--primary) ${percent}%, transparent)`

const DEFAULT_RESULTS: MagicTransformResult[] = [
	{ id: "email", label: "correo", color: primaryAt(100) },
	{ id: "total", label: "total", color: primaryAt(80) },
	{ id: "address", label: "dirección", color: primaryAt(65) },
	{ id: "order", label: "pedido", color: primaryAt(50) },
	{ id: "items", label: "líneas", color: primaryAt(35) },
]

const ScribbleLine = ({ width, amplitude = 1.6 }: { width: number; amplitude?: number }) => {
	const segments = Math.max(8, Math.floor(width / 6))
	const segW = width / segments
	let d = `M 0 ${amplitude}`
	for (let i = 0; i < segments; i++) {
		const cx1 = i * segW + segW * 0.25
		const cy1 = i % 2 === 0 ? 0 : amplitude * 2
		const cx2 = i * segW + segW * 0.75
		const cy2 = i % 2 === 0 ? amplitude * 2 : 0
		const x = (i + 1) * segW
		const y = amplitude
		d += ` C ${cx1} ${cy1} ${cx2} ${cy2} ${x} ${y}`
	}
	return (
		<svg
			width={width}
			height={amplitude * 2 + 1}
			viewBox={`0 0 ${width} ${amplitude * 2 + 1}`}
			style={{ display: "block" }}
			aria-hidden
		>
			<path d={d} fill="none" stroke="var(--foreground)" strokeOpacity={0.7} strokeWidth={0.9} />
		</svg>
	)
}

const HalftoneBlock = ({ width, height }: { width: number; height: number }) => {
	const cols = Math.floor(width / 4)
	const rows = Math.floor(height / 4)
	return (
		<svg width={width} height={height} viewBox={`0 0 ${cols * 4} ${rows * 4}`} aria-hidden>
			{Array.from({ length: rows }).map((_, r) =>
				Array.from({ length: cols }).map((_, c) => {
					const v = (Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1
					const on = (v + 1) % 1 > 0.5
					return on ? (
						<rect key={`${r}-${c}`} x={c * 4} y={r * 4} width={3} height={3} fill="var(--border)" />
					) : null
				})
			)}
		</svg>
	)
}

type DocumentVariant = "letter" | "image" | "table" | "envelope"

const DocumentBody = memo(function DocumentBody({
	seed,
	variant,
	width,
	height,
}: {
	seed: number
	variant: DocumentVariant
	width: number
	height: number
}) {
	const rand = useMemo(
		() => (n: number) => {
			const x = Math.sin(seed * 9301 + n * 49297) * 233280
			return x - Math.floor(x)
		},
		[seed]
	)

	const innerWidth = width - 32

	if (variant === "table") {
		const rows = 9
		const cols = 4
		const rowH = Math.max(8, Math.floor((height - 80) / (rows + 1)))
		return (
			<div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
				<div className="mb-2 flex items-center justify-between">
					<div className="bg-muted-foreground/30 h-1.5 w-1/3 rounded-[1px]" />
					<div className="bg-muted-foreground/20 h-1.5 w-1/6 rounded-[1px]" />
				</div>
				<div
					className="bg-border grid gap-[1px] overflow-hidden rounded-[2px]"
					style={{
						gridTemplateColumns: `repeat(${cols}, 1fr)`,
					}}
				>
					{Array.from({ length: (rows + 1) * cols }).map((_, i) => {
						const isHeader = i < cols
						return (
							<div
								key={i}
								className={isHeader ? "bg-muted" : "bg-background"}
								style={{ height: rowH }}
							>
								<div className="flex h-full items-center px-1.5">
									<div
										className={`h-1 rounded-[1px] ${
											isHeader ? "bg-muted-foreground/50" : "bg-muted-foreground/30"
										}`}
										style={{ width: `${50 + rand(i) * 40}%` }}
									/>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	if (variant === "envelope") {
		return (
			<div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
				<div className="mb-2 flex items-center gap-2">
					<div className="bg-muted-foreground/30 h-3 w-3 rounded-full" />
					<div className="flex flex-1 flex-col gap-1">
						<div className="bg-muted-foreground/30 h-1.5 w-1/2 rounded-[1px]" />
						<div className="bg-muted-foreground/20 h-1 w-1/3 rounded-[1px]" />
					</div>
				</div>
				<div className="border-border border-t pt-2">
					<div className="bg-muted-foreground/30 h-2 w-3/4 rounded-[1px]" />
				</div>
				<div className="mt-1 flex flex-col gap-1.5">
					{Array.from({ length: 9 }).map((_, i) => (
						<ScribbleLine key={`em-${i}`} width={innerWidth * (0.6 + rand(i + 10) * 0.35)} />
					))}
				</div>
				<div className="border-border mt-auto flex gap-1.5 border-t pt-2">
					<div className="bg-border h-3 w-12 rounded-[2px]" />
					<div className="border-border h-3 w-12 rounded-[2px] border" />
				</div>
			</div>
		)
	}

	if (variant === "image") {
		const blockHeight = Math.floor(height * 0.42)
		return (
			<div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
				<div className="bg-muted-foreground/30 mb-2 h-1.5 w-1/4 rounded-[1px]" />
				<div className="overflow-hidden">
					<HalftoneBlock width={innerWidth} height={blockHeight} />
				</div>
				<div className="mt-2 flex flex-col gap-1.5">
					{Array.from({ length: 9 }).map((_, i) => (
						<ScribbleLine key={i} width={innerWidth * (0.78 + rand(i) * 0.2)} />
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
			<div className="bg-muted-foreground/30 mb-2 h-1.5 w-1/4 rounded-[1px]" />
			<div className="flex flex-col gap-1.5">
				{Array.from({ length: 7 }).map((_, i) => (
					<ScribbleLine key={`p1-${i}`} width={innerWidth * (0.7 + rand(i) * 0.28)} />
				))}
			</div>
			<div className="my-1.5 flex gap-2">
				<div className="border-border h-3 w-[36%] rounded-sm border" />
				<div className="border-border h-3 w-[18%] rounded-sm border" />
			</div>
			<div className="flex flex-col gap-1.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<ScribbleLine key={`p2-${i}`} width={innerWidth * (0.7 + rand(i + 30) * 0.28)} />
				))}
			</div>
			<div className="my-1.5 flex gap-2">
				<div className="border-border h-3 w-[28%] rounded-sm border" />
				<div className="bg-muted-foreground/20 h-2.5 w-[24%] rounded-[1px]" />
			</div>
			<div className="flex flex-col gap-1.5">
				{Array.from({ length: 4 }).map((_, i) => (
					<ScribbleLine key={`p3-${i}`} width={innerWidth * (0.7 + rand(i + 60) * 0.28)} />
				))}
			</div>
		</div>
	)
})

const ResultBody = () => (
	<div className="border-border bg-background flex flex-col gap-0.75 rounded-sm border p-2">
		{Array.from({ length: 3 }).map((_, i) => (
			<div key={i} className="grid grid-cols-3 gap-0.75">
				<div className="bg-border h-1.5 rounded-[1px]" />
				<div className="bg-muted col-span-2 h-1.5 rounded-[1px]" />
			</div>
		))}
	</div>
)

interface ParticleSpec {
	id: number
	color: string
	dx: number
	dy: number
	rot: number
	size: number
	microDelay: number
}

const useParticleSpecs = (count: number, results: MagicTransformResult[]): ParticleSpec[] =>
	useMemo(() => {
		const specs: ParticleSpec[] = []
		for (let i = 0; i < count; i++) {
			const r = results[i % results.length]
			const seed = i * 9301
			const rand = (n: number) => {
				const x = Math.sin(seed + n * 49297) * 233280
				return x - Math.floor(x)
			}
			const angle = (rand(1) - 0.5) * 1.4
			const dist = 90 + rand(2) * 230
			specs.push({
				id: i,
				color: r?.color || "",
				dx: Math.cos(angle) * dist,
				dy: Math.sin(angle) * dist * 0.65,
				rot: (rand(3) - 0.5) * 360,
				size: 8 + Math.floor(rand(4) * 8),
				microDelay: rand(5) * 0.12,
			})
		}
		return specs
	}, [count, results])

interface SlidingDocProps {
	index: number
	total: number
	beat: number
	variant: DocumentVariant
	documentWidth: number
	documentHeight: number
	documentGap: number
	centerX: number
	/** Static snapshot of the stream: no CSS animation at all. */
	isStatic: boolean
	className?: string
}

const SlidingDoc = memo(function SlidingDoc({
	index,
	total,
	beat,
	variant,
	documentWidth,
	documentHeight,
	documentGap,
	centerX,
	isStatic,
	className,
}: SlidingDocProps) {
	const cycle = beat * total
	const travelEnd = centerX
	const travelStart = travelEnd - total * (documentWidth + documentGap)
	const loopEnd = travelEnd + documentWidth + documentGap

	const baseStyle: CSSProperties = {
		width: documentWidth,
		height: documentHeight,
		top: 0,
		left: 0,
		position: "absolute",
	}

	// Where this document sits at t = 0 of the loop (its negative delay
	// spreads the stream evenly), so the still frame matches the moving one.
	const staticX = travelStart + (index / total) * (loopEnd - travelStart)

	const docStyle: CSSProperties = isStatic
		? { ...baseStyle, transform: `translate3d(${staticX}px, 0, 0)` }
		: {
				...baseStyle,
				willChange: "transform",
				["--mt-from" as string]: `${travelStart}px`,
				["--mt-to" as string]: `${loopEnd}px`,
				animationName: "magic-transform-doc-slide",
				animationDuration: `${cycle}s`,
				animationTimingFunction: "linear",
				animationIterationCount: "infinite",
				animationDelay: `${-index * beat}s`,
			}

	return (
		<div className={className} style={docStyle}>
			<DocumentBody
				seed={index + 1}
				variant={variant}
				width={documentWidth}
				height={documentHeight}
			/>
		</div>
	)
})

const MagicTransform = ({
	documents = DEFAULT_DOCUMENTS,
	results = DEFAULT_RESULTS,
	height = 560,
	width = "100%",
	documentDuration = 4,
	documentWidth = 220,
	documentHeight = 320,
	documentGap = 60,
	axisColor = "var(--primary)",
	backgroundColor,
	centerContent,
	centerSize = 56,
	particleCount = 18,
	classNames,
	paused = false,
	className,
	style,
}: MagicTransformProps) => {
	useDocSlideStyles()

	const reduce = useReducedMotion()
	const stageRef = useRef<HTMLDivElement | null>(null)
	const inView = useInView(stageRef, { margin: "-10% 0px" })
	const [stageWidth, setStageWidth] = useState(0)

	// Reduced motion renders the still frame; off screen nothing runs either.
	const isStatic = paused || reduce || !inView

	useEffect(() => {
		const el = stageRef.current
		if (!el) return
		setStageWidth(el.clientWidth)
		let timer: ReturnType<typeof setTimeout> | null = null
		const ro = new ResizeObserver((entries) => {
			const next = entries[0]?.contentRect.width ?? el.clientWidth
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				setStageWidth((prev) => (Math.abs(prev - next) < 1 ? prev : next))
			}, 100)
		})
		ro.observe(el)
		return () => {
			if (timer) clearTimeout(timer)
			ro.disconnect()
		}
	}, [])

	const beat = documentDuration
	const docCount = Math.max(1, documents.length)
	const centerX = stageWidth / 2

	const [burstId, setBurstId] = useState(0)
	const animStartRef = useRef(0)

	// Remounting the stream on any of these restarts the CSS loop from t = 0,
	// which is what keeps the beat timer below in phase with it.
	const restartKey = useMemo(
		() => `${beat}|${documentWidth}|${documentGap}|${docCount}|${centerX}|${isStatic}`,
		[beat, documentWidth, documentGap, docCount, centerX, isStatic]
	)

	useEffect(() => {
		if (isStatic || stageWidth <= 0) return

		animStartRef.current = performance.now()

		const cycle = beat * docCount
		const span = (docCount + 1) * (documentWidth + documentGap)
		const impactOffset = docCount * (documentWidth + documentGap) - documentWidth
		const tauCross = (impactOffset / span) * cycle

		const computeNextDelay = () => {
			const elapsed = (performance.now() - animStartRef.current) / 1000
			const phase = (((elapsed - tauCross) % beat) + beat) % beat
			return phase < 1e-3 ? beat : beat - phase
		}

		let intervalId: ReturnType<typeof setInterval> | null = null
		const timeoutId = setTimeout(() => {
			setBurstId((id) => id + 1)
			intervalId = setInterval(() => {
				setBurstId((id) => id + 1)
			}, beat * 1000)
		}, computeNextDelay() * 1000)

		return () => {
			clearTimeout(timeoutId)
			if (intervalId) clearInterval(intervalId)
		}
	}, [isStatic, stageWidth, beat, docCount, documentWidth, documentGap, restartKey])

	const axisHeight = documentHeight
	const axisHaloWidth = 56

	const colStep = 200
	const rowStep = 130
	const baseX = centerSize / 2 + 40
	const baseY = -rowStep - 20
	const slots = useMemo(
		() => [
			{ col: 0, row: 0 },
			{ col: 1, row: 0 },
			{ col: 0, row: 1 },
			{ col: 0, row: 2 },
			{ col: 1, row: 2 },
		],
		[]
	)

	const particleSpecs = useParticleSpecs(particleCount, results)

	const rootStyle: CSSProperties = {
		width,
		height,
		background: backgroundColor,
		...style,
	}

	const showBursts = burstId > 0 && !isStatic

	return (
		<div
			ref={stageRef}
			className={cn("relative overflow-hidden rounded-sm", classNames?.root, className)}
			style={rootStyle}
		>
			{stageWidth > 0 && (
				<div
					key={restartKey}
					className="pointer-events-none absolute z-10 overflow-hidden"
					style={{
						left: 0,
						width: centerX,
						top: `calc(50% - ${documentHeight / 2}px)`,
						height: documentHeight,
					}}
					aria-hidden
				>
					{documents.map((doc, i) => (
						<SlidingDoc
							key={doc.id}
							index={i}
							total={docCount}
							beat={beat}
							variant={(["letter", "table", "envelope", "image"] as const)[i % 4]!}
							documentWidth={documentWidth}
							documentHeight={documentHeight}
							documentGap={documentGap}
							centerX={centerX}
							isStatic={isStatic}
							className={cn("border-border bg-background rounded-sm border", classNames?.document)}
						/>
					))}
				</div>
			)}

			<div
				className={cn("pointer-events-none absolute z-20", classNames?.axis)}
				style={{
					width: axisHaloWidth,
					height: axisHeight,
					left: "50%",
					top: "50%",
					transform: "translate(-100%, -50%)",
					background: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${axisColor} 6%, transparent) 60%, color-mix(in srgb, ${axisColor} 12%, transparent) 100%)`,
				}}
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute z-20"
				style={{
					width: 2,
					height: axisHeight,
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
					background: axisColor,
				}}
				aria-hidden
			/>

			<motion.div
				key={`center-${burstId}`}
				className={cn(
					"border-border bg-background text-foreground pointer-events-none absolute top-1/2 left-1/2 z-30 flex items-center justify-center rounded-sm border p-2",
					classNames?.center
				)}
				style={{
					width: centerSize,
					height: centerSize,
					translate: "-50% -50%",
				}}
				initial={{ scale: 1 }}
				animate={burstId === 0 || reduce ? {} : { scale: [1, 1.14, 1] }}
				transition={{
					duration: Math.min(0.6, beat * 0.5),
					ease: [0.16, 1, 0.3, 1],
					times: [0, 0.25, 1],
				}}
			>
				{centerContent}
			</motion.div>

			{stageWidth > 0 && showBursts && (
				<div
					key={`particles-${burstId}`}
					className="pointer-events-none absolute top-1/2 left-1/2 z-20"
					aria-hidden
				>
					{particleSpecs.map((p) => {
						const lifetime = Math.min(beat * 1.2, 2.4)
						return (
							<motion.div
								key={p.id}
								className={cn("absolute", classNames?.particle)}
								style={{
									left: 0,
									top: 0,
									width: p.size,
									height: p.size,
									translate: "-50% -50%",
									willChange: "transform, opacity",
								}}
								initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.2 }}
								animate={{
									x: p.dx,
									y: p.dy,
									rotate: p.rot,
									scale: 1,
									opacity: [0, 1, 1, 0],
								}}
								transition={{
									default: {
										duration: lifetime,
										ease: [0.16, 1, 0.3, 1],
										delay: p.microDelay,
									},
									opacity: {
										duration: lifetime,
										times: [0, 0.12, 0.5, 1],
										ease: "easeOut",
										delay: p.microDelay,
									},
								}}
							>
								<div className="h-full w-full rounded-[3px]" style={{ background: p.color }} />
							</motion.div>
						)
					})}
				</div>
			)}

			{stageWidth > 0 && showBursts && (
				<div
					key={`results-${burstId}`}
					className="pointer-events-none absolute top-1/2 left-1/2 z-20"
					aria-hidden
				>
					{results.map((res, i) => {
						const total = results.length
						const t = total === 1 ? 0.5 : i / (total - 1)
						const jitter = (((i * 53) % 11) - 5) / 60
						const angle = (t - 0.5) * 1.1 + jitter

						const driftDist = 240 + ((i * 23) % 60)
						const endX = Math.cos(angle) * driftDist + baseX * 0.4
						const endY = Math.sin(angle) * driftDist

						const launchRot = ((i * 53) % 30) - 15
						const endRot = launchRot * 0.25
						const microDelay = (i * 0.025) % 0.12

						const lifetime = Math.min(beat * 1.1, 2.4)

						return (
							<motion.div
								key={res.id}
								className={cn("absolute flex w-42.5 flex-col gap-1.5", classNames?.result)}
								style={{
									left: 0,
									top: 0,
									transformOrigin: "0% 50%",
									willChange: "transform, opacity",
								}}
								initial={{
									x: 0,
									y: 0,
									rotate: launchRot,
									opacity: 0,
									scale: 0.3,
								}}
								animate={{
									x: endX,
									y: endY,
									rotate: endRot,
									scale: 1,
									opacity: [0, 1, 1, 0],
								}}
								transition={{
									default: {
										duration: lifetime,
										ease: [0.16, 1, 0.3, 1],
										delay: microDelay,
									},
									opacity: {
										duration: lifetime,
										times: [0, 0.1, 0.55, 1],
										ease: "easeOut",
										delay: microDelay,
									},
								}}
							>
								<div className="h-5 w-22 rounded-sm" style={{ background: res.color }} />
								<div className={cn(classNames?.resultBody)}>
									<ResultBody />
								</div>
							</motion.div>
						)
					})}
				</div>
			)}

			{stageWidth > 0 && isStatic && (
				<div className="pointer-events-none absolute top-1/2 left-1/2 z-20" aria-hidden>
					{results.map((res, i) => {
						const slot = slots[i] ?? { col: i % 2, row: Math.floor(i / 2) }
						const targetX = baseX + slot.col * colStep
						const targetY = baseY + slot.row * rowStep
						return (
							<div
								key={res.id}
								className={cn("absolute flex w-42.5 flex-col gap-1.5", classNames?.result)}
								style={{
									left: 0,
									top: 0,
									transform: `translate(${targetX}px, ${targetY}px)`,
								}}
							>
								<div className="h-5 w-22 rounded-sm" style={{ background: res.color }} />
								<div className={cn(classNames?.resultBody)}>
									<ResultBody />
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default MagicTransform
