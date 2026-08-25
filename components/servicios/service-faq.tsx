"use client"

import { CornerPlus, Kicker } from "@/components/corner-plus"
import { softEase, useStaggerEntrance } from "@/lib/motion"
import type { ServiceFaqItem } from "@/lib/services"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

function FaqItem({
	item,
	isOpen,
	onToggle,
	index,
}: {
	item: ServiceFaqItem
	isOpen: boolean
	onToggle: () => void
	index: number
}): ReactNode {
	const panelId = `servicio-faq-panel-${index}`
	const buttonId = `servicio-faq-button-${index}`
	const { item: entrance, itemTransition } = useStaggerEntrance()

	return (
		<motion.div
			variants={entrance}
			transition={itemTransition}
			className="group border-border hover:border-primary/40 border-dotted transition-colors duration-200 [&:not(:first-child)]:border-t"
		>
			<h3>
				<button
					id={buttonId}
					type="button"
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={onToggle}
					className="focus-ring flex w-full items-center justify-between gap-6 py-5 pr-1 text-left lg:py-6 lg:pl-12"
				>
					<span className="text-base font-medium tracking-tight sm:text-lg">{item.q}</span>
					<motion.span
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.3, ease: softEase }}
						className="text-muted-foreground group-hover:text-foreground shrink-0 transition-colors duration-200"
					>
						<ChevronDown className="h-5 w-5" aria-hidden="true" />
					</motion.span>
				</button>
			</h3>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						id={panelId}
						role="region"
						aria-labelledby={buttonId}
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4, ease: softEase }}
						className="overflow-hidden"
					>
						<p className="text-muted-foreground max-w-xl pr-6 pb-6 text-sm leading-relaxed lg:pl-12">
							{item.a}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export function ServicioFaq({
	serviceName,
	items,
}: {
	serviceName: string
	items: ServiceFaqItem[]
}): ReactNode {
	const [openIndex, setOpenIndex] = useState<number | null>(0)
	const accordionRef = useRef<HTMLDivElement | null>(null)
	const [minHeight, setMinHeight] = useState<number | undefined>(undefined)
	const { container, item, itemTransition, viewport } = useStaggerEntrance()

	useEffect(() => {
		const node = accordionRef.current
		if (node === null) return

		let peak = 0
		let width = node.offsetWidth

		const observer = new ResizeObserver(() => {
			if (node.offsetWidth !== width) {
				width = node.offsetWidth
				peak = 0
				setMinHeight(undefined)
				return
			}
			const next = node.offsetHeight
			if (next > peak) {
				peak = next
				setMinHeight(next)
			}
		})

		observer.observe(node)
		return () => observer.disconnect()
	}, [])

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				className="border-border relative grid border-y lg:grid-cols-[0.85fr_1.15fr]"
			>
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				{/* Left: heading */}
				<div className="border-border border-b py-10 lg:border-r lg:border-b-0 lg:py-16 lg:pr-12">
					<motion.div variants={item} transition={itemTransition}>
						<Kicker>Antes de conversar</Kicker>
					</motion.div>
					<motion.h2
						variants={item}
						transition={itemTransition}
						className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						Preguntas frecuentes
					</motion.h2>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-6 max-w-sm text-sm leading-relaxed sm:text-base"
					>
						Lo que más nos preguntan sobre {serviceName.toLowerCase()}. ¿Falta la tuya? Escríbenos y
						te respondemos.
					</motion.p>
				</div>

				{/* Right: accordion */}
				<div
					ref={accordionRef}
					className="relative"
					style={minHeight !== undefined ? { minHeight } : undefined}
				>
					<CornerPlus className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
					<CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
					{items.map((entry, i) => (
						<FaqItem
							key={entry.q}
							item={entry}
							index={i}
							isOpen={openIndex === i}
							onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
						/>
					))}
				</div>
			</motion.div>
		</section>
	)
}
