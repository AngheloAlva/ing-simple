"use client"

import { ArrowUpRight, ChevronRightIcon } from "lucide-react"
import { easeOut, motion } from "motion/react"

const cards = [
	{
		title: "Inicio",
		icon: "circles",
	},
	{
		title: "Servicios",
		icon: "starburst",
	},
	{
		title: "Contactanos",
		icon: "slider",
	},
]

const CirclesIcon = () => (
	<svg
		viewBox="0 0 240 240"
		fill="none"
		className="h-full w-full"
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Concentric circles */}
		<circle
			cx="120"
			cy="120"
			r="80"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<circle
			cx="120"
			cy="120"
			r="60"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<circle cx="120" cy="120" r="40" stroke="oklch(0.6864 0.175052 153.4541)" strokeWidth="2" />
		<circle cx="120" cy="120" r="20" fill="oklch(0.6864 0.175052 153.4541)" />
	</svg>
)

const StarburstIcon = () => (
	<svg
		viewBox="0 0 240 240"
		fill="none"
		className="h-full w-full"
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Wavy lines */}
		<path
			d="M 40 60 Q 80 40, 120 60 T 200 60"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<path
			d="M 40 100 Q 80 80, 120 100 T 200 100"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<path
			d="M 40 140 Q 80 120, 120 140 T 200 140"
			stroke="oklch(0.6864 0.175052 153.4541)"
			strokeWidth="2.5"
		/>
		<path
			d="M 40 180 Q 80 160, 120 180 T 200 180"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
	</svg>
)

const SliderIcon = () => (
	<svg
		viewBox="0 0 240 240"
		fill="none"
		className="h-full w-full"
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Diagonal steps */}
		<rect
			x="40"
			y="140"
			width="40"
			height="40"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<rect
			x="90"
			y="100"
			width="40"
			height="40"
			stroke="#d4d4d4"
			strokeWidth="1.5"
			className="dark:stroke-neutral-700"
		/>
		<rect x="140" y="60" width="40" height="40" fill="oklch(0.6864 0.175052 153.4541)" />
		<circle cx="200" cy="35" r="20" stroke="oklch(0.6864 0.175052 153.4541)" strokeWidth="2" />
	</svg>
)

export default function NotFound() {
	return (
		<section className="flex min-h-screen w-full items-center bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-neutral-950">
			<div className="mx-auto w-full max-w-350">
				{/* Top Section - 404 and Content */}
				<div className="mb-16 grid grid-cols-1 items-start gap-8 sm:mb-20 md:grid-cols-[15%_85%] lg:mb-24">
					{/* Left Column - 404 Label */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center gap-2 pt-2"
					>
						<div className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />
						<span className="text-sm font-medium text-neutral-900 dark:text-white">404</span>
					</motion.div>

					{/* Right Column - Main Content */}
					<div className="flex flex-col gap-2">
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="text-3xl font-medium tracking-tight text-neutral-400 sm:text-4xl md:text-5xl lg:text-6xl dark:text-neutral-600"
						>
							Oops!
						</motion.h1>

						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="mb-4 text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
						>
							Esa página no parece existir.
						</motion.h2>

						<motion.a
							href="/"
							className="group mt-8 inline-flex w-fit items-center justify-center gap-3 rounded-md bg-white py-2 pr-3 pl-5 font-medium text-white shadow-lg shadow-white/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg hover:shadow-white/40 dark:text-black"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
						>
							<span>Ir al inicio</span>
							<span className="bg-background flex h-10 w-10 items-center justify-center rounded-full text-base transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4 text-neutral-900 dark:text-white" />
							</span>
						</motion.a>
					</div>
				</div>

				{/* Cards Grid */}
				<div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
					{cards.map((card, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
							className="group relative flex flex-col justify-between rounded-2xl bg-neutral-100 p-6 transition-colors duration-300 hover:bg-neutral-200 sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:hover:bg-neutral-800"
						>
							{/* Icon */}
							<div className="flex h-48 w-full items-center justify-center sm:h-64">
								{card.icon === "circles" && <CirclesIcon />}
								{card.icon === "starburst" && <SliderIcon />}
								{card.icon === "slider" && <StarburstIcon />}
							</div>

							{/* Bottom Section */}
							<div className="flex items-center justify-between">
								<div className="flex items-baseline gap-1">
									<span className="text-xl font-medium text-neutral-900 dark:text-white">
										{card.title}
									</span>
								</div>

								<button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform duration-200 hover:scale-110 sm:h-12 sm:w-12 dark:bg-white dark:text-neutral-900">
									<ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
