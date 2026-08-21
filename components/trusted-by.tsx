import type { ReactNode } from "react"
import { LogoLoop, type LogoItem } from "@/components/logo-loop"

/** Client logos live in `public/img/logos/` in mixed formats (svg/png/avif/jpeg),
 *  so each entry carries its full filename. Names are used as the accessible
 *  label for each logo. */
type Client = { file: string; name: string }

const CLIENTS: Client[] = [
	{ file: "otc.svg", name: "OTC" },
	{ file: "turismochiletours.svg", name: "TurismoChileTours" },
	{ file: "falabella.svg", name: "Falabella" },
	{ file: "lider.png", name: "Líder" },
	{ file: "clinica-alemana.svg", name: "Clínica Alemana" },
	{ file: "busanc.avif", name: "Busanc" },
	{ file: "bimakers.avif", name: "BiMakers" },
	{ file: "bzconsulting.png", name: "BZ Consulting" },
	{ file: "caemp.png", name: "Grupo CAEMP" },
	{ file: "aiep.svg", name: "AIEP" },
	{ file: "club-hipico.svg", name: "Club Hípico" },
	{ file: "sgs.svg", name: "SGS" },
	{ file: "generadora-metropolitana.png", name: "Generadora Metropolitana" },
	{ file: "geobiota.png", name: "Geobiota" },
	{ file: "gestion-global.png", name: "Gestión Global" },
	{ file: "tecno-global.jpeg", name: "Tecno Global" },
	{ file: "traza.svg", name: "Traza" },
	{ file: "asicap.png", name: "Asicap" },
]

const LOGOS: LogoItem[] = CLIENTS.map((client) => ({
	src: `/img/logos/${client.file}`,
	alt: client.name,
	title: client.name,
}))

function CornerPlus({ className }: { className: string }): ReactNode {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={`pointer-events-none absolute h-3.5 w-3.5 text-blue-500 ${className}`}
		>
			<path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	)
}

export function TrustedBy(): ReactNode {
	return (
		<section className="mx-auto max-w-360 px-5 pb-32 sm:px-8 lg:px-10">
			<div className="border-border relative rounded-sm border">
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				<div className="flex flex-col items-stretch md:flex-row">
					<div className="border-border flex shrink-0 items-center justify-center border-b px-6 py-5 md:border-r md:border-b-0 md:py-7">
						<span className="text-muted-foreground text-xs font-medium">
							Empresas que confían en nosotros
						</span>
          </div>

					<div className="min-w-0 flex-1 px-6 py-6 md:py-7">
						<LogoLoop
							logos={LOGOS}
							speed={55}
							direction="left"
							logoHeight={40}
							gap={72}
							hoverSpeed={0}
							scaleOnHover
							fadeOut
							fadeOutColor="var(--background)"
							ariaLabel="Empresas que confían en IngSimple"
							className="[&_img]:opacity-55 [&_img]:brightness-0 [&_img]:grayscale [&_img]:transition-opacity [&_img]:duration-200 dark:[&_img]:invert [&_li:hover_img]:opacity-100"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
