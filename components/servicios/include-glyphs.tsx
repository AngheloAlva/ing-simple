"use client"

import { softEase, useReducedMotion } from "@/lib/motion"
import { RefreshCw } from "lucide-react"
import { motion, type TargetAndTransition, type Transition, type Variants } from "motion/react"
import type { ComponentType, ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Tiny identifying glyphs for the "Qué incluye" dashboard cards.
 *
 * Every glyph fits a 40×28 box, is drawn in `currentColor` with three
 * opacity tiers (0.35 / 0.6 / 1) and animates in two ways:
 *
 * - entrance: inherits the card's "hidden"/"visible" variants, so it staggers
 *   with the card. Elements pop in (opacity + scale + blur), draw in
 *   (`pathLength`) or grow, ~60 ms apart.
 * - hover: the card passes `hovered`; wrappers below animate between a rest
 *   and an active target with the icon spring, so the change is interruptible
 *   and returns on its own. Hover wrappers use a plain `animate` target rather
 *   than a variant label on purpose: a label (`whileHover="hover"`) would turn
 *   the card into its own variant root and cut off the inherited entrance.
 *
 * Reduced motion renders the final state with no animation.
 * ------------------------------------------------------------------------ */

const ICON_SPRING: Transition = { type: "spring", duration: 0.3, bounce: 0 }
const STEP = 0.06
const BASE_DELAY = 0.2

/** Opacity tiers of the monochrome palette. */
const DIM = 0.35
const MID = 0.6
const FULL = 1

type Target = TargetAndTransition

type GlyphMotion = {
	/** Pop in per the icon rule: opacity 0→tier, scale 0.25→1, blur 4px→0. */
	pop: (tier: number, step: number) => Variants
	/** Draw a stroke via `pathLength` 0→1. */
	draw: (step: number) => Variants
	/** Generic entrance between two targets with the soft ease. */
	enter: (from: Target, to: Target, step: number) => Variants
	/** `animate`/`transition` props for a hover wrapper: rest, or active while hovered. */
	hover: (rest: Target, active: Target) => { animate: Target; transition: Transition }
}

function useGlyphMotion(hovered: boolean): GlyphMotion {
	const reduced = useReducedMotion()
	const delay = (step: number): number => BASE_DELAY + step * STEP

	return {
		pop: (tier, step) => {
			const to = { opacity: tier, scale: 1, filter: "blur(0px)" }
			return reduced
				? { hidden: to, visible: to }
				: {
						hidden: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
						visible: { ...to, transition: { ...ICON_SPRING, delay: delay(step) } },
					}
		},
		draw: (step) =>
			reduced
				? { hidden: { pathLength: 1 }, visible: { pathLength: 1 } }
				: {
						hidden: { pathLength: 0 },
						visible: {
							pathLength: 1,
							transition: { duration: 0.45, ease: softEase, delay: delay(step) },
						},
					},
		enter: (from, to, step) =>
			reduced
				? { hidden: to, visible: to }
				: {
						hidden: from,
						visible: { ...to, transition: { duration: 0.4, ease: softEase, delay: delay(step) } },
					},
		hover: (rest, active) => ({
			animate: hovered && !reduced ? active : rest,
			transition: ICON_SPRING,
		}),
	}
}

export type IncludeGlyphProps = { hovered?: boolean }

const SVG_PROPS = {
	viewBox: "0 0 40 28",
	width: 40,
	height: 28,
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.5,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "block overflow-visible",
} as const

/* ------------------------------ 1. dashboard ------------------------------ */

const DASHBOARD_BARS = [45, 100, 70]

/** 2×2 mini board: bars, a sparkline, a KPI figure and a ring — every tile in use. */
function DashboardGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)
	const tile = "rounded-[2px] overflow-hidden border border-current/35"

	return (
		<div className="grid h-7 w-10 grid-cols-2 grid-rows-2 gap-[3px]">
			{/* Bars: 3 × 2px + 2 × 2px gaps = 10px, inside the ~14px tile interior. */}
			<motion.div
				variants={m.pop(FULL, 0)}
				className={`${tile} flex items-end justify-center px-[2px] pb-[2px]`}
			>
				<motion.div
					{...m.hover({ scaleY: 1 }, { scaleY: 1.18 })}
					style={{ originY: 1 }}
					className="flex h-full items-end gap-[2px]"
				>
					{DASHBOARD_BARS.map((height, i) => (
						<motion.span
							key={i}
							variants={m.enter({ height: 0 }, { height: `${height}%` }, 4 + i)}
							className="w-[2px] rounded-t-[1px] bg-current"
						/>
					))}
				</motion.div>
			</motion.div>

			{/* Sparkline */}
			<motion.div variants={m.pop(FULL, 1)} className={`${tile} flex items-center justify-center`}>
				<svg
					viewBox="0 0 12 7"
					width={12}
					height={7}
					fill="none"
					className="block overflow-visible"
				>
					<motion.path
						d="M0.75 5.75 L3.75 2.75 L6.25 4.5 L11.25 0.75"
						stroke="currentColor"
						strokeWidth={1.25}
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{ opacity: MID }}
						variants={m.draw(5)}
					/>
				</svg>
			</motion.div>

			{/* KPI figure: a bold value line over a faint label line */}
			<motion.div
				variants={m.pop(FULL, 2)}
				className={`${tile} flex flex-col justify-center gap-[2px] px-[3px]`}
			>
				<motion.span
					variants={m.enter({ scaleX: 0 }, { scaleX: 1 }, 6)}
					style={{ originX: 0 }}
					className="h-[2px] w-[7px] rounded-full bg-current"
				/>
				<motion.span
					variants={m.enter({ scaleX: 0 }, { scaleX: 1 }, 7)}
					style={{ originX: 0, opacity: DIM }}
					className="h-[1.5px] w-[5px] rounded-full bg-current"
				/>
			</motion.div>

			{/* Ring: a faint track with a drawn 270° arc */}
			<motion.div variants={m.pop(FULL, 3)} className={`${tile} flex items-center justify-center`}>
				<svg viewBox="0 0 8 8" width={8} height={8} fill="none" className="block overflow-visible">
					<circle
						cx={4}
						cy={4}
						r={3}
						stroke="currentColor"
						strokeWidth={1.25}
						style={{ opacity: DIM }}
					/>
					<motion.path
						d="M4 1 A3 3 0 1 1 1 4"
						stroke="currentColor"
						strokeWidth={1.25}
						strokeLinecap="round"
						variants={m.draw(8)}
					/>
				</svg>
			</motion.div>
		</div>
	)
}

