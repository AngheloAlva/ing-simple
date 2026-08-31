import type { ServiceStep } from "@/lib/services"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Panels for "Cómo trabajamos": one small artefact per step, in the report
 * dialect (tiny type, hairline tiles, tabular figures, primary opacity tiers,
 * one green accent at most). Keyed by service slug; services without their
 * own set fall back to `FallbackPanel`.
 * ------------------------------------------------------------------------ */

export type PanelComponent = () => ReactNode

/* ---- Shared primitives -------------------------------------------------- */

function SectionLabel({ children }: { children: ReactNode }): ReactNode {
	return (
		<p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
			{children}
		</p>
	)
}

function Chip({
	children,
	tone = "muted",
}: {
	children: ReactNode
	tone?: "muted" | "primary" | "green"
}): ReactNode {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
				tone === "muted" && "border-border/60 bg-muted/40 text-muted-foreground",
				tone === "primary" && "border-primary/30 bg-primary/5 text-primary",
				tone === "green" && "border-brand-green/50 bg-brand-green/15 text-brand-green-text"
			)}
		>
			{children}
		</span>
	)
}

function Tile({ className, children }: { className?: string; children: ReactNode }): ReactNode {
	return (
		<div className={cn("border-border/60 bg-background rounded-sm border", className)}>
			{children}
		</div>
	)
}

function CheckMark({ className }: { className?: string }): ReactNode {
	return (
		<span
			className={cn(
				"bg-primary/10 text-primary inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
				className
			)}
			aria-hidden="true"
		>
			<Check className="h-2.5 w-2.5" strokeWidth={2.5} />
		</span>
	)
}

function LiveDot({ className }: { className?: string }): ReactNode {
	return (
		<span
			className={cn("bg-brand-green inline-block h-1.5 w-1.5 shrink-0 rounded-full", className)}
			aria-hidden="true"
		/>
	)
}

/** Bottom row of a panel: what the step leaves behind, anchored to the frame's edge. */
function Outcome({ children, chip }: { children: ReactNode; chip: ReactNode }): ReactNode {
	return (
		<div className="border-border/60 mt-auto flex items-center justify-between gap-3 border-t pt-2.5">
			<span className="text-muted-foreground min-w-0 text-[10px] leading-snug">
				<span className="text-foreground font-medium">Entregable</span> · {children}
			</span>
			{chip}
		</div>
	)
}

/* ---- 01 · Diagnóstico --------------------------------------------------- */

type Source = { name: string; detail: string; status: string; tone: "primary" | "muted" }

const SOURCES: Source[] = [
	{ name: "ERP", detail: "Ventas y costos", status: "Conectable", tone: "primary" },
	{ name: "Planillas", detail: "12 archivos", status: "Manual", tone: "muted" },
	{ name: "CRM", detail: "Clientes", status: "Conectable", tone: "primary" },
	{ name: "Correo", detail: "Reportes adjuntos", status: "Duplicada", tone: "muted" },
]

const QUESTIONS = [
	"¿Qué centro de costo se desvía del plan?",
	"¿Cuánto proyectamos cerrar el año?",
	"¿Qué área explica la brecha de este mes?",
]

function DiagnosticoPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Levantamiento de fuentes</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">4 fuentes</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{SOURCES.map((source) => (
							<div
								key={source.name}
								className="flex items-center justify-between gap-3 px-2.5 py-2"
							>
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="text-[11px] font-medium">{source.name}</span>
									<span className="text-muted-foreground truncate text-[10px]">
										· {source.detail}
									</span>
								</span>
								<Chip tone={source.tone}>{source.status}</Chip>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px] tabular-nums">
						2 conectables · 1 manual · 1 duplicada
					</p>
				</div>
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Preguntas de negocio</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">3 priorizadas</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{QUESTIONS.map((question, index) => (
							<div key={question} className="flex items-start gap-2 px-2.5 py-2">
								<span className="text-primary/60 mt-px text-[10px] font-medium tabular-nums">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="text-[11px] leading-snug">{question}</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px]">
						Definidas con gerencia en la sesión de levantamiento.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 1</Chip>}>
				mapa de fuentes y preguntas que el tablero debe responder
			</Outcome>
		</div>
	)
}

/* ---- 02 · Modelado de datos --------------------------------------------- */

type Table = { name: string; fields: string[] }

const FACT: Table = {
	name: "fact_ejecucion",
	fields: ["fecha_id", "cc_id", "cuenta_id", "plan", "gestion"],
}

const DIMS: Array<Table & { position: string }> = [
	{ name: "dim_fecha", fields: ["mes", "año"], position: "top-0 left-1/2 -translate-x-1/2" },
	{
		name: "dim_centro_costo",
		fields: ["área", "gerencia"],
		position: "top-1/2 left-0 -translate-y-1/2",
	},
	{
		name: "dim_cuenta",
		fields: ["grupo", "tipo"],
		position: "top-1/2 right-0 -translate-y-1/2",
	},
	{
		name: "dim_escenario",
		fields: ["base", "ajustado"],
		position: "bottom-0 left-1/2 -translate-x-1/2",
	},
]

function TableBox({ table, fact = false }: { table: Table; fact?: boolean }): ReactNode {
	return (
		<Tile className={cn("px-2 py-1.5", fact && "border-primary/40 shadow-sm")}>
			<p
				className={cn(
					"truncate text-[10px] font-semibold tracking-tight",
					fact ? "text-primary" : "text-foreground"
				)}
			>
				{table.name}
			</p>
			<ul className="mt-0.5 space-y-px">
				{table.fields.map((field) => (
					<li key={field} className="text-muted-foreground truncate text-[10px] leading-tight">
						{field}
					</li>
				))}
			</ul>
		</Tile>
	)
}

