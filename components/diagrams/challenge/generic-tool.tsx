"use client"

import { useChallengeHover } from "@/components/challenge-card"
import { DiagramCanvas, Reveal } from "@/components/diagrams/challenge/shared"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Herramientas que no encajan — your operation drops into the generic system
 * one piece at a time. One of them fits. The rest hit the box, bounce off and
 * stay outside, which is exactly where the manual work comes back from. The
 * box never changes shape: you do.
 * ------------------------------------------------------------------------ */

type Piece = { label: string; fits: boolean }

const PIECES: Piece[] = [
	{ label: "Aprobaciones", fits: false },
	{ label: "Remitos", fits: true },
	{ label: "Precios por cliente", fits: false },
	{ label: "Turnos", fits: false },
]

const OUTSIDE_COUNT = PIECES.filter((piece) => !piece.fits).length

const AIM_MS = 260
const FALL_MS = 460
const SETTLE_MS = 420
const RESTART_MS = 1500

type Stage = "aim" | "fall" | "settle"
type Phase = { index: number; stage: Stage; cycle: number } | null

function stageDuration(stage: Stage): number {
	if (stage === "aim") return AIM_MS
	if (stage === "fall") return FALL_MS
	return SETTLE_MS
}

/** Drops each piece into the box in turn, then starts the whole thing over. */
function useDropLoop(enabled: boolean): Phase {
	const [phase, setPhase] = useState<Phase>(null)

	useEffect(() => {
		if (!enabled) {
			setPhase(null)
			return
		}

		let cancelled = false
		const timers: ReturnType<typeof setTimeout>[] = []

		const advance = (index: number, stage: Stage, cycle: number) => {
			if (cancelled) return
			setPhase({ index, stage, cycle })

			timers.push(
				setTimeout(() => {
					if (cancelled) return

					if (stage === "aim") return advance(index, "fall", cycle)
					if (stage === "fall") return advance(index, "settle", cycle)

					const next = index + 1
					if (next < PIECES.length) return advance(next, "aim", cycle)

					setPhase(null)
					timers.push(setTimeout(() => advance(0, "aim", cycle + 1), RESTART_MS))
				}, stageDuration(stage))
			)
		}

		advance(0, "aim", 0)

		return () => {
			cancelled = true
			timers.forEach(clearTimeout)
		}
	}, [enabled])

	return phase
}

type PieceState = "idle" | "aiming" | "gone" | "outside" | "inside"

/** The piece currently being dropped, animated between the row and the box. */
function FallingPiece({
	piece,
	stage,
	cycle,
}: {
	piece: Piece
	stage: Stage
	cycle: number
}): ReactNode {
	const rejected = stage === "settle" && !piece.fits
	const accepted = stage === "settle" && piece.fits

	return (
		<motion.span
			key={`${piece.label}-${cycle}`}
			className={cn(
				"bg-background absolute top-0 left-1/2 z-20 flex h-6 -translate-x-1/2 items-center rounded-sm border px-2 text-[10px] leading-none whitespace-nowrap",
				rejected
					? "border-border text-muted-foreground border-dashed"
					: "border-brand-blue/50 text-foreground"
			)}
			initial={{ y: 0, x: "-50%", rotate: 0, opacity: 0 }}
			animate={
				stage === "aim"
					? { y: 0, x: "-50%", rotate: 0, opacity: 1 }
					: stage === "fall"
						? { y: 30, x: "-50%", rotate: 0, opacity: 1 }
						: accepted
							? { y: 44, x: "-50%", rotate: 0, opacity: 0, scale: 0.9 }
							: { y: 6, x: "-118%", rotate: -14, opacity: 0 }
			}
			transition={{
				duration: stageDuration(stage) / 1000,
				ease: stage === "fall" ? "easeIn" : "easeOut",
			}}
		>
			{piece.label}
		</motion.span>
	)
}

export function DiagramGenericTool(): ReactNode {
	const active = useChallengeHover()
	const prefersReduced = useReducedMotion()
	const phase = useDropLoop(active && !prefersReduced)
	const running = phase !== null

	const pieceState = (index: number): PieceState => {
		const piece = PIECES[index]
		if (!piece) return "idle"
		if (!running) return piece.fits ? "inside" : "outside"

		if (phase.index === index)
			return phase.stage === "settle" ? (piece.fits ? "inside" : "outside") : "gone"
		if (phase.index > index) return piece.fits ? "inside" : "outside"
		return "idle"
	}

	const outsideSoFar = running
		? PIECES.filter((piece, index) => !piece.fits && pieceState(index) === "outside").length
		: OUTSIDE_COUNT

	const boxRejecting = running && phase.stage === "settle" && !PIECES[phase.index]?.fits

	return (
		<DiagramCanvas caption="El sistema no cambia de forma. El proceso que se adapta es el tuyo.">
			<div className="flex h-full flex-col justify-between py-0.5">
				{/* Your operation, piece by piece. */}
				<div className="flex flex-wrap items-center justify-center gap-1.5">
					{PIECES.map((piece, index) => {
						const state = pieceState(index)

						return (
							<Reveal key={piece.label}>
								<span
									className={cn(
										"bg-background flex h-6 items-center gap-1.5 rounded-sm border px-2 text-[10px] leading-none whitespace-nowrap transition-all duration-300",
										state === "idle" && "border-border text-muted-foreground",
										state === "gone" && "border-border/50 border-dashed text-transparent",
										state === "inside" && "border-brand-blue/50 text-foreground",
										state === "outside" && "border-border text-muted-foreground border-dashed"
									)}
								>
									{state === "inside" ? (
										<span className="bg-brand-blue h-1 w-1 shrink-0 rounded-full" />
									) : null}
									{piece.label}
								</span>
							</Reveal>
						)
					})}
				</div>

				{/* Drop zone: the piece falls through here toward the box. */}
				<div className="relative h-10">
					{running ? (
						<FallingPiece
							piece={PIECES[phase.index] ?? PIECES[0]!}
							stage={phase.stage}
							cycle={phase.cycle}
						/>
					) : null}
				</div>

				{/* The generic system: a fixed opening that most pieces miss. */}
				<Reveal>
					<motion.div
						className={cn(
							"bg-background flex h-11 items-center justify-between rounded-sm border px-3 transition-colors duration-300",
							boxRejecting ? "border-foreground/40" : "border-border"
						)}
						animate={boxRejecting && !prefersReduced ? { x: [0, -3, 3, 0] } : { x: 0 }}
						transition={{ duration: 0.32, ease: "easeInOut" }}
					>
						<div className="flex flex-col gap-1">
							<span className="text-muted-foreground text-[10px] leading-none">
								Sistema genérico
							</span>
							<span className="border-border h-1.5 w-14 rounded-full border border-dashed" />
						</div>

						<div className="text-right">
							<span className="text-foreground/80 text-[13px] leading-none font-semibold tabular-nums">
								{outsideSoFar} de {PIECES.length}
							</span>
							<span className="text-muted-foreground mt-1 block text-[10px] leading-none">
								quedan afuera
							</span>
						</div>
					</motion.div>
				</Reveal>
			</div>
		</DiagramCanvas>
	)
}