/* ------------------------------- 2. sources ------------------------------- */

const SOURCE_Y = [5, 14, 23]

/** Three source dots on the left converge into one node on the right. */
function SourcesGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)

	return (
		<svg {...SVG_PROPS} aria-hidden="true">
			{SOURCE_Y.map((y, i) => (
				<motion.circle
					key={y}
					cx={4}
					cy={y}
					r={2}
					fill="currentColor"
					stroke="none"
					style={{ opacity: MID }}
					variants={m.pop(MID, i)}
				/>
			))}
			{SOURCE_Y.map((y, i) => (
				<motion.path
					key={y}
					d={`M7 ${y} C 19 ${y}, 19 14, 30 14`}
					strokeWidth={1.25}
					style={{ opacity: DIM }}
					variants={m.draw(2 + i)}
				/>
			))}
			<motion.g {...m.hover({ scale: 1 }, { scale: 1.15 })}>
				<motion.circle
					cx={34}
					cy={14}
					r={3.5}
					fill="currentColor"
					stroke="none"
					variants={m.pop(FULL, 6)}
				/>
			</motion.g>
		</svg>
	)
}

/* -------------------------------- 3. report ------------------------------- */

const REPORT_LINES: [number, number][] = [
	[24, FULL],
	[22, MID],
	[18, DIM],
]