function ModeladoPanel(): ReactNode {
	return (
		<div>
			<div className="flex items-baseline justify-between gap-2">
				<SectionLabel>Modelo en estrella</SectionLabel>
				<span className="text-muted-foreground text-[10px] tabular-nums">
					1 hecho · 4 dimensiones
				</span>
			</div>
			<div className="relative mt-2 h-[232px]">
				<svg
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className="text-primary absolute inset-0 h-full w-full"
					aria-hidden="true"
				>
					{[
						[50, 0],
						[0, 50],
						[100, 50],
						[50, 100],
					].map(([x, y]) => (
						<line
							key={`${x}-${y}`}
							x1="50"
							y1="50"
							x2={x}
							y2={y}
							stroke="currentColor"
							strokeOpacity="0.3"
							strokeWidth="1"
							vectorEffect="non-scaling-stroke"
						/>
					))}
				</svg>
				{DIMS.map((dim) => (
					<div key={dim.name} className={cn("absolute w-[28%] sm:w-32", dim.position)}>
						<TableBox table={dim} />
					</div>
				))}
				<div className="absolute top-1/2 left-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 sm:w-36">
					<TableBox table={FACT} fact />
				</div>
			</div>
			<div className="border-border/60 mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
				<span className="flex items-center gap-2 text-[11px] font-medium">
					<CheckMark className="bg-brand-green/15 text-brand-green-text" />
					Modelo validado con tu equipo
				</span>
				<span className="text-muted-foreground text-[10px] tabular-nums">
					38 medidas · 0 duplicados
				</span>
			</div>
		</div>
	)
}

/* ---- 03 · Diseño del dashboard ------------------------------------------ */

type Wireframe = { version: string; label: string; final?: boolean; blocks: string[] }

const WIREFRAMES: Wireframe[] = [
	{
		version: "v1",
		label: "Lo esencial",
		blocks: ["col-span-6 row-span-1", "col-span-6 row-span-5"],
	},
	{
		version: "v2",
		label: "Tendencia",
		blocks: [
			"col-span-6 row-span-1",
			"col-span-2 row-span-1",
			"col-span-2 row-span-1",
			"col-span-2 row-span-1",
			"col-span-6 row-span-4",
		],
	},
	{
		version: "v3",
		label: "Con detalle",
		final: true,
		blocks: [
			"col-span-6 row-span-1",
			"col-span-2 row-span-1",
			"col-span-2 row-span-1",
			"col-span-2 row-span-1",
			"col-span-4 row-span-2",
			"col-span-2 row-span-2",
			"col-span-6 row-span-2",
		],
	},
]

const FEEDBACK = [
	{ who: "Gerencia", note: "La proyección al cierre va arriba, no al final." },
	{ who: "Control de gestión", note: "Falta el drill-down por centro de costo." },
]

function WireframeThumb({ frame }: { frame: Wireframe }): ReactNode {
	return (
		<div className="min-w-0">
			<Tile
				className={cn(
					"grid aspect-[4/3] grid-cols-6 grid-rows-6 gap-[3px] p-1.5",
					frame.final && "border-primary/50"
				)}
			>
				{frame.blocks.map((block, index) => (
					<span
						key={`${frame.version}-${index}`}
						className={cn(
							"rounded-[2px]",
							block,
							frame.final ? (index === 0 ? "bg-primary/25" : "bg-primary/10") : "bg-muted"
						)}
					/>
				))}
			</Tile>
			<div className="mt-1.5 flex items-center justify-between gap-1">
				<span
					className={cn(
						"text-[10px] font-medium tabular-nums",
						frame.final ? "text-primary" : "text-muted-foreground"
					)}
				>
					{frame.version}
				</span>
				<span className="text-muted-foreground truncate text-[10px]">{frame.label}</span>
			</div>
		</div>
	)
}

