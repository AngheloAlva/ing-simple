"use client"

import { motion, AnimatePresence, easeOut } from "motion/react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export interface CardData {
	/** Unique identifier for the card */
	id: string
	/** Image URL for the card */
	imageUrl: string
	/** Title displayed on the card overlay */
	title: string
	/** Description shown when card is expanded */
	description: string
	/** Optional gradient color for the backdrop (defaults to purple #6366f1) */
	gradientColor?: string
	/** Short description displayed on the card overlay */
	shortDescription?: string
	/** Category badge displayed on the card overlay */
	category?: string
	/** Technology tags shown in the expanded modal */
	technologies?: string[]
	/** URL to live site, shown as button in expanded modal */
	liveUrl?: string
	/** URL to GitHub repo, shown as button in expanded modal */
	githubUrl?: string
}

export interface ModalCardsProps {
	/** Array of card data to display */
	cards?: CardData[]
	/** Additional CSS classes for the container */
	className?: string
	/** Default gradient color for all cards (can be overridden per card) */
	gradientColor?: string
	/** Animation speed preset (default: "normal") */
	animationSpeed?: "slow" | "normal" | "fast" | "none"
	/** Override spring stiffness for animations */
	springStiffness?: number
	/** Override spring damping for animations */
	springDamping?: number
	/** Animation variant for modal entry (default: "scale") */
	animationVariant?: "scale" | "fade" | "slide"
	/** Close modal when clicking backdrop (default: true) */
	closeOnBackdropClick?: boolean
	/** Close modal when pressing Escape key (default: true) */
	closeOnEscape?: boolean
	/** Show close button in modal (default: true) */
	showCloseButton?: boolean
	/** Aria label for modal accessibility */
	ariaLabel?: string
	/** Position of backdrop gradient (default: "50% 10%") */
	backdropGradientPosition?: string
	/** Custom CSS classes for modal container */
	modalClassName?: string
	/** Custom CSS classes for backdrop */
	backdropClassName?: string
}

const ANIMATION_SPEEDS = {
	slow: { duration: 0.6, springStiffness: 200, springDamping: 25 },
	normal: { duration: 0.4, springStiffness: 300, springDamping: 30 },
	fast: { duration: 0.2, springStiffness: 400, springDamping: 35 },
	none: { duration: 0, springStiffness: 500, springDamping: 50 },
}

