import type { ReactNode } from "react"
import { CornerPlus } from "@/components/corner-plus"
import { LogoLoop, type LogoItem } from "@/components/logo-loop"

/** Client logos live in `public/img/logos/` in mixed formats (svg/png/avif/jpeg),
 *  so each entry carries its full filename. Names are used as the accessible
 *  label for each logo.
 *
 *  Every file is a transparent cut-out, but they come in two kinds:
 *  - single-colour marks (white or coloured): `brightness-0` turns them into a
 *    clean black silhouette (inverted to white in dark mode);
 *  - artwork with internal contrast (white text on a dark shape, a white box
 *    behind the mark): `brightness-0` would flatten them into a blob, so they
 *    are flagged `blend` and rendered in greyscale with a blend mode instead —
 *    multiply drops white against the light background, screen drops black in
 *    dark mode — which keeps their internal contrast. */
type Client = { file: string; name: string; blend?: boolean }

const CLIENTS: Client[] = [
	{ file: "otc.svg", name: "OTC" },
	{ file: "turismochiletours.svg", name: "TurismoChileTours" },
	{ file: "falabella.svg", name: "Falabella" },
	{ file: "lider.png", name: "Líder" },
	{ file: "clinica-alemana.svg", name: "Clínica Alemana" },
	{ file: "busanc.avif", name: "Busanc" },
	{ file: "bimakers.avif", name: "BiMakers" },
	{ file: "bzconsulting.png", name: "BZ Consulting" },
	{ file: "caemp.png", name: "Grupo CAEMP", blend: true },
	{ file: "aiep.svg", name: "AIEP" },
	{ file: "udp.png", name: "Universidad Diego Portales" },
	{ file: "club-hipico.svg", name: "Club Hípico" },
	{ file: "sgs.svg", name: "SGS" },
	{ file: "generadora-metropolitana.png", name: "Generadora Metropolitana" },
	{ file: "geobiota.png", name: "Geobiota" },
	{ file: "gestion-global.png", name: "Gestión Global" },
	{ file: "tecno-global.jpeg", name: "Tecno Global" },
	{ file: "traza.svg", name: "Traza" },
	{ file: "asicap.png", name: "Asicap" },
]

const SILHOUETTE = "brightness-0 dark:invert"
const BLEND = "grayscale contrast-125 mix-blend-multiply dark:invert dark:mix-blend-screen"

const LOGOS: LogoItem[] = CLIENTS.map((client) => ({
	node: (
		<img
			src={`/img/logos/${client.file}`}
			alt={client.name}
			title={client.name}
			loading="lazy"
			decoding="async"
			draggable={false}
			className={`pointer-events-none block h-[var(--logoloop-logoHeight)] w-auto object-contain ${client.blend ? BLEND : SILHOUETTE}`}
		/>
	),
	title: client.name,
	ariaLabel: client.name,
}))

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
							className="[&_img]:opacity-55 [&_img]:transition-opacity [&_img]:duration-200 [&_li:hover_img]:opacity-100"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
