import { CutButton } from "@/components/cut-button"
import { SELF_FRAMED_DIAGRAMS, SERVICE_DIAGRAMS } from "@/components/service-diagrams"
import { SERVICES } from "@/lib/services"
import { Plus } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

const CARD_CLIP = "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)"

export function Services(): ReactNode {
	const clip = { clipPath: CARD_CLIP } as CSSProperties

	return (
		<section className="mx-auto max-w-360 px-5 pb-32 sm:px-8 sm:pb-44 lg:px-10">
			<div className="max-w-2xl">
				<h2 className="text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
					Nuestras líneas de servicio
				</h2>
				<p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
					Cuatro áreas especializadas para acompañar tu transformación digital de forma integral.
				</p>
			</div>

			<div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24 lg:space-y-32">
				{SERVICES.map((service, index) => {
					const Diagram = SERVICE_DIAGRAMS[service.href]
					const selfFramed = SELF_FRAMED_DIAGRAMS.has(service.href)
					// Alternate sides on large screens; text stays first in the DOM for
					// a11y and reading order, only the visual column flips.
					const visualFirst = index % 2 === 1

					return (
						<div key={service.href} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
							{/* Text */}
							<div className={visualFirst ? "lg:order-2" : "lg:order-1"}>
								<p className="text-muted-foreground text-xs font-medium tracking-wide">
									<span className="text-primary">{service.number}</span>
									{" · "}
									{service.shortName}
								</p>
								<h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
									{service.featureTitle}
								</h3>
								<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
									{service.featureDesc}
								</p>

								<ul className="mt-6 space-y-2.5">
									{service.bullets.map((bullet) => (
										<li
											key={bullet}
											className="text-foreground/80 flex items-start gap-2.5 text-sm"
										>
											<Plus
												className="text-primary mt-0.5 h-4 w-4 shrink-0"
												strokeWidth={2}
												aria-hidden="true"
											/>
											<span>{bullet}</span>
										</li>
									))}
								</ul>

								<div className="mt-8">
									<CutButton href={service.href} variant="solid" icon="arrow">
										Ver más
									</CutButton>
								</div>
							</div>

							{/* Visual */}
							<div className={visualFirst ? "lg:order-1" : "lg:order-2"}>
								{selfFramed ? (
									<div className="flex justify-center">{Diagram ? <Diagram /> : null}</div>
								) : (
									<div className="bg-border p-px" style={clip}>
										<div
											className="bg-muted/30 text-muted-foreground flex aspect-16/10 items-center justify-center p-8"
											style={clip}
										>
											{Diagram ? <Diagram /> : null}
										</div>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</section>
	)
}
