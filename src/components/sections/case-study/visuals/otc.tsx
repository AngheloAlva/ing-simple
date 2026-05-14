"use client"

import { useMemo, useState } from "react"
import { motion } from "motion/react"
import {
	Archive,
	BarChart3,
	Building2,
	Calendar,
	ChevronDown,
	Cog,
	Download,
	Eye,
	FileCheck2,
	FileText,
	Filter,
	Folder,
	FolderOpen,
	FolderPlus,
	Inbox,
	Pencil,
	PlusCircle,
	Search,
	ShieldCheck,
	Trash2,
	Users,
	Wrench,
	type LucideIcon,
} from "lucide-react"

import Logo from "@/components/shared/logo"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup ──────────────────────────────────────────────────────────

const NAV = [
	"Inicio",
	"Documentación",
	"Carpetas de Arranque",
	"Charlas de Seguridad",
	"Permisos de Trabajo",
	"OT / Libros de Obras",
	"Planes de Mantenimiento",
	"Solicitudes de Trabajo",
	"Reportabilidad",
]

interface KPI {
	label: string
	value: string
	caption: string
	icon: LucideIcon
	bar: string
	iconTint: string
}

const KPIS_ROW_1: KPI[] = [
	{
		label: "Empresas",
		value: "24",
		caption: "21 activas",
		icon: Building2,
		bar: "#2563eb",
		iconTint: "#dbeafe",
	},
	{
		label: "Equipos",
		value: "312",
		caption: "operacionales",
		icon: Cog,
		bar: "#16a34a",
		iconTint: "#dcfce7",
	},
	{
		label: "Usuarios",
		value: "156",
		caption: "132 activos",
		icon: Users,
		bar: "#9333ea",
		iconTint: "#f3e8ff",
	},
	{
		label: "Órdenes",
		value: "842",
		caption: "12 en progreso",
		icon: FileText,
		bar: "#ea580c",
		iconTint: "#ffedd5",
	},
]

const KPIS_ROW_2: KPI[] = [
	{
		label: "Permisos",
		value: "284",
		caption: "18 activos",
		icon: ShieldCheck,
		bar: "#dc2626",
		iconTint: "#fee2e2",
	},
	{
		label: "Planes",
		value: "32",
		caption: "vigentes",
		icon: Wrench,
		bar: "#6366f1",
		iconTint: "#e0e7ff",
	},
	{
		label: "Carpetas",
		value: "48",
		caption: "12 completas",
		icon: FolderOpen,
		bar: "#0d9488",
		iconTint: "#ccfbf1",
	},
]

function KpiCard({ kpi, compact = false }: { kpi: KPI; compact?: boolean }) {
	const Icon = kpi.icon
	return (
		<div className="border-border bg-background relative overflow-hidden rounded-md border">
			<div className="h-1 w-full" style={{ backgroundColor: kpi.bar }} />
			<div className={compact ? "p-2" : "p-2.5"}>
				<div className="flex items-start justify-between gap-1">
					<span className="text-foreground text-[8px] leading-tight font-medium">{kpi.label}</span>
					<span
						className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px]"
						style={{ backgroundColor: kpi.iconTint }}
					>
						<Icon className="h-2 w-2" style={{ color: kpi.bar }} />
					</span>
				</div>
				<div className="text-foreground mt-1 text-base leading-none font-bold tabular-nums">
					{kpi.value}
				</div>
				<div className="text-muted-foreground mt-0.5 text-[7px]">{kpi.caption}</div>
			</div>
		</div>
	)
}

