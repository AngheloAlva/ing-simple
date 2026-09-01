import { BetterAuthIcon } from "@/components/icons/better-auth"
import CloudinaryIcon from "@/components/icons/cloudinary"
import PostgreSQLIcon from "@/components/icons/postgresql"
import TurborepoIcon from "@/components/icons/turborepo"
import ShadcnuiIcon from "@/components/icons/shadcn-ui"
import NextIntlIcon from "@/components/icons/next-intl"
import { NestJSIcon } from "@/components/icons/nest-js"
import DrizzleORMIcon from "@/components/icons/drizzle"
import TanStackIcon from "@/components/icons/tanstack"
import RechartsIcon from "@/components/icons/recharts"
import ZustandIcon from "@/components/icons/zustand"
import NextjsIcon from "@/components/icons/next-js"
import PrismaIcon from "@/components/icons/prisma"
import ResendIcon from "@/components/icons/resend"
import VercelIcon from "@/components/icons/vercel"
import AzureIcon from "@/components/icons/azure"
import MoneyIcon from "@/components/icons/money"
import GsapIcon from "@/components/icons/gsap"
import PDFIcon from "@/components/icons/pdf"
import TailwindCSSIcon from "@/components/icons/tailwindcss"
import PowerAutomateIcon from "@/components/icons/power-automate"
import PowerPlatformIcon from "@/components/icons/power-platform"
import { MicrosoftSharePoint } from "@/components/icons/sharepoint"
import { MicrosoftOneDrive } from "@/components/icons/one-drive"
import PowerAppsIcon from "@/components/icons/power-apps"
import { MicrosoftOffice } from "@/components/icons/office"
import { MicrosoftExcel } from "@/components/icons/excel"
import { MicrosoftTeams } from "@/components/icons/teams"
import PowerBiIcon from "@/components/icons/power-bi"
import { Microsoft } from "@/components/icons/microsoft"

interface TechBrand {
	icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
	iconFill?: boolean
}

/**
 * Map a tech card title to a brand glyph. The match is keyword-based
 * so combined entries like "Next.js + TypeScript" still resolve to the right brand.
 */
const TECH_BRANDS: { match: string[]; brand: TechBrand }[] = [
	{
		match: ["next.js", "nextjs"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NextjsIcon {...props} />,
			iconFill: true,
		},
	},
	{
		match: ["vercel"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <VercelIcon {...props} />,
			iconFill: true,
		},
	},
	{
		match: ["tailwind", "tailwindcss"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TailwindCSSIcon {...props} />,
			iconFill: true,
		},
	},

	{
		match: ["prisma"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PrismaIcon {...props} />,
		},
	},
	{
		match: ["azure"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <AzureIcon {...props} />,
		},
	},
	{
		match: ["postgres"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PostgreSQLIcon {...props} />,
		},
	},
	{
		match: ["better auth"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <BetterAuthIcon {...props} />,
		},
	},
	{
		match: ["tanstack"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TanStackIcon {...props} />,
		},
	},
	{
		match: ["transbank"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MoneyIcon {...props} />,
		},
	},
	{
		match: ["drizzle"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <DrizzleORMIcon {...props} />,
		},
	},
	{
		match: ["recharts"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <RechartsIcon {...props} />,
		},
	},
	{
		match: ["react pdf", "pdf"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PDFIcon {...props} />,
		},
	},
	{
		match: ["zustand"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ZustandIcon {...props} />,
		},
	},
	{
		match: ["nestjs", "nest", "nest-js"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NestJSIcon {...props} />,
		},
	},
	{
		match: ["turborepo"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TurborepoIcon {...props} />,
		},
	},
	{
		match: ["shadcn-ui", "shadcn", "shadcnui"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ShadcnuiIcon {...props} />,
		},
	},
	{
		match: ["resend"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ResendIcon {...props} />,
		},
	},
	{
		match: ["gsap"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <GsapIcon {...props} />,
		},
	},
	{
		match: ["next-intl"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NextIntlIcon {...props} />,
		},
	},
	{
		match: ["cloudinary"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <CloudinaryIcon {...props} />,
		},
	},
	{
		match: ["power bi"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerBiIcon {...props} />,
		},
	},
	{
		match: ["power automate"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerAutomateIcon {...props} />,
		},
	},
	{
		match: ["power apps"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerAppsIcon {...props} />,
		},
	},
	{
		match: ["power platform"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerPlatformIcon {...props} />,
		},
	},
	{
		match: ["sharepoint"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftSharePoint {...props} />,
		},
	},
	{
		match: ["onedrive"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOneDrive {...props} />,
		},
	},
	{
		match: ["excel"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftExcel {...props} />,
		},
	},
	{
		match: ["teams"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftTeams {...props} />,
		},
	},
	{
		match: ["microsoft 365"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOffice {...props} />,
		},
	},
	{
		match: ["office"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOffice {...props} />,
		},
	},
	{
		match: ["microsoft"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <Microsoft {...props} />,
		},
	},
]

function resolveBrand(name: string): TechBrand | null {
	const lower = name.toLowerCase()
	return TECH_BRANDS.find((b) => b.match.some((k) => lower.includes(k)))?.brand ?? null
}

/**
 * The bare brand glyph (no colored tile), tinted by the parent's `color`.
 * Intended as a large low-opacity corner watermark; the tech name is shown as
 * text alongside, so the glyph is pure decoration. Unmatched techs render
 * nothing rather than a misleading placeholder.
 */
export function TechGlyph({ name, className }: { name: string; className?: string }) {
	const brand = resolveBrand(name)
	if (!brand) return null
	const Icon = brand.icon
	return (
		<Icon className={className} aria-hidden {...(brand.iconFill ? { fill: "currentColor" } : {})} />
	)
}
