import { Kicker } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { ScrollStack } from "@/components/scroll-stack"
import { SERVICE_VISUALS } from "@/components/service-diagrams"
import { SERVICES } from "@/lib/services"
import { Plus } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

/**
 * Home services section: the four service lines as a scroll-driven card
 * stack, each with the interactive artefact of that service.
 */

const CARD_CLIP = "polygon(0 0, calc(100% - 34px) 0, 100% 34px, 100% 100%, 0 100%)"

export function ServicesStack(): ReactNode {
	const clip = { clipPath: CARD_CLIP } as CSSProperties

	return (
		<section id="servicios" className="scroll-mt-24 pb-32 sm:pb-44">
			<div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
				<div className="max-w-2xl">
					<Kicker>Qué hacemos</Kicker>
					<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
						Cuatro líneas de servicio,{" "}
						<span className="font-sans font-semibold tracking-tight">una sola operación</span>
					</h2>
					<p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
						No son cuatro proveedores distintos. Cada línea resuelve un frente de tu operación y
						todas dejan lo mismo: algo funcionando y un equipo capaz de mantenerlo.
					</p>
				</div>
			</div>

			<ScrollStack
				variant="stack"
				scrollLength={0.9}
				peek={22}
				scaleStep={0.05}
				blur={3}
				dim={0.2}
				depth={3}
				cardWidth={1360}
				cardHeight={0.74}
				borderRadius={0}
				flowBelowLg
				className="mt-10 lg:-mt-20 lg:mt-0"
			>
				{SERVICES.map((service) => {
					const Diagram = SERVICE_VISUALS[service.href]

					return (
						<article key={service.href} className="bg-border w-full p-px lg:h-full" style={clip}>
							<div
								className="bg-muted dark:bg-card grid w-full items-center gap-8 overflow-hidden p-8 sm:p-10 lg:h-full lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:gap-14 lg:p-14"
								style={clip}
							>
								<div className="min-w-0">
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

								<div className="flex min-w-0 justify-center">{Diagram ? <Diagram /> : null}</div>
							</div>
						</article>
					)
				})}
			</ScrollStack>
		</section>
	)
}
