"use client"

import { motion } from "motion/react"
import {
	Activity,
	BarChart3,
	Clock,
	EyeOff,
	Gift,
	LogIn,
	MapPin,
	Radio,
	Trophy,
} from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

const ACCENT = "#b40000"
const ACCENT_SOFT = "#b4000018"

// ── Hero mockup — pantalla de juego ─────────────────────────────────────

function AiepHeroMockup({ label = "Vista de Desafío PEI" }: { label?: string }) {
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
					desafiopei.aiep.cl / oficial
				</div>
			</div>

			<div
				className="relative flex h-[calc(100%-1.75rem)] flex-col items-center justify-center gap-4 p-6"
				style={{
					background: `radial-gradient(120% 80% at 50% 20%, ${ACCENT_SOFT} 0%, transparent 60%)`,
				}}
			>
				<div className="flex w-full items-center justify-between text-[10px]">
					<span className="text-muted-foreground">Pregunta 4 / 10</span>
					<span
						className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-white"
						style={{ backgroundColor: ACCENT }}
					>
						<Clock className="h-3 w-3" />
						00:42
					</span>
				</div>

				<motion.h3
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="text-foreground max-w-md text-center text-sm font-semibold leading-snug sm:text-base"
				>
					¿Cuáles son los valores institucionales que sostienen el nuevo PEI de AIEP?
				</motion.h3>

				<div className="grid w-full max-w-md grid-cols-1 gap-2">
					{[
						"Innovación, liderazgo, inclusión, excelencia y responsabilidad",
						"Confianza, diversidad, trabajo en equipo, integridad y superación",
						"Calidad, respeto, colaboración, transparencia y compromiso",
					].map((opt, i) => (
						<motion.button
							key={opt}
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 + i * 0.08 }}
							className="border-border bg-background flex items-center gap-3 rounded-md border px-3 py-2 text-left text-[11px]"
						>
							<span
								className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
								style={{ backgroundColor: ACCENT }}
							>
								{String.fromCharCode(65 + i)}
							</span>
							<span className="text-foreground truncate">{opt}</span>
						</motion.button>
					))}
				</div>

				<div className="text-muted-foreground flex items-center gap-1.5 text-[9px]">
					<Radio className="h-3 w-3" style={{ color: ACCENT }} />
					<span>Polling cada 2s · sincronizado con el admin</span>
				</div>
			</div>
		</motion.div>
	)
}

// ── Feature mockups ──────────────────────────────────────────────────────

function PollingMockup() {
	return (
		<div className="border-border bg-background relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<Radio className="h-3.5 w-3.5" style={{ color: ACCENT }} />
					<span className="text-foreground text-[11px] font-semibold">Polling activo</span>
				</div>
				<span className="text-muted-foreground text-[9px]">cada 2s</span>
			</div>
			<div className="relative flex-1">
				<svg viewBox="0 0 240 90" className="h-full w-full">
					<defs>
						<linearGradient id="pollGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={ACCENT} stopOpacity="0.4" />
							<stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
						</linearGradient>
					</defs>
					{[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230].map((x, i) => (
						<g key={x}>
							<line
								x1={x}
								y1="10"
								x2={x}
								y2="80"
								stroke={ACCENT}
								strokeWidth="0.5"
								opacity="0.15"
							/>
							<motion.circle
								cx={x}
								cy={Math.sin(i * 0.6) * 18 + 45}
								r="2.5"
								fill={ACCENT}
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ delay: i * 0.05 }}
							/>
						</g>
					))}
					<motion.path
						initial={{ pathLength: 0 }}
						whileInView={{ pathLength: 1 }}
						transition={{ duration: 1.2 }}
						d="M10,51 L30,27 L50,33 L70,57 L90,63 L110,40 L130,27 L150,30 L170,55 L190,60 L210,42 L230,30 L230,80 L10,80 Z"
						fill="url(#pollGrad)"
						stroke={ACCENT}
						strokeWidth="1.5"
					/>
				</svg>
			</div>
			<div className="text-muted-foreground flex items-center justify-between text-[9px]">
				<span>p(95) &lt; 500ms</span>
				<span className="font-mono">1.000 VUs ✓</span>
			</div>
		</div>
	)
}

function AdminMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Activity className="h-3.5 w-3.5" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">Panel del admin</span>
				<span
					className="ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium text-white"
					style={{ backgroundColor: ACCENT }}
				>
					EN VIVO
				</span>
			</div>
			<div className="grid grid-cols-3 gap-1.5">
				{[
					{ label: "Pregunta", value: "4/10" },
					{ label: "Activos", value: "612" },
					{ label: "Responden", value: "548" },
				].map((s) => (
					<div key={s.label} className="border-border rounded-md border px-1.5 py-1">
						<div className="text-muted-foreground text-[7px] uppercase tracking-wider">
							{s.label}
						</div>
						<div className="text-foreground text-[11px] font-semibold">{s.value}</div>
					</div>
				))}
			</div>
			<div className="border-border bg-muted/40 flex flex-1 items-end gap-1 rounded-md border p-2">
				{[40, 25, 88, 60].map((h, i) => (
					<motion.div
						key={i}
						initial={{ height: 0 }}
						whileInView={{ height: `${h}%` }}
						transition={{ duration: 0.6, delay: i * 0.1 }}
						className="flex-1 rounded-sm"
						style={{ backgroundColor: i === 2 ? ACCENT : `${ACCENT}55` }}
						aria-hidden
					/>
				))}
			</div>
			<button
				className="rounded-md py-1 text-[9px] font-medium text-white"
				style={{ backgroundColor: ACCENT }}
			>
				Activar siguiente pregunta
			</button>
		</div>
	)
}

function NoFeedbackMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<EyeOff className="h-3.5 w-3.5" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">Respuesta enviada</span>
			</div>
			<div
				className="flex flex-1 flex-col items-center justify-center gap-2 rounded-md p-3 text-center"
				style={{ backgroundColor: ACCENT_SOFT }}
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
					<EyeOff className="h-4 w-4" style={{ color: ACCENT }} />
				</div>
				<div className="text-foreground text-[10px] font-semibold">¡Listo!</div>
				<p className="text-muted-foreground text-[8px] leading-tight">
					Verás tu resultado al final del juego.
				</p>
			</div>
		</div>
	)
}

