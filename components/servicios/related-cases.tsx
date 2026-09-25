import { Kicker } from "@/components/corner-plus"
import GradientText from "@/components/gradient-text"
import { CutButton } from "@/components/cut-button"
import { CaseThumbnail } from "@/components/servicios/case-thumbnail"
import { portfolioProjects, type ProjectData } from "@/lib/portfolio-data"
import { brandGradientGreen } from "@/lib/gradient"
import { type Service } from "@/lib/services"
import { CASE_VISUAL_PREFIX, NAV_FORWARD, viewTransitionName } from "@/lib/view-transitions"
import { ArrowUpRight, Lock } from "lucide-react"
import Link from "next/link"
import { ViewTransition, type CSSProperties, type ReactNode } from "react"

const PANEL_RADIUS = "4px"

/**
 * One related case. The thumbnail is the same hand-built mockup `/casos`
 * uses — these systems are internal and under agreement, so the interface is
 * reconstructed rather than screenshotted, and says so when it applies.
 */
function CaseCard({ project }: { project: ProjectData }): ReactNode {
	const clip = { borderRadius: PANEL_RADIUS } as CSSProperties
	const caseStudy = project.caseStudy!
	const isConfidential = caseStudy.visualPrivacy === "confidential-ui"

	return (
		<Link
			href={`/casos/${project.id}`}
			transitionTypes={[NAV_FORWARD]}
			className="focus-ring group bg-border hover:bg-brand-blue/40 block p-px transition-colors duration-200"
			style={clip}
		>
			<article className="bg-background flex h-full flex-col overflow-hidden" style={clip}>
				<ViewTransition
					name={viewTransitionName(CASE_VISUAL_PREFIX, project.id)}
					share="morph"
					default="none"
				>
					<div className="border-border/60 bg-muted/40 relative aspect-[16/10] overflow-hidden border-b">
						<CaseThumbnail projectId={project.id} />

						{isConfidential ? (
							<span className="bg-background/85 text-muted-foreground absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase backdrop-blur-sm">
								<Lock className="h-3 w-3" aria-hidden="true" />
								Vista reconstruida
							</span>
						) : null}
					</div>
				</ViewTransition>

				<div className="flex flex-1 flex-col p-6 sm:p-7">
					<p className="text-primary text-xs font-medium">{caseStudy.clientName}</p>
					<h3 className="mt-2.5 flex items-start justify-between gap-3 text-lg font-semibold tracking-tight">
						{project.title}
						<ArrowUpRight
							aria-hidden="true"
							className="text-muted-foreground group-hover:text-primary mt-1 h-4 w-4 shrink-0 transition-colors duration-200"
						/>
					</h3>
					<p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
						{project.shortDescription}
					</p>
					<ul className="mt-6 flex flex-wrap gap-2">
						{project.technologies.slice(0, 3).map((tech) => (
							<li
								key={tech}
								className="border-border text-muted-foreground border border-dotted px-2.5 py-1 text-[11px] font-medium"
							>
								{tech}
							</li>
						))}
					</ul>
				</div>
			</article>
		</Link>
	)
}

export function ServicioCases({ service }: { service: Service }): ReactNode {
	const related = portfolioProjects
		.filter(
			(project) =>
				project.category === service.page.caseCategory &&
				project.isFlagship &&
				project.caseStudy &&
				project.isProduction !== false
		)
		.slice(0, 3)

	// Three of the four services have no published case in their own category, and an
	// empty state announcing that reads worse than the section's absence: it turns a
	// missing case into a message about missing cases, right where the copy should be
	// about the visitor's problem. A service with nothing to show renders nothing, and
	// the page keeps its own calls to action as the only ones on it.
	if (related.length === 0) return null

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
				<Kicker>Casos relacionados</Kicker>
				<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					Esto ya está{" "}
					<GradientText
						inline
						className="font-sans font-semibold tracking-tight"
						colors={brandGradientGreen}
						animationSpeed={6}
					>
						funcionando en producción
					</GradientText>
				</h2>
			</div>

			<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
				{related.map((project) => (
					<CaseCard key={project.id} project={project} />
				))}
			</div>
			<div className="mt-10 flex justify-center">
				<CutButton variant="outline" icon="arrow" href="/casos">
					Ver todos los casos
				</CutButton>
			</div>
		</section>
	)
}
