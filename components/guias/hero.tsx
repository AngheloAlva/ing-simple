import type { ReactNode } from "react"

import { Kicker } from "@/components/corner-plus"

export function GuiasHero(): ReactNode {
	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
				<div className="mx-auto flex max-w-2xl flex-col items-center pt-32 pb-16 text-center sm:pt-40">
					<Kicker>Guías</Kicker>

					<h1 className="mt-5 font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]">
						Ideas concretas para{" "}
						<span className="font-sans font-semibold tracking-tight">avanzar sin enredarte</span>
					</h1>

					<p className="text-muted-foreground mt-5 max-w-xl text-[15px] leading-relaxed text-balance sm:text-base">
						Guías prácticas sobre IA, cumplimiento, reportabilidad y automatización, pensadas para
						pymes que quieren dar el próximo paso sin depender de un tercero para cada decisión.
					</p>
				</div>
			</div>
		</section>
	)
}
