"use client"

import { CutButton } from "@/components/cut-button"
import { Logo } from "@/components/logo"
import { isInternalHref } from "@/lib/href"
import { SERVICES } from "@/lib/services"
import { navLinkProps } from "@/lib/view-transitions"
import { Linkedin } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { CSSProperties, ReactNode } from "react"

type FooterLink = { label: string; href: string }

const COLUMNS: { title: string; links: FooterLink[] }[] = [
	{
		title: "Servicios",
		links: SERVICES.map((service) => ({
			label: service.shortName,
			href: service.href,
		})),
	},
	{
		title: "Empresa",
		links: [
			{ label: "Sobre nosotros", href: "/sobre-nosotros" },
			{ label: "Casos", href: "/casos" },
			{ label: "Guías", href: "/guias" },
			{ label: "Contacto", href: "/contacto" },
		],
	},
	{
		title: "Legal",
		links: [{ label: "Política de privacidad", href: "/privacidad" }],
	},
]

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/ingenieria-simple/",
		icon: <Linkedin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />,
	},
]

const PANEL_RADIUS = "2px"

function Plus({ className }: { className: string }): ReactNode {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className={`text-brand-blue pointer-events-none absolute z-10 h-3.5 w-3.5 ${className}`}
		>
			<path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	)
}

function FooterColumn({
	index,
	title,
	links,
	children,
}: {
	index: number
	title: string
	links: FooterLink[]
	children?: ReactNode
}): ReactNode {
	// Each link's direction depends on where the visitor already is: "Casos" is a step
	// forward from the home page and a step back from a case. Same derivation as the
	// header, and the reason this module is a client component at all.
	const pathname = usePathname()
	const divided = index > 0
	return (
		<div
			className={`relative md:px-8 ${divided ? "md:border-border md:border-l" : "md:pl-0"} ${
				index === 3 ? "md:pr-0" : ""
			}`}
		>
			{divided && (
				<>
					<Plus className="top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
					<Plus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 md:block" />
				</>
			)}

			<h3 className="text-sm font-semibold tracking-tight">{title}</h3>
			<ul className="mt-4 space-y-3">
				{links.map((link) => (
					<li key={link.href}>
						{/* Split on isInternalHref: a mailto: needs a browser anchor. */}
						{isInternalHref(link.href) ? (
							<Link
								href={link.href}
								{...navLinkProps(link.href, pathname)}
								className="focus-ring text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</Link>
						) : (
							<a
								href={link.href}
								className="focus-ring text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{link.label}
							</a>
						)}
					</li>
				))}
			</ul>
			{children}
		</div>
	)
}

export function Footer(): ReactNode {
	const clip = { borderRadius: PANEL_RADIUS } as CSSProperties

	return (
		<footer className="mx-auto max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-10">
			<div className="bg-border p-px" style={clip}>
				<div className="bg-background p-8 sm:p-10 lg:p-14" style={clip}>
					<Logo draw="in-view" />

					<div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-0">
						{COLUMNS.map((col, i) => (
							<FooterColumn key={col.title} index={i} title={col.title} links={col.links} />
						))}

						<FooterColumn
							index={3}
							title="Contacto"
							links={[
								{
									label: "contacto@ingsimple.cl",
									href: "mailto:contacto@ingsimple.cl",
								},
							]}
						>
							<div className="text-muted-foreground mt-3 space-y-1 text-sm">
								<p>Santiago, Chile</p>
								<p>Lun-Vie 9:00 – 18:00 (CLT)</p>
							</div>
							<div className="mt-6">
								<CutButton variant="solid" icon="arrow" href="/contacto">
									Conversemos
								</CutButton>
							</div>
						</FooterColumn>
					</div>

					<div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 pt-6 sm:flex-row sm:items-center md:mt-14">
						<p className="text-muted-foreground text-xs">
							© {new Date().getFullYear()} Ingeniería Simple SpA. Todos los derechos reservados.
						</p>

						<div className="flex items-center gap-4">
							{SOCIALS.map((social, i) => (
								<div key={social.href} className="flex items-center gap-4">
									{i > 0 && <span className="bg-border h-3.5 w-px" aria-hidden="true" />}
									<a
										href={social.href}
										aria-label={social.label}
										target="_blank"
										rel="noopener noreferrer"
										className="focus-ring text-muted-foreground hover:text-foreground transition-colors"
									>
										{social.icon}
									</a>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
