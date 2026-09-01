"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { getCaseStudyVisuals, type ArchNode } from "@/components/case-study/visuals/registry"
import { CornerPlus, Kicker } from "@/components/corner-plus"
import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"
import { useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailArchitectureProps {
	project: ProjectData
	caseStudy: CaseStudy
}

const NODE_FILL = {
	primary: "var(--primary)",
	accent: "color-mix(in srgb, var(--primary) 10%, transparent)",
	neutral: "var(--background)",
} as const

const NODE_STROKE = {
	primary: "var(--primary)",
	accent: "var(--primary)",
	neutral: "var(--border)",
} as const

export function DetailArchitecture({ project, caseStudy }: DetailArchitectureProps): ReactNode {
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const architecture = getCaseStudyVisuals(project.id)?.architecture
	const headline = resolveHeadline(caseStudy, "architecture")

	// No diagram data → nothing to draw.
	if (!architecture || architecture.nodes.length === 0) return null

	const { nodes, edges, viewBox, ariaLabel, diagramTitle } = architecture
	const byId: Record<string, ArchNode> = Object.fromEntries(nodes.map((n) => [n.id, n]))

	const getAnchor = (n: ArchNode, side: "top" | "bottom") => ({
		x: n.x + n.w / 2,
		y: side === "top" ? n.y : n.y + n.h,
	})

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={item}
					transition={itemTransition}
					className="lg:pt-2"
				>
					<Kicker>Arquitectura</Kicker>
					<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
					<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
						{headline.standfirst ?? caseStudy.architectureDescription}
					</p>
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={item}
					transition={itemTransition}
					className="border-border bg-muted/40 relative rounded-sm border p-4 sm:p-6"
				>
					<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
					<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

					{diagramTitle ? (
						<h3 className="text-foreground mb-3 text-sm font-semibold tracking-tight">
							{diagramTitle}
						</h3>
					) : null}

					<svg
						viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
						className="h-auto w-full"
						role="img"
						aria-label={ariaLabel}
					>
						<defs>
							<marker
								id="arrowhead"
								viewBox="0 0 10 10"
								refX="8"
								refY="5"
								markerWidth="6"
								markerHeight="6"
								orient="auto-start-reverse"
							>
								<path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.45" />
							</marker>
						</defs>

						<g
							className="text-muted-foreground"
							stroke="currentColor"
							strokeOpacity="0.45"
							strokeWidth="1.2"
							fill="none"
						>
							{edges.map((e, i) => {
								const from = byId[e.from]
								const to = byId[e.to]
								if (!from || !to) return null
								const a = getAnchor(from, "bottom")
								const b = getAnchor(to, "top")
								const midY = (a.y + b.y) / 2
								return (
									<path
										key={i}
										d={`M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`}
										markerEnd="url(#arrowhead)"
									/>
								)
							})}
						</g>

						<g>
							{nodes.map((n) => {
								const tone = n.tone === "primary" || n.tone === "accent" ? n.tone : "neutral"
								const isPrimary = tone === "primary"
								const textColor = isPrimary ? "var(--primary-foreground)" : "var(--foreground)"
								const subColor = isPrimary
									? "color-mix(in srgb, var(--primary-foreground) 75%, transparent)"
									: "var(--muted-foreground)"
								return (
									<g key={n.id}>
										<rect
											x={n.x}
											y={n.y}
											width={n.w}
											height={n.h}
											rx="4"
											ry="4"
											fill={NODE_FILL[tone]}
											stroke={NODE_STROKE[tone]}
											strokeWidth="1.2"
										/>
										<text
											x={n.x + n.w / 2}
											y={n.y + (n.sub ? n.h / 2 - 4 : n.h / 2 + 4)}
											fill={textColor}
											fontSize="14"
											fontWeight="600"
											textAnchor="middle"
											dominantBaseline="middle"
										>
											{n.label}
										</text>
										{n.sub ? (
											<text
												x={n.x + n.w / 2}
												y={n.y + n.h / 2 + 14}
												fill={subColor}
												fontSize="11"
												textAnchor="middle"
												dominantBaseline="middle"
											>
												{n.sub}
											</text>
										) : null}
									</g>
								)
							})}
						</g>
					</svg>
				</motion.div>
			</div>
		</section>
	)
}
