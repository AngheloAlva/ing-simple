"use client"

import { ChevronsLeftRight } from "lucide-react"
import { useCallback, useRef, useState, type ReactNode } from "react"

/** Spreadsheet chaos — the "before" every operation recognizes. */
function BeforeMock(): ReactNode {
	const rows = 9
	const cols = 7
	return (
		<div className="bg-muted/40 text-muted-foreground flex h-full flex-col font-mono text-[10px]">
			{/* File chrome */}
			<div className="border-border/60 bg-background/70 flex shrink-0 items-center justify-between border-b px-3 py-2">
				<span className="truncate font-medium">control_operacional_v7_FINAL(3).xlsx</span>
				<span className="hidden sm:inline">Solo lectura · Sin guardar</span>
			</div>
			{/* Grid */}
			<div className="min-h-0 flex-1 overflow-hidden p-2">
				<div
					className="bg-border/50 grid h-full gap-px"
					style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
				>
					{Array.from({ length: rows * cols }, (_, i) => {
						const row = Math.floor(i / cols)
						const isHeader = row === 0
						const broken = [9, 17, 24, 38, 44, 52].includes(i)
						return (
							<div
								key={i}
								className={`flex items-center overflow-hidden px-1.5 ${
									isHeader
										? "bg-muted font-semibold"
										: broken
											? "bg-background text-foreground/80"
											: "bg-background/80"
								}`}
							>
								{isHeader
									? ["Fecha", "OT", "Área", "Estado", "Resp.", "Monto", "Obs"][i % cols]
									: broken
										? "#¡REF!"
										: ""}
								{!isHeader && !broken ? (
									<span
										className="bg-muted-foreground/25 h-1.5 rounded-full"
										style={{ width: `${35 + ((i * 37) % 55)}%` }}
									/>
								) : null}
							</div>
						)
					})}
				</div>
			</div>
			{/* Sheet tabs */}
			<div className="border-border/60 bg-background/70 flex shrink-0 items-center gap-1 border-t px-2 py-1.5">
				{["Hoja1", "Copia de Hoja1", "FINAL", "no borrar"].map((tab, i) => (
					<span
						key={tab}
						className={`truncate px-2 py-0.5 ${i === 2 ? "bg-muted font-medium" : ""}`}
					>
						{tab}
					</span>
				))}
			</div>
		</div>
	)
}

