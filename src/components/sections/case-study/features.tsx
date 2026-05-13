"use client"

import { useMemo, useState, type ReactNode } from "react"
import { motion } from "motion/react"
import {
	Eye,
	Inbox,
	Trash2,
	Search,
	Pencil,
	Filter,
	Folder,
	Archive,
	Download,
	Calendar,
	FileText,
	BarChart3,
	FileCheck2,
	PlusCircle,
	FolderPlus,
	ChevronDown,
	type LucideIcon,
} from "lucide-react"

import type { CaseStudy, CaseStudyFeature } from "@/lib/portfolio-data"

interface CaseStudyFeaturesProps {
	caseStudy: CaseStudy
}

interface FeatureWithVisual {
	key: string
	title: string
	description: string
	icon: LucideIcon
	visual: ReactNode
	span: "wide" | "narrow"
}

const otStats = [
	{ label: "Total Órdenes", value: "248", caption: "Todas las OTs" },
	{ label: "En Progreso", value: "8", caption: "Actualmente activas" },
	{ label: "Planificadas", value: "24", caption: "Próximas a ejecutar" },
	{ label: "Completadas", value: "216", caption: "Finalizadas" },
]

const otRows = [
	{ id: "OT-0046", company: "Mantec SpA", supervisor: "J. Morales", work: "Limpieza estanque" },
	{ id: "OT-0045", company: "Andina Welding", supervisor: "R. Castillo", work: "Mantención bomba" },
	{
		id: "OT-0044",
		company: "Andina Welding",
		supervisor: "L. Pérez",
		work: "Verificación válvulas",
	},
	{ id: "OT-0043", company: "PetroServ", supervisor: "M. Soto", work: "Inspección de línea" },
	{ id: "OT-0042", company: "TecnoObra", supervisor: "A. Riquelme", work: "Georreferenciación" },
]