function OtcHeroMockup({ label = "Vista de OTC 360" }: { label?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
			className="border-border bg-muted/40 relative w-full overflow-hidden rounded-2xl border shadow-2xl"
			style={{ aspectRatio: "16 / 10" }}
			aria-label={label}
		>
			<div className="border-border bg-background/80 flex items-center gap-2 border-b px-3 py-2 backdrop-blur">
				<div className="flex gap-1">
					<span className="block h-2 w-2 rounded-full bg-red-400/70" />
					<span className="block h-2 w-2 rounded-full bg-yellow-400/70" />
					<span className="block h-2 w-2 rounded-full bg-green-400/70" />
				</div>
				<div className="bg-muted text-muted-foreground mx-auto w-2/3 truncate rounded-md px-3 py-0.5 text-center text-[10px]">
					otc360.cl
				</div>
			</div>

			<div className="flex h-[calc(100%-1.75rem)] flex-row text-[8px]">
				<div className="bg-background/80 border-border flex w-1/4 flex-col gap-1 border-r p-2">
					<div className="flex items-center gap-1.5 pb-1">
						<div className="from-accent to-ring h-4 w-4 rounded-[3px] bg-gradient-to-br" />
						<div className="flex flex-col leading-tight">
							<span className="text-foreground text-[9px] font-bold">OTC</span>
							<span className="text-muted-foreground text-[7px]">360 ERP</span>
						</div>
					</div>
					<span className="text-muted-foreground mt-1 text-[6px] tracking-wider uppercase">
						Menú Interno
					</span>
					<div className="flex flex-col gap-0.5">
						{NAV.map((item, i) => {
							const active = i === 0
							return (
								<div
									key={item}
									className={`flex items-center gap-1.5 rounded-[3px] px-1.5 py-1 ${
										active ? "bg-foreground text-background" : "text-muted-foreground"
									}`}
								>
									<span
										className={`h-1 w-1 rounded-full ${active ? "bg-background" : "bg-muted-foreground/50"}`}
									/>
									<span className="truncate text-[7px]">{item}</span>
								</div>
							)
						})}
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-1.5 p-2">
					<div className="relative h-12 overflow-hidden rounded-md">
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-900 to-slate-900" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(255,255,255,0.08),transparent_60%)]" />
						<div className="relative flex h-full items-end justify-end p-2 text-right">
							<div className="text-white">
								<div className="text-[10px] leading-tight font-bold">Bienvenido a OTC 360</div>
								<div className="text-[7px] opacity-80">Gestiona y supervisa todos los módulos</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-4 gap-1">
						{KPIS_ROW_1.map((kpi) => (
							<KpiCard key={kpi.label} kpi={kpi} compact />
						))}
					</div>

					<div className="grid grid-cols-3 gap-1">
						{KPIS_ROW_2.map((kpi) => (
							<KpiCard key={kpi.label} kpi={kpi} compact />
						))}
					</div>

					<div className="grid flex-1 grid-cols-2 gap-1">
						<div className="border-border bg-background flex flex-col gap-1 rounded-md border p-1.5">
							<span className="text-foreground text-[7px] font-semibold">Actividad por Módulo</span>
							<div className="flex flex-1 flex-col justify-around gap-0.5">
								{[0.8, 0.7, 0.45, 0.3, 0.55].map((w, i) => (
									<div key={i} className="flex items-center gap-1">
										<div className="bg-muted-foreground/30 h-1 w-6 rounded-[1px]" />
										<div
											className="h-1.5 rounded-[1px]"
											style={{
												width: `${w * 100}%`,
												backgroundColor: i % 2 === 0 ? "#eab308" : "#dc2626",
											}}
										/>
									</div>
								))}
							</div>
						</div>
						<div className="border-border bg-background relative flex items-center justify-center rounded-md border p-1.5">
							<span className="text-foreground absolute top-1.5 left-1.5 text-[7px] font-semibold">
								Órdenes de Trabajo
							</span>
							<svg viewBox="0 0 60 60" className="h-12 w-12">
								<circle cx="30" cy="30" r="22" fill="none" stroke="#16a34a" strokeWidth="14" />
								<circle
									cx="30"
									cy="30"
									r="22"
									fill="none"
									stroke="#eab308"
									strokeWidth="14"
									strokeDasharray="14 138"
									strokeDashoffset="-110"
								/>
								<circle
									cx="30"
									cy="30"
									r="22"
									fill="none"
									stroke="#dc2626"
									strokeWidth="14"
									strokeDasharray="4 148"
									strokeDashoffset="-100"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

// ── Feature mockups ──────────────────────────────────────────────────────

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

export const otcVisuals: CaseStudyVisuals = {
	HeroMockup: OtcHeroMockup,
	context: {
		modules: [
			{ id: "ots", label: "OTs", color: "#0f766e", textColor: "#ffffff" },
			{ id: "carpetas", label: "Carpetas", color: "#1e3a8a", textColor: "#ffffff" },
			{ id: "permisos", label: "Permisos", color: "#14b8a6", textColor: "#0a0a0a" },
			{ id: "indicadores", label: "Indicadores", color: "#1e40af", textColor: "#ffffff" },
		],
		bannerLeft: "Papel, correos y planillas → OTC 360",
		bannerRight: "una sola plataforma",
		footerText:
			"Papel, correos y Excel entran por la izquierda. Ingeniería Simple los procesa y los convierte en los seis módulos operativos de OTC 360.",
		axisColor: "#0f766e",
		centerContent: (
			<Logo
				className="h-10 w-auto"
				classNameIcon="text-accent"
				classNameText="text-foreground"
			/>
		),
	},
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de OTC 360",
		nodes: [
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
		],
		edges: [
			{ from: "clients", to: "next" },
			{ from: "next", to: "api" },
			{ from: "api", to: "auth" },
			{ from: "api", to: "prisma" },
			{ from: "api", to: "pdf" },
			{ from: "prisma", to: "postgres" },
			{ from: "api", to: "azure" },
		],
	},
	features: {
		"Órdenes de Trabajo": { visual: <OtsMockup />, span: "wide", icon: FileText },
		"Carpetas de Arranque": { visual: <CarpetasMockup />, span: "wide", icon: Folder },
		"Permisos de Trabajo": { visual: <PermisosMockup />, span: "narrow", icon: FileCheck2 },
		"Planes de Mantenimiento": { visual: <PlanesMockup />, span: "narrow", icon: Calendar },
		"Solicitudes de Trabajo": { visual: <SolicitudesMockup />, span: "narrow", icon: Inbox },
		"Indicadores": { visual: <IndicadoresMockup />, span: "narrow", icon: BarChart3 },
	},
}
