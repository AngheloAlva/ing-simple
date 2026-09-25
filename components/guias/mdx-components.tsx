import { CircleAlert, Info, TriangleAlert } from "lucide-react"
import Link from "next/link"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { resolveDiagrama } from "@/components/guias/diagramas"
import { Figura } from "@/components/guias/figura"
import {
	ARTICLE_VIEWPORT,
	Blockquote,
	Checklist,
	MdxLi,
	MdxP,
	MdxPre,
	MdxTd,
	MdxTh,
	Paso,
	Pasos,
	RevealDisabled,
} from "@/components/guias/mdx-motion"
import { isInternalHref } from "@/lib/href"
import { InView } from "@/lib/motion"

/**
 * Typographic + custom component map for guide MDX bodies
 * (`lib/guias/render.tsx`). On-brand: `rounded-sm`, `border-border`,
 * `bg-muted/40`, primary accents only — no green, no red, no second hue.
 *
 * This module stays a server component (`compileMDX` in `lib/guias/render.tsx`
 * runs on the server): every block below that reveals on scroll renders
 * `InView` (a client component, `lib/motion.tsx`) around server-rendered
 * children, which is plain RSC composition and needs no `"use client"` here.
 * `RevealDisabled` is the same story — it wraps the reveal-disabling context
 * (created and consumed in `mdx-motion.tsx`) in a named client component, so
 * this server module can render it around server-rendered children (a bare
 * `Context.Provider` reached off a client-module import does not survive the
 * RSC boundary as a component). That's how `Nota` tells the `p` inside it to
 * skip its own reveal instead of getting stuck behind Nota's own viewport
 * margin — a card with a title and a blank body.
 * Only the pieces that need their own hooks — `Pasos`/`Paso`'s stagger,
 * `Checklist`'s stagger, the pull quote's two-stage reveal, and the ones that
 * read the reveal-disabled context (`MdxP`, `MdxPre`, `MdxLi`, table cells) —
 * live in `mdx-motion.tsx` and are imported in.
 */

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">): ReactNode {
	const linkClassName = "text-primary underline underline-offset-4 hover:no-underline"

	if (isInternalHref(href)) {
		return (
			<Link href={href} className={linkClassName}>
				{children}
			</Link>
		)
	}

	// Three-way split, because the anchors are not the same kind of navigation: a
	// mailto: or another site needs a browser anchor, while an in-page hash must not
	// be sent to a new tab.
	if (href.startsWith("#")) {
		return (
			<a href={href} className={linkClassName} {...props}>
				{children}
			</a>
		)
	}

	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName} {...props}>
			{children}
		</a>
	)
}

type NotaTipo = "info" | "importante" | "advertencia"

const NOTA_LABELS: Record<NotaTipo, string> = {
	info: "Nota",
	importante: "Importante",
	advertencia: "Atención",
}

const NOTA_ICONS: Record<NotaTipo, typeof Info> = {
	info: Info,
	importante: CircleAlert,
	advertencia: TriangleAlert,
}

export function Nota({
	tipo = "info",
	titulo,
	children,
}: {
	tipo?: NotaTipo
	titulo?: string
	children: ReactNode
}): ReactNode {
	const Icon = NOTA_ICONS[tipo]

	return (
		<InView
			className="border-border bg-muted/40 mt-6 flex gap-3 rounded-sm border p-4"
			viewport={ARTICLE_VIEWPORT}
		>
			<Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
			<div className="min-w-0">
				<p className="text-sm font-semibold tracking-tight">{titulo ?? NOTA_LABELS[tipo]}</p>
				<div className="text-muted-foreground mt-1 text-[15px] leading-relaxed [&>p]:mt-0">
					{/*
						Nota already reveals as one unit above: without this, the `p`
						this renders (through the shared `p` mapping) would try to
						reveal a second time on its own and could end up stuck hidden
						behind Nota's own viewport margin — a card with a title and a
						blank body.
					*/}
					<RevealDisabled>{children}</RevealDisabled>
				</div>
			</div>
		</InView>
	)
}

/**
 * `<Diagrama nombre="..." pie="..." />`: looks `nombre` up in the registry
 * (`diagramas.tsx`) and frames it like `Figura` — its own breathing room and
 * an optional mono caption, so a diagram never sits flush against the prose.
 * The diagram itself owns its entrance motion (`useEntrance`); the figure
 * frame does not reveal separately, so the two do not fight on scroll-in.
 */
export function Diagrama({ nombre, pie }: { nombre: string; pie?: string }): ReactNode {
	return (
		<figure className="my-8 sm:my-10 lg:-mx-12">
			{resolveDiagrama(nombre)}
			{pie !== undefined ? (
				<figcaption className="text-muted-foreground mt-2 font-mono text-[11px] tracking-[0.02em]">
					{pie}
				</figcaption>
			) : null}
		</figure>
	)
}

function Table(props: ComponentPropsWithoutRef<"table">): ReactNode {
	return (
		<InView
			className="border-border mt-6 overflow-x-auto rounded-sm border"
			viewport={ARTICLE_VIEWPORT}
		>
			<table className="w-full border-collapse text-sm" {...props} />
		</InView>
	)
}

export const mdxComponents = {
	h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
		// The `first:mt-0` reset needs to see the real position among siblings,
		// so the margin lives on this wrapper (the actual flow sibling) rather
		// than on the `<h2>`, which would always be an only child of its own
		// `InView` div and so always match `:first-child`.
		<InView className="mt-12 first:mt-0" viewport={ARTICLE_VIEWPORT}>
			<h2
				className="scroll-mt-28 text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
				{...props}
			>
				{children}
			</h2>
		</InView>
	),
	h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
		<InView className="mt-8" viewport={ARTICLE_VIEWPORT}>
			<h3 className="scroll-mt-28 text-xl font-semibold tracking-tight" {...props}>
				{children}
			</h3>
		</InView>
	),
	p: MdxP,
	ul: (props: ComponentPropsWithoutRef<"ul">) => (
		<ul
			className="marker:text-primary mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed sm:text-base"
			{...props}
		/>
	),
	ol: (props: ComponentPropsWithoutRef<"ol">) => (
		<ol
			className="marker:text-primary mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed sm:text-base"
			{...props}
		/>
	),
	li: MdxLi,
	a: MdxLink,
	blockquote: Blockquote,
	table: Table,
	thead: (props: ComponentPropsWithoutRef<"thead">) => <thead className="bg-muted/40" {...props} />,
	tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
	tr: (props: ComponentPropsWithoutRef<"tr">) => (
		<tr className="border-border border-b last:border-0" {...props} />
	),
	th: MdxTh,
	td: MdxTd,
	code: (props: ComponentPropsWithoutRef<"code">) => (
		<code
			className="border-border bg-muted/40 rounded-sm border px-1.5 py-0.5 font-mono text-[0.85em]"
			{...props}
		/>
	),
	pre: MdxPre,
	hr: (props: ComponentPropsWithoutRef<"hr">) => <hr className="border-border my-10" {...props} />,
	strong: (props: ComponentPropsWithoutRef<"strong">) => (
		<strong className="text-foreground font-semibold" {...props} />
	),
	Nota,
	Pasos,
	Paso,
	Checklist,
	Figura,
	Diagrama,
}
