"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Globe, Layers, Mail, Package, Search, Share2 } from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup — captura real del homepage de Grupo CAEMP ───────────────

function CaempHeroMockup({ label = "Vista de Grupo CAEMP" }: { label?: string }) {
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
					grupocaemp.cl
				</div>
			</div>

			<div className="relative h-[calc(100%-1.75rem)] w-full">
				<Image
					src="/img/portfolio/caemp/hero.png"
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

/** Multi-domain "aha": tres marcas, tres dominios, un mismo build */
function MultiDominioMockup() {
	const brands = [
		{
			name: "CAEMP OTEC",
			domain: "caempotec.cl",
			color: "#0066b3",
			img: "/img/portfolio/caemp/otec.png",
			alt: "Homepage de CAEMP OTEC — capacitación certificada SENCE",
		},
		{
			name: "CAEMP PLUS",
			domain: "caempplus.cl",
			color: "#00a651",
			img: "/img/portfolio/caemp/plus.png",
			alt: "Homepage de CAEMP PLUS — equipos de protección personal",
		},
		{
			name: "Crecimiento",
			domain: "crecimientocaemp.cl",
			color: "#9b2789",
			img: "/img/portfolio/caemp/crecimiento.png",
			alt: "Homepage de Crecimiento — habilidades blandas y talleres",
		},
	]

	return (
		<div className="flex w-full gap-2 sm:gap-3">
			{brands.map((brand, i) => (
				<motion.div
					key={brand.name}
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.45, delay: 0.05 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
					className="border-border flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border"
				>
					{/* Mini browser chrome */}
					<div
						className="flex items-center gap-1.5 px-2 py-1.5"
						style={{ backgroundColor: brand.color }}
					>
						<div className="flex gap-0.5">
							<span className="block h-1.5 w-1.5 rounded-full bg-white/40" />
							<span className="block h-1.5 w-1.5 rounded-full bg-white/40" />
							<span className="block h-1.5 w-1.5 rounded-full bg-white/40" />
						</div>
						<span className="truncate text-[7px] font-medium text-white/90">{brand.domain}</span>
					</div>
					{/* Screenshot */}
					<div className="relative aspect-[3/4] w-full">
						<Image
							src={brand.img}
							alt={brand.alt}
							fill
							sizes="(min-width: 768px) 20vw, 33vw"
							className="object-cover object-top"
						/>
					</div>
					{/* Brand label */}
					<div className="bg-muted/40 px-2 py-1.5 text-center">
						<span className="text-foreground text-[8px] font-semibold">{brand.name}</span>
					</div>
				</motion.div>
			))}
		</div>
	)
}

/** Catalog visual — course/product listing screenshot */
function CatalogsMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/10] w-full">
				<Image
					src="/img/portfolio/caemp/catalogo-cursos.png"
					alt="Catálogo de cursos y productos por línea de negocio"
					fill
					sizes="(min-width: 768px) 40vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

