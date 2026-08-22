import { ChallengeCard } from "@/components/challenge-card"
import GradientText from "@/components/gradient-text"
import { brandGradient } from "@/lib/gradient"
import { Kicker } from "@/components/corner-plus"
import { DiagramGenericTool } from "@/components/diagrams/challenge/generic-tool"
import { DiagramManualSteps } from "@/components/diagrams/challenge/manual-steps"
import { DiagramScatteredData } from "@/components/diagrams/challenge/scattered-data"
import { DiagramSinglePoint } from "@/components/diagrams/challenge/single-point"
import type { ReactNode } from "react"

export function Challenge(): ReactNode {
	return (
		<section className="mx-auto max-w-360 px-5 pb-32 sm:px-8 sm:pb-44 lg:px-10">
			<div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
				{/* Voice tile: deliberately borderless so the four problems read as
            the only objects in the grid. */}
				<div className="flex flex-col justify-center lg:col-span-2 lg:pr-10">
					<div className="flex items-center gap-2">
						<Kicker>El desafío</Kicker>
					</div>
					<h2 className="mt-5 max-w-2xl font-serif text-3xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
						Digitalizar tu negocio te da una ventaja real, pero cada herramienta suelta suma otra{" "}
						<GradientText
							inline
							className="font-sans font-semibold tracking-tight"
							colors={brandGradient}
							animationSpeed={6}
						>
							isla que nadie conecta
						</GradientText>
					</h2>
				</div>

				<ChallengeCard
					title="Datos dispersos"
					body="La información vive repartida en planillas y sistemas que no se hablan entre sí. Sin una vista clara, las decisiones se toman a ciegas."
				>
					<DiagramScatteredData />
				</ChallengeCard>

				<ChallengeCard
					title="Procesos manuales"
					body="Tareas repetitivas que consumen horas del equipo y deberían estar automatizadas, escalando errores en lugar de resultados."
				>
					<DiagramManualSteps />
				</ChallengeCard>

				<ChallengeCard
					title="Herramientas que no encajan"
					body="Pagas por un sistema genérico que cubre una parte y te obliga a adaptar el proceso a la herramienta, en lugar de al revés."
				>
					<DiagramGenericTool />
				</ChallengeCard>

				<ChallengeCard
					title="Conocimiento que no circula"
					body="Todo depende de quien sabe cómo se hace. Si esa persona no está, el proceso se frena y nadie puede retomarlo."
				>
					<DiagramSinglePoint />
				</ChallengeCard>
			</div>
		</section>
	)
}