function DisenoPanel(): ReactNode {
	return (
		<div>
			<div className="flex items-baseline justify-between gap-2">
				<SectionLabel>Iteraciones</SectionLabel>
				<span className="text-muted-foreground text-[10px] tabular-nums">3 rondas · 2 semanas</span>
			</div>
			<div className="mt-2 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
				{WIREFRAMES.map((frame, index) => (
					<div key={frame.version} className="contents">
						{index > 0 ? (
							<span className="text-muted-foreground/60 -mt-5 text-[11px]" aria-hidden="true">
								→
							</span>
						) : null}
						<WireframeThumb frame={frame} />
					</div>
				))}
			</div>
			<p className="mt-3 text-[11px] font-medium">Primero lo esencial, después el detalle.</p>
			<div className="border-border/60 mt-3 border-t pt-2.5">
				<SectionLabel>Feedback</SectionLabel>
				<ul className="mt-1.5 space-y-1">
					{FEEDBACK.map((entry) => (
						<li key={entry.who} className="flex items-baseline gap-2">
							<Chip>{entry.who}</Chip>
							<span className="text-muted-foreground min-w-0 text-[11px] leading-snug">
								{entry.note}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

/* ---- 04 · Automatización ------------------------------------------------ */

type Run = { when: string; duration: string; live?: boolean }

const RUNS: Run[] = [
	{ when: "Jue 12 · 06:00", duration: "4 min" },
	{ when: "Vie 13 · 06:00", duration: "3 min" },
	{ when: "Lun 16 · 06:00", duration: "4 min" },
	{ when: "Mar 17 · 06:00", duration: "En curso", live: true },
]

function AutomatizacionPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div>
					<SectionLabel>Actualización programada</SectionLabel>
					<Tile className="mt-2 flex items-center justify-between gap-2 px-2.5 py-2">
						<span className="text-[11px] font-medium tabular-nums">Lun–Vie 06:00</span>
						<Chip tone="primary">Automática</Chip>
					</Tile>
					<div className="mt-3">
						<SectionLabel>Últimas ejecuciones</SectionLabel>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{RUNS.map((run) => (
							<div key={run.when} className="flex items-center justify-between gap-3 px-2.5 py-1.5">
								<span className="text-muted-foreground text-[10px] tabular-nums">{run.when}</span>
								<span className="flex items-center gap-1.5 text-[11px] font-medium tabular-nums">
									{run.live ? <LiveDot /> : <CheckMark className="h-3.5 w-3.5" />}
									{run.duration}
								</span>
							</div>
						))}
					</Tile>
				</div>
				<div>
					<SectionLabel>Distribución</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2">
						<p className="text-[11px] font-medium">PDF a 6 personas</p>
						<p className="text-muted-foreground mt-0.5 text-[10px] tabular-nums">
							Lun–Vie 07:00 · después de cada actualización
						</p>
						<div className="mt-2 flex flex-wrap gap-1">
							{["Gerencia", "Finanzas", "Operaciones"].map((group) => (
								<Chip key={group}>{group}</Chip>
							))}
						</div>
					</Tile>
					<div className="mt-3">
						<SectionLabel>Alertas</SectionLabel>
					</div>
					<Tile className="mt-2 px-2.5 py-2">
						<div className="flex items-center justify-between gap-2">
							<span className="text-[11px] font-medium">
								Si una fuente falla, avisa antes de enviar
							</span>
							<Chip>Correo</Chip>
						</div>
						<p className="text-muted-foreground mt-0.5 text-[10px] tabular-nums">
							Última alerta · hace 12 días · resuelta en 20 min
						</p>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Sin intervención manual</Chip>}>
				datos al día antes de que empiece la jornada
			</Outcome>
		</div>
	)
}

/* ---- 05 · Entrega y acompañamiento -------------------------------------- */

type HandoffItem = { label: string; meta: string; live?: boolean }

const HANDOFF: HandoffItem[] = [
	{ label: "Tablero publicado en producción", meta: "Mar 17" },
	{ label: "Documentación del modelo", meta: "Entregada" },
	{ label: "Capacitación", meta: "2 sesiones" },
	{ label: "Accesos y permisos", meta: "6 usuarios" },
	{ label: "Soporte 30 días", meta: "Activo", live: true },
]

const TEAM = ["MC", "JR", "AV"]

function EntregaPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div>
					<SectionLabel>Checklist de entrega</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{HANDOFF.map((entry) => (
							<div
								key={entry.label}
								className="flex items-center justify-between gap-3 px-2.5 py-2"
							>
								<span className="flex min-w-0 items-center gap-2">
									{entry.live ? (
										<span className="inline-flex h-4 w-4 items-center justify-center">
											<LiveDot />
										</span>
									) : (
										<CheckMark />
									)}
									<span className="truncate text-[11px] font-medium">{entry.label}</span>
								</span>
								<span className="text-muted-foreground text-[10px] tabular-nums">{entry.meta}</span>
							</div>
						))}
					</Tile>
				</div>
				<div>
					<SectionLabel>Tu equipo</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2">
						<div className="flex items-center gap-2">
							<span className="flex -space-x-1.5">
								{TEAM.map((initials) => (
									<span
										key={initials}
										className="bg-muted border-background text-muted-foreground inline-flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-semibold"
									>
										{initials}
									</span>
								))}
							</span>
							<span className="text-[11px] font-medium">3 personas capacitadas</span>
						</div>
						<p className="text-muted-foreground mt-1.5 text-[10px] leading-snug">
							Saben editar el modelo, agregar medidas y publicar cambios sin depender de nosotros.
						</p>
					</Tile>
					<Tile className="mt-2 flex items-center justify-between gap-2 px-2.5 py-2">
						<span className="text-[11px] font-medium">Ajustes y evolución</span>
						<Chip tone="primary">Bajo demanda</Chip>
					</Tile>
					<Tile className="mt-2 flex items-center justify-between gap-2 px-2.5 py-2">
						<span className="text-[11px] font-medium">Canal de soporte</span>
						<span className="text-muted-foreground text-[10px] tabular-nums">
							Correo directo · &lt; 1 día hábil
						</span>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Día 30</Chip>}>
				tablero en producción y un equipo que lo mantiene solo
			</Outcome>
		</div>
	)
}

/* ---- Registry ----------------------------------------------------------- */

/* ==========================================================================
 * Capacitaciones
 * ======================================================================== */

/* ---- 01 · Diagnóstico de nivel ------------------------------------------ */

type Assessed = { area: string; people: string; level: string; tone: "primary" | "muted" }

const ASSESSED: Assessed[] = [
	{ area: "Operaciones", people: "5 personas", level: "Básico", tone: "muted" },
	{ area: "Comercial", people: "4 personas", level: "Básico", tone: "muted" },
	{ area: "Control de gestión", people: "2 personas", level: "Intermedio", tone: "primary" },
	{ area: "Gerencia", people: "1 persona", level: "Lector", tone: "muted" },
]

const GAPS: { skill: string; now: number }[] = [
	{ skill: "Tablas dinámicas", now: 60 },
	{ skill: "Power Query", now: 25 },
	{ skill: "Modelado", now: 15 },
	{ skill: "DAX", now: 5 },
]

function NivelPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Quiénes se capacitan</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">12 personas</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{ASSESSED.map((row) => (
							<div key={row.area} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="text-[11px] font-medium">{row.area}</span>
									<span className="text-muted-foreground truncate text-[10px]">· {row.people}</span>
								</span>
								<Chip tone={row.tone}>{row.level}</Chip>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px] tabular-nums">
						2 cohortes · nivel de entrada disparejo
					</p>
				</div>
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Dominio actual</SectionLabel>
						<span className="text-muted-foreground text-[10px]">% del grupo</span>
					</div>
					<Tile className="mt-2 px-2.5 py-2">
						<div className="flex flex-col gap-2">
							{GAPS.map((gap) => (
								<div key={gap.skill}>
									<div className="flex items-baseline justify-between gap-2">
										<span className="text-[10px] leading-snug">{gap.skill}</span>
										<span className="text-muted-foreground text-[10px] tabular-nums">
											{gap.now} %
										</span>
									</div>
									<div className="bg-border/60 mt-1 h-1 w-full rounded-full">
										<div className="bg-primary h-1 rounded-full" style={{ width: `${gap.now}%` }} />
									</div>
								</div>
							))}
						</div>
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px]">
						Medido con un ejercicio corto, no con una encuesta.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 1</Chip>}>
				punto de partida por área y las brechas que el programa debe cerrar
			</Outcome>
		</div>
	)
}

/* ---- 02 · Diseño del programa ------------------------------------------- */

type Unit = { code: string; name: string; hours: string; included: boolean }

const UNITS: Unit[] = [
	{ code: "M1", name: "Datos ordenados en Excel", hours: "3 h", included: true },
	{ code: "M2", name: "Power Query", hours: "4 h", included: true },
	{ code: "M3", name: "Modelo y relaciones", hours: "3 h", included: true },
	{ code: "M4", name: "Primeras medidas DAX", hours: "3 h", included: true },
	{ code: "M5", name: "Power Apps", hours: "—", included: false },
]

function ProgramaPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-5">
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Temario propuesto</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">13 h</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{UNITS.map((unit) => (
							<div key={unit.code} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-center gap-2">
									{unit.included ? (
										<CheckMark />
									) : (
										<span
											className="border-border inline-block h-4 w-4 shrink-0 rounded-full border border-dotted"
											aria-hidden="true"
										/>
									)}
									<span
										className={cn(
											"truncate text-[11px]",
											unit.included ? "font-medium" : "text-muted-foreground"
										)}
									>
										{unit.name}
									</span>
								</span>
								<span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
									{unit.hours}
								</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px]">
						M5 queda fuera de esta etapa: se retoma cuando el grupo cierre M4.
					</p>
				</div>
				<div>
					<SectionLabel>Formato acordado</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{[
							["Modalidad", "Online en vivo"],
							["Sesiones", "4 de 3 h"],
							["Cohorte", "6 personas"],
							["Datos", "Los del cliente"],
						].map(([label, value]) => (
							<div key={label} className="flex items-baseline justify-between gap-2 px-2.5 py-2">
								<span className="text-muted-foreground text-[10px]">{label}</span>
								<span className="text-[10px] font-medium">{value}</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px]">
						Grupos chicos: nadie avanza sin haber hecho el ejercicio.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 2</Chip>}>
				temario, calendario y set de datos acordados antes de la primera clase
			</Outcome>
		</div>
	)
}

/* ---- 03 · Sesiones prácticas -------------------------------------------- */

type Beat = { time: string; label: string; kind: "teoría" | "ejercicio"; done: boolean }

const BEATS: Beat[] = [
	{ time: "00:00", label: "Repaso del ejercicio anterior", kind: "teoría", done: true },
	{ time: "00:20", label: "Power Query sobre tus planillas", kind: "teoría", done: true },
	{ time: "00:50", label: "Cada uno limpia su propia fuente", kind: "ejercicio", done: true },
	{ time: "01:40", label: "Revisión en conjunto", kind: "teoría", done: false },
	{ time: "02:10", label: "Ejercicio guiado de cierre", kind: "ejercicio", done: false },
]

function SesionesPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="pb-4">
				<div className="flex items-baseline justify-between gap-2">
					<SectionLabel>Sesión 02 · Power Query</SectionLabel>
					<span className="text-muted-foreground flex items-center gap-1.5 text-[10px] tabular-nums">
						<LiveDot />6 conectados · 3 h
					</span>
				</div>
				<Tile className="divide-border/60 mt-2 divide-y">
					{BEATS.map((beat) => (
						<div key={beat.time} className="flex items-center justify-between gap-3 px-2.5 py-2">
							<span className="flex min-w-0 items-center gap-2">
								<span className="text-muted-foreground w-9 shrink-0 text-[10px] tabular-nums">
									{beat.time}
								</span>
								{beat.done ? (
									<CheckMark />
								) : (
									<span
										className="border-border inline-block h-4 w-4 shrink-0 rounded-full border border-dotted"
										aria-hidden="true"
									/>
								)}
								<span
									className={cn(
										"truncate text-[11px]",
										beat.done ? "text-muted-foreground" : "font-medium"
									)}
								>
									{beat.label}
								</span>
							</span>
							<Chip tone={beat.kind === "ejercicio" ? "primary" : "muted"}>{beat.kind}</Chip>
						</div>
					))}
				</Tile>
				<p className="text-muted-foreground mt-2 text-[10px] tabular-nums">
					Más de la mitad del tiempo es teclado del participante, no diapositiva.
				</p>
			</div>
			<Outcome chip={<Chip tone="muted">En curso</Chip>}>
				cada sesión cierra con un ejercicio terminado sobre datos reales
			</Outcome>
		</div>
	)
}

/* ---- 04 · Aplicación real ----------------------------------------------- */

const BUILD: { label: string; detail: string; done: boolean }[] = [
	{ label: "Fuente conectada", detail: "Planilla de ventas", done: true },
	{ label: "Modelo armado", detail: "3 tablas relacionadas", done: true },
	{ label: "Medidas propias", detail: "Margen y cumplimiento", done: true },
	{ label: "Tablero publicado", detail: "Visible para su jefatura", done: false },
]

function AplicacionPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Lo que construye el equipo</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">3 de 4</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{BUILD.map((row) => (
							<div key={row.label} className="flex items-start gap-2 px-2.5 py-2">
								{row.done ? (
									<CheckMark className="mt-px" />
								) : (
									<span
										className="border-border mt-px inline-block h-4 w-4 shrink-0 rounded-full border border-dotted"
										aria-hidden="true"
									/>
								)}
								<span className="min-w-0">
									<span className="block text-[11px] font-medium">{row.label}</span>
									<span className="text-muted-foreground block text-[10px] leading-snug">
										{row.detail}
									</span>
								</span>
							</div>
						))}
					</Tile>
				</div>
				<div>
					<SectionLabel>Quién lo hizo</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2">
						<p className="text-[11px] leading-snug">
							El tablero lo arma <span className="font-medium">el equipo</span>, no nosotros.
							Nosotros revisamos y corregimos en vivo.
						</p>
					</Tile>
					<Tile className="divide-border/60 mt-2 divide-y">
						{[
							["Horas de práctica", "13 h"],
							["Tableros propios", "6"],
							["Dependencia externa", "Baja"],
						].map(([label, value]) => (
							<div key={label} className="flex items-baseline justify-between gap-2 px-2.5 py-2">
								<span className="text-muted-foreground text-[10px]">{label}</span>
								<span className="text-[10px] font-medium tabular-nums">{value}</span>
							</div>
						))}
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="green">Cierre</Chip>}>
				un tablero construido por el equipo, funcionando sobre datos de la operación
			</Outcome>
		</div>
	)
}

/* ---- 05 · Acompañamiento ------------------------------------------------ */

const FOLLOWUP: { week: string; asked: number; solved: number }[] = [
	{ week: "S1", asked: 9, solved: 9 },
	{ week: "S2", asked: 6, solved: 6 },
	{ week: "S3", asked: 3, solved: 3 },
	{ week: "S4", asked: 1, solved: 1 },
]

