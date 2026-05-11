"use client"

import { easeOut, motion } from "motion/react"

interface LoadMoreButtonProps {
	onClick: () => void
}

export function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
	return (
		<motion.div
			className="mt-10 flex justify-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
		>
			<button
				onClick={onClick}
				className="group bg-accent inline-flex cursor-pointer items-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg"
			>
				<span>Ver más proyectos</span>
				<span className="text-accent flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path
							d="M6 3L11 8L6 13"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</button>
		</motion.div>
	)
}
