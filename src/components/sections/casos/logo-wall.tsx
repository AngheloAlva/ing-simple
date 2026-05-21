"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const UNIQUE_CLIENT_LOGOS = [
	{ name: "OTC", src: "/img/logos/otc.svg", invertOnDark: false },
	{ name: "Busanc", src: "/img/logos/busanc.avif", invertOnDark: false },
	{ name: "TurismoChileTours", src: "/img/logos/turismochiletours.svg", invertOnDark: true },
	{ name: "Bimakers", src: "/img/logos/bimakers.avif", invertOnDark: false },
	{ name: "BZ Consulting", src: "/img/logos/bzconsulting.png", invertOnDark: false },
	{ name: "AIEP", src: "/img/logos/aiep.svg", invertOnDark: false },
]

export function CasosLogoWall() {
	return (
		<section className="border-border/60 border-y px-4 py-12 sm:px-6">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
				<motion.span
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase"
				>
					Clientes que confían en nosotros
				</motion.span>
				<motion.ul
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16"
				>
					{UNIQUE_CLIENT_LOGOS.map((logo) => (
						<li key={logo.name} className="flex h-10 items-center sm:h-12">
							<Image
								src={logo.src}
								alt={logo.name}
								width={120}
								height={48}
								className={cn(
									"h-full w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0",
									logo.invertOnDark && "dark:invert"
								)}
							/>
						</li>
					))}
				</motion.ul>
			</div>
		</section>
	)
}
