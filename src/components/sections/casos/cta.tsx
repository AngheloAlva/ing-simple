"use client"

import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"
import { easeOut, motion } from "motion/react"
import { useEffect, useState } from "react"

import DitherCursor from "@/components/shared/dither-cursor"

export function CasosCTA() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	return (
		<section className="px-6 py-24 md:py-36">
			<motion.div
				className="bg-ring relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 text-center text-black md:rounded-4xl md:px-12 md:py-24"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8, ease: easeOut }}
			>
				{!isMobile && <DitherCursor color="#00b864" radius={0.1} opacity={1} position="absolute" />}

				<div className="relative z-10">
					<motion.h2
						className="mx-auto mb-6 max-w-2xl text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-5xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
					>
						¿Tu proyecto puede ser el próximo?
					</motion.h2>

					<motion.p
						className="mx-auto mb-10 max-w-md text-lg text-white"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
					>
						Conversemos. Si tu problema se puede resolver con software, lo armamos y lo dejamos en
						producción.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
						className="inline-block"
					>
						<Link
							href="/contacto"
							className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-white py-3 pr-3 pl-5 font-medium text-black transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto"
						>
							<span>Hablemos de tu proyecto</span>
							<span className="bg-ring group-hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</section>
	)
}
