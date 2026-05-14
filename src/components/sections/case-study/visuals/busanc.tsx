"use client"

import { motion } from "motion/react"
import {
	Activity,
	Bell,
	Box,
	Building2,
	ClipboardList,
	Cog,
	DollarSign,
	GitBranch,
	History,
	LayoutGrid,
	LifeBuoy,
	Moon,
	Package,
	Receipt,
	Search,
	Settings,
	ShieldCheck,
	Sparkles,
	Truck,
	UserCog,
	Users,
	Wrench,
	type LucideIcon,
} from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup — replica del dashboard de Busanc ────────────────────────

const SIDEBAR_MENU: { label: string; icon: LucideIcon; active?: boolean; hasPlus?: boolean }[] = [
	{ label: "Dashboard Gerencia", icon: LayoutGrid, active: true },
	{ label: "Comercial", icon: Receipt, hasPlus: true },
	{ label: "Ingeniería", icon: Cog, hasPlus: true },
	{ label: "Hispana", icon: Wrench, hasPlus: true },
	{ label: "Evaluación y Costos", icon: DollarSign, hasPlus: true },
	{ label: "Planificación", icon: ClipboardList, hasPlus: true },
	{ label: "Calidad", icon: ShieldCheck, hasPlus: true },
	{ label: "Notificaciones", icon: Bell },
	{ label: "Soporte", icon: LifeBuoy },
]

const SIDEBAR_ADMIN: { label: string; icon: LucideIcon; hasPlus?: boolean }[] = [
	{ label: "Registro de Actividad", icon: History },
	{ label: "Clientes", icon: Building2 },
	{ label: "Usuarios", icon: UserCog, hasPlus: true },
]

interface BusancKpi {
	label: string
	sub: string
	value: string
	icon: LucideIcon
	tint: string
	iconColor: string
}

const KPIS_TOP: BusancKpi[] = [
	{ label: "Solicitudes", sub: "en total", value: "1", icon: ClipboardList, tint: "#fee2e2", iconColor: "#dc2626" },
	{ label: "Proyectos", sub: "en total", value: "0", icon: Package, tint: "#ede9fe", iconColor: "#7c3aed" },
	{ label: "Cotizaciones", sub: "en total", value: "0", icon: Receipt, tint: "#fce7f3", iconColor: "#db2777" },
	{ label: "Clientes", sub: "activos", value: "1", icon: Building2, tint: "#fee2e2", iconColor: "#dc2626" },
]

const KPIS_BOTTOM: BusancKpi[] = [
	{
		label: "Monto Total",
		sub: "cotizaciones aprobadas",
		value: "$0",
		icon: DollarSign,
		tint: "#ccfbf1",
		iconColor: "#0d9488",
	},
	{
		label: "Proyectos Riesgo Alto",
		sub: "más de 30 días",
		value: "0",
		icon: ShieldCheck,
		tint: "#fee2e2",
		iconColor: "#dc2626",
	},
	{
		label: "Proyectos En Ejecución",
		sub: "actualmente",
		value: "0",
		icon: Cog,
		tint: "#ede9fe",
		iconColor: "#7c3aed",
	},
]

