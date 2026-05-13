"use client"

import { Building2, Cog, FileText, FolderOpen, ShieldCheck, Users, Wrench } from "lucide-react"
import { motion } from "motion/react"

import type { LucideIcon } from "lucide-react"

interface VisualMockupProps {
	accent?: string
	label?: string
}

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

export function VisualMockup({ label = "Vista de OTC 360" }: VisualMockupProps) {
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
				{/* Sidebar */}
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

				{/* Main */}
				<div className="flex flex-1 flex-col gap-1.5 p-2">
					{/* Banner */}
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

					{/* KPI row 1 */}
					<div className="grid grid-cols-4 gap-1">
						{KPIS_ROW_1.map((kpi) => (
							<KpiCard key={kpi.label} kpi={kpi} compact />
						))}
					</div>

					{/* KPI row 2 */}
					<div className="grid grid-cols-3 gap-1">
						{KPIS_ROW_2.map((kpi) => (
							<KpiCard key={kpi.label} kpi={kpi} compact />
						))}
					</div>

					{/* Charts */}
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
