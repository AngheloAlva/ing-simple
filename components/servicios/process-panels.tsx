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
				tone === "green" && "border-brand-green/40 bg-brand-green/10 text-brand-green-text"
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

export const PROCESS_PANELS: Partial<Record<string, PanelComponent[]>> = {
	reportabilidad: [DiagnosticoPanel, ModeladoPanel, DisenoPanel, AutomatizacionPanel, EntregaPanel],
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