function BusancHeroMockup({ label = "Vista de Busanc" }: { label?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
			className="border-border bg-background relative w-full overflow-hidden rounded-2xl border shadow-2xl"
			style={{ aspectRatio: "16 / 10" }}
			aria-label={label}
		>
			<div className="flex h-full flex-row text-[8px]">
				{/* Sidebar */}
				<div className="bg-background border-border flex w-[30%] flex-col gap-1 border-r p-2">
					<div className="flex items-center gap-1.5 px-1 pb-1">
						<div className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#1447e6] text-white text-[7px] font-bold">
							S
						</div>
						<span className="text-foreground text-[9px] font-bold tracking-tight">BUSANC</span>
					</div>

					<div className="bg-muted/60 border-border/60 mx-1 mt-0.5 flex items-center justify-between rounded-[3px] border px-1.5 py-0.5">
						<div className="flex items-center gap-1">
							<Search className="text-muted-foreground h-2 w-2" />
							<span className="text-muted-foreground text-[7px]">Buscar</span>
						</div>
						<span className="text-muted-foreground text-[6px]">⌘K</span>
					</div>

					<span className="text-muted-foreground mt-1 px-1 text-[6px] tracking-wider uppercase">
						Menú
					</span>
					<div className="flex flex-col gap-0.5">
						{SIDEBAR_MENU.map((item) => {
							const Icon = item.icon
							return (
								<div
									key={item.label}
									className={`flex items-center justify-between rounded-[3px] px-1.5 py-1 ${
										item.active ? "bg-muted text-foreground" : "text-muted-foreground"
									}`}
								>
									<div className="flex items-center gap-1.5">
										<Icon className="h-2 w-2" />
										<span className="truncate text-[7px]">{item.label}</span>
									</div>
									{item.hasPlus && <span className="text-muted-foreground text-[7px]">+</span>}
								</div>
							)
						})}
					</div>

					<span className="text-muted-foreground mt-1 px-1 text-[6px] tracking-wider uppercase">
						Admistración
					</span>
					<div className="flex flex-col gap-0.5">
						{SIDEBAR_ADMIN.map((item) => {
							const Icon = item.icon
							return (
								<div
									key={item.label}
									className="text-muted-foreground flex items-center justify-between rounded-[3px] px-1.5 py-1"
								>
									<div className="flex items-center gap-1.5">
										<Icon className="h-2 w-2" />
										<span className="truncate text-[7px]">{item.label}</span>
									</div>
									{item.hasPlus && <span className="text-muted-foreground text-[7px]">+</span>}
								</div>
							)
						})}
					</div>

					<div className="mt-auto flex flex-col gap-1 px-1 pt-1">
						<div className="flex items-center gap-1">
							<Settings className="text-muted-foreground h-2.5 w-2.5" />
							<LayoutGrid className="text-muted-foreground h-2.5 w-2.5" />
						</div>
						<div className="border-border bg-muted/40 flex items-center gap-1.5 rounded-[3px] border px-1 py-1">
							<div className="bg-foreground text-background flex h-3.5 w-3.5 items-center justify-center rounded-[2px] text-[6px] font-bold">
								AB
							</div>
							<div className="flex min-w-0 flex-col leading-tight">
								<span className="text-foreground truncate text-[7px] font-medium">Admin Busanc</span>
								<span className="text-muted-foreground truncate text-[6px]">admin@busanc.cl</span>
							</div>
						</div>
					</div>
				</div>

				{/* Main */}
				<div className="bg-muted/30 flex flex-1 flex-col gap-1 p-2">
					{/* Top bar */}
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground flex items-center gap-1 text-[7px]">
							<span>Dashboard</span>
							<span className="opacity-60">›</span>
							<span className="text-foreground font-medium">Inicio</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="bg-background border-border flex items-center gap-1 rounded-[3px] border px-1.5 py-0.5">
								<Search className="text-muted-foreground h-2 w-2" />
								<span className="text-muted-foreground text-[6px]">Buscar</span>
								<span className="text-muted-foreground text-[6px]">⌘K</span>
							</div>
							<Bell className="text-muted-foreground h-2.5 w-2.5" />
							<Moon className="text-muted-foreground h-2.5 w-2.5" />
						</div>
					</div>

					{/* Welcome banner */}
					<div className="relative h-12 overflow-hidden rounded-md">
						<div
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(135deg, #1447e6 0%, #6366f1 30%, #c084fc 60%, #f9a8d4 80%, #fef3c7 100%)",
							}}
						/>
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_55%)]" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.4),transparent_50%)]" />
						<div className="absolute inset-0 flex flex-col justify-end p-2">
							<span className="text-[7px] text-white/85">Bienvenido de vuelta</span>
							<span className="text-[10px] leading-tight font-bold text-white">Admin Busanc</span>
						</div>
					</div>

					{/* KPIs top row */}
					<div className="grid grid-cols-4 gap-1">
						{KPIS_TOP.map((kpi, i) => (
							<BusancKpiCard key={kpi.label} kpi={kpi} delay={i * 0.05} />
						))}
					</div>

					{/* KPIs bottom row */}
					<div className="grid grid-cols-3 gap-1">
						{KPIS_BOTTOM.map((kpi, i) => (
							<BusancKpiCard key={kpi.label} kpi={kpi} delay={0.2 + i * 0.05} />
						))}
					</div>

					{/* Bottom split */}
					<div className="grid flex-1 grid-cols-[1.4fr_1fr] gap-1">
						<div className="border-border bg-background flex flex-col gap-1 rounded-md border p-1.5">
							<div className="flex items-center justify-between">
								<div className="flex flex-col leading-tight">
									<span className="text-foreground text-[7px] font-semibold">
										Estado de Solicitudes
									</span>
									<span className="text-muted-foreground text-[6px]">Distribución por estado</span>
								</div>
								<ClipboardList className="text-muted-foreground h-2 w-2" />
							</div>
							<div className="flex flex-1 items-end gap-1.5">
								<div className="h-full flex-1 rounded-[2px] bg-[#3b82f6]" />
								<div className="h-2/3 flex-1 rounded-[2px] bg-[#3b82f6]/45" />
								<div className="h-2/5 flex-1 rounded-[2px] bg-[#3b82f6]/25" />
								<div className="h-1/4 flex-1 rounded-[2px] bg-[#3b82f6]/15" />
							</div>
						</div>
						<div className="border-border bg-background flex flex-col gap-1 rounded-md border p-1.5">
							<div className="flex items-center justify-between">
								<div className="flex flex-col leading-tight">
									<span className="text-foreground text-[7px] font-semibold">Acciones Rápidas</span>
									<span className="text-muted-foreground text-[6px]">Accesos directos</span>
								</div>
								<Sparkles className="text-muted-foreground h-2 w-2" />
							</div>
							<div className="flex flex-1 flex-col gap-1">
								{[
									{ label: "Nueva Solicitud", Icon: ClipboardList },
									{ label: "Ver Proyectos", Icon: Box },
									{ label: "Nueva Cotización", Icon: Receipt },
									{ label: "Registro Actividad", Icon: History },
								].map(({ label, Icon }) => (
									<div
										key={label}
										className="border-border flex flex-1 items-center justify-between rounded-[3px] border px-1.5"
									>
										<span className="text-foreground text-[6px]">{label}</span>
										<Icon className="text-muted-foreground h-1.5 w-1.5" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

function BusancKpiCard({ kpi, delay = 0 }: { kpi: BusancKpi; delay?: number }) {
	const Icon = kpi.icon
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay }}
			className="border-border bg-background flex items-center justify-between gap-1 rounded-md border p-1.5"
		>
			<div className="flex flex-col leading-tight">
				<span className="text-foreground text-base leading-none font-bold tabular-nums">
					{kpi.value}
				</span>
				<span className="text-muted-foreground mt-0.5 text-[6px]">{kpi.label}</span>
				<span className="text-muted-foreground text-[6px]">{kpi.sub}</span>
			</div>
			<span
				className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px]"
				style={{ backgroundColor: kpi.tint }}
			>
				<Icon className="h-2.5 w-2.5" style={{ color: kpi.iconColor }} />
			</span>
		</motion.div>
	)
}