function AcompanamientoPanel(): ReactNode {
	const peak = 9

	return (
		<div className="flex h-full flex-col">
			<div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div>
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Consultas post-curso</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">19 resueltas</span>
					</div>
					<Tile className="mt-2 px-2.5 py-2">
						<div className="flex flex-col gap-2">
							{FOLLOWUP.map((row) => (
								<div key={row.week} className="flex items-center gap-2">
									<span className="text-muted-foreground w-5 shrink-0 text-[10px] tabular-nums">
										{row.week}
									</span>
									<span className="bg-border/60 h-1 flex-1 rounded-full">
										<span
											className="bg-primary block h-1 rounded-full"
											style={{ width: `${(row.asked / peak) * 100}%` }}
										/>
									</span>
									<span className="text-muted-foreground w-4 shrink-0 text-right text-[10px] tabular-nums">
										{row.asked}
									</span>
								</div>
							))}
						</div>
					</Tile>
					<p className="text-muted-foreground mt-2 text-[10px]">
						Las consultas bajan solas: esa es la señal de que la autonomía quedó.
					</p>
				</div>
				<div>
					<SectionLabel>Qué queda con el equipo</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{[
							"Grabaciones de las sesiones",
							"Ejercicios y sus soluciones",
							"Archivos del caso aplicado",
							"Canal de consultas por 30 días",
						].map((asset) => (
							<div key={asset} className="flex items-center gap-2 px-2.5 py-2">
								<CheckMark className="bg-brand-green/15 text-brand-green-text" />
								<span className="text-[11px] leading-snug">{asset}</span>
							</div>
						))}
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="green">Autonomía</Chip>}>
				el equipo resuelve sin nosotros y el material queda en la empresa
			</Outcome>
		</div>
	)
}

/* ======================= AUTOMATIZACIONES =============================== */

/* ---- 01 · Mapeo del proceso --------------------------------------------- */

type ManualStep = { step: string; who: string; time: string; flag?: string }

const FLOW_TODAY: ManualStep[] = [
	{ step: "Llega la solicitud", who: "Correo", time: "—" },
	{ step: "Revisar presupuesto", who: "Analista", time: "25 min" },
	{ step: "Pedir el visto bueno", who: "Jefatura", time: "1,5 días", flag: "Espera" },
	{ step: "Cargar en el ERP", who: "Analista", time: "20 min", flag: "Redigita" },
	{ step: "Avisar al solicitante", who: "Correo", time: "10 min" },
]

const TIME_LOSS: { label: string; pct: number }[] = [
	{ label: "Esperando aprobación", pct: 62 },
	{ label: "Redigitando en el ERP", pct: 20 },
	{ label: "Revisando a mano", pct: 12 },
	{ label: "Avisando y archivando", pct: 6 },
]

function MapeoPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>El proceso hoy</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">2 días por caso</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{FLOW_TODAY.map((row) => (
							<div key={row.step} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="truncate text-[11px] font-medium">{row.step}</span>
									<span className="text-muted-foreground shrink-0 text-[10px]">· {row.who}</span>
								</span>
								<span className="flex shrink-0 items-center gap-1.5">
									{row.flag ? <Chip>{row.flag}</Chip> : null}
									<span className="text-muted-foreground text-[10px] tabular-nums">{row.time}</span>
								</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						Lo cronometramos acompañando el proceso real, no preguntando cuánto creen que demora.
					</p>
				</div>
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Dónde se va el tiempo</SectionLabel>
						<span className="text-muted-foreground text-[10px]">% del ciclo</span>
					</div>
					<Tile className="mt-2 flex-1 px-2.5 py-2">
						<div className="flex h-full flex-col justify-between gap-2">
							{TIME_LOSS.map((row) => (
								<div key={row.label}>
									<div className="flex items-baseline justify-between gap-2">
										<span className="text-[10px] leading-snug">{row.label}</span>
										<span className="text-muted-foreground text-[10px] tabular-nums">
											{row.pct} %
										</span>
									</div>
									<div className="bg-border/60 mt-1 h-1 w-full rounded-full">
										<div className="bg-primary h-1 rounded-full" style={{ width: `${row.pct}%` }} />
									</div>
								</div>
							))}
						</div>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 1</Chip>}>
				el proceso actual medido paso a paso, con las etapas que se llevan las horas
			</Outcome>
		</div>
	)
}

/* ---- 02 · Diseño del flujo ---------------------------------------------- */

type FlowDecision = { step: string; mode: "auto" | "persona" }

const FLOW_DESIGN: FlowDecision[] = [
	{ step: "Entrada por formulario", mode: "auto" },
	{ step: "Validar presupuesto y proveedor", mode: "auto" },
	{ step: "Aprobar sobre el tope", mode: "persona" },
	{ step: "Crear la orden en el ERP", mode: "auto" },
	{ step: "Avisar al solicitante", mode: "auto" },
]

const FLOW_RULES: [string, string][] = [
	["Tope automático", "$500.000"],
	["Sobre el tope", "Jefatura"],
	["Proveedor no vigente", "Rechaza"],
	["Sin presupuesto", "Avisa y espera"],
]

function FlujoPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Qué corre solo</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">4 de 5 pasos</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{FLOW_DESIGN.map((row) => (
							<div key={row.step} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-center gap-2">
									{row.mode === "auto" ? (
										<CheckMark />
									) : (
										<span
											className="border-border inline-block h-4 w-4 shrink-0 rounded-full border border-dotted"
											aria-hidden="true"
										/>
									)}
									<span
										className={cn(
											"truncate text-[11px]",
											row.mode === "auto" ? "font-medium" : "text-muted-foreground"
										)}
									>
										{row.step}
									</span>
								</span>
								<span className="text-muted-foreground shrink-0 text-[10px]">
									{row.mode === "auto" ? "Automático" : "Persona"}
								</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						El paso que queda con persona es una decisión, no una limitación técnica.
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Reglas del negocio</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{FLOW_RULES.map(([label, value]) => (
							<div key={label} className="flex items-baseline justify-between gap-2 px-2.5 py-2">
								<span className="text-muted-foreground min-w-0 truncate text-[10px]">{label}</span>
								<span className="shrink-0 text-[10px] font-medium">{value}</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						Escritas y firmadas antes de construir nada.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 2</Chip>}>
				el flujo definido: qué corre solo, qué pasa por una persona y bajo qué regla
			</Outcome>
		</div>
	)
}

/* ---- 03 · Implementación ------------------------------------------------ */

type Connection = { name: string; detail: string; live: boolean }

