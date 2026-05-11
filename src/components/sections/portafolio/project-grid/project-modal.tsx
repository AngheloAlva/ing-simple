"use client"

import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { createPortal } from "react-dom"

import { CATEGORY_LABELS, type ProjectCategory, type ProjectData } from "@/lib/portfolio-data"

interface ProjectModalProps {
	selected: ProjectData | null
	onClose: () => void
}

export function ProjectModal({ selected, onClose }: ProjectModalProps) {
	return createPortal(
		<AnimatePresence mode="wait">
			{selected && (
				<>
					<motion.div
						initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
						animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
						exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
						transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
						onClick={onClose}
						className="fixed inset-0 z-999999 cursor-pointer"
						style={{
							background: `radial-gradient(125% 125% at 50% 10%, light-dark(#fff, #0a0a0a) 40%, ${selected.gradientColor || "#14b8a6"} 100%)`,
						}}
						role="button"
						aria-label="Cerrar modal"
					/>

					<div
						className="pointer-events-none fixed inset-0 z-1000000 flex items-center justify-center p-8"
						role="dialog"
						aria-modal="true"
						aria-label="Detalle de proyecto"
					>
						<motion.div
							layoutId={`card-${selected.id}`}
							className="pointer-events-auto relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
							style={{ backgroundColor: "light-dark(#fff, #0a0a0a)" }}
							onClick={(e) => e.stopPropagation()}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						>
							<motion.div className="relative h-96">
								<motion.img
									layoutId={`image-${selected.id}`}
									src={selected.imageUrl}
									alt={selected.title}
									className="h-full w-full object-cover"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>

								<div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-6 pt-12">
									<div className="flex items-end justify-between">
										<motion.h3
											layoutId={`title-${selected.id}`}
											className="text-3xl font-bold text-white"
											transition={{ type: "spring", stiffness: 300, damping: 30 }}
										>
											{selected.title}
										</motion.h3>

										<motion.button
											onClick={(e) => {
												e.stopPropagation()
												onClose()
											}}
											className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
											whileTap={{ scale: 0.9 }}
											aria-label="Cerrar modal"
										>
											<svg width="20" height="20" viewBox="0 0 16 16" fill="none">
												<path
													d="M12 4L4 12M4 4L12 12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
												/>
											</svg>
										</motion.button>
									</div>
								</div>
							</motion.div>

							<motion.div
								className="overflow-y-auto p-8"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
							>
								<span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.15em] uppercase">
									{CATEGORY_LABELS[selected.category as ProjectCategory]}
								</span>
								<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
									{selected.fullDescription}
								</p>
								{selected.technologies.length > 0 && (
									<div className="mt-4 flex flex-wrap gap-2">
										{selected.technologies.map((tech) => (
											<span
												key={tech}
												className="bg-foreground text-background rounded-full px-3 py-1 text-sm font-medium"
											>
												{tech}
											</span>
										))}
									</div>
								)}
								{(selected.liveUrl || selected.githubUrl) && (
									<div className="mt-6 flex gap-3">
										{selected.liveUrl && (
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={selected.liveUrl}
												className="group bg-foreground text-background inline-flex w-fit items-center justify-center gap-3 rounded-md py-1.5 pr-3 pl-5 font-medium shadow-md transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
											>
												<span>Ver Sitio</span>
												<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
													<ArrowUpRight className="h-4 w-4" />
												</span>
											</a>
										)}
										{selected.githubUrl && (
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={selected.githubUrl}
												className="group bg-background text-foreground border-foreground inline-flex w-fit items-center justify-center gap-3 rounded-md border py-1.5 pr-3 pl-5 font-medium shadow-md transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
											>
												<span>GitHub</span>
												<span className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
													<ArrowUpRight className="h-4 w-4" />
												</span>
											</a>
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
	)
}
