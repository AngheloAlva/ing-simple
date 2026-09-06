import type { ReactNode } from "react"

import { Kicker } from "@/components/corner-plus"
import { formatGuiaDate } from "@/lib/guias/format"
import type { GuiaMeta } from "@/lib/guias/schema"
import { TEMAS } from "@/lib/guias/temas"

/**
 * `meta.title` has no separate accent field the way `ServicePage.pageTitle` /
 * `pageTitleAccent` do (see `lib/services.ts`), so there is no natural place
 * to split it into the site's regular/semibold pair. Rendered whole in the
 * serif regular weight instead of guessing which words to emphasize.
 */
export function ArticleHeader({ meta }: { meta: GuiaMeta }): ReactNode {
	return (
		<header className="pb-10">
			<Kicker>{TEMAS[meta.tema]}</Kicker>

			<h1 className="mt-5 font-serif text-3xl leading-[1.15] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
				{meta.title}
			</h1>

			<p className="text-muted-foreground mt-4 text-[15px] leading-relaxed text-balance sm:text-base">
				{meta.description}
			</p>

			<div className="border-border text-muted-foreground mt-6 flex flex-wrap items-center gap-2 border-t pt-5 text-xs">
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
			</div>
		</header>
	)
}