/** A small page with three text lines and a "sent" arrow at its corner. */
function ReportGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)

	return (
		<svg {...SVG_PROPS} aria-hidden="true">
			<motion.rect
				x={8}
				y={1}
				width={20}
				height={26}
				rx={2}
				strokeWidth={1.25}
				style={{ opacity: MID }}
				variants={m.pop(MID, 0)}
			/>
			{REPORT_LINES.map(([x2, tier], i) => (
				<motion.line
					key={i}
					x1={12}
					x2={x2}
					y1={8 + i * 5}
					y2={8 + i * 5}
					strokeWidth={1.5}
					variants={m.enter({ opacity: 0, x: -4 }, { opacity: tier, x: 0 }, 1 + i)}
				/>
			))}
			<motion.g {...m.hover({ x: 0 }, { x: 2 })}>
				<motion.path
					d="M27 22 H37 M33.5 18.5 L37 22 L33.5 25.5"
					strokeWidth={1.5}
					variants={m.pop(FULL, 5)}
				/>
			</motion.g>
		</svg>
	)
}

/* --------------------------------- 4. kpi --------------------------------- */

/** A progress bar that grows to its target tick, with a delta chip above. */
function KpiGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)

	return (
		<svg {...SVG_PROPS} aria-hidden="true">
			<rect
				x={2}
				y={18}
				width={36}
				height={4}
				rx={1}
				fill="currentColor"
				stroke="none"
				opacity={DIM}
			/>
			<motion.rect
				x={2}
				y={18}
				width={28}
				height={4}
				rx={1}
				fill="currentColor"
				stroke="none"
				style={{ originX: 0 }}
				variants={m.enter({ scaleX: 0 }, { scaleX: 1 }, 0)}
			/>
			<motion.line
				x1={30}
				x2={30}
				y1={13}
				y2={27}
				strokeWidth={1.5}
				style={{ opacity: MID }}
				variants={m.pop(MID, 3)}
			/>
			<motion.g {...m.hover({ y: 0 }, { y: -1 })}>
				<motion.g variants={m.pop(FULL, 5)}>
					<rect x={20} y={2} width={12} height={9} rx={2} strokeWidth={1.25} opacity={MID} />
					<path d="M26 4.5 L28.5 8.5 H23.5 Z" fill="currentColor" stroke="none" />
				</motion.g>
			</motion.g>
		</svg>
	)
}

/* ------------------------------- 5. refresh ------------------------------- */

/** The lucide refresh icon: pops in per the icon rule, makes a half turn on hover. */
function RefreshGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)

	return (
		<div className="flex h-7 w-10 items-center justify-end">
			<motion.div variants={m.pop(FULL, 0)} className="flex">
				<motion.div {...m.hover({ rotate: 0 }, { rotate: 180 })} className="flex">
					<RefreshCw size={20} strokeWidth={1.75} aria-hidden="true" />
				</motion.div>
			</motion.div>
		</div>
	)
}

/* ------------------------------- 6. handoff ------------------------------- */

/** A card slides from the left toward a check circle on the right. */
function HandoffGlyph({ hovered = false }: IncludeGlyphProps): ReactNode {
	const m = useGlyphMotion(hovered)

	return (
		<svg {...SVG_PROPS} aria-hidden="true">
			<motion.g {...m.hover({ x: 0 }, { x: 2 })}>
				<motion.g variants={m.enter({ opacity: 0, x: -6 }, { opacity: MID, x: 0 }, 0)}>
					<rect x={2} y={7} width={16} height={14} rx={2} strokeWidth={1.25} />
					<line x1={5.5} x2={13} y1={11.5} y2={11.5} strokeWidth={1.25} />
					<line x1={5.5} x2={10} y1={16} y2={16} strokeWidth={1.25} />
				</motion.g>
			</motion.g>
			<motion.line
				x1={21}
				x2={25}
				y1={14}
				y2={14}
				strokeWidth={1.25}
				strokeDasharray="1.5 2"
				style={{ opacity: DIM }}
				variants={m.pop(DIM, 2)}
			/>
			<motion.circle cx={33} cy={14} r={6} strokeWidth={1.5} variants={m.pop(FULL, 3)} />
			<motion.path d="M30 14 L32.25 16.25 L36.25 12" strokeWidth={1.5} variants={m.draw(5)} />
		</svg>
	)
}

/* -------------------------------- registry -------------------------------- */

export const INCLUDE_GLYPHS: Record<string, ComponentType<IncludeGlyphProps>> = {
	dashboard: DashboardGlyph,
	sources: SourcesGlyph,
	report: ReportGlyph,
	kpi: KpiGlyph,
	refresh: RefreshGlyph,
	handoff: HandoffGlyph,
}
