"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Gauge, Languages, Mail, Newspaper, Search } from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

const ACCENT = "#ea580c"

// ── Hero mockup — captura real del homepage ─────────────────────────────

function BzHeroMockup({ label = "Vista de BZ Consulting" }: { label?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
			className="border-border bg-muted/40 relative w-full overflow-hidden rounded-2xl border shadow-2xl"
			style={{ aspectRatio: "16 / 10" }}
			aria-label={label}
		>
			<div className="border-border bg-background/80 flex items-center gap-2 border-b px-3 py-2 backdrop-blur">
				<div className="flex gap-1">
					<span className="block h-2 w-2 rounded-full bg-red-400/70" />
					<span className="block h-2 w-2 rounded-full bg-yellow-400/70" />
					<span className="block h-2 w-2 rounded-full bg-green-400/70" />
				</div>
				<div className="bg-muted text-muted-foreground mx-auto w-2/3 truncate rounded-md px-3 py-0.5 text-center text-[10px]">
					bzconsulting.cl
				</div>
			</div>

			<div className="relative h-[calc(100%-1.75rem)] w-full">
				<Image
					src="/img/portfolio/bzconsulting/hero.png"
					alt={label}
					fill
					sizes="(min-width: 1024px) 50vw, 100vw"
					className="object-cover object-top"
					priority
				/>
			</div>
		</motion.div>
	)
}

// ── Feature mockups ──────────────────────────────────────────────────────

function NoticiasMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/9] w-full">
				<Image
					src="/img/portfolio/bzconsulting/noticias.png"
					alt="Listado de noticias publicadas semanalmente"
					fill
					sizes="(min-width: 1024px) 60vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function I18nMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[4/3] w-full">
				<Image
					src="/img/portfolio/bzconsulting/i18n.png"
					alt="Selector y URLs traducidas ES/EN"
					fill
					sizes="(min-width: 768px) 30vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function ContactoMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[4/3] w-full">
				<Image
					src="/img/portfolio/bzconsulting/contacto.png"
					alt="Formulario de contacto"
					fill
					sizes="(min-width: 768px) 30vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function PerformanceMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/9] w-full">
				<Image
					src="/img/portfolio/bzconsulting/pagespeed.png"
					alt="Métricas de PageSpeed / Core Web Vitals"
					fill
					sizes="(min-width: 1024px) 60vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function SeoMockup() {
	const items = [
		{ label: "Sitemap.xml", ok: true },
		{ label: "Robots.txt", ok: true },
		{ label: "OG tags", ok: true },
		{ label: "Hreflang ES/EN", ok: true },
		{ label: "View Transitions", ok: true },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-2 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Search className="h-3 w-3" style={{ color: ACCENT }} />
				<span className="text-foreground text-[10px] font-semibold">SEO técnico</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{items.map((it, i) => (
					<motion.div
						key={it.label}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
						className="border-border flex items-center justify-between rounded-[3px] border px-1.5 py-1"
					>
						<span className="text-foreground text-[8px]">{it.label}</span>
						<span
							className="rounded-full px-1.5 py-0.5 text-[7px] font-medium text-white"
							style={{ backgroundColor: ACCENT }}
						>
							OK
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

// ── Visuals export ───────────────────────────────────────────────────────

export const bzConsultingVisuals: CaseStudyVisuals = {
	HeroMockup: BzHeroMockup,
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de BZ Consulting",
		diagramTitle: "Astro SSG sobre Cloudflare Pages, con publicación por git",
		nodes: [
			{
				id: "visitors",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Visitantes CL + UY · ES / EN",
				sub: "Clientes corporativos del sector petróleo y gas",
				tone: "neutral",
			},
			{
				id: "cdn",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Cloudflare Pages · CDN global",
				sub: "Hosting estático · auto-deploy desde main · tier gratuito",
				tone: "primary",
			},
			{
				id: "astro",
				x: 20,
				y: 228,
				w: 760,
				h: 64,
				label: "Astro 4 · Static Site Generation",
				sub: "HTML prerenderizado · React hidratado solo en islas",
				tone: "primary",
			},
			{
				id: "content",
				x: 20,
				y: 328,
				w: 240,
				h: 80,
				label: "Content Collections",
				sub: "MDX + Zod · 190+ noticias bilingües",
				tone: "accent",
			},
			{
				id: "i18n",
				x: 280,
				y: 328,
				w: 240,
				h: 80,
				label: "@astrolicious/i18n",
				sub: "URLs traducidas por locale",
				tone: "accent",
			},
			{
				id: "islands",
				x: 540,
				y: 328,
				w: 240,
				h: 80,
				label: "React 18 · Islands",
				sub: "Formulario, idioma, carrusel",
				tone: "accent",
			},
			{
				id: "git",
				x: 100,
				y: 432,
				w: 280,
				h: 80,
				label: "git push → main",
				sub: "Workflow editorial de noticias semanales",
				tone: "neutral",
			},
			{
				id: "worker",
				x: 420,
				y: 432,
				w: 280,
				h: 80,
				label: "Cloudflare Worker → Resend",
				sub: "Formulario de contacto serverless",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "visitors", to: "cdn" },
			{ from: "cdn", to: "astro" },
			{ from: "astro", to: "content" },
			{ from: "astro", to: "i18n" },
			{ from: "astro", to: "islands" },
			{ from: "content", to: "git" },
			{ from: "islands", to: "worker" },
		],
	},
	features: {
		"Publicación semanal de noticias sin CMS": {
			visual: <NoticiasMockup />,
			span: "wide",
			icon: Newspaper,
		},
		"Performance medida y validada": {
			visual: <PerformanceMockup />,
			span: "wide",
			icon: Gauge,
		},
		"Formulario de contacto serverless": {
			visual: <ContactoMockup />,
			span: "narrow",
			icon: Mail,
		},
		"Sitio bilingüe (ES/EN) con URLs traducidas": {
			visual: <I18nMockup />,
			span: "narrow",
			icon: Languages,
		},
		"SEO técnico cuidado": {
			visual: <SeoMockup />,
			span: "narrow",
			icon: Search,
		},
	},
}
