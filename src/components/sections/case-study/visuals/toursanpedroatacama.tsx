"use client"

import Image from "next/image"
import { motion } from "motion/react"
import {
	CalendarDays,
	Check,
	CreditCard,
	DollarSign,
	FileText,
	Languages,
	LayoutDashboard,
} from "lucide-react"

import type { CaseStudyVisuals } from "./registry"

// ── Hero mockup — captura real del homepage ─────────────────────────────

function ToursHeroMockup({ label = "Vista de ToursSanPedroAtacama" }: { label?: string }) {
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
					toursanpedroatacama.com
				</div>
			</div>

			<div className="relative h-[calc(100%-1.75rem)] w-full">
				<Image
					src="/img/portfolio/toursanpedroatacama/hero.png"
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

// ── Feature mockups (wide con capturas reales) ──────────────────────────

function CatalogoMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/10] w-full">
				<Image
					src="/img/portfolio/toursanpedroatacama/catalog.png"
					alt="Catálogo de excursiones por zona"
					fill
					sizes="(min-width: 768px) 40vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

function AdminMockup() {
	return (
		<div className="border-border relative overflow-hidden rounded-xl border bg-neutral-900">
			<div className="relative aspect-[16/10] w-full">
				<Image
					src="/img/portfolio/toursanpedroatacama/admin.png"
					alt="Panel administrativo"
					fill
					sizes="(min-width: 768px) 40vw, 100vw"
					className="object-cover object-top"
				/>
			</div>
		</div>
	)
}

// ── Feature mockups (narrow JSX) ────────────────────────────────────────

function CheckoutMockup() {
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<DollarSign className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">Checkout</span>
			</div>
			<div className="flex flex-1 flex-col gap-1.5 pt-0.5">
				<div className="bg-muted/40 border-border flex items-center justify-between rounded-md border px-2 py-1">
					<span className="text-muted-foreground text-[7px]">Moneda</span>
					<div className="flex items-center gap-0.5">
						<span className="rounded-[2px] bg-[#D97706] px-1 py-0.5 text-[6px] font-bold text-white">
							CLP
						</span>
						<span className="text-muted-foreground rounded-[2px] bg-neutral-200 px-1 py-0.5 text-[6px] font-bold dark:bg-neutral-800">
							USD
						</span>
					</div>
				</div>
				<motion.div
					initial={{ opacity: 0, y: 4 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="border-border flex items-baseline justify-between rounded-md border px-2 py-1.5"
				>
					<span className="text-muted-foreground text-[7px]">Total</span>
					<div className="flex items-baseline gap-0.5">
						<span className="text-foreground text-base font-bold tabular-nums">$89.000</span>
						<span className="text-muted-foreground text-[7px]">CLP</span>
					</div>
				</motion.div>
				<div className="text-muted-foreground text-center text-[6px]">
					≈ USD 95 · OpenExchangeRates
				</div>
			</div>
		</div>
	)
}

function PasarelasMockup() {
	const gateways = [
		{ name: "Webpay", color: "#cd1719", initials: "W" },
		{ name: "PayPal", color: "#003087", initials: "P" },
		{ name: "Flow", color: "#22c55e", initials: "F" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<CreditCard className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">3 pasarelas</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{gateways.map((g, i) => (
					<motion.div
						key={g.name}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.08 }}
						className="border-border flex items-center justify-between rounded-md border px-2 py-1"
					>
						<div className="flex items-center gap-1.5">
							<span
								className="flex h-4 w-4 items-center justify-center rounded-[3px] text-[7px] font-bold text-white"
								style={{ backgroundColor: g.color }}
							>
								{g.initials}
							</span>
							<span className="text-foreground text-[7px] font-medium">{g.name}</span>
						</div>
						<Check className="h-2 w-2 text-emerald-500" />
					</motion.div>
				))}
			</div>
		</div>
	)
}

