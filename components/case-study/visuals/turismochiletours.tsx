"use client"

import Image from "next/image"
import { motion } from "motion/react"
import {
	Briefcase,
	BookOpen,
	Check,
	FileText,
	Globe,
	Languages,
	Mail,
	MapPin,
	Send,
} from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup — captura real del homepage ─────────────────────────────

function TurismoHeroMockup({ label = "Vista de TurismoChileTours" }: { label?: string }) {
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
					turismochiletours.com
				</div>
			</div>

			<div className="relative h-[calc(100%-1.75rem)] w-full">
				<Image
					src="/img/portfolio/turismochiletours/hero.png"
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

function CatalogoProgramasMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/10] w-full">
				<Image
					src="/img/portfolio/turismochiletours/programs.png"
					alt="Catálogo de programas multi-día"
					fill
					sizes="(min-width: 768px) 40vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function FichasDestinosMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/10] w-full">
				<Image
					src="/img/portfolio/turismochiletours/destine.png"
					alt="Ficha de destino"
					fill
					sizes="(min-width: 768px) 40vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function MultilingueMockup() {
	return (
		<div className="border-border bg-background relative flex h-full items-center justify-center overflow-hidden rounded-xl border p-4">
			<div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#D97706]/10 blur-xl" />
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="border-border bg-muted/40 relative w-full max-w-32 overflow-hidden rounded-md border shadow-lg"
			>
				<div className="bg-background flex items-center justify-between px-2 py-1.5">
					<div className="flex items-center gap-1.5">
						<Languages className="h-2.5 w-2.5 text-[#D97706]" />
						<span className="text-foreground text-[8px] font-semibold">Idioma</span>
					</div>
					<span className="text-muted-foreground text-[8px]">▾</span>
				</div>
				<div className="border-border bg-background flex flex-col border-t">
					{[
						{ code: "ES", name: "Español", active: true },
						{ code: "EN", name: "English" },
						{ code: "FR", name: "Français" },
						{ code: "PT", name: "Português" },
					].map((l) => (
						<div
							key={l.code}
							className={`flex items-center justify-between px-2 py-1 text-[8px] ${
								l.active ? "bg-[#D97706]/10" : ""
							}`}
						>
							<div className="flex items-center gap-1.5">
								<span
									className={`rounded-[2px] px-1 py-0.5 text-[6px] font-bold ${
										l.active ? "bg-[#D97706] text-white" : "bg-muted text-muted-foreground"
									}`}
								>
									{l.code}
								</span>
								<span className="text-foreground">{l.name}</span>
							</div>
							{l.active && <Check className="h-2 w-2 text-[#D97706]" />}
						</div>
					))}
				</div>
			</motion.div>
		</div>
	)
}