/** The same operation, as a purpose-built system. */
function AfterMock(): ReactNode {
	const stats = [
		{ label: "OT abiertas", value: "24" },
		{ label: "En curso", value: "11" },
		{ label: "Cerradas hoy", value: "7" },
	]
	const rows = [
		{ ot: "OT-1042", area: "Mantención", state: "En curso" },
		{ ot: "OT-1041", area: "Operaciones", state: "Aprobada" },
		{ ot: "OT-1039", area: "Seguridad", state: "En curso" },
		{ ot: "OT-1038", area: "Mantención", state: "Cerrada" },
		{ ot: "OT-1037", area: "Operaciones", state: "En curso" },
		{ ot: "OT-1036", area: "Bodega", state: "Aprobada" },
		{ ot: "OT-1035", area: "Mantención", state: "Cerrada" },
	]
	return (
		<div className="bg-background flex h-full text-[10px]">
			{/* Sidebar */}
			<aside className="border-border/60 hidden w-24 shrink-0 flex-col gap-1 border-r p-2 sm:flex">
				<span className="bg-primary mb-2 h-4 w-4 rounded" aria-hidden="true" />
				{["Órdenes", "Equipos", "Reportes", "Usuarios"].map((item, i) => (
					<span
						key={item}
						className={`rounded px-2 py-1 font-medium ${
							i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"
						}`}
					>
						{item}
					</span>
				))}
			</aside>
			{/* Main */}
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="border-border/60 flex shrink-0 items-center justify-between border-b px-3 py-2">
					<span className="text-foreground font-semibold tracking-tight">Órdenes de trabajo</span>
					<span className="bg-primary text-primary-foreground rounded px-2 py-0.5 font-medium">
						+ Nueva OT
					</span>
				</div>
				<div className="grid shrink-0 grid-cols-3 gap-2 p-2.5">
					{stats.map((stat) => (
						<div key={stat.label} className="border-border/60 rounded-md border p-2">
							<p className="text-muted-foreground">{stat.label}</p>
							<p className="text-foreground mt-0.5 text-sm font-semibold tabular-nums">
								{stat.value}
							</p>
						</div>
					))}
				</div>
				<div className="border-border/60 mx-2.5 mb-2.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
					{rows.map((row) => (
						<div
							key={row.ot}
							className="border-border/40 flex flex-1 items-center justify-between border-b px-2.5 last:border-b-0"
						>
							<span className="text-foreground font-medium">{row.ot}</span>
							<span className="text-muted-foreground hidden sm:inline">{row.area}</span>
							<span
								className={`rounded-full px-2 py-0.5 font-medium ${
									row.state === "Cerrada"
										? "bg-muted text-muted-foreground"
										: "bg-primary/10 text-primary"
								}`}
							>
								{row.state}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

const SHIFTS = [
	"Planillas sueltas → un solo sistema",
	"Estados por WhatsApp → trazabilidad real",
	"“¿Quién tiene la última versión?” → todos ven lo mismo",
]

export function ModuleBeforeAfter(): ReactNode {
	const [position, setPosition] = useState(50)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const draggingRef = useRef(false)

	const updateFromClientX = useCallback((clientX: number) => {
		const node = containerRef.current
		if (node === null) return
		const rect = node.getBoundingClientRect()
		const pct = ((clientX - rect.left) / rect.width) * 100
		setPosition(Math.min(96, Math.max(4, pct)))
	}, [])

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<p className="text-muted-foreground text-sm font-medium">Antes / después</p>
				<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					De la planilla <span className="font-sans font-semibold tracking-tight">al sistema</span>
				</h2>
				<p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
					Arrastra el divisor: así se ve la misma operación antes y después de construir su
					plataforma.
				</p>
			</div>

			<div className="mx-auto max-w-[1100px]">
				<div
					ref={containerRef}
					className="border-border/60 relative h-[380px] touch-pan-y overflow-hidden rounded-2xl border shadow-2xl shadow-black/[0.08] select-none sm:h-[440px]"
					onPointerDown={(e) => {
						draggingRef.current = true
						e.currentTarget.setPointerCapture(e.pointerId)
						updateFromClientX(e.clientX)
					}}
					onPointerMove={(e) => {
						if (draggingRef.current) updateFromClientX(e.clientX)
					}}
					onPointerUp={() => {
						draggingRef.current = false
					}}
					onPointerCancel={() => {
						draggingRef.current = false
					}}
				>
					{/* After — full layer underneath */}
					<div className="absolute inset-0">
						<AfterMock />
					</div>

					{/* Before — clipped to the left of the divider */}
					<div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
						<BeforeMock />
					</div>

					{/* Divider + handle */}
					<div
						className="bg-primary absolute inset-y-0 z-10 w-0.5"
						style={{ left: `${position}%` }}
						aria-hidden="true"
					>
						<span className="bg-primary text-primary-foreground absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg">
							<ChevronsLeftRight className="h-5 w-5" />
						</span>
					</div>

					{/* Layer labels */}
					<span className="bg-foreground/80 text-background pointer-events-none absolute top-3 left-3 z-10 rounded px-2 py-1 text-[10px] font-semibold tracking-widest uppercase">
						Antes
					</span>
					<span className="bg-primary text-primary-foreground pointer-events-none absolute top-3 right-3 z-10 rounded px-2 py-1 text-[10px] font-semibold tracking-widest uppercase">
						Después
					</span>

					{/* Keyboard-accessible control driving the same position */}
					<input
						type="range"
						min={4}
						max={96}
						value={Math.round(position)}
						onChange={(e) => setPosition(Number(e.target.value))}
						aria-label="Comparar antes y después"
						className="absolute inset-x-0 bottom-2 z-20 mx-auto block w-40 opacity-0 focus-visible:opacity-100"
					/>
				</div>

				<ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
					{SHIFTS.map((shift) => (
						<li key={shift} className="text-muted-foreground text-sm font-medium">
							{shift}
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