const CONNECTIONS: Connection[] = [
	{ name: "ERP", detail: "Órdenes de compra", live: true },
	{ name: "SharePoint", detail: "Adjuntos y registro", live: true },
	{ name: "Correo", detail: "Entrada y avisos", live: true },
	{ name: "Firma digital", detail: "Casos sobre el tope", live: false },
]

const BUILD_ITEMS: { label: string; done: boolean }[] = [
	{ label: "Formulario de entrada", done: true },
	{ label: "Validaciones y reglas", done: true },
	{ label: "Creación de la orden", done: true },
	{ label: "Avisos al solicitante", done: true },
	{ label: "Manejo de errores", done: false },
]

function ImplementacionPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Conexiones</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">3 de 4</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{CONNECTIONS.map((row) => (
							<div key={row.name} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="text-[11px] font-medium">{row.name}</span>
									<span className="text-muted-foreground truncate text-[10px]">· {row.detail}</span>
								</span>
								<span className="flex shrink-0 items-center gap-1.5">
									{row.live ? <LiveDot /> : null}
									<span className="text-muted-foreground text-[10px]">
										{row.live ? "Conectado" : "En trámite"}
									</span>
								</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						Contra tus sistemas y tus datos, en un ambiente aparte del productivo.
					</p>
				</div>
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Construcción</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">4 de 5</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{BUILD_ITEMS.map((row) => (
							<div key={row.label} className="flex items-center gap-2 px-2.5 py-2">
								{row.done ? (
									<CheckMark />
								) : (
									<span
										className="border-border inline-block h-4 w-4 shrink-0 rounded-full border border-dotted"
										aria-hidden="true"
									/>
								)}
								<span
									className={cn(
										"truncate text-[11px]",
										row.done ? "font-medium" : "text-muted-foreground"
									)}
								>
									{row.label}
								</span>
							</div>
						))}
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semanas 3-4</Chip>}>
				el flujo armado y enchufado, corriendo fuera de producción
			</Outcome>
		</div>
	)
}

/* ---- 04 · Pruebas con tu equipo ----------------------------------------- */

const TEST_RESULTS: { label: string; value: string; green?: boolean }[] = [
	{ label: "Casos probados", value: "40" },
	{ label: "Resueltos solos", value: "34", green: true },
	{ label: "Derivados a una persona", value: "5" },
	{ label: "Marcados para corregir", value: "1" },
]

const TEST_NOTES: { who: string; note: string }[] = [
	{ who: "Abastecimiento", note: "Faltaba el centro de costo en el aviso" },
	{ who: "Jefatura", note: "Aprobar desde el correo, sin entrar al sistema" },
	{ who: "Contabilidad", note: "Adjuntar la cotización a la orden" },
]

function PruebasPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-5">
				<div className="flex flex-col">
					<SectionLabel>Corrida de prueba</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{TEST_RESULTS.map((row) => (
							<div
								key={row.label}
								className="flex items-baseline justify-between gap-2 px-2.5 py-2"
							>
								<span className="text-muted-foreground min-w-0 text-[10px] leading-snug">
									{row.label}
								</span>
								<span
									className={cn(
										"shrink-0 text-[11px] font-semibold tabular-nums",
										row.green && "text-brand-green-text"
									)}
								>
									{row.value}
								</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						Casos reales del mes pasado, no ejemplos inventados.
					</p>
				</div>
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Lo que pidió el equipo</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">3 ajustes</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{TEST_NOTES.map((row) => (
							<div key={row.who} className="flex items-start gap-2 px-2.5 py-2">
								<CheckMark className="bg-brand-green/15 text-brand-green-text mt-px" />
								<span className="min-w-0">
									<span className="block text-[10px] leading-snug">{row.note}</span>
									<span className="text-muted-foreground block text-[10px]">{row.who}</span>
								</span>
							</div>
						))}
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="green">Aplicado</Chip>}>
				el flujo validado por quienes lo van a usar, con sus correcciones ya adentro
			</Outcome>
		</div>
	)
}

/* ---- 05 · Puesta en marcha ---------------------------------------------- */

const WEEK_RUNS: { day: string; runs: number }[] = [
	{ day: "Lun", runs: 41 },
	{ day: "Mar", runs: 38 },
	{ day: "Mié", runs: 45 },
	{ day: "Jue", runs: 40 },
	{ day: "Vie", runs: 36 },
]

const WEEK_PEAK = 45

const FAILSAFE: string[] = [
	"Reintenta 3 veces antes de rendirse",
	"Avisa a soporte si igual falla",
	"Cada ejecución queda registrada",
	"Plan B escrito para el paso crítico",
]

function MarchaPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Primera semana en vivo</SectionLabel>
						<span className="flex items-center gap-1.5">
							<LiveDot />
							<span className="text-muted-foreground text-[10px] tabular-nums">
								200 ejecuciones
							</span>
						</span>
					</div>
					<Tile className="mt-2 flex-1 px-2.5 py-2.5">
						{/*
						 * The bar needs a parent with a resolved height, so the track is its
						 * own `flex-1` row inside a fixed-height column. Sizing the bar
						 * against the column itself gives a percentage of `auto`, which
						 * computes to zero and draws nothing.
						 */}
						<div className="flex h-full items-stretch justify-between gap-2">
							{WEEK_RUNS.map((row) => (
								<div key={row.day} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
									<span className="text-muted-foreground text-[10px] tabular-nums">{row.runs}</span>
									<div className="flex w-full flex-1 items-end">
										<div
											className="bg-primary mx-auto w-full max-w-8 rounded-t-sm"
											style={{ height: `${(row.runs / WEEK_PEAK) * 100}%` }}
										/>
									</div>
									<span className="text-muted-foreground text-[10px]">{row.day}</span>
								</div>
							))}
						</div>
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px] tabular-nums">
						0 caídas · 0 casos perdidos
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Si algo falla</SectionLabel>
					<Tile className="divide-border/60 mt-2 divide-y">
						{FAILSAFE.map((line) => (
							<div key={line} className="flex items-start gap-2 px-2.5 py-2">
								<CheckMark className="bg-brand-green/15 text-brand-green-text mt-px" />
								<span className="text-[10px] leading-snug">{line}</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground mt-auto pt-2 text-[10px]">
						Un flujo que falla en silencio es peor que el proceso manual.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="green">En producción</Chip>}>
				el flujo corriendo con monitoreo y alertas, acompañado las primeras semanas
			</Outcome>
		</div>
	)
}

