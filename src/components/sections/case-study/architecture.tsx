"use client"

import { motion } from "motion/react"

import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"

import { getCaseStudyVisuals, type ArchNode } from "./visuals/registry"

interface CaseStudyArchitectureProps {
	project: ProjectData
	caseStudy: CaseStudy
	accent?: string
}

const FALLBACK = {
	viewBox: { width: 800, height: 200 },
	ariaLabel: "Diagrama de arquitectura",
	nodes: [] as ArchNode[],
	edges: [] as { from: string; to: string }[],
}

export function CaseStudyArchitecture({
	project,
	caseStudy,
	accent = "#6366f1",
}: CaseStudyArchitectureProps) {
	const visuals = getCaseStudyVisuals(project.id)
	const { nodes, edges, viewBox, ariaLabel } = visuals?.architecture ?? FALLBACK
	const byId: Record<string, ArchNode> = Object.fromEntries(nodes.map((n) => [n.id, n]))

	const getAnchor = (n: ArchNode, side: "top" | "bottom") => ({
		x: n.x + n.w / 2,
		y: side === "top" ? n.y : n.y + n.h,
	})

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
						>
							03 — Arquitectura
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
						>
							Cómo está armado por dentro
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: 0.15 }}
							className="text-muted-foreground mt-5 text-base leading-relaxed"
						>
							{caseStudy.architectureDescription}
						</motion.p>
					</div>

					<div className="lg:col-span-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.6 }}
							className="border-border bg-muted/40 rounded-2xl border p-4 sm:p-6"
						>
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
										const isPrimary = n.tone === "primary"
										const isAccent = n.tone === "accent"
										const fill = isPrimary
											? accent
											: isAccent
												? `${accent}1A`
												: "var(--color-background)"
										const stroke = isPrimary ? accent : isAccent ? accent : "var(--color-border)"
										const textColor = isPrimary ? "#ffffff" : "var(--color-foreground)"
										const subColor = isPrimary ? "#ffffffbb" : "var(--color-muted-foreground)"
										return (
											<g key={n.id}>
												<rect
													x={n.x}
													y={n.y}
													width={n.w}
													height={n.h}
													rx="10"
													ry="10"
													fill={fill}
													stroke={stroke}
													strokeWidth="1.2"
													opacity={isPrimary ? 0.95 : 1}
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
												{n.sub && (
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
												)}
											</g>
										)
									})}
								</g>
							</svg>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	)
}
