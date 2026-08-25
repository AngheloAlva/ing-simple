"use client"

import { CornerPlus, Kicker, PlusSvg } from "@/components/corner-plus"
import { useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

export function ServicioProblem({
	problem,
	audience,
}: {
	problem: string
	audience: string[]
}): ReactNode {
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				className="border-border relative grid border-y lg:grid-cols-[1.1fr_0.9fr]"
			>
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				{/* Left: the pain this service removes */}
				<div className="border-border border-b py-10 lg:border-r lg:border-b-0 lg:py-16 lg:pr-14">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>El problema</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 max-w-lg font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl"
					>
						Te suena, ¿verdad?
					</motion.h2>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-6 max-w-xl text-[15px] leading-relaxed sm:text-base"
					>
						{problem}
					</motion.p>
				</div>

				{/* Right: who should recognize themselves here */}
				<div className="relative py-10 lg:py-16 lg:pl-14">
					<CornerPlus className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
					<CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />

					<motion.h3
						variants={item}
						transition={itemTransition}
						className="text-sm font-semibold tracking-tight"
					>
						¿Para quién es este servicio?
					</motion.h3>
					<ul className="mt-5 space-y-2.5">
						{audience.map((profile) => (
							<motion.li
								key={profile}
								variants={item}
								transition={itemTransition}
								className="flex items-start gap-3"
							>
								<PlusSvg className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
								<span className="text-muted-foreground text-sm leading-relaxed">{profile}</span>
							</motion.li>
						))}
					</ul>
				</div>
			</motion.div>
		</section>
	)
}