function LateJoinMockup() {
	const steps = [
		{ q: "P1", state: "done" },
		{ q: "P2", state: "done" },
		{ q: "P3", state: "done" },
		{ q: "P4", state: "done" },
		{ q: "P5", state: "current" },
		{ q: "P6", state: "future" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<LogIn className="h-3.5 w-3.5" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">Entraste en P5</span>
			</div>
			<div className="flex flex-1 items-center justify-center">
				<div className="flex w-full items-center">
					{steps.map((s, i) => (
						<div key={s.q} className="flex flex-1 items-center">
							<div
								className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold"
								style={{
									backgroundColor:
										s.state === "current"
											? ACCENT
											: s.state === "done"
												? `${ACCENT}55`
												: "transparent",
									color: s.state === "future" ? "var(--muted-foreground)" : "white",
									border:
										s.state === "future"
											? "1px dashed var(--border)"
											: `1px solid ${ACCENT}`,
								}}
							>
								{s.q}
							</div>
							{i < steps.length - 1 && (
								<div
									className="h-px flex-1"
									style={{
										backgroundColor:
											s.state === "future" || steps[i + 1]?.state === "future"
												? "var(--border)"
												: ACCENT,
									}}
								/>
							)}
						</div>
					))}
				</div>
			</div>
			<p className="text-muted-foreground text-[8px] leading-tight">
				Respondés P1–P4 ahora y te sincronizás con el resto.
			</p>
		</div>
	)
}

function SedeRankingMockup() {
	const sedes = [
		{ name: "Sede Providencia", pct: 92 },
		{ name: "Sede Concepción", pct: 86 },
		{ name: "Sede Antofagasta", pct: 78 },
		{ name: "Sede Temuco", pct: 71 },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<MapPin className="h-3.5 w-3.5" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">Ranking por sede</span>
				<span className="text-muted-foreground ml-auto text-[8px]">Pausa P4</span>
			</div>
			<div className="flex flex-1 flex-col gap-1.5">
				{sedes.map((s, i) => (
					<motion.div
						key={s.name}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.08 }}
						className="flex items-center gap-2 text-[8px]"
					>
						<span className="text-muted-foreground w-3 text-right font-mono">{i + 1}</span>
						<span className="text-foreground w-24 truncate">{s.name}</span>
						<div className="bg-muted/60 relative h-2 flex-1 overflow-hidden rounded-full">
							<motion.div
								initial={{ width: 0 }}
								whileInView={{ width: `${s.pct}%` }}
								transition={{ duration: 0.6, delay: i * 0.08 }}
								className="absolute inset-y-0 left-0 rounded-full"
								style={{ backgroundColor: i === 0 ? ACCENT : `${ACCENT}88` }}
							/>
						</div>
						<span className="text-foreground w-7 text-right font-mono font-semibold">
							{s.pct}%
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function RaffleMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 overflow-hidden rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Trophy className="h-3.5 w-3.5" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">Sorteo final</span>
			</div>
			<div
				className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-md p-2 text-center"
				style={{ backgroundColor: ACCENT_SOFT }}
			>
				<Gift className="h-5 w-5" style={{ color: ACCENT }} />
				<div className="text-muted-foreground text-[8px] uppercase tracking-wider">
					Ganador
				</div>
				<div className="text-foreground text-[11px] font-semibold">M. Hernández</div>
				<div className="text-muted-foreground text-[8px]">Sede Antofagasta</div>
			</div>
			<div className="text-muted-foreground flex items-center justify-between text-[8px]">
				<span>Calificados 10/10</span>
				<span className="font-mono font-semibold">47</span>
			</div>
		</div>
	)
}

// ── Visuals export ───────────────────────────────────────────────────────

export const aiepPeiVisuals: CaseStudyVisuals = {
	HeroMockup: AiepHeroMockup,
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de Desafío PEI",
		diagramTitle: "Next.js + Postgres + polling — sin WebSockets",
		nodes: [
			{
				id: "participants",
				x: 20,
				y: 20,
				w: 540,
				h: 64,
				label: "600-700 participantes en vivo",
				sub: "Desde 26 sedes en Chile · polling cada 2-4s",
				tone: "neutral",
			},
			{
				id: "admin",
				x: 580,
				y: 20,
				w: 200,
				h: 64,
				label: "Administrador",
				sub: "Control del evento",
				tone: "accent",
			},
			{
				id: "next",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Next.js 15 · App Router · Vercel",
				sub: "Server Actions tipadas con Zod · sin API REST separada",
				tone: "primary",
			},
			{
				id: "actions",
				x: 20,
				y: 228,
				w: 760,
				h: 64,
				label: "Server Actions: activateQuestion · submitAnswer · getActiveGameSession",
				sub: "Validación end-to-end · respuestas únicas por (sessionId, userId, questionId)",
				tone: "primary",
			},
			{
				id: "prisma",
				x: 20,
				y: 328,
				w: 240,
				h: 80,
				label: "Prisma 7",
				sub: "Schema versionado · driver pg",
				tone: "accent",
			},
			{
				id: "auth",
				x: 280,
				y: 328,
				w: 240,
				h: 80,
				label: "Better Auth",
				sub: "Sesiones server-side · @aiep.cl",
				tone: "accent",
			},
			{
				id: "stats",
				x: 540,
				y: 328,
				w: 240,
				h: 80,
				label: "Stats por sede",
				sub: "Recharts · queries agregadas",
				tone: "accent",
			},
			{
				id: "postgres",
				x: 100,
				y: 432,
				w: 280,
				h: 80,
				label: "PostgreSQL",
				sub: "GameSession · OfficialAnswer · User",
				tone: "neutral",
			},
			{
				id: "k6",
				x: 420,
				y: 432,
				w: 280,
				h: 80,
				label: "Load test con k6 · 1.000 VUs",
				sub: "Validado antes del evento · p(95) < 500ms",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "participants", to: "next" },
			{ from: "admin", to: "next" },
			{ from: "next", to: "actions" },
			{ from: "actions", to: "prisma" },
			{ from: "actions", to: "auth" },
			{ from: "actions", to: "stats" },
			{ from: "prisma", to: "postgres" },
			{ from: "stats", to: "k6" },
		],
	},
	features: {
		"Polling vs WebSockets — y por qué ganó": {
			visual: <PollingMockup />,
			span: "wide",
			icon: Radio,
		},
		"Admin con control narrativo del evento": {
			visual: <AdminMockup />,
			span: "wide",
			icon: Activity,
		},
		"Sin feedback inmediato (anti-abandono)": {
			visual: <NoFeedbackMockup />,
			span: "narrow",
			icon: EyeOff,
		},
		"Entrada tardía inteligente": {
			visual: <LateJoinMockup />,
			span: "narrow",
			icon: LogIn,
		},
		"Ranking por sede en pausas": {
			visual: <SedeRankingMockup />,
			span: "narrow",
			icon: BarChart3,
		},
		"Sorteo final + pregunta bonus": {
			visual: <RaffleMockup />,
			span: "narrow",
			icon: Trophy,
		},
	},
}