// ── Feature mockups ──────────────────────────────────────────────────────

const scRows = [
	{ id: "SC-0142", client: "Codelco Andina", projects: 3, status: "En Ingeniería", tone: "blue" },
	{ id: "SC-0141", client: "Anglo American", projects: 2, status: "Cotizando", tone: "amber" },
	{ id: "SC-0140", client: "BHP Spence", projects: 1, status: "OC aprobada", tone: "green" },
	{ id: "SC-0139", client: "Codelco Andina", projects: 4, status: "Levantamiento", tone: "neutral" },
	{ id: "SC-0138", client: "Antofagasta Min.", projects: 2, status: "En Ingeniería", tone: "blue" },
]

const toneStyles: Record<string, string> = {
	blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
	neutral: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
}

function FlujoComercialMockup() {
	return (
		<div className="border-border overflow-hidden rounded-xl border bg-[#eff3fb] text-[9px] dark:bg-neutral-900">
			<div className="relative overflow-hidden bg-linear-to-r from-[#1447e6] via-[#3b5bff] to-[#6366f1] px-3 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="text-white">
						<div className="text-[11px] leading-tight font-bold">Solicitudes Comerciales</div>
						<div className="text-[8px] opacity-90">SC con proyectos asociados</div>
					</div>
					<span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[7px] font-medium text-[#1447e6]">
						+ Nueva SC
					</span>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-1.5 px-3 py-2">
				{[
					{ label: "Total SC", value: "84" },
					{ label: "En Ingeniería", value: "12" },
					{ label: "Cotizando", value: "7" },
					{ label: "Cerradas", value: "65" },
				].map((s, i) => (
					<motion.div
						key={s.label}
						initial={{ opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
						className="border-border bg-background overflow-hidden rounded-md border"
					>
						<div className="h-0.5 w-full bg-[#1447e6]" style={{ opacity: 0.5 + i * 0.15 }} />
						<div className="p-1.5">
							<div className="text-foreground text-[7px] leading-tight font-medium">{s.label}</div>
							<div className="text-foreground mt-0.5 text-sm leading-none font-bold tabular-nums">
								{s.value}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			<div className="bg-background mx-3 mb-3 overflow-hidden rounded-md border border-neutral-200/70 dark:border-neutral-800">
				<div className="bg-muted/60 text-muted-foreground grid grid-cols-[70px_1fr_50px_90px] gap-1.5 px-2 py-1 text-[7px] font-semibold">
					<span>N° SC</span>
					<span>Cliente</span>
					<span className="text-center">Proy.</span>
					<span>Estado</span>
				</div>
				{scRows.map((row, i) => (
					<motion.div
						key={row.id}
						initial={{ opacity: 0, x: -8 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
						className="grid grid-cols-[70px_1fr_50px_90px] items-center gap-1.5 border-t border-neutral-100 px-2 py-1 dark:border-neutral-800"
					>
						<span className="text-[7px] font-medium text-[#1447e6]">{row.id}</span>
						<span className="text-foreground truncate text-[7px]">{row.client}</span>
						<span className="text-muted-foreground text-center text-[7px]">{row.projects}</span>
						<span
							className={`rounded-full px-1.5 py-0.5 text-center text-[6px] font-medium ${toneStyles[row.tone]}`}
						>
							{row.status}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

const stages = [
	{ id: "metalico", label: "Metálico", icon: Wrench, color: "#64748b" },
	{ id: "goma", label: "Goma", icon: Box, color: "#0d9488" },
	{ id: "pintura", label: "Pintura", icon: Sparkles, color: "#7c3aed" },
	{ id: "calidad", label: "Calidad", icon: ShieldCheck, color: "#16a34a" },
	{ id: "despacho", label: "Despacho", icon: Truck, color: "#dc2626" },
]

const components = [
	{ id: "CMP-201", name: "Revestimiento molino", stage: 2, progress: 0.55 },
	{ id: "CMP-202", name: "Liner línea SAG", stage: 4, progress: 0.95 },
	{ id: "CMP-203", name: "Cuchara cargadora", stage: 1, progress: 0.3 },
]

function ComponenteCentricoMockup() {
	return (
		<div className="border-border overflow-hidden rounded-xl border bg-[#eff3fb] text-[9px] dark:bg-neutral-900">
			<div className="relative overflow-hidden bg-linear-to-r from-[#0e3bd1] via-[#1447e6] to-[#3b5bff] px-3 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="text-white">
						<div className="text-[11px] leading-tight font-bold">Flujo Componente-Céntrico</div>
						<div className="text-[8px] opacity-90">
							Cada componente avanza por sus etapas
						</div>
					</div>
					<span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-[7px] font-medium text-[#1447e6]">
						<GitBranch className="h-2 w-2" /> 3 en curso
					</span>
				</div>
			</div>

			{/* Stage header */}
			<div className="px-3 pt-2">
				<div className="grid grid-cols-5 gap-1">
					{stages.map((stage) => {
						const Icon = stage.icon
						return (
							<div
								key={stage.id}
								className="border-border bg-background flex flex-col items-center gap-0.5 rounded-md border p-1.5"
							>
								<span
									className="flex h-4 w-4 items-center justify-center rounded-[3px]"
									style={{ backgroundColor: `${stage.color}25` }}
								>
									<Icon className="h-2 w-2" style={{ color: stage.color }} />
								</span>
								<span className="text-foreground text-[6px] font-semibold">{stage.label}</span>
							</div>
						)
					})}
				</div>
			</div>

			{/* Component rows */}
			<div className="flex flex-col gap-1.5 px-3 py-3">
				{components.map((c, i) => (
					<motion.div
						key={c.id}
						initial={{ opacity: 0, x: -8 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
						className="border-border bg-background rounded-md border p-1.5"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								<span className="rounded-[3px] bg-[#1447e6]/10 px-1 py-0.5 text-[6px] font-bold text-[#1447e6]">
									{c.id}
								</span>
								<span className="text-foreground text-[7px] font-medium">{c.name}</span>
							</div>
							<span className="text-muted-foreground text-[6px]">
								{stages[c.stage]?.label}
							</span>
						</div>
						<div className="bg-muted relative mt-1 h-1 overflow-hidden rounded-full">
							<motion.div
								initial={{ width: 0 }}
								whileInView={{ width: `${c.progress * 100}%` }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{
									duration: 0.8,
									delay: 0.2 + i * 0.08,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="absolute inset-y-0 left-0 rounded-full"
								style={{ backgroundColor: stages[c.stage]?.color }}
							/>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function ParaleloAreasMockup() {
	const areas = [
		{ name: "Ingeniería", count: 4, color: "#1447e6", status: "guardado" },
		{ name: "Hispana", count: 3, color: "#0d9488", status: "guardado" },
		{ name: "E&C", count: 2, color: "#7c3aed", status: "cerrado" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<GitBranch className="h-3 w-3 text-[#1447e6]" />
				<span className="text-foreground text-[10px] font-semibold">3 áreas en paralelo</span>
			</div>
			<div className="grid flex-1 grid-cols-3 gap-1">
				{areas.map((a, i) => (
					<motion.div
						key={a.name}
						initial={{ opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
						className="border-border flex flex-col items-center justify-between rounded-md border p-1.5"
						style={{ backgroundColor: `${a.color}10` }}
					>
						<span
							className="rounded-full px-1 py-0.5 text-[6px] font-medium"
							style={{ backgroundColor: a.color, color: "#fff" }}
						>
							{a.name}
						</span>
						<span className="text-foreground text-base leading-none font-bold tabular-nums">
							{a.count}
						</span>
						<span className="text-muted-foreground text-[6px]">{a.status}</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function ActivityLogMockup() {
	const events = [
		{ user: "M. López", action: "cerró etapa Metálico", time: "10:42" },
		{ user: "J. Ríos", action: "guardó componente CMP-203", time: "10:31" },
		{ user: "A. Silva", action: "aprobó OC SC-0140", time: "09:58" },
		{ user: "C. Vera", action: "creó SL-0089", time: "09:12" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<History className="text-ring h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">Activity Log</span>
			</div>
			<div className="relative flex flex-1 flex-col gap-1.5">
				<div className="bg-border absolute top-1 bottom-1 left-1 w-px" />
				{events.map((e, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, x: -4 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
						className="relative flex items-center gap-1.5 pl-3"
					>
						<span className="bg-ring absolute left-[2px] h-1.5 w-1.5 rounded-full ring-2 ring-background" />
						<div className="flex flex-1 flex-col leading-tight">
							<span className="text-foreground text-[7px]">
								<span className="font-semibold">{e.user}</span> {e.action}
							</span>
							<span className="text-muted-foreground text-[6px]">{e.time}</span>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function CapacidadMockup() {
	const days = Array.from({ length: 28 })
	const loads = [
		0.2, 0.4, 0.6, 0.85, 0.7, 0.3, 0.1, 0.45, 0.6, 0.95, 0.8, 0.55, 0.25, 0.1, 0.3, 0.5, 0.7, 0.9,
		1.0, 0.6, 0.2, 0.15, 0.4, 0.55, 0.7, 0.5, 0.25, 0.1,
	]
	const tint = (v: number) => {
		if (v >= 0.9) return "bg-red-500"
		if (v >= 0.7) return "bg-orange-500"
		if (v >= 0.5) return "bg-amber-400"
		if (v >= 0.3) return "bg-emerald-400"
		return "bg-emerald-100 dark:bg-emerald-900/40"
	}
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<Activity className="text-accent h-3 w-3" />
					<span className="text-foreground text-[10px] font-semibold">Capacidad</span>
				</div>
				<span className="text-muted-foreground text-[7px]">por día</span>
			</div>
			<div className="grid grid-cols-7 gap-0.5">
				{days.map((_, i) => (
					<motion.span
						key={i}
						initial={{ opacity: 0, scale: 0.6 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.25, delay: i * 0.01 }}
						className={`aspect-square rounded-[2px] ${tint(loads[i] ?? 0)}`}
					/>
				))}
			</div>
		</div>
	)
}

function GuiaDespachoMockup() {
	return (
		<div className="border-border bg-background relative flex h-full items-center justify-center overflow-hidden rounded-xl border p-4">
			<div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#1447e6]/10 blur-xl" />
			<motion.div
				initial={{ rotate: -6, opacity: 0, y: 10 }}
				whileInView={{ rotate: -4, opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="border-border bg-muted/40 relative flex w-full max-w-35 flex-col gap-1 rounded-md border p-2.5"
			>
				<div className="flex items-center justify-between gap-1.5">
					<div className="flex items-center gap-1">
						<Truck className="h-3 w-3 text-[#1447e6]" />
						<span className="text-foreground text-[9px] font-semibold">GD-1287</span>
					</div>
					<span className="rounded-full bg-emerald-100 px-1 py-0.5 text-[6px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
						Parcial
					</span>
				</div>
				<div className="bg-muted h-1 w-full rounded-full" />
				<div className="bg-muted h-1 w-5/6 rounded-full" />
				<div className="bg-muted h-1 w-4/6 rounded-full" />
				<div className="bg-foreground/80 mt-1 h-3 w-full rounded-[2px]" />
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-[6px]">2 / 5 componentes</span>
					<span className="text-[6px] font-medium text-[#1447e6]">Zebra ✓</span>
				</div>
			</motion.div>
		</div>
	)
}

export const busancVisuals: CaseStudyVisuals = {
	HeroMockup: BusancHeroMockup,
	context: {
		modules: [
			{ id: "sc", label: "SC", color: "#1447e6", textColor: "#ffffff" },
			{ id: "cotizaciones", label: "Cotizaciones", color: "#0e3bd1", textColor: "#ffffff" },
			{ id: "ots", label: "OTs", color: "#3b5bff", textColor: "#ffffff" },
			{ id: "despacho", label: "Despacho", color: "#6366f1", textColor: "#ffffff" },
		],
		bannerLeft: "Excel, correos e intranet legada → Busanc",
		bannerRight: "una sola plataforma",
		footerText:
			"Excel, correos y la intranet legada entran por la izquierda. Ingeniería Simple los procesa y los convierte en el flujo end-to-end de Busanc.",
		axisColor: "#1447e6",
	},
	architecture: {
		viewBox: { width: 800, height: 600 },
		ariaLabel: "Diagrama de arquitectura de Busanc",
		nodes: [
			{
				id: "users",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Usuarios",
				sub: "Comercial · Ingeniería · Hispana · E&C · Planificación · Calidad",
				tone: "neutral",
			},
			{
				id: "frontend",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Next.js 16 · App Router · React 19",
				sub: "TanStack Query · TanStack Form · Zod · shadcn/ui",
				tone: "primary",
			},
			{
				id: "backend",
				x: 20,
				y: 228,
				w: 760,
				h: 72,
				label: "NestJS 11 · Arquitectura modular por dominio",
				sub: "JwtAuthGuard + RolesGuard + PermissionsGuard (RBAC global)",
				tone: "primary",
			},
			{
				id: "auth",
				x: 20,
				y: 336,
				w: 240,
				h: 80,
				label: "JWT + Passport",
				sub: "RBAC granular · 10 roles",
				tone: "accent",
			},
			{
				id: "drizzle",
				x: 280,
				y: 336,
				w: 240,
				h: 80,
				label: "Drizzle ORM",
				sub: "Schema por módulo · tipado E2E",
				tone: "accent",
			},
			{
				id: "pdf",
				x: 540,
				y: 336,
				w: 240,
				h: 80,
				label: "@react-pdf/renderer",
				sub: "Cotizaciones · guías · reportes",
				tone: "accent",
			},
			{
				id: "postgres",
				x: 100,
				y: 452,
				w: 280,
				h: 80,
				label: "PostgreSQL (Azure)",
				sub: "Proyectos · componentes · OTs · activity log",
				tone: "neutral",
			},
			{
				id: "blob",
				x: 420,
				y: 452,
				w: 280,
				h: 80,
				label: "Azure Blob Storage",
				sub: "Planos · documentos · URLs firmadas",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "users", to: "frontend" },
			{ from: "frontend", to: "backend" },
			{ from: "backend", to: "auth" },
			{ from: "backend", to: "drizzle" },
			{ from: "backend", to: "pdf" },
			{ from: "drizzle", to: "postgres" },
			{ from: "backend", to: "blob" },
		],
	},
	features: {
		"Flujo Comercial Unificado": {
			visual: <FlujoComercialMockup />,
			span: "wide",
			icon: Receipt,
		},
		"Modelo Componente-Céntrico de Producción": {
			visual: <ComponenteCentricoMockup />,
			span: "wide",
			icon: GitBranch,
		},
		"Trabajo en Paralelo entre Áreas": {
			visual: <ParaleloAreasMockup />,
			span: "narrow",
			icon: Users,
		},
		"Activity Log y Trazabilidad End-to-End": {
			visual: <ActivityLogMockup />,
			span: "narrow",
			icon: History,
		},
		"Dashboard de Capacidad por Área": {
			visual: <CapacidadMockup />,
			span: "narrow",
			icon: Activity,
		},
		"Guía de Despacho Enriquecida": {
			visual: <GuiaDespachoMockup />,
			span: "narrow",
			icon: Truck,
		},
	},
}