/* ======================= Desarrollo Web ================================== */

/* ---- 01 · Levantamiento -------------------------------------------------- */

type DataHome = { data: string; tool: string; risk: string }

const DATA_TODAY: DataHome[] = [
	{ data: "Clientes", tool: "Planilla compartida", risk: "3 versiones" },
	{ data: "Solicitudes", tool: "Correo", risk: "Sin historial" },
	{ data: "Estados", tool: "WhatsApp", risk: "Se pierde" },
	{ data: "Facturación", tool: "ERP", risk: "Isla" },
]

const SURVEY_QUESTIONS = [
	"¿Quién decide, y con qué información al frente?",
	"¿Qué pasa hoy cuando alguien se equivoca?",
	"¿Qué dato nadie quiere volver a digitar?",
	"¿Qué reporte se arma a mano cada mes?",
]

function LevantamientoPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Dónde vive tu información</SectionLabel>
						<span className="text-muted-foreground text-[10px]">Hoy</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{DATA_TODAY.map((row) => (
							<div key={row.data} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="truncate text-[11px] font-medium">{row.data}</span>
									<span className="text-muted-foreground shrink-0 text-[10px]">· {row.tool}</span>
								</span>
								<Chip>{row.risk}</Chip>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground pt-2.5 text-[10px]">
						Lo levantamos sentados en tu operación, mirando cómo trabaja la gente de verdad.
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Lo que preguntamos</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2.5">
						<div className="flex flex-col gap-2.5">
							{SURVEY_QUESTIONS.map((question) => (
								<div key={question} className="flex items-start gap-2">
									<CheckMark className="mt-px" />
									<span className="text-[10px] leading-snug">{question}</span>
								</div>
							))}
						</div>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semanas 1-2</Chip>}>
				el mapa de tu operación, con la primera versión útil ya acotada
			</Outcome>
		</div>
	)
}

/* ---- 02 · Propuesta y diseño -------------------------------------------- */

type ScopeItem = { module: string; stage: 1 | 2 | 3 }

const SCOPE: ScopeItem[] = [
	{ module: "Usuarios, roles y permisos", stage: 1 },
	{ module: "Solicitudes y aprobaciones", stage: 1 },
	{ module: "Reportes de gestión", stage: 2 },
	{ module: "Portal para clientes", stage: 2 },
	{ module: "Integración con el ERP", stage: 3 },
]

const PROTOTYPE_SCREENS = ["Bandeja de pendientes", "Detalle de solicitud", "Panel de gerencia"]

function PropuestaPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Alcance por etapas</SectionLabel>
						<span className="text-muted-foreground text-[10px]">Qué entra primero</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{SCOPE.map((row) => (
							<div key={row.module} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="truncate text-[11px] font-medium">{row.module}</span>
								<Chip tone={row.stage === 1 ? "primary" : "muted"}>Etapa {row.stage}</Chip>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground pt-2.5 text-[10px]">
						La etapa 1 es la versión más chica que ya te sirve en producción.
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Prototipo navegable</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2.5">
						<div className="flex flex-col gap-2.5">
							{PROTOTYPE_SCREENS.map((screen) => (
								<div key={screen} className="border-border/60 rounded-sm border px-2 py-1.5">
									<div className="flex items-center gap-1" aria-hidden="true">
										<span className="bg-border h-1 w-1 rounded-full" />
										<span className="bg-border h-1 w-1 rounded-full" />
										<span className="bg-primary/60 h-1 w-1 rounded-full" />
									</div>
									<p className="mt-1 text-[10px] leading-snug font-medium">{screen}</p>
								</div>
							))}
							<p className="text-muted-foreground text-[10px] leading-snug">
								Se navega y se comenta antes de programar nada.
							</p>
						</div>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semana 3</Chip>}>
				alcance cerrado y un prototipo que ya puedes mostrar internamente
			</Outcome>
		</div>
	)
}

/* ---- 03 · Desarrollo iterativo ------------------------------------------ */

type Delivery = { sprint: string; shipped: string; state: "Entregado" | "En curso" | "Siguiente" }

const DELIVERIES: Delivery[] = [
	{ sprint: "Entrega 1", shipped: "Login, roles y permisos", state: "Entregado" },
	{ sprint: "Entrega 2", shipped: "Solicitudes de punta a punta", state: "Entregado" },
	{ sprint: "Entrega 3", shipped: "Aprobaciones y notificaciones", state: "En curso" },
	{ sprint: "Entrega 4", shipped: "Reportes de gestión", state: "Siguiente" },
]

function IterativoPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Entregas cada dos semanas</SectionLabel>
						<span className="text-muted-foreground text-[10px] tabular-nums">2 de 4</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{DELIVERIES.map((row) => (
							<div key={row.sprint} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="flex min-w-0 items-baseline gap-1.5">
									<span className="shrink-0 text-[10px] font-medium tabular-nums">
										{row.sprint}
									</span>
									<span className="text-muted-foreground truncate text-[10px]">
										· {row.shipped}
									</span>
								</span>
								{row.state === "Entregado" ? (
									<CheckMark />
								) : (
									<Chip tone={row.state === "En curso" ? "primary" : "muted"}>{row.state}</Chip>
								)}
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground pt-2.5 text-[10px]">
						Cada entrega se prueba con tu equipo. Si algo no calza, se corrige ahí y no al final.
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Lo que ves cada quincena</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2.5">
						<div className="flex flex-col gap-2.5">
							{[
								"Un ambiente de pruebas con tu usuario",
								"El avance funcionando, no un informe",
								"La lista de lo que viene, repriorizable",
							].map((item) => (
								<div key={item} className="flex items-start gap-2">
									<CheckMark className="mt-px" />
									<span className="text-[10px] leading-snug">{item}</span>
								</div>
							))}
						</div>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Semanas 4+</Chip>}>
				software funcionando y probado por tu equipo desde la primera quincena
			</Outcome>
		</div>
	)
}

/* ---- 04 · Puesta en producción ------------------------------------------ */

const GO_LIVE = [
	"Migración de los datos históricos",
	"Capacitación a los usuarios reales",
	"Dominio, certificado y respaldos",
	"Monitoreo de errores y rendimiento",
]

