"use client"

import { motion } from "motion/react"
import {
	AlertCircle,
	ArrowDown,
	ArrowLeftRight,
	BarChart3,
	Bell,
	Banknote,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	Compass,
	Database,
	DollarSign,
	FileSpreadsheet,
	Globe,
	LayoutGrid,
	type LucideIcon,
	Mountain,
	Receipt,
	ShieldCheck,
	Ticket,
	TrendingDown,
	TrendingUp,
	Truck,
	UserCog,
	Users,
	Wallet,
} from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

const BRAND = "#e75219"

// ── Sidebar config ───────────────────────────────────────────────────────

const SIDEBAR_MAIN: { label: string; icon: LucideIcon; active?: boolean }[] = [
	{ label: "Inicio", icon: LayoutGrid, active: true },
	{ label: "Ventas y Cotizaciones", icon: Receipt },
	{ label: "Traspasos / Recepción", icon: Truck },
	{ label: "Control Financiero", icon: Wallet },
	{ label: "Gestión Operacional", icon: ClipboardList },
	{ label: "Panel de Alertas", icon: Bell },
]

const SIDEBAR_ADMIN: { label: string; icon: LucideIcon }[] = [
	{ label: "Gestión de Mayoristas", icon: Globe },
	{ label: "Gestión de Agencias", icon: Users },
	{ label: "Gestión de Proveedores", icon: Truck },
	{ label: "Gestión de Tours", icon: Compass },
	{ label: "Usuarios", icon: UserCog },
	{ label: "Roles", icon: ShieldCheck },
]

interface TurismoKpi {
	label: string
	sub: string
	value: string
	icon: LucideIcon
	tint: string
	iconColor: string
}

const KPIS_TOP: TurismoKpi[] = [
	{
		label: "Ventas del Mes",
		sub: "-99.4% vs anterior",
		value: "2",
		icon: Receipt,
		tint: "#fee2e2",
		iconColor: "#dc2626",
	},
	{
		label: "Ingresos del Mes",
		sub: "CLP",
		value: "$160.000",
		icon: DollarSign,
		tint: "#dcfce7",
		iconColor: "#16a34a",
	},
	{
		label: "Cotizaciones",
		sub: "pendientes",
		value: "0",
		icon: ClipboardList,
		tint: "#fef3c7",
		iconColor: "#d97706",
	},
	{
		label: "Servicios Activos",
		sub: "actualmente",
		value: "2",
		icon: Compass,
		tint: "#ffedd5",
		iconColor: BRAND,
	},
]

const KPIS_BOTTOM: TurismoKpi[] = [
	{
		label: "Pasajeros del Mes",
		sub: "registrados",
		value: "5",
		icon: Users,
		tint: "#ede9fe",
		iconColor: "#7c3aed",
	},
	{
		label: "Tours Activos",
		sub: "publicados",
		value: "94",
		icon: Mountain,
		tint: "#dbeafe",
		iconColor: "#2563eb",
	},
	{
		label: "Agencias Activas",
		sub: "del mes",
		value: "34",
		icon: Globe,
		tint: "#fce7f3",
		iconColor: "#db2777",
	},
	{
		label: "Pagos Pendientes",
		sub: "por cobrar",
		value: "1",
		icon: AlertCircle,
		tint: "#fee2e2",
		iconColor: "#dc2626",
	},
]

// ── Brand logo: cuadrado naranja con icono de montaña ────────────────────

function BrandMark({ size = 16 }: { size?: number }) {
	return (
		<span
			className="flex items-center justify-center rounded-[4px] text-white"
			style={{ height: size, width: size, backgroundColor: BRAND }}
		>
			<Mountain style={{ height: size * 0.6, width: size * 0.6 }} strokeWidth={2.4} />
		</span>
	)
}

// ── Hero mockup — pantalla Inicio ────────────────────────────────────────

