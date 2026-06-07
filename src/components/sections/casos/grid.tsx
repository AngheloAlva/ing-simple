"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Lock, Hourglass } from "lucide-react"
import { motion } from "motion/react"

import { portfolioProjects, type ProjectData } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

const easeOut = [0.16, 1, 0.3, 1] as const

type Industry = "turismo" | "industria" | "consultoria" | "educacion" | "seguridad-capacitacion"

const INDUSTRY_BY_PROJECT: Record<string, Industry> = {
	"otc-360": "industria",
	"bimakers": "industria",
	"busanc": "industria",
	"turismochiletours": "turismo",
	"toursanpedroatacama": "turismo",
	"dashboard-turismo": "turismo",
	"bz-consulting": "consultoria",
	"aiep-pei": "educacion",
	"caemp": "seguridad-capacitacion",
}

const AREA_BY_PROJECT: Record<string, string> = {
	"otc-360": "Petróleo",
	"busanc": "Minería",
	"bimakers": "Operación en planta",
	"turismochiletours": "Web institucional",
	"toursanpedroatacama": "Ecommerce",
	"dashboard-turismo": "Plataforma operativa",
	"bz-consulting": "Consultoría",
	"aiep-pei": "Evento en vivo",
	"caemp": "Web multi-dominio",
}

const INDUSTRY_GROUPS: { key: Industry; label: string; description: string }[] = [
	{
		key: "turismo",
		label: "Turismo",
		description:
			"Productos digitales para tour operadores: catálogos, ventas online y operación interna.",
	},
	{
		key: "industria",
		label: "Industria y operaciones",
		description:
			"Plataformas que reemplazan papel, Excel y chats por flujos auditables en planta y oficina, en distintos rubros productivos.",
	},
	{
		key: "consultoria",
		label: "Consultoría y servicios",
		description: "Soluciones a medida para empresas de consultoría y servicios profesionales.",
	},
	{
		key: "educacion",
		label: "Educación",
		description:
			"Plataformas para instituciones educativas: eventos en vivo, evaluaciones interactivas y experiencias de aprendizaje.",
	},
	{
		key: "seguridad-capacitacion",
		label: "Seguridad y capacitación",
		description:
			"Presencia digital para empresas de seguridad laboral, capacitación certificada y equipos de protección personal.",
	},
]

function isProduction(project: ProjectData): boolean {
	return Boolean(project.isProduction)
}

export function CasosGrid() {
	const cases = portfolioProjects.filter(isProduction)

	return (
		<section id="casos-grid" className="scroll-mt-24 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
			<div className="mx-auto flex max-w-6xl flex-col gap-20">
				{INDUSTRY_GROUPS.map((group) => {
					const groupCases = cases.filter((p) => INDUSTRY_BY_PROJECT[p.id] === group.key)
					if (groupCases.length === 0) return null
					return (
						<div key={group.key} className="flex flex-col gap-8">
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-80px" }}
								transition={{ duration: 0.5, ease: easeOut }}
								className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
							>
								<div className="flex flex-col gap-1.5">
									<span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">
										{group.label}
									</span>
									<h2 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">
										{groupCases.length} {groupCases.length === 1 ? "proyecto" : "proyectos"}
									</h2>
								</div>
								<p className="text-muted-foreground max-w-md text-sm sm:text-right">
									{group.description}
								</p>
							</motion.div>

							<ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
								{groupCases.map((project, index) => (
									<li key={project.id}>
										<CaseCard project={project} index={index} />
									</li>
								))}
							</ul>
						</div>
					)
				})}
			</div>
		</section>
	)
}

interface CaseCardProps {
	project: ProjectData
	index: number
}