/** SEO mockup — meta tags per domain */
function SeoDominioMockup() {
	const domains = [
		{ domain: "caempotec.cl", title: "CAEMP OTEC · Capacitación SENCE", color: "#0066b3" },
		{ domain: "caempplus.cl", title: "CAEMP PLUS · Equipos EPP", color: "#00a651" },
		{ domain: "crecimientocaemp.cl", title: "Crecimiento · Habilidades blandas", color: "#9b2789" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Search className="text-accent h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">SEO independiente</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{domains.map((d, i) => (
					<motion.div
						key={d.domain}
						initial={{ opacity: 0, y: 4 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.08 }}
						className="border-border rounded-md border px-2 py-1.5"
					>
						<div className="flex items-center gap-1.5">
							<span
								className="h-1.5 w-1.5 shrink-0 rounded-full"
								style={{ backgroundColor: d.color }}
							/>
							<span className="text-foreground truncate text-[7px] font-medium">{d.domain}</span>
						</div>
						<p className="text-muted-foreground mt-0.5 truncate text-[6px]">{d.title}</p>
					</motion.div>
				))}
			</div>
		</div>
	)
}

/** Shared vs specific content split */
function ContenidoCompartidoMockup() {
	const shared = ["Navegación", "Layout", "Formularios", "Utilidades UI"]
	const specific = ["Catálogo OTEC", "Productos PLUS", "Talleres Crecimiento"]

	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Share2 className="text-accent h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">Compartido vs. específico</span>
			</div>
			<div className="grid flex-1 grid-cols-2 gap-1.5">
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-[7px] font-semibold tracking-wide uppercase">
						Común
					</span>
					{shared.map((item, i) => (
						<motion.div
							key={item}
							initial={{ opacity: 0, x: -4 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
							className="border-border rounded-[3px] border px-1.5 py-1"
						>
							<span className="text-foreground text-[7px]">{item}</span>
						</motion.div>
					))}
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-muted-foreground text-[7px] font-semibold tracking-wide uppercase">
						Por marca
					</span>
					{specific.map((item, i) => (
						<motion.div
							key={item}
							initial={{ opacity: 0, x: 4 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
							className="border-border rounded-[3px] border px-1.5 py-1"
						>
							<span className="text-foreground text-[7px]">{item}</span>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

/** Contact form per brand */
function ContactoMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Mail className="text-accent h-3 w-3" />
				<span className="text-foreground text-[10px] font-semibold">Contacto y cotización</span>
			</div>
			<div className="flex flex-1 flex-col gap-1.5 pt-0.5">
				{[
					{ label: "Nombre", width: "w-full" },
					{ label: "Email", width: "w-5/6" },
					{ label: "Mensaje", width: "w-2/3" },
				].map((f, i) => (
					<motion.div
						key={f.label}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.08 }}
						className="border-border bg-muted/40 flex h-3 items-center gap-1 rounded-[3px] border px-1.5"
					>
						<span className={`bg-muted h-1 rounded-full ${f.width}`} />
					</motion.div>
				))}
				<motion.div
					initial={{ opacity: 0, y: 4 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.3, delay: 0.3 }}
					className="mt-auto flex items-center justify-between gap-1"
				>
					<span className="text-muted-foreground text-[7px]">vía grupocaemp.cl</span>
					<span className="inline-flex items-center gap-1 rounded-[3px] bg-[#0066b3] px-1.5 py-1 text-[7px] font-medium text-white">
						<Mail className="h-2 w-2" /> Enviar
					</span>
				</motion.div>
			</div>
		</div>
	)
}

// ── Architecture diagram ─────────────────────────────────────────────────

export const caempVisuals: CaseStudyVisuals = {
	HeroMockup: CaempHeroMockup,
	architecture: {
		viewBox: { width: 800, height: 560 },
		ariaLabel: "Diagrama de arquitectura multi-dominio de Grupo CAEMP",
		nodes: [
			{
				id: "domains",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Cuatro dominios públicos",
				sub: "grupocaemp.cl · caempotec.cl · caempplus.cl · crecimientocaemp.cl",
				tone: "neutral",
			},
			{
				id: "tenant",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "getTenantFromHost — resolución de tenant",
				sub: "Match exacto de dominio → identifica OTEC / PLUS / Crecimiento / Grupo",
				tone: "primary",
			},
			{
				id: "rewrite",
				x: 20,
				y: 228,
				w: 760,
				h: 64,
				label: "Rewrite bidireccional en el router (TanStack Router)",
				sub: "Entrada: caempplus.cl/productos → /plus/productos · Salida: /plus/productos → /productos",
				tone: "primary",
			},
			{
				id: "otec",
				x: 20,
				y: 328,
				w: 240,
				h: 80,
				label: "Marca OTEC",
				sub: "Prefijo /otec · Azul #0066b3 · Cursos SENCE",
				tone: "accent",
			},
			{
				id: "plus",
				x: 280,
				y: 328,
				w: 240,
				h: 80,
				label: "Marca PLUS",
				sub: "Prefijo /plus · Verde #00a651 · Catálogo EPP",
				tone: "accent",
			},
			{
				id: "crecimiento",
				x: 540,
				y: 328,
				w: 240,
				h: 80,
				label: "Marca Crecimiento",
				sub: "Prefijo /crecimiento · Púrpura #9b2789 · Talleres",
				tone: "accent",
			},
			{
				id: "shared",
				x: 100,
				y: 444,
				w: 280,
				h: 80,
				label: "Design system compartido",
				sub: "Componentes Radix/shadcn · Tailwind v4 · TanStack Form + Zod",
				tone: "neutral",
			},
			{
				id: "deploy",
				x: 420,
				y: 444,
				w: 280,
				h: 80,
				label: "Un solo build · Vercel",
				sub: "Nitro v2 + Vite · Resend + React Email · 4 dominios → 1 despliegue",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "domains", to: "tenant" },
			{ from: "tenant", to: "rewrite" },
			{ from: "rewrite", to: "otec" },
			{ from: "rewrite", to: "plus" },
			{ from: "rewrite", to: "crecimiento" },
			{ from: "otec", to: "shared" },
			{ from: "plus", to: "deploy" },
		],
	},
	features: {
		"Arquitectura multi-dominio de marca": {
			visual: <MultiDominioMockup />,
			span: "full",
			icon: Globe,
		},
		"Catálogos y detalle por negocio": {
			visual: <CatalogsMockup />,
			span: "wide",
			icon: Package,
		},
		"SEO independiente por dominio": {
			visual: <SeoDominioMockup />,
			span: "wide",
			icon: Search,
		},
		"Contenido compartido vs. específico": {
			visual: <ContenidoCompartidoMockup />,
			span: "narrow",
			icon: Share2,
		},
		"Contacto y cotización con correo transaccional": {
			visual: <ContactoMockup />,
			span: "narrow",
			icon: Mail,
		},
		"Tres líneas de negocio diferenciadas": {
			visual: (
				<div className="border-border bg-muted/30 flex items-center justify-center gap-2 rounded-xl border px-4 py-3">
					{[
						{ label: "OTEC", sub: "Capacitación SENCE", color: "#0066b3" },
						{ label: "PLUS", sub: "EPP", color: "#00a651" },
						{ label: "Crecimiento", sub: "Soft skills", color: "#9b2789" },
					].map((b) => (
						<div key={b.label} className="flex flex-col items-center gap-1">
							<span
								className="rounded-md px-2 py-1 text-[8px] font-bold text-white"
								style={{ backgroundColor: b.color }}
							>
								{b.label}
							</span>
							<span className="text-muted-foreground text-[7px]">{b.sub}</span>
						</div>
					))}
				</div>
			),
			span: "narrow",
			icon: Layers,
		},
	},
}
