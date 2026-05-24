"use client"

import { motion } from "motion/react"
import {
	AlertTriangle,
	ArrowLeftRight,
	AtSign,
	Bell,
	Box,
	Briefcase,
	Building2,
	Calendar,
	Check,
	CheckCheck,
	CheckCircle2,
	ChevronDown,
	Clock,
	Eye,
	EyeOff,
	FileSpreadsheet,
	Folder,
	FolderKanban,
	History,
	LayoutDashboard,
	List,
	ListChecks,
	LogOut,
	Megaphone,
	Play,
	Plus,
	Search,
	ShieldCheck,
	User,
	Users,
	Wifi,
	X,
	type LucideIcon,
} from "lucide-react"

import Logo from "@/components/shared/logo"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup ──────────────────────────────────────────────────────────

interface SideNavItem {
	icon: LucideIcon
	label: string
	active?: boolean
}

const SIDE_GENERAL: SideNavItem[] = [
	{ icon: LayoutDashboard, label: "Dashboard" },
	{ icon: Calendar, label: "Calendario" },
	{ icon: History, label: "Historial Equipo" },
	{ icon: Clock, label: "Mi Historial" },
]

const SIDE_COMUNICACION: SideNavItem[] = [{ icon: Megaphone, label: "Comunicados" }]

const SIDE_GESTION: SideNavItem[] = [
	{ icon: Building2, label: "Clientes" },
	{ icon: Users, label: "Usuarios" },
	{ icon: FolderKanban, label: "Proyectos" },
	{ icon: ListChecks, label: "Tareas", active: true },
]

interface KpiData {
	label: string
	value: string
	color: string
	textColor: string
	borderColor: string
	icon: LucideIcon
}

const KPIS: KpiData[] = [
	{
		label: "TOTAL",
		value: "70",
		color: "rgba(255,255,255,0.03)",
		textColor: "#a1a1aa",
		borderColor: "#71717a",
		icon: List,
	},
	{
		label: "ACTIVAS",
		value: "1",
		color: "rgba(59,130,246,0.06)",
		textColor: "#93c5fd",
		borderColor: "#3b82f6",
		icon: Play,
	},
	{
		label: "EN REVISIÓN",
		value: "17",
		color: "rgba(245,158,11,0.06)",
		textColor: "#fcd34d",
		borderColor: "#f59e0b",
		icon: Eye,
	},
	{
		label: "BLOQUEADAS",
		value: "8",
		color: "rgba(239,68,68,0.06)",
		textColor: "#fca5a5",
		borderColor: "#ef4444",
		icon: AlertTriangle,
	},
	{
		label: "CERRADAS",
		value: "31",
		color: "rgba(34,197,94,0.06)",
		textColor: "#86efac",
		borderColor: "#22c55e",
		icon: CheckCircle2,
	},
]

interface TaskRow {
	id: string
	title: string
	date: string
	project: string
	status: string
	statusBg: string
	statusColor: string
	accentColor: string
	assignee: string
}

const TASK_ROWS: TaskRow[] = [
	{
		id: "#46",
		title: "Fotos de perfil cargan pero no se ven en viñetas",
		date: "22 abr",
		project: "Soporte",
		status: "Activo",
		statusBg: "rgba(59,130,246,0.15)",
		statusColor: "#93c5fd",
		accentColor: "#3b82f6",
		assignee: "C",
	},
	{
		id: "#49",
		title: "Prueba externo",
		date: "29 abr",
		project: "Soporte",
		status: "Cerrado",
		statusBg: "rgba(239,68,68,0.15)",
		statusColor: "#fca5a5",
		accentColor: "#ef4444",
		assignee: "C",
	},
	{
		id: "#55",
		title: "Visibilidad según tema oscuro o claro",
		date: "6 may",
		project: "Soporte",
		status: "Pendiente",
		statusBg: "rgba(228,228,231,0.15)",
		statusColor: "#f4f4f5",
		accentColor: "#e4e4e7",
		assignee: "C",
	},
]