function OtsMockup() {
	return (
		<div className="border-border overflow-hidden rounded-xl border bg-[#f1efe7] text-[9px] dark:bg-neutral-900">
			{/* Orange gradient header */}
			<div className="relative overflow-hidden bg-linear-to-r from-orange-600 via-orange-500 to-red-600 px-3 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="text-white">
						<div className="text-[11px] leading-tight font-bold">Órdenes de Trabajo</div>
						<div className="text-[8px] opacity-90">Gestión y seguimiento</div>
					</div>
					<div className="flex items-center gap-1">
						<span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[7px] font-medium text-orange-600">
							<PlusCircle className="h-2 w-2" /> Nueva OT
						</span>
						<span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[7px] font-medium text-orange-600">
							<PlusCircle className="h-2 w-2" /> Libro
						</span>
					</div>
				</div>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-4 gap-1.5 px-3 py-2">
				{otStats.map((s, i) => (
					<motion.div
						key={s.label}
						initial={{ opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
						className="border-border bg-background overflow-hidden rounded-md border"
					>
						<div
							className="h-0.5 w-full bg-linear-to-r from-orange-400 to-red-500"
							style={{ opacity: 0.6 + i * 0.1 }}
						/>
						<div className="p-1.5">
							<div className="text-foreground text-[7px] leading-tight font-medium">{s.label}</div>
							<div className="text-foreground mt-0.5 text-sm leading-none font-bold tabular-nums">
								{s.value}
							</div>
							<div className="text-muted-foreground mt-0.5 text-[6px]">{s.caption}</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Toolbar */}
			<div className="flex items-center gap-1 px-3 pb-1">
				<div className="border-border bg-background flex flex-1 items-center gap-1 rounded-md border px-1.5 py-0.5">
					<Search className="text-muted-foreground h-2 w-2" />
					<span className="text-muted-foreground text-[7px]">Buscar por N° OT…</span>
				</div>
				<div className="border-border bg-background flex items-center gap-1 rounded-md border px-1.5 py-0.5">
					<Filter className="text-muted-foreground h-2 w-2" />
					<span className="text-muted-foreground text-[7px]">Filtros</span>
				</div>
			</div>

			{/* Table */}
			<div className="bg-background mx-3 mb-3 overflow-hidden rounded-md border border-neutral-200/70 dark:border-neutral-800">
				<div className="bg-muted/60 text-muted-foreground grid grid-cols-[16px_60px_1fr_1fr_70px] gap-1.5 px-2 py-1 text-[7px] font-semibold">
					<span />
					<span>N° OT</span>
					<span>Empresa</span>
					<span>Supervisor</span>
					<span>Estado</span>
				</div>
				{otRows.map((row, i) => (
					<motion.div
						key={row.id}
						initial={{ opacity: 0, x: -8 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
						className="grid grid-cols-[16px_60px_1fr_1fr_70px] items-center gap-1.5 border-t border-neutral-100 px-2 py-1 dark:border-neutral-800"
					>
						<Eye className="h-2 w-2 text-orange-500" />
						<span className="text-[7px] font-medium text-orange-600">{row.id}</span>
						<span className="text-foreground truncate text-[7px]">{row.company}</span>
						<span className="text-muted-foreground truncate text-[7px]">{row.supervisor}</span>
						<span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-center text-[6px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
							Planificado
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

const carpetaCategories = [
	{
		name: "Seguridad y Salud Ocupacional",
		borrador: 6,
		completados: 4,
		rechazados: 0,
		revision: 1,
		expirados: 0,
	},
	{ name: "Medio Ambiente", borrador: 4, completados: 3, rechazados: 0, revision: 0, expirados: 0 },
	{
		name: "Especificaciones Técnicas",
		borrador: 2,
		completados: 5,
		rechazados: 0,
		revision: 0,
		expirados: 0,
	},
	{
		name: "Vehículos y Equipos",
		borrador: 1,
		completados: 2,
		rechazados: 0,
		revision: 0,
		expirados: 0,
	},
	{
		name: "Documentación Personal",
		borrador: 3,
		completados: 8,
		rechazados: 1,
		revision: 0,
		expirados: 0,
	},
]

function CarpetasMockup() {
	return (
		<div className="border-border overflow-hidden rounded-xl border bg-[#f1efe7] text-[9px] dark:bg-neutral-900">
			{/* Teal header */}
			<div className="relative overflow-hidden bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-800 px-3 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="flex items-start gap-1.5 text-white">
						<span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-emerald-900/40">
							<Folder className="h-2.5 w-2.5" />
						</span>
						<div>
							<div className="text-[11px] leading-tight font-bold">Contratista — Rev. A</div>
							<div className="text-[8px] opacity-90">Administra carpetas de arranque</div>
						</div>
					</div>
					<span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[7px] font-medium text-emerald-700">
						<Download className="h-2 w-2" /> Documentos
					</span>
				</div>
			</div>

			{/* Selector + actions */}
			<div className="flex items-center gap-1 px-3 py-2">
				<div className="border-border bg-background flex flex-1 items-center justify-between rounded-md border px-1.5 py-0.5">
					<span className="text-foreground text-[8px] font-medium">Carpeta activa</span>
					<ChevronDown className="text-muted-foreground h-2 w-2" />
				</div>
				<span className="border-border bg-background inline-flex items-center gap-0.5 rounded-md border px-1 py-0.5 text-[7px] text-cyan-600 dark:text-cyan-400">
					<Pencil className="h-2 w-2" /> Actualizar
				</span>
				<span className="border-border bg-background inline-flex items-center gap-0.5 rounded-md border px-1 py-0.5 text-[7px] text-amber-600 dark:text-amber-400">
					<Archive className="h-2 w-2" />
				</span>
				<span className="border-border bg-background inline-flex items-center gap-0.5 rounded-md border px-1 py-0.5 text-[7px] text-red-600 dark:text-red-400">
					<Trash2 className="h-2 w-2" />
				</span>
				<span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[7px] font-medium text-white">
					<FolderPlus className="h-2 w-2" /> Nueva
				</span>
			</div>

			{/* Table */}
			<div className="bg-background mx-3 mb-3 overflow-hidden rounded-md border border-neutral-200/70 dark:border-neutral-800">
				<div className="bg-muted/60 text-muted-foreground grid grid-cols-[1fr_38px_38px_38px_38px] gap-1.5 px-2 py-1 text-[7px] font-semibold">
					<span>Categoría</span>
					<span className="text-center">Borrador</span>
					<span className="text-center">Compl.</span>
					<span className="text-center">Rechaz.</span>
					<span className="text-center">Total</span>
				</div>
				{carpetaCategories.map((cat, i) => {
					const total =
						cat.borrador + cat.completados + cat.rechazados + cat.revision + cat.expirados
					return (
						<motion.div
							key={cat.name}
							initial={{ opacity: 0, x: -8 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
							className="grid grid-cols-[1fr_38px_38px_38px_38px] items-center gap-1.5 border-t border-neutral-100 px-2 py-1 dark:border-neutral-800"
						>
							<div className="flex items-center gap-1">
								<Folder className="h-2 w-2 text-emerald-600" />
								<span className="text-foreground truncate text-[7px] font-medium">{cat.name}</span>
							</div>
							<span className="rounded-full bg-neutral-200 px-1 py-0.5 text-center text-[6px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
								{cat.borrador}
							</span>
							<span
								className={`rounded-full px-1 py-0.5 text-center text-[6px] ${
									cat.completados > 0
										? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
										: "bg-emerald-50 text-emerald-400 dark:bg-emerald-900/10"
								}`}
							>
								{cat.completados}
							</span>
							<span
								className={`rounded-full px-1 py-0.5 text-center text-[6px] ${
									cat.rechazados > 0
										? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
										: "bg-red-50 text-red-400 dark:bg-red-900/10"
								}`}
							>
								{cat.rechazados}
							</span>
							<span className="rounded-full bg-cyan-100 px-1 py-0.5 text-center text-[6px] text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
								{total}
							</span>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

function IndicadoresMockup() {
	const [hovered, setHovered] = useState<number | null>(null)
	const bars = useMemo(() => [42, 58, 36, 71, 52, 68, 84], [])
	const max = Math.max(...bars)
	const avg = Math.round(bars.reduce((a, b) => a + b, 0) / bars.length)
	return (
		<div className="border-border bg-background flex flex-col gap-2 rounded-xl border p-3">
			<div className="flex items-end justify-between">
				<span className="text-foreground text-[10px] font-semibold">OTs / semana</span>
				<span className="text-accent text-[10px] font-medium">
					{hovered !== null ? bars[hovered] : avg}
				</span>
			</div>
			<div className="flex h-14 items-end gap-1">
				{bars.map((b, i) => {
					const h = (b / max) * 100
					const isActive = hovered === i
					return (
						<motion.div
							key={i}
							initial={{ height: 0 }}
							whileInView={{ height: `${h}%` }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
							onHoverStart={() => setHovered(i)}
							onHoverEnd={() => setHovered(null)}
							className={`flex-1 rounded-sm transition-colors ${
								isActive ? "bg-accent" : "bg-accent/40"
							}`}
						/>
					)
				})}
			</div>
		</div>
	)
}

function PermisosMockup() {
	return (
		<div className="border-border bg-background relative flex h-full items-center justify-center overflow-hidden rounded-xl border p-4">
			<div className="bg-ring/10 absolute -top-6 -right-6 h-20 w-20 rounded-full blur-xl" />
			<motion.div
				initial={{ rotate: -6, opacity: 0, y: 10 }}
				whileInView={{ rotate: -4, opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="border-border bg-muted/40 relative flex w-full max-w-35 flex-col gap-1.5 rounded-md border p-2.5"
			>
				<div className="flex items-center gap-1.5">
					<FileCheck2 className="text-accent h-3 w-3" />
					<span className="text-foreground text-[9px] font-semibold">PT-04821</span>
				</div>
				<div className="bg-muted h-1 w-full rounded-full" />
				<div className="bg-muted h-1 w-5/6 rounded-full" />
				<div className="bg-muted h-1 w-4/6 rounded-full" />
				<svg viewBox="0 0 80 20" className="text-ring h-4 w-16" aria-hidden>
					<path
						d="M2 14 Q 10 4, 18 12 T 34 10 T 52 12 T 70 8"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</motion.div>
		</div>
	)
}

function PlanesMockup() {
	const days = Array.from({ length: 21 })
	const marked = new Set([2, 5, 9, 12, 16, 19])
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Calendar className="text-ring h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">Mantenciones</span>
			</div>
			<div className="grid grid-cols-7 gap-1">
				{days.map((_, i) => (
					<motion.span
						key={i}
						initial={{ opacity: 0, scale: 0.6 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.25, delay: i * 0.015 }}
						className={`aspect-square rounded-sm ${marked.has(i) ? "bg-accent" : "bg-muted"}`}
					/>
				))}
			</div>
		</div>
	)
}

function SolicitudesMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Inbox className="text-accent h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">Bandeja</span>
				<span className="bg-accent text-background ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-medium">
					3
				</span>
			</div>
			<div className="flex flex-col gap-1.5">
				{[1, 0.8, 0.65].map((opacity, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
						className="border-border flex items-center gap-2 rounded-md border px-2 py-1.5"
					>
						<span className="bg-ring h-1.5 w-1.5 shrink-0 rounded-full" />
						<div className="bg-muted h-1 flex-1 rounded-full" />
					</motion.div>
				))}
			</div>
		</div>
	)
}

function buildFeatures(features: CaseStudyFeature[]): FeatureWithVisual[] {
	const map: Record<string, { icon: LucideIcon; visual: ReactNode; span: "wide" | "narrow" }> = {
		"Órdenes de Trabajo": { icon: FileText, visual: <OtsMockup />, span: "wide" },
		"Carpetas de Arranque": { icon: Folder, visual: <CarpetasMockup />, span: "wide" },
		"Permisos de Trabajo": { icon: FileCheck2, visual: <PermisosMockup />, span: "narrow" },
		"Planes de Mantenimiento": { icon: Calendar, visual: <PlanesMockup />, span: "narrow" },
		"Solicitudes de Trabajo": { icon: Inbox, visual: <SolicitudesMockup />, span: "narrow" },
		"Indicadores": { icon: BarChart3, visual: <IndicadoresMockup />, span: "narrow" },
	}
	return features.map((f) => {
		const entry = map[f.title] ?? { icon: FileText, visual: null, span: "narrow" as const }
		return {
			key: f.title,
			title: f.title,
			description: f.description,
			icon: entry.icon,
			visual: entry.visual,
			span: entry.span,
		}
	})
}

export function CaseStudyFeatures({ caseStudy }: CaseStudyFeaturesProps) {
	const features = buildFeatures(caseStudy.features)
	const wide = features.filter((f) => f.span === "wide")
	const narrow = features.filter((f) => f.span === "narrow")

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-12 max-w-2xl">
					<motion.span
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4 }}
						className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
					>
						05 — Funcionalidades clave
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
					>
						Los módulos que sostienen la operación
					</motion.h2>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
					{wide.map((f, i) => (
						<BentoCard key={f.key} feature={f} index={i} large />
					))}
				</div>

				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-4">
					{narrow.map((f, i) => (
						<BentoCard key={f.key} feature={f} index={i} />
					))}
				</div>
			</div>
		</section>
	)
}

function BentoCard({
	feature,
	index,
	large = false,
}: {
	feature: FeatureWithVisual
	index: number
	large?: boolean
}) {
	const Icon = feature.icon
	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15 }}
			transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
			className={`border-border bg-muted/30 group relative flex flex-col overflow-hidden rounded-2xl border ${
				large ? "min-h-105 p-6 sm:p-8" : "min-h-65 p-5"
			}`}
		>
			<div className="flex items-center gap-2.5">
				<span className="bg-background border-border flex h-8 w-8 items-center justify-center rounded-md border">
					<Icon className="text-accent h-4 w-4" />
				</span>
				<h3 className={`text-foreground font-semibold ${large ? "text-xl" : "text-base"}`}>
					{feature.title}
				</h3>
			</div>
			<p
				className={`text-muted-foreground mt-3 leading-relaxed ${
					large ? "max-w-md text-sm sm:text-[15px]" : "text-xs sm:text-sm"
				}`}
			>
				{feature.description}
			</p>
			{feature.visual && (
				<div className={`mt-auto pt-6 ${large ? "sm:pt-8" : "pt-4"}`}>{feature.visual}</div>
			)}
		</motion.article>
	)
}
