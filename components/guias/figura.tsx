import { ARTICLE_VIEWPORT } from "@/components/guias/mdx-motion"
import { InView } from "@/lib/motion"
import Image from "next/image"
import type { ReactNode } from "react"

/**
 * `Figura` MDX block (`content/guias/README.md`): a captioned image inside a
 * guide's body, framed with the site's chrome. Stays a server component —
 * guides compile on the server (`lib/guias/render.tsx`) and this never needs
 * client-side state — but renders `InView` (a client component) around its
 * own output to reveal on scroll, which is plain RSC composition.
 */
export function Figura({
	src,
	alt,
	pie,
	ancho = "texto",
}: {
	src: string
	alt: string
	pie?: string
	ancho?: "texto" | "ancha"
}): ReactNode {
	if (process.env.NODE_ENV !== "production" && !src.startsWith("/img/guias/")) {
		return (
			<div className="border-destructive/50 bg-destructive/5 text-destructive mt-6 rounded-sm border border-dashed p-4 text-sm">
				<p className="font-semibold tracking-tight">Figura con ruta inválida: &quot;{src}&quot;</p>
				<p className="mt-1 text-[13px] leading-relaxed">
					Las imágenes de guías van bajo /img/guias/.
				</p>
			</div>
		)
	}

	return (
		<InView className={ancho === "ancha" ? "mt-6 lg:-mx-8" : "mt-6"} viewport={ARTICLE_VIEWPORT}>
			<figure>
				<div className="border-border bg-muted/40 relative aspect-video overflow-hidden rounded-sm border">
					<Image
						src={src}
						alt={alt}
						fill
						sizes="(min-width: 1024px) 48rem, 100vw"
						className="object-cover"
					/>
				</div>
				{pie !== undefined ? (
					<figcaption className="text-muted-foreground mt-2 font-mono text-[11px] tracking-[0.02em]">
						{pie}
					</figcaption>
				) : null}
			</figure>
		</InView>
	)
}