function CuadrillasHeroMockup({ label = "Vista de Bimakers" }: { label?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
			className="border-border bg-muted/40 relative w-full overflow-hidden rounded-2xl border shadow-2xl"
			style={{ aspectRatio: "16 / 10" }}
			aria-label={label}
		>
			{/* Browser chrome */}
			<div className="flex items-center gap-2 border-b border-black/8 bg-zinc-100/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-zinc-900/90">
				<div className="flex gap-1">
					<span className="block h-2 w-2 rounded-full bg-red-400/70" />
					<span className="block h-2 w-2 rounded-full bg-yellow-400/70" />
					<span className="block h-2 w-2 rounded-full bg-green-400/70" />
				</div>
				<div className="mx-auto w-2/3 truncate rounded-md bg-zinc-200 px-3 py-0.5 text-center text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
					ingsimple.app
				</div>
			</div>

			{/* App body */}
			<div className="bg-background flex h-[calc(100%-1.75rem)] flex-row text-[8px] dark:bg-zinc-950">
				{/* Sidebar */}
				<aside className="bg-background flex w-[22%] flex-col border-r border-black/6 p-1.5 dark:border-white/6 dark:bg-zinc-950">
					{/* Logo row */}
					<div className="mb-1.5 flex items-center gap-1 border-b border-black/6 pb-1.5 dark:border-white/6">
						<div className="flex h-4 w-4 items-center justify-center rounded-sm bg-linear-to-br from-blue-500 to-blue-700">
							<Box className="h-2.5 w-2.5 text-white" />
						</div>
						<span className="text-[8px] font-medium tracking-wide text-zinc-900 dark:text-zinc-100">
							IngSimple
						</span>
						<Bell className="ml-auto h-2.5 w-2.5 text-zinc-500" />
					</div>

					{/* GENERAL */}
					<span className="mb-0.5 px-0.5 text-[6px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
						GENERAL
					</span>
					<div className="flex flex-col gap-px">
						{SIDE_GENERAL.map(({ icon: Icon, label: lbl }) => (
							<div
								key={lbl}
								className="flex items-center gap-1 rounded-[3px] px-1 py-0.5 text-zinc-500 dark:text-zinc-400"
							>
								<Icon className="h-2 w-2 shrink-0" />
								<span className="truncate text-[7px]">{lbl}</span>
							</div>
						))}
					</div>

					{/* COMUNICACIÓN */}
					<span className="mt-1.5 mb-0.5 px-0.5 text-[6px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
						COMUNICACIÓN
					</span>
					<div className="flex flex-col gap-px">
						{SIDE_COMUNICACION.map(({ icon: Icon, label: lbl }) => (
							<div
								key={lbl}
								className="flex items-center gap-1 rounded-[3px] px-1 py-0.5 text-zinc-500 dark:text-zinc-400"
							>
								<Icon className="h-2 w-2 shrink-0" />
								<span className="truncate text-[7px]">{lbl}</span>
							</div>
						))}
					</div>

					{/* GESTIÓN */}
					<span className="mt-1.5 mb-0.5 px-0.5 text-[6px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
						GESTIÓN
					</span>
					<div className="flex flex-col gap-px">
						{SIDE_GESTION.map(({ icon: Icon, label: lbl, active }) => (
							<div
								key={lbl}
								className={`flex items-center gap-1 rounded-[3px] px-1 py-0.5 ${
									active
										? "border border-blue-500/25 bg-blue-500/12 font-medium text-blue-700 dark:text-blue-300"
										: "text-zinc-500 dark:text-zinc-400"
								}`}
							>
								<Icon className="h-2 w-2 shrink-0" />
								<span className="truncate text-[7px]">{lbl}</span>
								{active && <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-blue-500" />}
							</div>
						))}
					</div>

					{/* Footer user */}
					<div className="mt-auto flex items-center gap-1 border-t border-black/6 pt-1.5 dark:border-white/6">
						<div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[6px] font-semibold text-white">
							C
						</div>
						<div className="min-w-0 flex-1">
							<div className="truncate text-[7px] font-medium text-zinc-900 dark:text-zinc-100">
								Charly
							</div>
							<div className="truncate text-[6px] text-zinc-500">Ing. Dev</div>
						</div>
						<LogOut className="h-2 w-2 shrink-0 text-zinc-500" />
					</div>
				</aside>

				{/* Main content */}
				<main className="bg-background relative flex flex-1 flex-col overflow-hidden p-1.5 dark:bg-zinc-950">
					{/* Subtle radial glow */}
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background:
								"radial-gradient(ellipse at top right, rgba(59,130,246,0.06), transparent 60%), radial-gradient(ellipse at bottom left, rgba(168,85,247,0.04), transparent 55%)",
						}}
					/>

					{/* Header card */}
					<div className="relative mb-1.5 flex items-center gap-1.5 rounded-lg border border-black/8 bg-zinc-50/90 px-2 py-1.5 dark:border-white/8 dark:bg-zinc-900/90">
						<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-blue-500/30 bg-blue-500/15">
							<ListChecks className="h-3 w-3 text-blue-400" />
						</div>
						<div className="flex-1">
							<div className="text-[9px] leading-tight font-semibold text-zinc-900 dark:text-zinc-100">
								Tareas
							</div>
							<div className="text-[7px] text-zinc-600 dark:text-zinc-400">
								Vista global de todas las tareas
							</div>
						</div>
						<div className="flex items-center gap-1 rounded-md bg-linear-to-r from-blue-500 to-blue-700 px-1.5 py-0.5 text-[7px] font-medium text-white">
							<Plus className="h-2 w-2" />
							Nueva Tarea
						</div>
					</div>

					{/* KPI row */}
					<div className="relative mb-1.5 grid grid-cols-5 gap-1">
						{KPIS.map((kpi) => {
							const Icon = kpi.icon
							return (
								<div
									key={kpi.label}
									className="relative overflow-hidden rounded-md border px-1.5 py-1"
									style={{
										background: kpi.color,
										borderColor: `${kpi.borderColor}33`,
									}}
								>
									<div
										className="absolute top-0 bottom-0 left-0 w-0.5"
										style={{ background: kpi.borderColor }}
									/>
									<div className="flex items-center justify-between">
										<span
											className="text-[6px] font-semibold tracking-wider"
											style={{ color: kpi.textColor }}
										>
											{kpi.label}
										</span>
										<Icon className="h-2 w-2" style={{ color: kpi.textColor }} />
									</div>
									<div className="mt-0.5 text-[11px] leading-none font-medium text-zinc-900 dark:text-zinc-100">
										{kpi.value}
									</div>
								</div>
							)
						})}
					</div>

					{/* Search / filter row */}
					<div className="relative mb-1.5 flex items-center gap-1">
						<div className="flex flex-1 items-center gap-1 rounded-md border border-black/8 bg-black/2 px-1.5 py-0.5 dark:border-white/8 dark:bg-white/3">
							<Search className="h-2 w-2 text-zinc-500" />
							<span className="text-[7px] text-zinc-500 dark:text-zinc-600">
								Buscar tarea, proyecto o ID...
							</span>
						</div>
						<div className="flex items-center gap-0.5 rounded-md border border-black/8 bg-black/2 px-1.5 py-0.5 text-[7px] text-zinc-600 dark:border-white/8 dark:bg-white/3 dark:text-zinc-400">
							Soporte IngSimple
							<ChevronDown className="h-2 w-2" />
						</div>
						<div className="flex items-center gap-0.5 rounded-md border border-blue-500/30 bg-blue-500/12 px-1.5 py-0.5 text-[7px] text-blue-700 dark:text-blue-300">
							<EyeOff className="h-2 w-2" />
							Cerradas ocultas
						</div>
					</div>

					{/* Tasks table */}
					<div className="relative flex-1 overflow-hidden rounded-lg border border-black/8 bg-black/2 dark:border-white/8 dark:bg-white/2">
						{/* Table header */}
						<div className="grid grid-cols-[28px_1fr_36px_54px_46px_36px] gap-1 border-b border-black/6 bg-black/2 px-2 py-1 dark:border-white/6 dark:bg-white/2">
							{["#", "TAREA", "FECHA", "PROYECTO", "ESTADO", ""].map((h) => (
								<span key={h} className="text-[6px] font-semibold tracking-wider text-zinc-500">
									{h}
								</span>
							))}
						</div>

						{/* Table rows */}
						{TASK_ROWS.map((row, i) => (
							<motion.div
								key={row.id}
								initial={{ opacity: 0, x: -6 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
								className="grid grid-cols-[28px_1fr_36px_54px_46px_36px] items-center gap-1 border-b border-black/4 px-2 py-1 dark:border-white/4"
								style={{ borderLeft: `2px solid ${row.accentColor}` }}
							>
								<span className="text-[7px] text-zinc-500">{row.id}</span>
								<span className="truncate text-[7px] font-medium text-zinc-900 dark:text-zinc-100">
									{row.title}
								</span>
								<span className="text-[7px] text-zinc-500">{row.date}</span>
								<div className="flex items-center gap-0.5 text-[7px] text-zinc-500">
									<Folder className="h-1.5 w-1.5 shrink-0" />
									<span className="truncate">{row.project}</span>
								</div>
								<span
									className="rounded-full px-1 py-0.5 text-center text-[6px] font-medium"
									style={{ background: row.statusBg, color: row.statusColor }}
								>
									{row.status}
								</span>
								<div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[6px] font-semibold text-white">
									{row.assignee}
								</div>
							</motion.div>
						))}
					</div>
				</main>
			</div>
		</motion.div>
	)
}

// ── Feature mockups ──────────────────────────────────────────────────────

interface RoleCard {
	initials: string
	avatarBg: string
	name: string
	title: string
}

const ASIGNADO: RoleCard = {
	initials: "CE",
	avatarBg: "bg-purple-500",
	name: "Charly Eguilas",
	title: "Ing. Dev",
}

const SOLICITANTE: RoleCard = {
	initials: "RU",
	avatarBg: "bg-amber-500",
	name: "Reilly Urtecho",
	title: "Director",
}

const COORDINADOR: RoleCard = {
	initials: "AA",
	avatarBg: "bg-teal-500",
	name: "Anghelo Alva",
	title: "Senior",
}

function RoleChip({ role }: { role: RoleCard }) {
	return (
		<div className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-1 dark:border-zinc-800 dark:bg-zinc-900">
			<span
				className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[6px] font-semibold text-white ${role.avatarBg}`}
			>
				{role.initials}
			</span>
			<span className="truncate text-[8px] font-medium text-zinc-900 dark:text-zinc-100">
				{role.name}
			</span>
			<span className="shrink-0 text-[6px] text-zinc-500">· {role.title}</span>
		</div>
	)
}

function AsignacionMockup() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[9px] shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
		>
			{/* Header: task ref + title + close */}
			<div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<span className="rounded bg-zinc-100 px-1 text-[6px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
							4 / 4
						</span>
						<span className="text-[8px] font-semibold text-teal-700 dark:text-teal-300">#46</span>
						<span className="truncate text-[8px] text-zinc-700 dark:text-zinc-300">
							Fotos de perfil cargan pero no se ven en viñetas
						</span>
					</div>
					<X className="h-2.5 w-2.5 shrink-0 text-zinc-500" />
				</div>
				<div className="mt-1 flex items-center gap-1 text-[7px] text-zinc-500">
					<Folder className="h-2 w-2 shrink-0" />
					<span>Soporte Bimakers</span>
				</div>
			</div>

			{/* Asignados */}
			<div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
				<div className="mb-1.5 flex items-center gap-1 text-[7px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
					<Users className="h-2 w-2" />
					<span>Asignados</span>
				</div>
				<RoleChip role={ASIGNADO} />
			</div>

			{/* Solicitado por + Coordinador (two columns) */}
			<div className="grid grid-cols-2 gap-2 px-3 py-2">
				<div className="min-w-0">
					<div className="mb-1.5 flex items-center gap-1 text-[7px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
						<User className="h-2 w-2" />
						<span>Solicitado por</span>
					</div>
					<RoleChip role={SOLICITANTE} />
				</div>
				<div className="min-w-0">
					<div className="mb-1.5 flex items-center gap-1 text-[7px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
						<Briefcase className="h-2 w-2" />
						<span>Coordinador</span>
					</div>
					<RoleChip role={COORDINADOR} />
				</div>
			</div>
		</motion.div>
	)
}

function NumeracionMockup() {
	const tasks = [
		{ num: "#001", label: "Limpieza tanque norte", color: "#22c55e" },
		{ num: "#002", label: "Inspección eléctrica", color: "#22c55e" },
		{ num: "#003", label: "Mantención bomba", color: "#f59e0b" },
		{ num: "#004", label: "Revisión válvulas", color: "#3b82f6" },
	]
	return (
		<div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
			<div className="flex items-center gap-1.5">
				<ListChecks className="h-3 w-3 text-teal-400" />
				<span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100">
					Numeración Concurrente
				</span>
			</div>
			<div className="flex flex-col gap-1">
				{tasks.map((t, i) => (
					<motion.div
						key={t.num}
						initial={{ opacity: 0, x: -8 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: i * 0.07 }}
						className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900"
					>
						<span className="shrink-0 rounded bg-zinc-200 px-1 py-0.5 text-[8px] font-bold text-teal-700 tabular-nums dark:bg-zinc-800 dark:text-teal-300">
							{t.num}
						</span>
						<span className="flex-1 truncate text-[8px] text-zinc-700 dark:text-zinc-300">
							{t.label}
						</span>
						<span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.color }} />
					</motion.div>
				))}
			</div>
			<div className="mt-auto rounded-md border border-teal-500/20 bg-teal-500/10 px-2 py-1 text-[7px] text-teal-700 dark:text-teal-300">
				Advisory locks · sin duplicados bajo concurrencia
			</div>
		</div>
	)
}

function CargaMasivaMockup() {
	return (
		<div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
			<div className="flex items-center gap-1.5">
				<FileSpreadsheet className="h-3 w-3 text-teal-400" />
				<span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100">
					Carga Masiva por Excel
				</span>
			</div>
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 rounded-md border border-dashed border-zinc-300 bg-zinc-100/60 px-2 py-2 dark:border-zinc-700 dark:bg-zinc-900/60">
					<FileSpreadsheet className="h-4 w-4 text-emerald-500" />
					<div>
						<div className="text-[8px] font-medium text-zinc-800 dark:text-zinc-200">
							tareas_planta_mayo.xlsx
						</div>
						<div className="text-[7px] text-zinc-500">248 KB · listo para importar</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-1">
					{[
						{ label: "Filas", value: "84", color: "text-teal-700 dark:text-teal-300" },
						{ label: "Válidas", value: "81", color: "text-green-600 dark:text-green-400" },
						{ label: "Errores", value: "3", color: "text-red-500 dark:text-red-400" },
					].map((s) => (
						<div
							key={s.label}
							className="rounded-md border border-zinc-200 bg-zinc-100 p-1.5 text-center dark:border-zinc-800 dark:bg-zinc-900"
						>
							<div className={`text-[11px] font-bold tabular-nums ${s.color}`}>{s.value}</div>
							<div className="text-[7px] text-zinc-500">{s.label}</div>
						</div>
					))}
				</div>
				<div className="flex items-center justify-end gap-1">
					<div className="flex flex-1 flex-col gap-0.5">
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
							<motion.div
								initial={{ width: 0 }}
								whileInView={{ width: "96%" }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
								className="h-full rounded-full bg-linear-to-r from-teal-500 to-emerald-500"
							/>
						</div>
						<span className="text-[7px] text-zinc-500">81 de 84 importadas</span>
					</div>
				</div>
			</div>
		</div>
	)
}

function CalendarioMockup() {
	const days = Array.from({ length: 35 })
	const marked = new Set([3, 7, 10, 14, 17, 21, 24, 28, 31])
	const today = 19
	return (
		<div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
			<div className="flex items-center gap-1.5">
				<Calendar className="h-3 w-3 text-teal-400" />
				<span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100">
					Calendario Operativo
				</span>
				<span className="ml-auto text-[8px] text-zinc-500">Mayo 2025</span>
			</div>
			<div className="grid grid-cols-7 gap-0.5">
				{["L", "M", "X", "J", "V", "S", "D"].map((d) => (
					<span
						key={d}
						className="text-center text-[7px] font-semibold text-zinc-400 dark:text-zinc-600"
					>
						{d}
					</span>
				))}
				{days.map((_, i) => (
					<motion.span
						key={i}
						initial={{ opacity: 0, scale: 0.5 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.2, delay: i * 0.01 }}
						className={`flex aspect-square items-center justify-center rounded-sm text-center text-[7px] leading-none ${
							i + 1 === today
								? "bg-teal-500 font-bold text-white"
								: marked.has(i)
									? "bg-teal-500/25 text-teal-300"
									: "bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600"
						}`}
					>
						{i + 1}
					</motion.span>
				))}
			</div>
		</div>
	)
}

function VistaRolesMockup() {
	const roles = [
		{
			role: "Administrador",
			perms: ["Ver todo", "Editar", "Asignar", "Reportes"],
			color: "text-purple-300",
			dot: "#a855f7",
		},
		{
			role: "Ingeniero",
			perms: ["Ver asignadas", "Editar estado", "Adjuntos"],
			color: "text-blue-300",
			dot: "#3b82f6",
		},
		{
			role: "Operador",
			perms: ["Ver propias", "Actualizar estado"],
			color: "text-teal-300",
			dot: "#0f766e",
		},
	]
	return (
		<div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
			<div className="flex items-center gap-1.5">
				<ShieldCheck className="h-3 w-3 text-teal-400" />
				<span className="text-[10px] font-semibold text-zinc-900 dark:text-zinc-100">
					Vistas por Rol
				</span>
			</div>
			<div className="flex flex-col gap-1.5">
				{roles.map((r, i) => (
					<motion.div
						key={r.role}
						initial={{ opacity: 0, y: 4 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.08 * i }}
						className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1.5 dark:border-zinc-800 dark:bg-zinc-900"
					>
						<div className="mb-1 flex items-center gap-1">
							<span className="h-1.5 w-1.5 rounded-full" style={{ background: r.dot }} />
							<span className={`text-[8px] font-semibold ${r.color}`}>{r.role}</span>
						</div>
						<div className="flex flex-wrap gap-0.5">
							{r.perms.map((p) => (
								<span
									key={p}
									className="rounded bg-zinc-200 px-1 py-0.5 text-[6px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
								>
									{p}
								</span>
							))}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

interface AuditEvent {
	kind: "state" | "action"
	verb: string
	from?: string
	to?: string
	date: string
}

const AUDIT_EVENTS: AuditEvent[] = [
	{
		kind: "state",
		verb: "cambió el estado",
		from: "Activa",
		to: "En revisión",
		date: "23 abr 2026",
	},
	{ kind: "action", verb: "realizó una acción", date: "22 abr 2026" },
	{ kind: "state", verb: "cambió el estado", from: "Pendiente", to: "Activa", date: "22 abr 2026" },
]

const AUDIT_ACTOR = {
	initials: "CE",
	name: "Charly Eguilas",
	avatarBg: "bg-purple-500",
}

function AuditoriaMockup() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[9px] shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
		>
			{/* Header: task ref + title + close */}
			<div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<span className="rounded bg-zinc-100 px-1 text-[6px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
							4 / 4
						</span>
						<span className="text-[8px] font-semibold text-teal-700 dark:text-teal-300">#46</span>
						<span className="truncate text-[8px] text-zinc-700 dark:text-zinc-300">
							Fotos de perfil cargan pero no se ven en viñetas
						</span>
					</div>
					<X className="h-2.5 w-2.5 shrink-0 text-zinc-500" />
				</div>
				<div className="mt-1 flex items-center justify-between gap-2">
					<div className="flex items-center gap-1 text-[7px] text-zinc-500">
						<Folder className="h-2 w-2 shrink-0" />
						<span>Soporte Bimakers</span>
					</div>
					<div className="flex items-center gap-1 text-[7px] font-medium text-teal-400">
						<History className="h-2 w-2" />
						<span>Historial</span>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800/60">
				{AUDIT_EVENTS.map((ev, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.08 * i }}
						className="flex items-start gap-2 px-3 py-2"
					>
						{/* Event-type icon */}
						{ev.kind === "state" ? (
							<span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-500/20 ring-1 ring-teal-500/30">
								<ArrowLeftRight className="h-2 w-2 text-teal-300" />
							</span>
						) : (
							<span className="h-4 w-4 shrink-0 rounded-full border border-zinc-400 dark:border-zinc-600" />
						)}

						{/* Avatar + actor + verb + transition */}
						<div className="flex min-w-0 flex-1 flex-col gap-0.5">
							<div className="flex items-center gap-1">
								<span
									className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[5px] font-semibold text-white ${AUDIT_ACTOR.avatarBg}`}
								>
									{AUDIT_ACTOR.initials}
								</span>
								<span className="truncate text-[8px] text-zinc-700 dark:text-zinc-200">
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										{AUDIT_ACTOR.name}
									</span>{" "}
									<span className="text-zinc-500 dark:text-zinc-400">{ev.verb}</span>
								</span>
							</div>
							{ev.from && ev.to && (
								<div className="ml-4 text-[7px] text-zinc-500">
									<span>{ev.from}</span>
									<span className="mx-1 text-zinc-400 dark:text-zinc-600">→</span>
									<span className="text-zinc-700 dark:text-zinc-300">{ev.to}</span>
								</div>
							)}
						</div>

						{/* Date */}
						<span className="shrink-0 text-[7px] text-zinc-500">{ev.date}</span>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

interface NotificationItem {
	initials: string
	avatarBg: string
	avatarOpacity?: string
	badgeIcon: typeof AtSign
	badgeBg: string
	badgeColor: string
	boldName: string
	action: string
	sub: string
	time: string
	unread: boolean
}

const NOTIFICATIONS: NotificationItem[] = [
	{
		initials: "AA",
		avatarBg: "bg-purple-600",
		badgeIcon: AtSign,
		badgeBg: "bg-blue-500",
		badgeColor: "text-white",
		boldName: "Anghelo Alva",
		action: " te mencionó",
		sub: 'En la tarea "Selección proyecto admin"',
		time: "hace 2 horas",
		unread: true,
	},
	{
		initials: "AA",
		avatarBg: "bg-purple-600",
		badgeIcon: AtSign,
		badgeBg: "bg-blue-500",
		badgeColor: "text-white",
		boldName: "Anghelo Alva",
		action: " te mencionó",
		sub: 'En la tarea "Migración base de datos"',
		time: "ayer",
		unread: true,
	},
	{
		initials: "AA",
		avatarBg: "bg-green-600",
		badgeIcon: Check,
		badgeBg: "bg-green-500",
		badgeColor: "text-white",
		boldName: "Anghelo Alva",
		action: " cerró una tarea",
		sub: 'En la tarea "Ajuste de filtros en dashboard"',
		time: "hace 3 días",
		unread: true,
	},
	{
		initials: "AA",
		avatarBg: "bg-purple-600",
		avatarOpacity: "opacity-70",
		badgeIcon: AtSign,
		badgeBg: "bg-zinc-600",
		badgeColor: "text-zinc-300",
		boldName: "Anghelo Alva",
		action: " te mencionó",
		sub: 'En la tarea "Revisión de etiquetas"',
		time: "hace 5 días",
		unread: false,
	},
]

const LIVE_EVENTS = [
	{ id: "#46", text: "Estado → En Revisión", time: "ahora", dotColor: "#f59e0b" },
	{ id: "#51", text: "Asignada a Cuadrilla B", time: "2s", dotColor: "#3b82f6" },
	{ id: "#39", text: "Adjunto recibido · foto_campo.jpg", time: "8s", dotColor: "#0d9488" },
	{ id: "#28", text: "Cerrada por J. Morales", time: "14s", dotColor: "#22c55e" },
	{ id: "#52", text: "Mención a @anghelo", time: "21s", dotColor: "#a855f7" },
]

function TiempoRealMockup() {
	return (
		<div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-[10px] dark:border-zinc-800 dark:bg-zinc-950">
			{/* Header bar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<Wifi className="h-3 w-3 text-teal-400" />
					<span className="font-bold text-zinc-900 dark:text-zinc-100">Tiempo Real con Ably</span>
					<span className="rounded bg-zinc-200 px-1 py-0.5 text-[8px] text-zinc-500 dark:bg-zinc-800">
						Pub/Sub
					</span>
				</div>
				<div className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[8px] font-medium text-emerald-400">
					<motion.span
						animate={{ opacity: [1, 0.2, 1] }}
						transition={{ duration: 1.4, repeat: Infinity }}
						className="h-1.5 w-1.5 rounded-full bg-emerald-400"
					/>
					En vivo
				</div>
			</div>

			{/* Two-column body */}
			<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
				{/* Left — Notifications panel */}
				<div className="overflow-hidden rounded-lg border border-black/8 bg-zinc-100 shadow-lg dark:border-white/15 dark:bg-zinc-900">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-black/8 px-2.5 py-1.5 dark:border-white/8">
						<div>
							<span className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">
								Notificaciones
							</span>
							<span className="ml-1.5 text-[8px] text-zinc-500">Todo al día</span>
						</div>
						<div className="flex items-center gap-0.5 text-[8px] text-blue-400">
							<CheckCheck className="h-2.5 w-2.5" />
							Marcar todas
						</div>
					</div>

					{/* Notification rows */}
					{NOTIFICATIONS.map((n, i) => {
						const BadgeIcon = n.badgeIcon
						return (
							<div
								key={i}
								className={`flex items-start gap-2 px-2.5 py-1.5 ${n.unread ? "bg-blue-500/6" : ""}`}
							>
								{/* Avatar with badge */}
								<div className="relative mt-0.5 shrink-0">
									<div
										className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold text-white ${n.avatarBg} ${n.avatarOpacity ?? ""}`}
									>
										{n.initials}
									</div>
									<div
										className={`absolute -right-0.5 -bottom-0.5 flex h-2 w-2 items-center justify-center rounded-full ${n.badgeBg}`}
									>
										<BadgeIcon className={`h-1 w-1 ${n.badgeColor}`} />
									</div>
								</div>

								{/* Content */}
								<div className="min-w-0 flex-1">
									<div
										className={`text-[8px] leading-tight ${n.unread ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500"}`}
									>
										<span className="font-bold">{n.boldName}</span>
										{n.action}
									</div>
									<div
										className={`truncate text-[7px] ${n.unread ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-600"}`}
									>
										{n.sub}
									</div>
									<div className="text-[7px] text-zinc-500 dark:text-zinc-600">{n.time}</div>
								</div>

								{/* Unread dot */}
								{n.unread && (
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
								)}
							</div>
						)
					})}

					{/* Footer */}
					<div className="border-t border-black/8 px-2.5 py-1.5 text-center text-[8px] text-blue-600 dark:border-white/8 dark:text-blue-400">
						Ver todas las notificaciones
					</div>
				</div>

				{/* Right — Live activity stream */}
				<div className="overflow-hidden rounded-lg border border-black/8 bg-zinc-100 dark:border-white/15 dark:bg-zinc-900">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-black/8 px-2.5 py-1.5 dark:border-white/8">
						<span className="text-[9px] font-bold text-zinc-900 dark:text-zinc-100">
							Actividad en vivo
						</span>
						<span className="text-[7px] text-zinc-500 dark:text-zinc-600">via Ably channel</span>
					</div>

					{/* Event rows */}
					<div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800/60">
						{LIVE_EVENTS.map((ev, i) => (
							<motion.div
								key={ev.id + i}
								initial={{ opacity: 0, x: 8 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.35, delay: i * 0.08 }}
								className="flex items-center gap-2 px-2.5 py-1.5"
							>
								<span
									className="h-1.5 w-1.5 shrink-0 rounded-full"
									style={{ background: ev.dotColor }}
								/>
								<span className="shrink-0 rounded bg-zinc-200 px-1 py-0.5 text-[7px] font-bold text-zinc-600 tabular-nums dark:bg-zinc-800 dark:text-zinc-400">
									{ev.id}
								</span>
								<span className="flex-1 truncate text-[8px] text-zinc-700 dark:text-zinc-300">
									{ev.text}
								</span>
								<span className="shrink-0 text-[7px] text-zinc-500 dark:text-zinc-600">
									{ev.time}
								</span>
							</motion.div>
						))}
					</div>

					{/* Footer hint */}
					<div className="border-t border-black/6 px-2.5 py-1.5 text-center text-[7px] text-zinc-500 dark:border-white/6 dark:text-zinc-600">
						Pub/Sub bidireccional · sin polling, sin recargas.
					</div>
				</div>
			</div>

			{/* Footer band */}
			<div className="mt-3 flex items-center justify-between border-t border-black/6 pt-2 text-[8px] text-zinc-500 dark:border-white/6">
				<div className="flex items-center gap-1">
					<motion.span
						animate={{ opacity: [1, 0.2, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="h-1.5 w-1.5 rounded-full bg-teal-500"
					/>
					Conectado · ably-realtime
				</div>
				<span>Latencia &lt;100ms · ~60 usuarios activos</span>
			</div>
		</div>
	)
}

// ── Export ───────────────────────────────────────────────────────────────

export const cuadrillasVisuals: CaseStudyVisuals = {
	HeroMockup: CuadrillasHeroMockup,
	context: {
		modules: [
			{ id: "tareas", label: "Tareas", color: "#0f766e", textColor: "#ffffff" },
			{ id: "cuadrillas", label: "Cuadrillas", color: "#1e3a8a", textColor: "#ffffff" },
			{ id: "tiempo-real", label: "Tiempo Real", color: "#14b8a6", textColor: "#0a0a0a" },
			{ id: "auditoria", label: "Auditoría", color: "#1e40af", textColor: "#ffffff" },
		],
		bannerLeft: "WhatsApp, planillas y radio → Bimakers",
		bannerRight: "una sola plataforma",
		footerText:
			"Pedidos por WhatsApp, planillas de turnos y reportes de campo entran por la izquierda. Ingeniería Simple los procesa y los convierte en los módulos operativos de Bimakers.",
		axisColor: "#0f766e",
		centerContent: (
			<Logo className="h-10 w-auto" classNameIcon="text-accent" classNameText="text-foreground" />
		),
	},
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de Bimakers",
		diagramTitle: "Arquitectura de Bimakers",
		nodes: [
			{
				id: "clients",
				x: 20,
				y: 20,
				w: 760,
				h: 58,
				label: "Roles de usuario",
				sub: "Administradores · Ingenieros · Operadores en planta",
				tone: "neutral",
			},
			{
				id: "next",
				x: 20,
				y: 110,
				w: 760,
				h: 66,
				label: "Next.js · App Router",
				sub: "TypeScript · RSC · SSR · Componentes de cliente",
				tone: "primary",
			},
			{
				id: "api",
				x: 20,
				y: 208,
				w: 760,
				h: 58,
				label: "Server Actions + API Routes",
				sub: "Validación con Zod · lógica de negocio server-side",
				tone: "primary",
			},
			{
				id: "auth",
				x: 20,
				y: 306,
				w: 178,
				h: 88,
				label: "Better Auth",
				sub: "Sesiones · roles · permisos",
				tone: "accent",
			},
			{
				id: "prisma",
				x: 214,
				y: 306,
				w: 178,
				h: 88,
				label: "Prisma ORM",
				sub: "Advisory locks · sin colisiones",
				tone: "accent",
			},
			{
				id: "ably",
				x: 408,
				y: 306,
				w: 178,
				h: 88,
				label: "Ably",
				sub: "Pub/Sub · tiempo real",
				tone: "accent",
			},
			{
				id: "exceljs",
				x: 602,
				y: 306,
				w: 178,
				h: 88,
				label: "ExcelJS",
				sub: "Carga masiva desde Excel",
				tone: "accent",
			},
			{
				id: "persist",
				x: 20,
				y: 436,
				w: 760,
				h: 72,
				label: "PostgreSQL · Vercel Blob",
				sub: "Datos relacionales, auditoría y adjuntos (fotos de campo)",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "clients", to: "next" },
			{ from: "next", to: "api" },
			{ from: "api", to: "auth" },
			{ from: "api", to: "prisma" },
			{ from: "api", to: "ably" },
			{ from: "api", to: "exceljs" },
			{ from: "prisma", to: "persist" },
		],
	},
	features: {
		"Asignación de Cuadrillas y Tareas": {
			visual: <AsignacionMockup />,
			span: "wide",
			icon: ListChecks,
		},
		"Numeración Concurrente de Tareas": {
			visual: <NumeracionMockup />,
			span: "narrow",
			icon: List,
		},
		"Carga Masiva por Excel": {
			visual: <CargaMasivaMockup />,
			span: "narrow",
			icon: FileSpreadsheet,
		},
		"Calendario Operativo": {
			visual: <CalendarioMockup />,
			span: "narrow",
			icon: Calendar,
		},
		"Vistas por Rol": {
			visual: <VistaRolesMockup />,
			span: "narrow",
			icon: ShieldCheck,
		},
		"Auditoría y Trazabilidad": {
			visual: <AuditoriaMockup />,
			span: "wide",
			icon: History,
		},
		"Tiempo Real": {
			visual: <TiempoRealMockup />,
			span: "full",
			icon: Wifi,
		},
	},
}