const GO_LIVE_FACTS: { label: string; value: string }[] = [
	{ label: "Usuarios activos", value: "48" },
	{ label: "Datos migrados", value: "12.400" },
	{ label: "Respaldo", value: "Diario" },
]

function ProduccionPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-5">
				<div className="flex flex-col">
					<SectionLabel>Antes de abrir la puerta</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2.5">
						<div className="flex flex-col gap-2.5">
							{GO_LIVE.map((item) => (
								<div key={item} className="flex items-start gap-2">
									<CheckMark className="mt-px" />
									<span className="text-[10px] leading-snug">{item}</span>
								</div>
							))}
						</div>
					</Tile>
				</div>
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>El día de la salida</SectionLabel>
						<span className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
							<LiveDot />
							En vivo
						</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{GO_LIVE_FACTS.map((row) => (
							<div key={row.label} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="text-muted-foreground text-[10px]">{row.label}</span>
								<span className="text-[11px] font-medium tabular-nums">{row.value}</span>
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground pt-2.5 text-[10px]">
						Acompañamos la primera semana en vivo, con el equipo trabajando.
					</p>
				</div>
			</div>
			<Outcome chip={<Chip tone="green">En producción</Chip>}>
				el sistema andando y tu gente usándolo, no un zip con código fuente
			</Outcome>
		</div>
	)
}

/* ---- 05 · Evolución continua -------------------------------------------- */

type Request = { title: string; state: "Publicado" | "En curso" | "En cola" }

const BACKLOG: Request[] = [
	{ title: "Firma digital en terreno", state: "Publicado" },
	{ title: "Exportar a Excel filtrado", state: "Publicado" },
	{ title: "Alertas por vencimiento", state: "En curso" },
	{ title: "App móvil para supervisores", state: "En cola" },
]

function EvolucionPanel(): ReactNode {
	return (
		<div className="flex h-full flex-col">
			<div className="grid flex-1 gap-4 pb-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-5">
				<div className="flex flex-col">
					<div className="flex items-baseline justify-between gap-2">
						<SectionLabel>Lo que pide la operación</SectionLabel>
						<span className="text-muted-foreground text-[10px]">Últimos 6 meses</span>
					</div>
					<Tile className="divide-border/60 mt-2 divide-y">
						{BACKLOG.map((row) => (
							<div key={row.title} className="flex items-center justify-between gap-3 px-2.5 py-2">
								<span className="truncate text-[11px] font-medium">{row.title}</span>
								{row.state === "Publicado" ? (
									<CheckMark />
								) : (
									<Chip tone={row.state === "En curso" ? "primary" : "muted"}>{row.state}</Chip>
								)}
							</div>
						))}
					</Tile>
					<p className="text-muted-foreground pt-2.5 text-[10px]">
						Las ideas nacen del uso real: nadie pide esto en la reunión de levantamiento.
					</p>
				</div>
				<div className="flex flex-col">
					<SectionLabel>Cómo seguimos</SectionLabel>
					<Tile className="mt-2 px-2.5 py-2.5">
						<div className="flex flex-col gap-2.5">
							{[
								"Canal directo para reportar y pedir",
								"Monitoreo activo, sin esperar tu llamado",
								"Mejoras priorizadas contigo cada mes",
							].map((item) => (
								<div key={item} className="flex items-start gap-2">
									<CheckMark className="mt-px" />
									<span className="text-[10px] leading-snug">{item}</span>
								</div>
							))}
						</div>
					</Tile>
				</div>
			</div>
			<Outcome chip={<Chip tone="primary">Continuo</Chip>}>
				un sistema que crece con la operación en vez de envejecer con ella
			</Outcome>
		</div>
	)
}

export const PROCESS_PANELS: Partial<Record<string, PanelComponent[]>> = {
	"reportabilidad": [
		DiagnosticoPanel,
		ModeladoPanel,
		DisenoPanel,
		AutomatizacionPanel,
		EntregaPanel,
	],
	"capacitaciones": [
		NivelPanel,
		ProgramaPanel,
		SesionesPanel,
		AplicacionPanel,
		AcompanamientoPanel,
	],
	"automatizaciones": [MapeoPanel, FlujoPanel, ImplementacionPanel, PruebasPanel, MarchaPanel],
	"desarrollo-web": [
		LevantamientoPanel,
		PropuestaPanel,
		IterativoPanel,
		ProduccionPanel,
		EvolucionPanel,
	],
}

/* ---- Fallback ----------------------------------------------------------- */

/**
 * Services without bespoke panels: a step track with the active node filled,
 * plus the active step's title and description.
 */
export function FallbackPanel({
	steps,
	active,
}: {
	steps: ServiceStep[]
	active: number
}): ReactNode {
	const step = steps[active]
	if (step === undefined) return null

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center" aria-hidden="true">
				{steps.map((entry, index) => {
					const done = index < active
					const current = index === active
					return (
						<div key={entry.title} className={cn("flex items-center", index > 0 && "flex-1")}>
							{index > 0 ? (
								<span
									className={cn(
										"h-px flex-1 transition-colors duration-200",
										index <= active ? "bg-primary/50" : "bg-border"
									)}
								/>
							) : null}
							<span
								className={cn(
									"inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium tabular-nums transition-colors duration-200",
									current && "bg-primary border-primary text-primary-foreground",
									done && "border-primary/50 text-primary",
									!current && !done && "border-border text-muted-foreground"
								)}
							>
								{String(index + 1).padStart(2, "0")}
							</span>
						</div>
					)
				})}
			</div>
			<div className="flex flex-1 flex-col justify-center py-8">
				<p className="text-primary text-[11px] font-medium tracking-wide uppercase tabular-nums">
					Paso {String(active + 1).padStart(2, "0")} de {String(steps.length).padStart(2, "0")}
				</p>
				<p className="mt-2 text-lg font-semibold tracking-tight">{step.title}</p>
				<p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">{step.desc}</p>
			</div>
			<div className="border-border/60 flex items-center justify-between gap-2 border-t pt-2.5">
				<span className="text-muted-foreground text-[10px]">
					{active + 1 < steps.length
						? `Siguiente: ${steps[active + 1]?.title ?? ""}`
						: "Último paso del proceso"}
				</span>
				<Chip tone={active + 1 === steps.length ? "green" : "muted"}>
					{active + 1 === steps.length ? "Completado" : "En proceso"}
				</Chip>
			</div>
		</div>
	)
}
