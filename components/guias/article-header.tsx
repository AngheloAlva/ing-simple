"use client"

import type { ReactNode } from "react"

import { Kicker } from "@/components/corner-plus"
import { formatGuiaDate } from "@/lib/guias/format"
import { useStaggerEntrance } from "@/lib/motion"
import type { GuiaMeta } from "@/lib/guias/schema"
import { TEMAS } from "@/lib/guias/temas"
import { motion } from "motion/react"

/**
 * `meta.title` has no separate accent field the way `ServicePage.pageTitle` /
 * `pageTitleAccent` do (see `lib/services.ts`), so there is no natural place
 * to split it into the site's regular/semibold pair. Rendered whole in the
 * serif regular weight instead of guessing which words to emphasize.
 *
 * Client component only for the entrance stagger (same recipe as the site's
 * section headers, `useStaggerEntrance`); everything else here is static.
 */
export function ArticleHeader({ meta }: { meta: GuiaMeta }): ReactNode {
	const { container, item, itemTransition } = useStaggerEntrance()

	return (
		<motion.header className="pb-10" variants={container} initial="hidden" animate="visible">
			<motion.div variants={item} transition={itemTransition}>
				<Kicker>{TEMAS[meta.tema]}</Kicker>
			</motion.div>

			<motion.h1
				variants={item}
				transition={itemTransition}
				className="mt-5 font-serif text-3xl leading-[1.15] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]"
			>
				{meta.title}
			</motion.h1>

			<motion.p
				variants={item}
				transition={itemTransition}
				className="text-muted-foreground mt-4 text-[15px] leading-relaxed text-balance sm:text-base"
			>
				{meta.description}
			</motion.p>

			<motion.div
				variants={item}
				transition={itemTransition}
				className="border-border text-muted-foreground mt-6 flex flex-wrap items-center gap-2 border-t pt-5 text-xs"
			>
				<span className="text-foreground font-medium">Ingeniería Simple</span>
				<span aria-hidden="true">·</span>
				<time dateTime={meta.publishedAt}>Publicado el {formatGuiaDate(meta.publishedAt)}</time>
				{meta.updatedAt !== undefined ? (
					<>
						<span aria-hidden="true">·</span>
						<time dateTime={meta.updatedAt}>Actualizado el {formatGuiaDate(meta.updatedAt)}</time>
					</>
				) : null}
				<span aria-hidden="true">·</span>
				<span>{meta.readingTimeMinutes} min de lectura</span>
			</motion.div>
		</motion.header>
	)
}