function CaseCard({ project, index }: CaseCardProps) {
	const cs = project.caseStudy
	const hasCase = Boolean(cs)
	const isPublic = cs?.visualPrivacy === "public"
	const area = AREA_BY_PROJECT[project.id]
	const accentColor = project.gradientColor ?? "#6366f1"

	const visual = hasCase ? (
		<>
			{isPublic ? (
				<PublicVisual project={project} />
			) : (
				<ConfidentialVisual accentColor={accentColor} />
			)}

			<motion.div
				variants={{ hover: { opacity: 1, y: 0 } }}
				initial={{ opacity: 0, y: 8 }}
				transition={{ duration: 0.3 }}
				className="bg-background text-foreground absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full shadow-md"
			>
				<ArrowUpRight className="h-4 w-4" />
			</motion.div>

			{!isPublic && (
				<span className="bg-background/90 text-foreground absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] uppercase backdrop-blur-sm">
					<Lock className="h-3 w-3" aria-hidden />
					Vista confidencial
				</span>
			)}
		</>
	) : (
		<>
			<ConfidentialVisual accentColor={accentColor} />
			<span className="bg-background/90 text-foreground absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] uppercase backdrop-blur-sm">
				<Hourglass className="h-3 w-3" aria-hidden />
				Caso de estudio próximamente
			</span>
		</>
	)

	const content = (
		<div className="flex flex-col gap-4">
			<div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">{visual}</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between gap-3">
					{project.clientLogo ? (
						<Image
							src={project.clientLogo}
							alt={cs?.clientName ?? project.title}
							width={72}
							height={20}
							className={cn(
								"h-5 w-auto object-contain opacity-80",
								project.clientLogo.includes("turismochiletours") && "dark:invert"
							)}
						/>
					) : (
						<span className="text-muted-foreground text-xs font-medium">
							{cs?.clientName ?? project.title}
						</span>
					)}
					{area && (
						<span className="text-muted-foreground text-[10px] font-medium tracking-[0.15em] uppercase">
							{area}
						</span>
					)}
				</div>

				<h3 className="text-foreground text-base leading-snug font-semibold sm:text-lg">
					{project.title}
				</h3>
				<p className="text-muted-foreground line-clamp-2 text-sm">
					{cs?.pitch ?? project.shortDescription}
				</p>
			</div>
		</div>
	)

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.45, ease: easeOut, delay: index * 0.05 }}
			{...(hasCase ? { whileHover: "hover" as const } : {})}
			className={cn("group flex flex-col gap-4 text-left", !hasCase && "opacity-90")}
		>
			{hasCase ? (
				<Link
					href={`/portafolio/${project.id}`}
					aria-label={`Ver caso de estudio de ${project.title}`}
					className="flex flex-col gap-4"
				>
					{content}
				</Link>
			) : (
				<div aria-label={`${project.title} — caso de estudio próximamente`}>{content}</div>
			)}
		</motion.div>
	)
}

function PublicVisual({ project }: { project: ProjectData }) {
	return (
		<motion.div
			variants={{ hover: { scale: 1.04 } }}
			transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			className="absolute inset-0"
		>
			<Image
				src={project.imageUrl}
				alt={project.title}
				fill
				sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
				className="object-cover"
			/>
		</motion.div>
	)
}

function ConfidentialVisual({ accentColor }: { accentColor: string }) {
	return (
		<div className="absolute inset-0">
			<div
				className="absolute inset-0"
				style={{
					background: `radial-gradient(120% 80% at 70% 30%, ${accentColor}26 0%, transparent 60%), radial-gradient(100% 60% at 0% 100%, ${accentColor}40 0%, transparent 65%)`,
				}}
				aria-hidden
			/>
			<div
				className={cn(
					"absolute inset-0 opacity-[0.12] dark:opacity-[0.06]",
					"[background-image:radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)]",
					"text-foreground [background-size:10px_10px]"
				)}
				aria-hidden
			/>
			<MockupDashboard accentColor={accentColor} />
		</div>
	)
}

function MockupDashboard({ accentColor }: { accentColor: string }) {
	return (
		<div className="absolute inset-4 flex items-center justify-center">
			<div className="bg-background/85 border-border/60 relative h-full w-full overflow-hidden rounded-md border shadow-sm backdrop-blur-sm">
				<div className="border-border/60 flex items-center gap-1.5 border-b px-2 py-1.5">
					<span className="bg-foreground/20 h-1.5 w-1.5 rounded-full" />
					<span className="bg-foreground/20 h-1.5 w-1.5 rounded-full" />
					<span className="bg-foreground/20 h-1.5 w-1.5 rounded-full" />
					<div className="bg-foreground/8 ml-2 h-1.5 flex-1 rounded-sm" />
				</div>

				<div className="flex h-[calc(100%-1.625rem)]">
					<div className="border-border/60 flex w-1/4 flex-col gap-1.5 border-r p-2">
						<div className="bg-foreground/15 h-1 w-3/4 rounded" />
						<div className="bg-foreground/10 h-1 w-1/2 rounded" />
						<div className="bg-foreground/10 h-1 w-2/3 rounded" />
						<div className="bg-foreground/10 h-1 w-1/2 rounded" />
						<div className="mt-auto h-1 w-2/3 rounded" style={{ backgroundColor: accentColor }} />
					</div>

					<div className="flex flex-1 flex-col gap-1.5 p-2">
						<div className="bg-foreground/15 h-1.5 w-1/3 rounded" />
						<div className="grid grid-cols-3 gap-1.5">
							{[0, 1, 2].map((i) => (
								<div key={i} className="border-border/40 flex flex-col gap-1 rounded border p-1.5">
									<div
										className="h-1 w-2/3 rounded"
										style={{ backgroundColor: `${accentColor}cc` }}
									/>
									<div className="bg-foreground/15 h-2 w-1/2 rounded" />
								</div>
							))}
						</div>
						<div className="border-border/40 mt-auto flex items-end gap-1 rounded border p-1.5">
							{[40, 70, 55, 85, 60, 90, 45, 75].map((h, i) => (
								<div
									key={i}
									className="flex-1 rounded-sm"
									style={{
										height: `${h * 0.18}px`,
										backgroundColor: `${accentColor}${i % 2 === 0 ? "cc" : "66"}`,
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
