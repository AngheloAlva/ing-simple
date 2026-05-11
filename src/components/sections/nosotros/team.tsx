"use client"

import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useEffect, useRef } from "react"

export const teamMembers = [
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
	{ name: "Nombre Apellido", role: "Rol del Integrante", linkedin: "#" },
]

export function Team() {
	const x = useMotionValue(0)
	const trackRef = useRef<HTMLDivElement>(null)
	const maxScroll = useMotionValue(1)

	const progressScale = useTransform(x, (v) => {
		const max = maxScroll.get()
		if (max <= 0) return 1
		return Math.min(1, Math.max(0, -v / max))
	})

	const targetX = useRef(0)
	const animRef = useRef<ReturnType<typeof animate> | null>(null)

	useEffect(() => {
		const update = () => {
			const track = trackRef.current
			if (!track) return
			const viewWidth = track.parentElement?.clientWidth ?? 0
			const next = Math.max(0, track.scrollWidth - viewWidth)
			if (next !== maxScroll.get()) maxScroll.set(next)
		}
		update()
		const ro = new ResizeObserver(update)
		if (trackRef.current) {
			ro.observe(trackRef.current)
			if (trackRef.current.parentElement) ro.observe(trackRef.current.parentElement)
		}
		return () => {
			ro.disconnect()
			animRef.current?.stop()
		}
	}, [maxScroll])

	const step = () => {
		const first = trackRef.current?.firstElementChild as HTMLElement | null
		const gap = 16
		return (first?.offsetWidth ?? 300) + gap
	}

	const runTo = (value: number) => {
		targetX.current = value
		animRef.current?.stop()
		animRef.current = animate(x, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] })
	}

	const prev = () => {
		runTo(Math.min(0, targetX.current + step()))
	}
	const next = () => {
		const trackWidth = trackRef.current?.scrollWidth ?? 0
		const viewWidth = trackRef.current?.parentElement?.clientWidth ?? 0
		const min = Math.min(0, viewWidth - trackWidth)
		runTo(Math.max(min, targetX.current - step()))
	}

	return (
		<section className="bg-background flex w-full items-start overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[0.4fr_2fr] lg:gap-12">
					<motion.span
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="inline-flex w-fit items-center gap-2 rounded bg-orange-200 px-2 py-1 text-xs font-medium text-neutral-900 lg:mt-2 dark:bg-orange-300/20 dark:text-orange-200"
					>
						<span className="h-2 w-2 rounded-sm bg-orange-500" />
						EQUIPO
					</motion.span>

					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-foreground max-w-4xl text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl"
					>
						Un equipo apasionado por la tecnología, obsesionado con los detalles que la mayoría pasa
						por alto, y comprometido con entregar las soluciones que las organizaciones realmente
						necesitan.
					</motion.h2>
				</div>

				<div className="relative mt-12">
					<div className="overflow-hidden">
						<motion.div ref={trackRef} style={{ x }} className="flex gap-4">
							{teamMembers.map((m, i) => (
								<article
									key={`${m.name}-${i}`}
									className="border-border bg-muted flex h-70 w-[calc(100%-0px)] shrink-0 flex-col rounded-[20px] border p-3 sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
								>
									<div className="p-2">
										<p className="text-foreground text-lg font-medium">{m.name}</p>
										<p className="text-muted-foreground mt-1 text-[11px] tracking-[0.15em] uppercase">
											{m.role}
										</p>
									</div>

									<div className="mt-auto flex items-center justify-between pl-2">
										<span className="text-muted-foreground text-[11px] font-semibold tracking-[0.15em] uppercase">
											LinkedIn
										</span>
										<a
											href={m.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="grid h-9 w-9 place-items-center rounded-lg bg-orange-300 text-neutral-900 transition-colors hover:bg-orange-400"
											aria-label={`LinkedIn de ${m.name}`}
										>
											<ArrowUpRight className="h-4 w-4" />
										</a>
									</div>
								</article>
							))}
						</motion.div>
					</div>

					<div className="mt-6 flex items-center justify-between gap-4">
						<div className="bg-muted relative h-px flex-1 overflow-hidden">
							<motion.div
								className="bg-foreground absolute inset-y-0 right-0 left-0 origin-left"
								style={{ scaleX: progressScale }}
							/>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={prev}
								className="border-border bg-muted text-muted-foreground hover:bg-background grid h-10 w-10 cursor-pointer place-items-center rounded-lg border transition-colors"
								aria-label="Anterior"
							>
								<ArrowLeft className="h-4 w-4" />
							</button>
							<button
								onClick={next}
								className="border-border bg-muted text-muted-foreground hover:bg-background grid h-10 w-10 cursor-pointer place-items-center rounded-lg border transition-colors"
								aria-label="Siguiente"
							>
								<ArrowRight className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
