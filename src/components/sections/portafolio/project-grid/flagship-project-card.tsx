"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

import { CATEGORY_LABELS, type ProjectCategory, type ProjectData } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

interface FlagshipProjectCardProps {
	project: ProjectData
}

export function FlagshipProjectCard({ project }: FlagshipProjectCardProps) {
	const [loaded, setLoaded] = useState(false)

	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{
				layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.8 },
				opacity: { duration: 0.25, ease: "easeOut" },
			}}
			whileHover="hover"
			className="group flex flex-col gap-4 text-left"
		>
			<Link
				href={`/portafolio/${project.id}`}
				aria-label={`Ver caso de estudio de ${project.title}`}
				className="flex flex-col gap-4"
			>
				<div className="bg-muted relative aspect-square overflow-hidden rounded-2xl">
					<motion.img
						src={project.imageUrl}
						alt={project.title}
						loading="lazy"
						onLoad={() => setLoaded(true)}
						variants={{ hover: { scale: 1.05 } }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className={cn(
							"absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
							loaded ? "opacity-100" : "opacity-0"
						)}
					/>

					<div
						className="pointer-events-none absolute inset-0 opacity-70"
						style={{
							background: `radial-gradient(120% 80% at 0% 100%, ${project.gradientColor ?? "#6366f1"}55 0%, transparent 55%)`,
						}}
						aria-hidden
					/>

					<motion.div
						variants={{ hover: { opacity: 1, y: 0 } }}
						initial={{ opacity: 0, y: 8 }}
						transition={{ duration: 0.3 }}
						className="bg-background text-foreground absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full shadow-md"
					>
						<ArrowUpRight className="h-4 w-4" />
					</motion.div>

					<div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
						<span className="bg-background/90 text-foreground rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] uppercase backdrop-blur-sm">
							{CATEGORY_LABELS[project.category as ProjectCategory]}
						</span>
						<span
							className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] text-white uppercase backdrop-blur-sm"
							style={{ backgroundColor: project.gradientColor ?? "#6366f1" }}
						>
							Caso de estudio
						</span>
					</div>
				</div>
				<div className="flex items-baseline justify-between gap-3">
					<div className="flex min-w-0 flex-col gap-0.5">
						<h3 className="text-foreground truncate text-base font-semibold sm:text-lg">
							{project.title}
						</h3>
						<span className="text-muted-foreground line-clamp-1 text-xs">
							{project.shortDescription}
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	)
}
