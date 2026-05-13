"use client"

import { motion } from "motion/react"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyArchitectureProps {
	caseStudy: CaseStudy
	accent?: string
}

interface DiagramNode {
	id: string
	x: number
	y: number
	w: number
	h: number
	label: string
	sub?: string
	tone: "primary" | "neutral" | "accent"
}

interface DiagramEdge {
	from: string
	to: string
	label?: string
}

const NODES: DiagramNode[] = [
	{
		id: "clients",
		x: 20,
		y: 20,
		w: 760,
		h: 64,
		label: "Clientes",
		sub: "Equipo OTC interno + empresas contratistas",
		tone: "neutral",
	},
	{
		id: "next",
		x: 20,
		y: 120,
		w: 760,
		h: 72,
		label: "Next.js · App Router",
		sub: "TypeScript · SSR · RSC · Cliente",
		tone: "primary",
	},
	{
		id: "api",
		x: 20,
		y: 228,
		w: 760,
		h: 64,
		label: "Server Actions + API Routes",
		sub: "Validación end-to-end con Zod · TanStack Query en cliente",
		tone: "primary",
	},
	{
		id: "auth",
		x: 20,
		y: 328,
		w: 240,
		h: 80,
		label: "Better Auth",
		sub: "Sesiones server-side · invitaciones a contratistas",
		tone: "accent",
	},
	{
		id: "prisma",
		x: 280,
		y: 328,
		w: 240,
		h: 80,
		label: "Prisma ORM",
		sub: "Migraciones versionadas · tipos generados",
		tone: "accent",
	},
	{
		id: "pdf",
		x: 540,
		y: 328,
		w: 240,
		h: 80,
		label: "React PDF",
		sub: "Permisos y reportes server-side",
		tone: "accent",
	},
	{
		id: "postgres",
		x: 280,
		y: 432,
		w: 240,
		h: 80,
		label: "PostgreSQL",
		sub: "OTs · permisos · planes · usuarios",
		tone: "neutral",
	},
	{
		id: "azure",
		x: 540,
		y: 432,
		w: 240,
		h: 80,
		label: "Azure Blob Storage",
		sub: "Documentación · carpetas de arranque",
		tone: "neutral",
	},
]

const EDGES: DiagramEdge[] = [
	{ from: "clients", to: "next" },
	{ from: "next", to: "api" },
	{ from: "api", to: "auth" },
	{ from: "api", to: "prisma" },
	{ from: "api", to: "pdf" },
	{ from: "prisma", to: "postgres" },
	{ from: "api", to: "azure" },
]

export function CaseStudyArchitecture({
	caseStudy,
	accent = "#6366f1",
}: CaseStudyArchitectureProps) {
	const byId: Record<string, DiagramNode> = Object.fromEntries(NODES.map((n) => [n.id, n]))

	const getAnchor = (n: DiagramNode, side: "top" | "bottom") => ({
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
								viewBox="0 0 800 528"
								className="h-auto w-full"
								role="img"
								aria-label="Diagrama de arquitectura de OTC 360"
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

								{/* Edges */}
								<g
									className="text-muted-foreground"
									stroke="currentColor"
									strokeOpacity="0.45"
									strokeWidth="1.2"
									fill="none"
								>
									{EDGES.map((e, i) => {
										const a = getAnchor(byId[e.from]!, "bottom")
										const b = getAnchor(byId[e.to]!, "top")
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

								{/* Nodes */}
								<g>
									{NODES.map((n) => {
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
