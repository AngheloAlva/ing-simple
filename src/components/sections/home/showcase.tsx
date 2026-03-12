"use client"

import { motion, useMotionValue, useAnimationFrame, easeOut } from "motion/react"
import { useRef, useState, useEffect } from "react"
import { ChevronRightIcon } from "lucide-react"
import Image from "next/image"

const SHOWCASE_ITEMS = [
	{
		id: 1,
		image:
			"https://cdn.dribbble.com/userupload/46030284/file/8dfdc9a8b09fdbd99b010c1dcb279841.jpg?resize=1024x1693&vertical=center",
		height: "h-[400px]",
		bgColor: "bg-rose-500/30",
	},
	{
		id: 2,
		image:
			"https://cdn.dribbble.com/userupload/46029941/file/f3b0e906d38980bf48e008f5542a58b5.jpg?resize=1024x1693&vertical=center",
		height: "h-[450px]",
		bgColor: "bg-lime-500/30",
	},
	{
		id: 3,
		image:
			"https://cdn.dribbble.com/userupload/45777759/file/acf14657b38cd25e64bb16b4f201bef8.jpg?resize=1024x1529&vertical=center",
		height: "h-[420px]",
		bgColor: "bg-blue-500/30",
	},
	{
		id: 4,
		image:
			"https://cdn.dribbble.com/userupload/46068721/file/3910087a60fe6f781ddae7c14daf1804.jpg?resize=1024x1589&vertical=center",
		height: "h-[380px]",
		bgColor: "bg-neutral-500",
	},
]

export function Showcase() {
	const [isDragging, setIsDragging] = useState(false)
	const [hoveredId, setHoveredId] = useState<number | null>(null)
	const [oneSetWidth, setOneSetWidth] = useState(0)

	const baseVelocity = -20
	const baseX = useMotionValue(0)
	const scrollVelocity = useRef(baseVelocity)
	const scrollerRef = useRef<HTMLDivElement>(null)

	const items = [
		...SHOWCASE_ITEMS,
		...SHOWCASE_ITEMS,
		...SHOWCASE_ITEMS,
		...SHOWCASE_ITEMS,
		...SHOWCASE_ITEMS,
		...SHOWCASE_ITEMS,
	]

	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth < 640
			const itemWidth = isMobile ? 280 : 320
			const gap = 24
			const width = (itemWidth + gap) * SHOWCASE_ITEMS.length
			setOneSetWidth(width)

			baseX.set(-width)
		}

		handleResize()
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [baseX])

	useAnimationFrame((_, delta) => {
		if (!oneSetWidth) return

		if (!isDragging) {
			scrollVelocity.current = scrollVelocity.current * 0.9 + baseVelocity * 0.1

			const moveBy = scrollVelocity.current * (delta / 1000)
			baseX.set(baseX.get() + moveBy)

			const x = baseX.get()
			if (x <= -oneSetWidth * 2) {
				baseX.set(x + oneSetWidth)
			} else if (x > 0) {
				baseX.set(x - oneSetWidth)
			}
		}
	})

	return (
		<section className="w-full px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="max-w-xl">
						<p className="text-muted-foreground mb-2 text-sm sm:text-base">Portafolio</p>
						<h2 className="text-feature mb-8 text-3xl leading-[1.15] font-medium tracking-tight sm:mb-10 sm:text-4xl md:text-5xl">
							Proyectos que transforman negocios y equipos.
						</h2>

						<motion.a
							href="/portafolio"
							className="group bg-foreground text-background inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							whileHover={{ scale: 1.02 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
						>
							<span>Ver Portafolio Completo</span>
							<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</motion.a>
					</div>
				</motion.div>

				{/* Infinite Carousel */}
				<div className="relative -mx-4 overflow-hidden py-20 sm:-mx-6 lg:-mx-8">
					<motion.div
						ref={scrollerRef}
						className="flex cursor-grab items-end gap-6 active:cursor-grabbing"
						style={{ x: baseX }}
						drag="x"
						onDragStart={() => setIsDragging(true)}
						onDragEnd={(_, info) => {
							setIsDragging(false)
							scrollVelocity.current = info.velocity.x
						}}
						dragElastic={0.05}
						dragMomentum={false}
					>
						{items.map((item, index) => (
							<motion.div
								key={`${item.id}-${index}`}
								className={`w-70 shrink-0 sm:w-[320px] ${item.height} pointer-events-auto relative overflow-hidden rounded-2xl select-none`}
								initial={{ rotateX: 0, opacity: 1 }}
								animate={
									hoveredId === index
										? {
												scale: 1.05,
												rotateX: -15,
												y: -25,
												zIndex: 50,
											}
										: {
												scale: 1,
												rotateX: 0,
												y: 0,
												zIndex: 1,
											}
								}
								transition={{
									duration: 0.3,
									ease: "backOut",
									zIndex: { delay: hoveredId === index ? 0 : 0.4 },
								}}
								onMouseEnter={() => setHoveredId(index)}
								onMouseLeave={() => setHoveredId(null)}
								style={{ transformPerspective: 1000 }}
							>
								<div className={`h-full w-full ${item.bgColor}`}>
									<Image
										width={500}
										height={1000}
										src={item.image}
										alt="Showcase item"
										className="pointer-events-none h-full w-full object-cover object-top"
										draggable="false"
									/>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	)
}