function DashboardTurismoHeroMockup({ label = "Vista del dashboard TurismoChileTours" }: { label?: string }) {
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
				<div className="bg-background border-border flex w-[22%] flex-col gap-1 border-r p-2">
					<div className="flex items-center gap-1.5 px-1 pb-1">
						<BrandMark size={16} />
						<div className="flex min-w-0 flex-col leading-tight">
							<span className="text-foreground truncate text-[8px] font-bold tracking-tight">
								TurismoChileTours
							</span>
							<span className="text-muted-foreground truncate text-[6px]">
								Dashboard de gestión
							</span>
						</div>
					</div>

					<span className="text-muted-foreground mt-1 px-1 text-[6px] tracking-wider uppercase">
						Principal
					</span>
					<div className="flex flex-col gap-0.5">
						{SIDEBAR_MAIN.map((item) => {
							const Icon = item.icon
							return (
								<div
									key={item.label}
									className="flex items-center gap-1.5 rounded-[3px] px-1.5 py-1"
									style={
										item.active
											? { backgroundColor: BRAND, color: "#fff" }
											: undefined
									}
								>
									<Icon
										className={item.active ? "h-2 w-2" : "text-muted-foreground h-2 w-2"}
									/>
									<span
										className={
											item.active
												? "truncate text-[7px] font-medium"
												: "text-muted-foreground truncate text-[7px]"
										}
									>
										{item.label}
									</span>
								</div>
							)
						})}
					</div>

					<span className="text-muted-foreground mt-1 px-1 text-[6px] tracking-wider uppercase">
						Administración
					</span>
					<div className="flex flex-col gap-0.5">
						{SIDEBAR_ADMIN.map((item) => {
							const Icon = item.icon
							return (
								<div
									key={item.label}
									className="text-muted-foreground flex items-center gap-1.5 rounded-[3px] px-1.5 py-1"
								>
									<Icon className="h-2 w-2" />
									<span className="truncate text-[7px]">{item.label}</span>
								</div>
							)
						})}
					</div>

					<div className="mt-auto pt-1">
						<div className="border-border bg-muted/40 flex items-center gap-1.5 rounded-[3px] border px-1 py-1">
							<div
								className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[6px] font-bold text-white"
								style={{ backgroundColor: BRAND }}
							>
								Ad
							</div>
							<div className="flex min-w-0 flex-col leading-tight">
								<span className="text-foreground truncate text-[7px] font-medium">
									Administrador
								</span>
								<span className="text-muted-foreground truncate text-[6px]">
									admin@turismochiletours.c…
								</span>
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
						<div
							className="flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[7px] font-medium text-white"
							style={{ backgroundColor: BRAND }}
						>
							<Ticket className="h-2 w-2" />
							<span>Tutorial Inicio</span>
						</div>
					</div>

					{/* KPIs top */}
					<div className="grid grid-cols-4 gap-1">
						{KPIS_TOP.map((kpi, i) => (
							<TurismoKpiCard key={kpi.label} kpi={kpi} delay={i * 0.05} />
						))}
					</div>

					{/* KPIs bottom */}
					<div className="grid grid-cols-4 gap-1">
						{KPIS_BOTTOM.map((kpi, i) => (
							<TurismoKpiCard key={kpi.label} kpi={kpi} delay={0.2 + i * 0.05} />
						))}
					</div>

					{/* Charts split */}
					<div className="grid flex-1 grid-cols-[1.5fr_1fr] gap-1">
						<div className="border-border bg-background flex flex-col gap-1 rounded-md border p-1.5">
							<div className="flex items-center justify-between">
								<div className="flex flex-col leading-tight">
									<span className="text-foreground text-[7px] font-semibold">
										Resumen de Ventas
									</span>
									<span className="text-muted-foreground text-[6px]">Últimos 6 meses</span>
								</div>
								<TrendingUp className="h-2 w-2" style={{ color: BRAND }} />
							</div>
							<svg viewBox="0 0 200 60" className="w-full flex-1" preserveAspectRatio="none">
								<defs>
									<linearGradient id="dt-area" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={BRAND} stopOpacity="0.35" />
										<stop offset="100%" stopColor={BRAND} stopOpacity="0" />
									</linearGradient>
								</defs>
								<path
									d="M0,45 C20,40 35,30 55,28 C75,26 90,38 110,32 C130,26 145,14 170,18 C185,20 195,12 200,10 L200,60 L0,60 Z"
									fill="url(#dt-area)"
								/>
								<path
									d="M0,45 C20,40 35,30 55,28 C75,26 90,38 110,32 C130,26 145,14 170,18 C185,20 195,12 200,10"
									fill="none"
									stroke={BRAND}
									strokeWidth="1.2"
								/>
							</svg>
						</div>
						<div className="border-border bg-background flex flex-col gap-1 rounded-md border p-1.5">
							<div className="flex items-center justify-between">
								<span className="text-foreground text-[7px] font-semibold">Próximos Eventos</span>
								<CalendarDays className="text-muted-foreground h-2 w-2" />
							</div>
							<div className="flex flex-1 flex-col gap-1">
								{[
									{ label: "Valle de la Luna", meta: "3 pax · 14:00", color: "#2563eb" },
									{ label: "Geyser del Tatio", meta: "5 pax · 04:30", color: BRAND },
									{ label: "Transfer OUT", meta: "2 pax · 09:15", color: "#7c3aed" },
								].map((ev) => (
									<div
										key={ev.label}
										className="border-border flex items-center gap-1.5 rounded-[3px] border px-1.5 py-1"
									>
										<span
											className="h-2 w-2 shrink-0 rounded-[2px]"
											style={{ backgroundColor: ev.color }}
										/>
										<div className="flex min-w-0 flex-1 flex-col leading-tight">
											<span className="text-foreground truncate text-[6px] font-medium">
												{ev.label}
											</span>
											<span className="text-muted-foreground truncate text-[6px]">
												{ev.meta}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Últimas ventas */}
					<div className="border-border bg-background rounded-md border p-1.5">
						<div className="flex items-center justify-between">
							<span className="text-foreground text-[7px] font-semibold">Últimas Ventas</span>
							<span className="text-muted-foreground text-[6px]">Ver todas</span>
						</div>
						<div className="mt-1 flex flex-col gap-0.5">
							{[
								{ id: "V-8756", client: "Hotel Cumbres · 2 pax", amount: "$95.000" },
								{ id: "V-8755", client: "Walk-in · 3 pax", amount: "$65.000" },
							].map((row) => (
								<div
									key={row.id}
									className="grid grid-cols-[60px_1fr_70px] items-center gap-1 py-0.5 text-[6px]"
								>
									<span className="font-medium" style={{ color: BRAND }}>
										{row.id}
									</span>
									<span className="text-foreground truncate">{row.client}</span>
									<span className="text-foreground text-right tabular-nums">{row.amount}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

function TurismoKpiCard({ kpi, delay = 0 }: { kpi: TurismoKpi; delay?: number }) {
	const Icon = kpi.icon
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay }}
			className="border-border bg-background flex items-center justify-between gap-1 rounded-md border p-1.5"
		>
			<div className="flex flex-col leading-tight">
				<span className="text-foreground text-sm leading-none font-bold tabular-nums">
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

function CalendarMockup() {
	const days = Array.from({ length: 35 }, (_, i) => i - 2) // offset semana
	const BLUE = "#2563eb"
	const GREEN = "#16a34a"
	const PURPLE = "#7c3aed"
	const events: Record<number, { label: string; color: string }[]> = {
		1: [{ label: "Tatio", color: BLUE }],
		2: [
			{ label: "Valle de la Luna", color: BLUE },
			{ label: "Transfer IN", color: PURPLE },
		],
		3: [
			{ label: "Tour Regular", color: BLUE },
			{ label: "Sandboard", color: BLUE },
			{ label: "Transfer OUT", color: PURPLE },
		],
		4: [{ label: "Privado luna", color: GREEN }],
		5: [
			{ label: "Transfer IN", color: PURPLE },
			{ label: "Laguna Cejar", color: BLUE },
		],
		6: [{ label: "Tatio", color: BLUE }],
		8: [
			{ label: "Astrolunar", color: BLUE },
			{ label: "Privado", color: GREEN },
		],
		9: [{ label: "Valle de la Luna", color: BLUE }],
		10: [
			{ label: "Piedras Rojas", color: BLUE },
			{ label: "Transfer OUT", color: PURPLE },
			{ label: "Sandboard", color: BLUE },
		],
		11: [{ label: "Tour Regular", color: BLUE }],
		12: [
			{ label: "Valle de la Luna", color: BLUE },
			{ label: "Privado", color: GREEN },
		],
		13: [{ label: "Astronómico", color: BLUE }],
		15: [
			{ label: "Tatio", color: BLUE },
			{ label: "Transfer IN", color: PURPLE },
			{ label: "Laguna Cejar", color: BLUE },
		],
		16: [{ label: "Privado", color: GREEN }],
		17: [
			{ label: "Tatio", color: BLUE },
			{ label: "Arqueológico", color: BLUE },
		],
		18: [{ label: "Valle Arcoiris", color: BLUE }],
		19: [
			{ label: "Sandboard", color: BLUE },
			{ label: "Transfer OUT", color: PURPLE },
		],
		20: [{ label: "Privado", color: GREEN }],
		22: [
			{ label: "Tour Regular", color: BLUE },
			{ label: "Astronómico", color: BLUE },
			{ label: "Privado", color: GREEN },
		],
		23: [{ label: "Tatio", color: BLUE }],
		24: [
			{ label: "Valle de la Luna", color: BLUE },
			{ label: "Transfer IN", color: PURPLE },
		],
		25: [{ label: "Piedras Rojas", color: BLUE }],
		26: [
			{ label: "Privado", color: GREEN },
			{ label: "Sandboard", color: BLUE },
		],
		28: [{ label: "Laguna Cejar", color: BLUE }],
		29: [
			{ label: "Valle de la Luna", color: BLUE },
			{ label: "Arqueológico", color: BLUE },
			{ label: "Transfer OUT", color: PURPLE },
		],
		30: [{ label: "Tatio", color: BLUE }],
	}
	return (
		<div className="border-border bg-background relative flex h-full flex-col gap-1.5 overflow-hidden rounded-xl border p-3 text-[9px]">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<CalendarDays className="h-3 w-3" style={{ color: BRAND }} />
					<span className="text-foreground text-[10px] font-semibold">Calendario · Abril 2026</span>
				</div>
				<span className="text-muted-foreground text-[7px]">Mes / Semana / Día</span>
			</div>
			<div className="grid grid-cols-7 gap-0.5 text-center text-[6px] text-muted-foreground">
				{["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
					<span key={i}>{d}</span>
				))}
			</div>
			<div className="grid flex-1 grid-cols-7 gap-0.5">
				{days.map((d, i) => {
					const isMonth = d > 0 && d <= 30
					const evts = events[d] ?? []
					return (
						<div
							key={i}
							className="border-border bg-muted/20 relative rounded-[3px] border p-0.5"
							style={{ opacity: isMonth ? 1 : 0.4 }}
						>
							<span className="text-foreground text-[6px]">{isMonth ? d : ""}</span>
							{evts.map((e, j) => (
								<span
									key={j}
									className="mt-0.5 block truncate rounded-[2px] px-0.5 text-[5px] text-white"
									style={{ backgroundColor: e.color }}
								>
									{e.label}
								</span>
							))}
						</div>
					)
				})}
			</div>
			{/* Hover card */}
			<motion.div
				initial={{ opacity: 0, y: 4 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4, delay: 0.3 }}
				className="border-border bg-background absolute right-3 bottom-3 w-36 rounded-md border p-1.5 shadow-lg"
			>
				<div className="flex items-center gap-1">
					<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#2563eb" }} />
					<span className="text-foreground text-[7px] font-semibold">Valle de la Luna</span>
				</div>
				<div className="text-muted-foreground mt-0.5 flex flex-col gap-px text-[6px]">
					<span>miércoles 29 abr · sin horario</span>
					<span>3 pax · Sin proveedores asignados</span>
				</div>
			</motion.div>
		</div>
	)
}

function BillingMockup() {
	const rows = [
		{ id: "V-8754", amount: "$111.300" },
		{ id: "V-8757", amount: "$142.000" },
		{ id: "V-8761", amount: "$131.000" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 rounded-xl border p-3 text-[9px]">
			<div className="flex items-center gap-1.5">
				<Banknote className="h-3 w-3" style={{ color: BRAND }} />
				<span className="text-foreground text-[10px] font-semibold">Facturación mayorista</span>
			</div>
			<div className="flex flex-wrap items-center gap-1">
				<span
					className="rounded-full px-1.5 py-0.5 text-[6px] font-medium text-white"
					style={{ backgroundColor: BRAND }}
				>
					Ekatours
				</span>
				<span className="border-border text-muted-foreground rounded-full border px-1.5 py-0.5 text-[6px] font-medium">
					abr–may 2026
				</span>
			</div>
			<div className="border-border bg-muted/20 flex flex-col gap-0.5 rounded-md border p-1.5">
				{rows.map((row, i) => (
					<motion.div
						key={row.id}
						initial={{ opacity: 0, y: 4 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: i * 0.05 }}
						className="grid grid-cols-[10px_55px_1fr_60px] items-center gap-1 py-0.5 text-[7px]"
					>
						<span
							className="flex h-2.5 w-2.5 items-center justify-center rounded-[2px]"
							style={{ backgroundColor: BRAND }}
						>
							<CheckCircle2 className="h-1.5 w-1.5 text-white" strokeWidth={3} />
						</span>
						<span className="font-medium" style={{ color: BRAND }}>
							{row.id}
						</span>
						<span className="text-muted-foreground truncate text-[6px]">voucher · 2 pax</span>
						<span className="text-foreground text-right tabular-nums">{row.amount}</span>
					</motion.div>
				))}
			</div>
			<div className="text-muted-foreground flex items-center justify-between px-0.5 text-[7px]">
				<span>3 ventas seleccionadas</span>
				<span className="text-foreground font-semibold tabular-nums">$384.300</span>
			</div>
			<div className="mt-auto">
				<button
					type="button"
					className="flex w-full items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[7px] font-semibold text-white"
					style={{ backgroundColor: BRAND }}
				>
					<FileSpreadsheet className="h-2 w-2" />
					<span>Generar PDF de cobro</span>
				</button>
			</div>
		</div>
	)
}

function PermissionsMockup() {
	const roles = ["Administración", "Operadora", "Lectura"]
	const modules = ["Ventas", "Caja", "Tours", "Reportes"]
	const matrix: boolean[][] = [
		[true, true, true, true],
		[true, false, true, false],
		[false, false, false, true],
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3 text-[9px]">
			<div className="flex items-center gap-1.5">
				<ShieldCheck className="h-3 w-3" style={{ color: BRAND }} />
				<span className="text-foreground text-[10px] font-semibold">Permisos por módulo</span>
			</div>
			<div className="overflow-hidden rounded-md border border-border">
				<div className="bg-muted/50 grid grid-cols-[1fr_repeat(4,minmax(0,1fr))] gap-0.5 px-1.5 py-1 text-[6px] font-semibold text-muted-foreground">
					<span>Rol</span>
					{modules.map((m) => (
						<span key={m} className="text-center">
							{m}
						</span>
					))}
				</div>
				{roles.map((role, i) => (
					<div
						key={role}
						className="border-border grid grid-cols-[1fr_repeat(4,minmax(0,1fr))] gap-0.5 border-t px-1.5 py-1 text-[7px]"
					>
						<span className="text-foreground font-medium">{role}</span>
						{matrix[i]!.map((on, j) => (
							<span key={j} className="flex items-center justify-center">
								{on ? (
									<CheckCircle2 className="h-2.5 w-2.5" style={{ color: BRAND }} />
								) : (
									<span className="text-muted-foreground text-[7px]">–</span>
								)}
							</span>
						))}
					</div>
				))}
			</div>
			<span className="text-muted-foreground text-[6px]">RoleModulePermission · editable sin tocar código</span>
		</div>
	)
}

function AnalyticsMockup() {
	const stats = [
		{ label: "Ingresos Totales", value: "$515.254.028", icon: DollarSign },
		{ label: "Ventas", value: "1,375", icon: Receipt },
		{ label: "Pasajeros", value: "3,304", icon: Users },
		{ label: "Voucher Promedio", value: "$374.730", icon: TrendingUp },
		{ label: "Países", value: "88", icon: Globe },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3 text-[9px]">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<BarChart3 className="h-3 w-3" style={{ color: BRAND }} />
					<span className="text-foreground text-[10px] font-semibold">Análisis y reportes</span>
				</div>
				<span className="text-muted-foreground text-[7px]">2015–2026 · filtros server-side</span>
			</div>
			<div className="grid grid-cols-5 gap-1">
				{stats.map((s, i) => {
					const Icon = s.icon
					return (
						<motion.div
							key={s.label}
							initial={{ opacity: 0, y: 4 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
							className="border-border bg-muted/20 flex flex-col gap-0.5 rounded-md border p-1.5"
						>
							<Icon className="h-2 w-2" style={{ color: BRAND }} />
							<span className="text-foreground text-[8px] leading-none font-bold tabular-nums">
								{s.value}
							</span>
							<span className="text-muted-foreground text-[6px]">{s.label}</span>
						</motion.div>
					)
				})}
			</div>
			<div className="border-border bg-muted/10 mt-1 flex flex-1 flex-col gap-1 rounded-md border p-2">
				<div className="flex items-center justify-between">
					<span className="text-foreground text-[7px] font-semibold">Evolución de Ventas</span>
					<TrendingDown className="text-muted-foreground h-2 w-2" />
				</div>
				<svg viewBox="0 0 240 50" className="w-full flex-1" preserveAspectRatio="none">
					<path
						d="M0,42 L20,38 L40,30 L60,33 L80,22 L100,28 L120,18 L140,24 L160,14 L180,18 L200,8 L220,12 L240,6"
						fill="none"
						stroke={BRAND}
						strokeWidth="1.4"
					/>
				</svg>
			</div>
		</div>
	)
}

function ReceptionsTransfersMockup() {
	const receptions = [
		{ label: "Hotel Atacama · 4 pax · 14:30", status: "Confirmada", tint: "#dcfce7", color: "#16a34a" },
		{ label: "Hotel Tierra · 2 pax · 16:00", status: "Pendiente", tint: "#fef3c7", color: "#d97706" },
	]
	const transfers = [
		{ label: "→ Despegar · Valle de la Luna · 3 pax", status: "Aceptado", tint: "#dbeafe", color: "#2563eb" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 rounded-xl border p-3 text-[9px]">
			<div className="flex items-center gap-1.5">
				<ArrowLeftRight className="h-3 w-3" style={{ color: BRAND }} />
				<span className="text-foreground text-[10px] font-semibold">Recepciones y traspasos</span>
			</div>
			<div className="flex flex-1 flex-col gap-1.5">
				<div className="flex flex-1 flex-col gap-1">
					<span className="text-muted-foreground text-[6px] tracking-wider uppercase">
						Recepciones del día
					</span>
					{receptions.map((r, i) => (
						<motion.div
							key={r.label}
							initial={{ opacity: 0, y: 4 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
							className="border-border bg-muted/20 flex items-center justify-between gap-1 rounded-[3px] border px-1.5 py-1"
						>
							<span className="text-foreground truncate text-[7px]">{r.label}</span>
							<span
								className="shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-medium"
								style={{ backgroundColor: r.tint, color: r.color }}
							>
								{r.status}
							</span>
						</motion.div>
					))}
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-[6px] tracking-wider uppercase">
						Traspasos
					</span>
					{transfers.map((t, i) => (
						<motion.div
							key={t.label}
							initial={{ opacity: 0, y: 4 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
							className="border-border bg-muted/20 flex items-center justify-between gap-1 rounded-[3px] border px-1.5 py-1"
						>
							<span className="text-foreground truncate text-[7px]">{t.label}</span>
							<span
								className="shrink-0 rounded-full px-1.5 py-0.5 text-[6px] font-medium"
								style={{ backgroundColor: t.tint, color: t.color }}
							>
								{t.status}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

function MigrationMockup() {
	const steps = [
		{ label: "Microsoft Lists", sub: "fuente legacy" },
		{ label: "Excel maestro", sub: "extracción" },
		{ label: "Excel normalizado", sub: "limpieza + reconciliación" },
		{ label: "Postgres", sub: "importación por períodos" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col justify-between gap-2 rounded-xl border p-3 text-[9px]">
			<div className="flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<Database className="h-3 w-3" style={{ color: BRAND }} />
					<span className="text-foreground text-[10px] font-semibold">Migración 11 años</span>
				</div>
				<span
					className="rounded-full px-1.5 py-0.5 text-[6px] font-medium text-white"
					style={{ backgroundColor: BRAND }}
				>
					2015–2026
				</span>
			</div>
			<div className="flex flex-1 flex-col items-stretch justify-center gap-0.5">
				{steps.map((s, i) => (
					<div key={s.label} className="flex flex-col items-stretch gap-0.5">
						<motion.div
							initial={{ opacity: 0, x: -4 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: i * 0.08 }}
							className="border-border bg-muted/30 flex items-center gap-1.5 rounded-md border px-1.5 py-1"
						>
							<span
								className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] text-[6px] font-bold text-white"
								style={{ backgroundColor: BRAND }}
							>
								{i + 1}
							</span>
							<div className="flex min-w-0 flex-1 flex-col leading-tight">
								<span className="text-foreground truncate text-[7px] font-semibold">
									{s.label}
								</span>
								<span className="text-muted-foreground truncate text-[6px]">{s.sub}</span>
							</div>
						</motion.div>
						{i < steps.length - 1 && (
							<div className="text-muted-foreground flex justify-center">
								<ArrowDown className="h-2 w-2" />
							</div>
						)}
					</div>
				))}
			</div>
			<div
				className="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[7px] font-semibold text-white"
				style={{ backgroundColor: BRAND }}
			>
				<CheckCircle2 className="h-2.5 w-2.5" />
				<span>11 años importados</span>
			</div>
		</div>
	)
}

// ── Exported visuals ─────────────────────────────────────────────────────

export const dashboardTurismoVisuals: CaseStudyVisuals = {
	HeroMockup: DashboardTurismoHeroMockup,
	context: {
		modules: [
			{ id: "powerapps", label: "Power Apps", color: "#5e5cb5", textColor: "#ffffff" },
			{ id: "lists", label: "Microsoft Lists", color: "#0078d4", textColor: "#ffffff" },
			{ id: "excel-wa", label: "Excel + WhatsApp", color: "#16a34a", textColor: "#ffffff" },
			{ id: "dashboard", label: "Dashboard Turismo", color: BRAND, textColor: "#ffffff" },
		],
		bannerLeft: "Power Apps, Microsoft Lists y Excel dispersos →",
		bannerRight: "una sola plataforma operativa",
		footerText:
			"El dashboard consolida 11 años de data atrapada en Microsoft Lists, planillas Excel y hilos de WhatsApp en una única fuente de verdad sobre Postgres. Auditoría inmutable, calendario visual con validación de conflictos en servidor, permisos granulares por módulo y exportes operativos en PDF y Excel listos para el día a día — no para una demo.",
		axisColor: BRAND,
	},
	architecture: {
		viewBox: { width: 800, height: 600 },
		ariaLabel: "Diagrama de arquitectura del dashboard TurismoChileTours",
		nodes: [
			{
				id: "users",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Equipo TurismoChileTours",
				sub: "Jefe · Operadoras · Administración (permisos por módulo)",
				tone: "primary",
			},
			{
				id: "frontend",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Next.js 16 · App Router · React Compiler",
				sub: "TanStack Query/Table/Form · shadcn/ui · DnD Kit · Recharts",
				tone: "primary",
			},
			{
				id: "backend",
				x: 20,
				y: 228,
				w: 760,
				h: 72,
				label: "Server Actions + Zod 4",
				sub: "Validación end-to-end · transacciones de venta/evento/pago",
				tone: "primary",
			},
			{
				id: "auth",
				x: 20,
				y: 336,
				w: 240,
				h: 80,
				label: "Better Auth 1.4",
				sub: "RoleModulePermission · permisos por módulo",
				tone: "accent",
			},
			{
				id: "prisma",
				x: 280,
				y: 336,
				w: 240,
				h: 80,
				label: "Prisma 7 ORM",
				sub: "40+ modelos · 49+ migraciones",
				tone: "accent",
			},
			{
				id: "exports",
				x: 540,
				y: 336,
				w: 240,
				h: 80,
				label: "@react-pdf/renderer + ExcelJS",
				sub: "Hoja de ruta · vouchers · planillas",
				tone: "accent",
			},
			{
				id: "postgres",
				x: 100,
				y: 452,
				w: 280,
				h: 80,
				label: "PostgreSQL (Neon)",
				sub: "Branching de DB por PR · 11 años de data migrada",
				tone: "neutral",
			},
			{
				id: "blob",
				x: 420,
				y: 452,
				w: 280,
				h: 80,
				label: "Vercel Blob + Resend",
				sub: "Vouchers PDF · fotos de tours · emails transaccionales",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "users", to: "frontend" },
			{ from: "frontend", to: "backend" },
			{ from: "backend", to: "auth", label: "permisos por módulo" },
			{ from: "backend", to: "prisma" },
			{ from: "backend", to: "exports" },
			{ from: "prisma", to: "postgres", label: "40+ modelos" },
			{ from: "backend", to: "blob" },
		],
	},
	features: {
		"Calendario operativo con drag-and-drop": {
			visual: <CalendarMockup />,
			span: "full",
			icon: CalendarDays,
		},
		"Facturación mayorista con exportes": {
			visual: <BillingMockup />,
			span: "wide",
			icon: Banknote,
		},
		"Permisos granulares por módulo": {
			visual: <PermissionsMockup />,
			span: "narrow",
			icon: ShieldCheck,
		},
		"Análisis y reportes con filtros": {
			visual: <AnalyticsMockup />,
			span: "wide",
			icon: BarChart3,
		},
		"Recepciones y traspasos entre agencias": {
			visual: <ReceptionsTransfersMockup />,
			span: "narrow",
			icon: ArrowLeftRight,
		},
		"Migración de 11 años de data": {
			visual: <MigrationMockup />,
			span: "narrow",
			icon: Database,
		},
	},
}
