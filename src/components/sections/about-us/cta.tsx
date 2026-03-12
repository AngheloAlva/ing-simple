"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

export default function AboutUsCta() {
	const images = [
		{
			id: 1,
			url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop",
			alt: "Developer coding security systems",
		},
		{
			id: 2,
			url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=600&fit=crop",
			alt: "Modern data center",
		},
		{
			id: 3,
			url: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=400&h=600&fit=crop",
			alt: "Security team collaboration",
		},
		{
			id: 4,
			url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop",
			alt: "Tech workspace planning",
		},
		{
			id: 5,
			url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop",
			alt: "Security operations team",
		},
		{
			id: 6,
			url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop",
			alt: "Developer at workstation",
		},
		{
			id: 7,
			url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop",
			alt: "Tech team meeting",
		},
		{
			id: 8,
			url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=600&fit=crop",
			alt: "Engineers collaborating",
		},
	]

	const duplicatedImages = [...images, ...images]

	return (
		<section className="flex min-h-screen w-full flex-col items-center overflow-visible bg-white dark:bg-neutral-950">
			{/* Top Content Section */}
			<div className="mx-auto flex w-full max-w-[1400px] items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
				<div className="space-y-6 text-center">
					{/* Main Headline with Italic Word */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-3xl leading-[1.15] font-normal text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl dark:text-white"
					>
						protect the <span className="font-light italic">digital</span> world
					</motion.h1>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-400"
					>
						Join our elite cybersecurity team to defend against the most sophisticated threats and
						protect businesses.
					</motion.p>

					{/* CTA Button with Arrow */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex justify-center"
					>
						<button className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-yellow-300 py-2 pr-2 pl-6 text-sm font-medium text-black transition-colors duration-200 hover:bg-yellow-400 sm:text-base">
							<span className="relative z-10">Join our team</span>
							<span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black transition-transform duration-200 group-hover:scale-110 sm:h-10 sm:w-10">
								<ArrowRight className="h-4 w-4 text-white sm:h-5 sm:w-5" />
							</span>
						</button>
					</motion.div>
				</div>
			</div>

			{/* Bottom Marquee Section */}
			<div className="w-full overflow-x-clip pt-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
				<div className="relative">
					{/* Marquee Container */}
					<motion.div
						className="flex gap-4 sm:gap-6 md:gap-8"
						animate={{
							x: ["-0%", "-50%"],
						}}
						transition={{
							x: {
								duration: 40,
								ease: "linear",
								repeat: Infinity,
								repeatType: "loop",
							},
						}}
						style={{ willChange: "transform" }}
					>
						{duplicatedImages.map((image, index) => (
							<div
								key={`${image.id}-${index}`}
								className={`h-44 w-32 shrink-0 rounded-lg bg-neutral-100 sm:h-48 sm:w-36 md:h-56 md:w-44 lg:h-64 lg:w-48 dark:bg-neutral-800 ${
									index % 2 === 1 ? "-mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16" : ""
								}`}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	)
}
