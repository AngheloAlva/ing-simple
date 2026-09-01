import type { CaseStudy, CaseStudyHeadline, CaseStudySectionKey } from "@/lib/portfolio-data"
import type { ReactNode } from "react"

const DEFAULT_HEADLINES: Record<CaseStudySectionKey, CaseStudyHeadline> = {
	solution: { lead: "Cómo lo", emphasis: "resolvimos" },
	architecture: { lead: "Cómo está", emphasis: "armado por dentro" },
	techStack: { lead: "No es solo qué usamos, es", emphasis: "por qué" },
	features: { lead: "Lo que se usa", emphasis: "todos los días" },
	timeline: {
		lead: "Del",
		emphasis: "kickoff a hoy",
		standfirst: "Cada hito del proyecto, desde el primer contacto hasta la operación actual.",
	},
	metrics: { lead: "Lo que cambió", emphasis: "en números" },
	beforeAfter: {
		lead: "El antes y el",
		emphasis: "después",
		standfirst: "Lo que cambia cuando la operación deja de vivir en planillas, correos y chats.",
	},
}

/** Headline for a section: the case's own copy when present, else the neutral default. */
export function resolveHeadline(caseStudy: CaseStudy, key: CaseStudySectionKey): CaseStudyHeadline {
	return caseStudy.sectionHeadlines?.[key] ?? DEFAULT_HEADLINES[key]
}

export const SECTION_H2_CLASS =
	"mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"

export const STANDFIRST_CLASS =
	"mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"

/** Section h2 with the shared headline signature: regular lead, one semibold emphasis. */
export function DetailH2({
	lead,
	emphasis,
	className = "",
}: {
	lead: string
	emphasis: string
	className?: string
}): ReactNode {
	return (
		<h2 className={`${SECTION_H2_CLASS} ${className}`.trim()}>
			{lead} <span className="font-sans font-semibold tracking-tight">{emphasis}</span>
		</h2>
	)
}
