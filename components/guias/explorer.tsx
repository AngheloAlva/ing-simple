"use client"

import { CutButton } from "@/components/cut-button"
import { IllustrationPlate } from "@/components/illustration-plate"
import { filterGuias } from "@/lib/guias/filter"
import { formatGuiaDate } from "@/lib/guias/format"
import type { GuiaMeta } from "@/lib/guias/schema"
import { TEMAS } from "@/lib/guias/temas"
import { SERVICES } from "@/lib/services"
import { GUIA_COVER_PREFIX, NAV_FORWARD, viewTransitionName } from "@/lib/view-transitions"
import { Search } from "lucide-react"
import Link from "next/link"
import { ViewTransition, useMemo, useState, type ReactNode } from "react"

/** Shown when there are no guides in the repo at all — never reachable when a search/filter empties the list. */
function GlobalEmptyState(): ReactNode {
	return (
		<div className="border-border relative flex min-h-[280px] flex-col items-center justify-center rounded-sm border border-dashed px-6 py-16 text-center">
			<p className="font-serif text-2xl font-normal tracking-[-0.01em]">
				Estamos escribiendo las primeras guías
			</p>
			<p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
				Vuelve pronto o cuéntanos qué tema te gustaría que cubramos primero.
			</p>
			<div className="mt-6">
				<CutButton variant="outline" href="/contacto">
					Conversemos
				</CutButton>
			</div>
		</div>
	)
}

function FilteredEmptyState({ onClear }: { onClear: () => void }): ReactNode {
	return (
		<div className="border-border relative flex min-h-[280px] flex-col items-center justify-center rounded-sm border border-dashed px-6 py-16 text-center">
			<p className="font-serif text-2xl font-normal tracking-[-0.01em]">
				Ninguna guía coincide con tu búsqueda
			</p>
			<p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
				Prueba con otra palabra clave o revisa todas las guías disponibles.
			</p>
			<div className="mt-6">
				<button
					type="button"
					onClick={onClear}
					className="border-border hover:border-primary hover:text-primary rounded-sm border px-4 py-2 text-sm font-medium transition-colors duration-200"
				>
					Limpiar filtros
				</button>
			</div>
		</div>
	)
}

function GuiaCard({ guia }: { guia: GuiaMeta }): ReactNode {
	return (
		<Link
			href={`/guias/${guia.slug}`}
			transitionTypes={[NAV_FORWARD]}
			className="group border-border bg-background hover:border-primary focus-visible:outline-primary flex flex-col overflow-hidden rounded-sm border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
		>
			{/* The same plate the guide's own cover renders, so the card and the article
			    agree: the card used to draw the raw asset and the cover duotoned it, which
			    put a greyscale drawing in the grid and a blue one on the page. The frame is
			    the assets' own 16:9 — at the former 16/10 the plate would have cropped 10%
			    of the drawing's width. */}
			<ViewTransition
				name={viewTransitionName(GUIA_COVER_PREFIX, guia.slug)}
				share="morph"
				default="none"
			>
				<IllustrationPlate
					src={guia.portada}
					alt={guia.portadaAlt}
					sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					frame="border-border aspect-video w-full border-b"
				/>
			</ViewTransition>

			<div className="flex flex-1 flex-col p-6">
				<span className="text-muted-foreground font-mono text-[11px] tracking-[0.1em] uppercase">
					{TEMAS[guia.tema]}
				</span>

				<h2 className="mt-3 text-xl font-semibold tracking-tight">{guia.title}</h2>

				<p className="text-muted-foreground mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-pretty">
					{guia.description}
				</p>

				<div className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
					<time dateTime={guia.publishedAt}>{formatGuiaDate(guia.publishedAt)}</time>
					<span aria-hidden="true">·</span>
					<span>{guia.readingTimeMinutes} min</span>
				</div>
			</div>
		</Link>
	)
}

const SERVICIO_CHIPS = [
	{ slug: "todos", label: "Todas" },
	...SERVICES.map((service) => ({ slug: service.slug, label: service.shortName })),
]

export function GuiasExplorer({
	guias,
	initialServicio,
}: {
	guias: GuiaMeta[]
	initialServicio?: string
}): ReactNode {
	const initial = SERVICIO_CHIPS.some((chip) => chip.slug === initialServicio)
		? (initialServicio ?? "todos")
		: "todos"

	const [servicio, setServicio] = useState(initial)
	const [query, setQuery] = useState("")

	const results = useMemo(() => filterGuias(guias, { servicio, query }), [guias, servicio, query])

	function handleClear(): void {
		setServicio("todos")
		setQuery("")
	}

	if (guias.length === 0) return <GlobalEmptyState />

	return (
		<div>
			<div className="border-border flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<label htmlFor="guias-search" className="sr-only">
						Buscar
					</label>
					<Search
						className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
						aria-hidden="true"
					/>
					<input
						id="guias-search"
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Busca por tema o palabra clave"
						className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring/40 focus-visible:border-foreground/40 w-full rounded-sm border py-2.5 pr-4 pl-10 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
					/>
				</div>

				<div className="flex flex-wrap gap-2" aria-label="Filtrar por servicio">
					{SERVICIO_CHIPS.map((chip) => {
						const isActive = servicio === chip.slug
						// "todos" has no accent to scope to; the other chips pick up
						// their own service's colour for the active/hover state.
						const accentAttr = chip.slug === "todos" ? {} : { "data-service": chip.slug }
						return (
							<button
								key={chip.slug}
								type="button"
								aria-pressed={isActive}
								onClick={() => setServicio(chip.slug)}
								{...accentAttr}
								className={`focus-ring rounded-sm px-3.5 py-1.5 text-sm font-medium tracking-wide transition-colors duration-200 ${
									isActive
										? "bg-primary text-primary-foreground"
										: "border-border text-muted-foreground hover:border-primary/40 hover:text-primary border"
								}`}
							>
								{chip.label}
							</button>
						)
					})}
				</div>
			</div>

			{results.length === 0 ? (
				<div className="mt-10">
					<FilteredEmptyState onClear={handleClear} />
				</div>
			) : (
				<div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
					{results.map((guia) => (
						<GuiaCard key={guia.slug} guia={guia} />
					))}
				</div>
			)}
		</div>
	)
}