function MultilingueDbMockup() {
	const langs = [
		{ code: "ES", value: "Tour al Valle de la Luna" },
		{ code: "EN", value: "Valley of the Moon Tour" },
		{ code: "FR", value: "Tour à la Vallée de la Lune" },
		{ code: "PT", value: "Tour ao Vale da Lua" },
	]
	return (
		<div className="border-border bg-background flex h-full flex-col gap-1.5 rounded-xl border p-3">
			<div className="flex items-center gap-1.5">
				<Languages className="h-3 w-3 text-[#D97706]" />
				<span className="text-foreground text-[10px] font-semibold">i18n en DB</span>
			</div>
			<div className="flex flex-1 flex-col gap-1">
				{langs.map((l, i) => (
					<motion.div
						key={l.code}
						initial={{ opacity: 0, x: -6 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
						className="border-border flex items-center gap-1.5 rounded-[3px] border px-1.5 py-1"
					>
						<span className="rounded-[2px] bg-[#D97706] px-1 py-0.5 text-[6px] font-bold text-white">
							{l.code}
						</span>
						<span className="text-foreground truncate text-[7px]">{l.value}</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

function VoucherMockup() {
	return (
		<div className="border-border bg-background relative flex h-full items-center justify-center overflow-hidden rounded-xl border p-4">
			<div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#D97706]/10 blur-xl" />
			<motion.div
				initial={{ rotate: -6, opacity: 0, y: 10 }}
				whileInView={{ rotate: -4, opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
				className="border-border bg-muted/40 relative flex w-full max-w-35 flex-col gap-1 rounded-md border p-2.5"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<FileText className="h-3 w-3 text-[#D97706]" />
						<span className="text-foreground text-[9px] font-semibold">Voucher</span>
					</div>
					<span className="rounded-full bg-emerald-100 px-1 py-0.5 text-[6px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
						Pagado
					</span>
				</div>
				<div className="bg-muted h-1 w-full rounded-full" />
				<div className="bg-muted h-1 w-5/6 rounded-full" />
				<div className="bg-muted h-1 w-4/6 rounded-full" />
				<div className="bg-foreground/80 mt-1 h-3 w-full rounded-[2px]" />
				<div className="text-muted-foreground text-[6px]">PDF · Resend</div>
			</motion.div>
		</div>
	)
}

export const tourSanPedroAtacamaVisuals: CaseStudyVisuals = {
	HeroMockup: ToursHeroMockup,
	architecture: {
		viewBox: { width: 800, height: 528 },
		ariaLabel: "Diagrama de arquitectura de ToursSanPedroAtacama",
		nodes: [
			{
				id: "tourists",
				x: 20,
				y: 20,
				w: 760,
				h: 64,
				label: "Turistas globales",
				sub: "4 idiomas · tarjetas en CLP y USD",
				tone: "neutral",
			},
			{
				id: "next",
				x: 20,
				y: 120,
				w: 760,
				h: 72,
				label: "Next.js 15 · App Router · Vercel",
				sub: "React 19 · Turbopack · Server Actions",
				tone: "primary",
			},
			{
				id: "domain",
				x: 20,
				y: 228,
				w: 760,
				h: 64,
				label: "Drizzle ORM + next-intl + Jose (JWT)",
				sub: "Schema con tablas de traducciones · auth admin propia",
				tone: "primary",
			},
			{
				id: "webpay",
				x: 20,
				y: 328,
				w: 240,
				h: 80,
				label: "Transbank / Webpay",
				sub: "Tarjetas chilenas",
				tone: "accent",
			},
			{
				id: "paypal",
				x: 280,
				y: 328,
				w: 240,
				h: 80,
				label: "PayPal",
				sub: "Turista internacional",
				tone: "accent",
			},
			{
				id: "flow",
				x: 540,
				y: 328,
				w: 240,
				h: 80,
				label: "Flow",
				sub: "Métodos locales adicionales",
				tone: "accent",
			},
			{
				id: "turso",
				x: 20,
				y: 432,
				w: 240,
				h: 80,
				label: "Turso (libSQL)",
				sub: "DB distribuida · free tier",
				tone: "neutral",
			},
			{
				id: "cloudinary",
				x: 280,
				y: 432,
				w: 240,
				h: 80,
				label: "Cloudinary",
				sub: "Imágenes con transformaciones",
				tone: "neutral",
			},
			{
				id: "resend",
				x: 540,
				y: 432,
				w: 240,
				h: 80,
				label: "Resend + React PDF",
				sub: "Vouchers + correos branded",
				tone: "neutral",
			},
		],
		edges: [
			{ from: "tourists", to: "next" },
			{ from: "next", to: "domain" },
			{ from: "domain", to: "webpay" },
			{ from: "domain", to: "paypal" },
			{ from: "domain", to: "flow" },
			{ from: "domain", to: "turso" },
			{ from: "next", to: "cloudinary" },
			{ from: "domain", to: "resend" },
		],
	},
	features: {
		"Catálogo navegable por días recomendados": {
			visual: <CatalogoMockup />,
			span: "wide",
			icon: CalendarDays,
		},
		"Panel administrativo completo": {
			visual: <AdminMockup />,
			span: "wide",
			icon: LayoutDashboard,
		},
		"Checkout en CLP o USD": {
			visual: <CheckoutMockup />,
			span: "narrow",
			icon: DollarSign,
		},
		"Tres pasarelas de pago": {
			visual: <PasarelasMockup />,
			span: "narrow",
			icon: CreditCard,
		},
		"Contenido multilingüe a nivel DB": {
			visual: <MultilingueDbMockup />,
			span: "narrow",
			icon: Languages,
		},
		"Vouchers PDF y notificaciones": {
			visual: <VoucherMockup />,
			span: "narrow",
			icon: FileText,
		},
	},
}
