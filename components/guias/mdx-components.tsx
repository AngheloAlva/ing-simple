import { CircleAlert, Info, TriangleAlert } from "lucide-react"
import Link from "next/link"
import {
	Children,
	cloneElement,
	isValidElement,
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
} from "react"

import { resolveDiagrama } from "@/components/guias/diagramas"
import { Figura } from "@/components/guias/figura"

/**
 * Typographic + custom component map for guide MDX bodies
 * (`lib/guias/render.tsx`). On-brand: `rounded-sm`, `border-border`,
 * `bg-muted/40`, primary accents only — no green, no red, no second hue.
 */

function isInternalHref(href: string): boolean {
	return href.startsWith("/") || href.startsWith("#")
}

function MdxLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">): ReactNode {
	const linkClassName = "text-primary underline underline-offset-4 hover:no-underline"

	if (isInternalHref(href)) {
		return (
			<Link href={href} className={linkClassName}>
				{children}
			</Link>
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
		<div className="border-border bg-muted/40 mt-6 flex gap-3 rounded-sm border p-4">
			<Icon className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
			<div className="min-w-0">
				<p className="text-sm font-semibold tracking-tight">{titulo ?? NOTA_LABELS[tipo]}</p>
				<div className="text-muted-foreground mt-1 text-[15px] leading-relaxed [&>p]:mt-0">
					{children}
				</div>
			</div>
		</div>
	)
}

interface PasoProps {
	titulo: string
	numero?: number
	children: ReactNode
}

export function Paso({ titulo, numero, children }: PasoProps): ReactNode {
	return (
		<li className="flex gap-4">
			<span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-sm font-mono text-sm font-medium">
				{String(numero ?? 1).padStart(2, "0")}
			</span>
			<div className="min-w-0 pt-0.5">
				<p className="text-sm font-semibold tracking-tight sm:text-base">{titulo}</p>
				<div className="text-muted-foreground mt-1 text-[15px] leading-relaxed [&>p]:mt-0">
					{children}
				</div>
			</div>
		</li>
	)
}

/** Wraps `Paso` children and numbers them in order — the author never passes `numero`. */
export function Pasos({ children }: { children: ReactNode }): ReactNode {
	const items = Children.toArray(children).filter(isValidElement)

	return (
		<ol className="mt-6 space-y-5">
			{items.map((child, index) =>
				cloneElement(child as ReactElement<PasoProps>, {
					key: index,
					numero: index + 1,
				})
			)}
		</ol>
	)
}

/** A markdown list wrapped in `<Checklist>` renders with check glyphs instead of bullets. */
export function Checklist({ children }: { children: ReactNode }): ReactNode {
	return (
		<div
			className={[
				"border-border bg-muted/40 mt-6 rounded-sm border p-5",
				"[&_ul]:m-0 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pl-0",
				"[&_li]:flex [&_li]:items-start [&_li]:gap-2.5",
				"[&_li]:text-[15px] [&_li]:leading-relaxed sm:[&_li]:text-base",
				"[&_li]:before:text-primary [&_li]:before:mt-0.5 [&_li]:before:font-semibold [&_li]:before:content-['✓']",
			].join(" ")}
		>
			{children}
		</div>
	)
}

/** `<Diagrama nombre="..." />`: looks `nombre` up in the registry (`diagramas.tsx`). */
export function Diagrama({ nombre }: { nombre: string }): ReactNode {
	return resolveDiagrama(nombre)
}

function Table(props: ComponentPropsWithoutRef<"table">): ReactNode {
	return (
		<div className="border-border mt-6 overflow-x-auto rounded-sm border">
			<table className="w-full border-collapse text-sm" {...props} />
		</div>
	)
}

export const mdxComponents = {
	h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
		<h2
			className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-[1.75rem]"
			{...props}
		>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
		<h3 className="mt-8 scroll-mt-28 text-xl font-semibold tracking-tight" {...props}>
			{children}
		</h3>
	),
	p: (props: ComponentPropsWithoutRef<"p">) => (
		<p className="mt-4 text-[15px] leading-relaxed sm:text-base" {...props} />
	),
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
	li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
	a: MdxLink,
	blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
		<blockquote
			className="border-primary bg-muted/40 text-muted-foreground mt-6 rounded-sm border-l-2 py-3 pr-4 pl-5 text-[15px] leading-relaxed italic"
			{...props}
		/>
	),
	table: Table,
	thead: (props: ComponentPropsWithoutRef<"thead">) => <thead className="bg-muted/40" {...props} />,
	tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
	tr: (props: ComponentPropsWithoutRef<"tr">) => (
		<tr className="border-border border-b last:border-0" {...props} />
	),
	th: (props: ComponentPropsWithoutRef<"th">) => (
		<th className="px-3 py-2 text-left font-semibold" {...props} />
	),
	td: (props: ComponentPropsWithoutRef<"td">) => <td className="px-3 py-2 align-top" {...props} />,
	code: (props: ComponentPropsWithoutRef<"code">) => (
		<code
			className="border-border bg-muted/40 rounded-sm border px-1.5 py-0.5 font-mono text-[0.85em]"
			{...props}
		/>
	),
	pre: (props: ComponentPropsWithoutRef<"pre">) => (
		<pre
			className="border-border bg-muted/40 mt-6 overflow-x-auto rounded-sm border p-4 font-mono text-sm leading-relaxed [&>code]:rounded-none [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0"
			{...props}
		/>
	),
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