const ModalCards = ({
	cards = [],
	className,
	gradientColor = "#6366f1",
	animationSpeed = "normal",
	springStiffness,
	springDamping,
	animationVariant = "scale",
	closeOnBackdropClick = true,
	closeOnEscape = true,
	showCloseButton = true,
	ariaLabel = "Card details modal",
	backdropGradientPosition = "50% 10%",
	modalClassName,
	backdropClassName,
}: ModalCardsProps) => {
	const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
	const [mounted, setMounted] = useState(false)
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

	const speedConfig = ANIMATION_SPEEDS[animationSpeed]
	const finalStiffness = springStiffness ?? speedConfig.springStiffness
	const finalDamping = springDamping ?? speedConfig.springDamping
	const isAnimationDisabled = animationSpeed === "none"

	const springTransition = {
		type: "spring" as const,
		stiffness: finalStiffness,
		damping: finalDamping,
	}

	const smoothSpring = {
		type: "spring" as const,
		stiffness: finalStiffness * 1.3,
		damping: finalDamping * 1.2,
	}

	const softSpring = {
		type: "spring" as const,
		stiffness: finalStiffness * 0.7,
		damping: finalDamping * 0.9,
	}

	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (selectedCard) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}

		return () => {
			document.body.style.overflow = ""
		}
	}, [selectedCard])

	useEffect(() => {
		if (!closeOnEscape || !selectedCard) return

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setSelectedCard(null)
			}
		}

		document.addEventListener("keydown", handleEscape)
		return () => document.removeEventListener("keydown", handleEscape)
	}, [selectedCard, closeOnEscape])

	const handleClose = () => {
		if (closeOnBackdropClick) {
			setSelectedCard(null)
		}
	}

	const handleImageLoad = (id: string) => {
		setLoadedImages((prev) => {
			const newSet = new Set(prev)
			newSet.add(id)
			return newSet
		})
	}

	const getInitialAnimation = () => {
		if (isAnimationDisabled) return { opacity: 1 }

		switch (animationVariant) {
			case "fade":
				return { opacity: 0 }
			case "slide":
				return { opacity: 0, y: 50 }
			case "scale":
			default:
				return { opacity: 0, scale: 0.9 }
		}
	}

	const getAnimateAnimation = () => {
		if (isAnimationDisabled) return { opacity: 1 }

		switch (animationVariant) {
			case "fade":
				return { opacity: 1 }
			case "slide":
				return { opacity: 1, y: 0 }
			case "scale":
			default:
				return { opacity: 1, scale: 1 }
		}
	}

	const getExitAnimation = () => {
		if (isAnimationDisabled) return { opacity: 1 }

		switch (animationVariant) {
			case "fade":
				return { opacity: 0 }
			case "slide":
				return { opacity: 0, y: 50 }
			case "scale":
			default:
				return { opacity: 0, scale: 0.9 }
		}
	}

	return (
		<div className={cn("@container relative w-full", className)}>
			<div className="grid grid-cols-1 gap-6 p-4 @md:grid-cols-2 @xl:grid-cols-3">
				{cards.map((card) => (
					<motion.div
						key={card.id}
						layoutId={`card-${card.id}`}
						onClick={() => setSelectedCard(card)}
						className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl"
						whileTap={isAnimationDisabled ? { scale: 1 } : { scale: 0.98 }}
						transition={isAnimationDisabled ? { duration: 0 } : smoothSpring}
					>
						<motion.img
							layoutId={`image-${card.id}`}
							src={card.imageUrl}
							alt={card.title}
							className={cn(
								"h-full w-full object-cover transition-opacity duration-500",
								loadedImages.has(card.id) ? "opacity-100" : "opacity-0"
							)}
							onLoad={() => handleImageLoad(card.id)}
						/>

						{card.category && (
							<span className="absolute top-4 right-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
								{card.category}
							</span>
						)}

						<motion.div
							layoutId={`overlay-${card.id}`}
							className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-4 pt-12"
						>
							<div className="flex items-end justify-between gap-3">
								<div className="min-w-0 flex-1">
									<motion.h3 layoutId={`title-${card.id}`} className="text-xl font-bold text-white">
										{card.title}
									</motion.h3>

									{card.shortDescription && (
										<p className="line-clamp-1 text-sm text-white/70">{card.shortDescription}</p>
									)}
								</div>

								<motion.div
									layoutId={`icon-${card.id}`}
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black backdrop-blur-sm transition-colors group-hover:bg-white/30"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8 3V13M3 8H13"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				))}
			</div>

			{mounted &&
				createPortal(
					<AnimatePresence mode="wait">
						{selectedCard && (
							<>
								<motion.div
									initial={
										isAnimationDisabled
											? { opacity: 1 }
											: { opacity: 0, backdropFilter: "blur(0px)" }
									}
									animate={
										isAnimationDisabled
											? { opacity: 1 }
											: { opacity: 1, backdropFilter: "blur(8px)" }
									}
									exit={
										isAnimationDisabled
											? { opacity: 1 }
											: { opacity: 0, backdropFilter: "blur(0px)" }
									}
									transition={
										isAnimationDisabled
											? { duration: 0 }
											: {
													duration: speedConfig.duration,
													ease: [0.32, 0.72, 0, 1],
												}
									}
									onClick={handleClose}
									className={cn(
										"fixed inset-0 z-999999",
										closeOnBackdropClick && "cursor-pointer",
										backdropClassName
									)}
									style={{
										background: `radial-gradient(125% 125% at ${backdropGradientPosition}, light-dark(#fff, #0a0a0a) 40%, ${selectedCard.gradientColor || gradientColor} 100%)`,
									}}
									role="button"
									aria-label={closeOnBackdropClick ? "Close modal" : undefined}
									tabIndex={closeOnBackdropClick ? 0 : -1}
								/>

								<div
									className="pointer-events-none fixed inset-0 z-1000000 flex items-center justify-center p-8"
									role="dialog"
									aria-modal="true"
									aria-label={ariaLabel}
								>
									<motion.div
										layoutId={animationVariant === "scale" ? `card-${selectedCard.id}` : ""}
										initial={getInitialAnimation()}
										animate={getAnimateAnimation()}
										exit={getExitAnimation()}
										className={cn(
											"pointer-events-auto relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl",
											modalClassName
										)}
										style={{
											backgroundColor: "light-dark(#fff, #0a0a0a)",
										}}
										onClick={(e) => e.stopPropagation()}
										transition={isAnimationDisabled ? { duration: 0 } : springTransition}
									>
										<motion.div className="relative h-96">
											<motion.img
												layoutId={animationVariant === "scale" ? `image-${selectedCard.id}` : ""}
												src={selectedCard.imageUrl}
												alt={selectedCard.title}
												className="h-full w-full object-cover"
												transition={isAnimationDisabled ? { duration: 0 } : springTransition}
											/>

											<motion.div
												layoutId={animationVariant === "scale" ? `overlay-${selectedCard.id}` : ""}
												className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6 pt-12"
												transition={isAnimationDisabled ? { duration: 0 } : springTransition}
											>
												<div className="flex items-end justify-between">
													<motion.h3
														layoutId={
															animationVariant === "scale" ? `title-${selectedCard.id}` : ""
														}
														className="text-3xl font-bold text-white"
														transition={isAnimationDisabled ? { duration: 0 } : springTransition}
													>
														{selectedCard.title}
													</motion.h3>
													{showCloseButton && (
														<motion.button
															layoutId={
																animationVariant === "scale" ? `icon-${selectedCard.id}` : ""
															}
															onClick={(e) => {
																e.stopPropagation()
																setSelectedCard(null)
															}}
															className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
															whileHover={
																isAnimationDisabled ? { scale: 1 } : { scale: 1.1, rotate: 90 }
															}
															whileTap={isAnimationDisabled ? { scale: 1 } : { scale: 0.9 }}
															transition={isAnimationDisabled ? { duration: 0 } : smoothSpring}
															aria-label="Close modal"
														>
															<svg
																width="20"
																height="20"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M12 4L4 12M4 4L12 12"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																/>
															</svg>
														</motion.button>
													)}
												</div>
											</motion.div>
										</motion.div>

										<motion.div
											className="overflow-y-auto p-8"
											initial={isAnimationDisabled ? { opacity: 1 } : { opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={isAnimationDisabled ? { opacity: 1 } : { opacity: 0 }}
											transition={
												isAnimationDisabled
													? { duration: 0 }
													: {
															duration: speedConfig.duration * 0.75,
															delay: speedConfig.duration * 0.375,
															ease: [0.32, 0.72, 0, 1],
														}
											}
										>
											<motion.p
												className="text-muted-foreground text-lg leading-relaxed"
												initial={isAnimationDisabled ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={isAnimationDisabled ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
												transition={isAnimationDisabled ? { duration: 0 } : softSpring}
											>
												{selectedCard.description}
											</motion.p>
											{selectedCard.technologies && selectedCard.technologies.length > 0 && (
												<div className="mt-4 flex flex-wrap gap-2">
													{selectedCard.technologies.map((tech) => (
														<span
															key={tech}
															className="bg-foreground text-background rounded-full px-3 py-1 text-sm font-medium"
														>
															{tech}
														</span>
													))}
												</div>
											)}
											{(selectedCard.liveUrl || selectedCard.githubUrl) && (
												<div className="mt-6 flex gap-3">
													{selectedCard.liveUrl && (
														<motion.a
															target="_blank"
															href={selectedCard.liveUrl}
															className="group bg-foreground shadow-foreground/25 hover:shadow-foreground/40 text-background inline-flex w-fit items-center justify-center gap-3 rounded-md py-1.5 pr-3 pl-5 font-medium shadow-md transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
															initial={{ opacity: 0, y: 5 }}
															whileInView={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
														>
															<span>Ver Sitio</span>
															<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
																<svg
																	width="16"
																	height="16"
																	viewBox="0 0 16 16"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9"
																		stroke="currentColor"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															</span>
														</motion.a>
													)}
													{selectedCard.githubUrl && (
														<motion.a
															target="_blank"
															href={selectedCard.githubUrl}
															className="group bg-background shadow-background/25 hover:shadow-background/40 text-foreground border-foreground inline-flex w-fit items-center justify-center gap-3 rounded-md border py-1.5 pr-3 pl-5 font-medium shadow-md transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
															initial={{ opacity: 0, y: 5 }}
															whileInView={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
														>
															<span>GitHub</span>
															<span className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
																<svg
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="currentColor"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
																</svg>
															</span>
														</motion.a>
													)}
												</div>
											)}
										</motion.div>
									</motion.div>
								</div>
							</>
						)}
					</AnimatePresence>,
					document.body
				)}
		</div>
	)
}

ModalCards.displayName = "ModalCards"

export default ModalCards