function ToursPrivadosMockup() {
	const fields = [
		{ label: "Nombre", width: "w-full" },
		{ label: "Email", width: "w-5/6" },
		{ label: "Programa", width: "w-2/3" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Send className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">Tour privado</span>
			</div>
			<div className="flex flex-1 flex-col gap-1.5 pt-0.5">
				{fields.map((f, i) => (
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
					className="mt-auto flex items-center justify-end gap-1"
				>
					<span className="inline-flex items-center gap-1 rounded-[3px] bg-[#D97706] px-1.5 py-1 text-[7px] font-medium text-white">
						<Mail className="h-2 w-2" /> Enviar
					</span>
				</motion.div>
			</div>
		</div>
	)
}

function PostulacionesMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Briefcase className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">Trabaja con nosotros</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{[
					{ role: "Guía bilingüe", area: "Operaciones", tone: "open" },
					{ role: "Atención al cliente", area: "Comercial", tone: "open" },
					{ role: "Conductor 4x4", area: "Operaciones", tone: "closed" },
				].map((p, i) => (
					<motion.div
						key={p.role}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.08 }}
						className="border-border flex items-center justify-between rounded-md border px-2 py-1.5"
					>
						<div className="flex min-w-0 flex-col leading-tight">
							<span className="text-foreground truncate text-[7px] font-medium">{p.role}</span>
							<span className="text-muted-foreground text-[6px]">{p.area}</span>
						</div>
						<span
							className={`rounded-full px-1.5 py-0.5 text-[6px] font-medium ${
								p.tone === "open"
									? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
									: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
							}`}
						>
							{p.tone === "open" ? "Abierto" : "Cerrado"}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function InstitucionalMockup() {
	const pages = [
		{ label: "Historia", icon: BookOpen },
		{ label: "Equipo", icon: Briefcase },
		{ label: "Políticas", icon: FileText },
		{ label: "FAQ", icon: Globe },
		{ label: "Sustentabilidad", icon: MapPin },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<BookOpen className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">Institucional</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{pages.map((p, i) => {
					const Icon = p.icon
					return (
						<motion.div
							key={p.label}
							initial={{ opacity: 0, x: -6 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
							className="border-border flex items-center gap-1.5 rounded-[3px] border px-1.5 py-1"
						>
							<Icon className="text-muted-foreground h-2 w-2" />
							<span className="text-foreground text-[7px]">{p.label}</span>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

export const turismoChileToursVisuals: CaseStudyVisuals = {
	HeroMockup: TurismoHeroMockup,
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de TurismoChileTours",
		nodes: [
			{
				id: "visitors",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Visitantes globales",
				sub: "Turistas internacionales · 4 mercados idiomáticos",
				tone: "neutral",
			},
			{
				id: "next",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Next.js 14 · App Router · Vercel",
				sub: "Páginas pre-renderizadas · edge cache global",
				tone: "primary",
			},
			{
				id: "actions",
				x: 20,
				y: 228,
				w: 760,
				h: 64,
				label: "Server Actions + next-intl",
				sub: "Routing localizado · validación end-to-end con Zod",
				tone: "primary",
			},
			{
				id: "rhf",
				x: 20,
				y: 328,
				w: 240,
				h: 80,
				label: "React Hook Form + Zod",
				sub: "Mismo schema en cliente y servidor",
				tone: "accent",
			},
			{
				id: "resend",
				x: 280,
				y: 328,
				w: 240,
				h: 80,
				label: "Resend + React Email",
				sub: "Correos transaccionales branded",
				tone: "accent",
			},
			{
				id: "gsap",
				x: 540,
				y: 328,
				w: 240,
				h: 80,
				label: "GSAP + Embla",
				sub: "Animaciones y carruseles fluidos",
				tone: "accent",
			},
			{
				id: "content",
				x: 100,
				y: 432,
				w: 280,
				h: 80,
				label: "Contenido en repo",
				sub: "Sin DB · iteración por commit",
				tone: "neutral",
			},
			{
				id: "email",
				x: 420,
				y: 432,
				w: 280,
				h: 80,
				label: "Email comercial",
				sub: "Leads de tours privados y postulaciones",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "visitors", to: "next" },
			{ from: "next", to: "actions" },
			{ from: "actions", to: "rhf" },
			{ from: "actions", to: "resend" },
			{ from: "actions", to: "gsap" },
			{ from: "next", to: "content" },
			{ from: "resend", to: "email" },
		],
	},
	features: {
		"Catálogo de programas y excursiones": {
			visual: <CatalogoProgramasMockup />,
			span: "wide",
			icon: MapPin,
		},
		"Fichas de destinos": {
			visual: <FichasDestinosMockup />,
			span: "wide",
			icon: Globe,
		},
		"Sitio multilingüe (4 idiomas)": {
			visual: <MultilingueMockup />,
			span: "narrow",
			icon: Languages,
		},
		"Solicitud de tours privados": {
			visual: <ToursPrivadosMockup />,
			span: "narrow",
			icon: Send,
		},
		"Postulaciones laborales": {
			visual: <PostulacionesMockup />,
			span: "narrow",
			icon: Briefcase,
		},
		"Páginas institucionales completas": {
			visual: <InstitucionalMockup />,
			span: "narrow",
			icon: BookOpen,
		},
	},
}
