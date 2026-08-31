import { BetterAuthIcon } from "@/components/icons/better-auth"
import CloudinaryIcon from "@/components/icons/cloudinary"
import TypeScriptIcon from "@/components/icons/typescript"
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
	background: string
	foreground: string
	iconFill?: boolean
}

/**
 * Map a tech card title to a brand-colored icon tile. The match is keyword-based
 * so combined entries like "Next.js + TypeScript" still resolve to the right brand.
 */
const TECH_BRANDS: { match: string[]; brand: TechBrand }[] = [
	{
		match: ["next.js", "nextjs"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NextjsIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
			iconFill: true,
		},
	},
	{
		match: ["vercel"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <VercelIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
			iconFill: true,
		},
	},
	{
		match: ["tailwind", "tailwindcss"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TailwindCSSIcon {...props} />,
			background: "#FFFFFF",
			foreground: "#FFFFFF",
			iconFill: true,
		},
	},

	{
		match: ["prisma"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PrismaIcon {...props} />,
			background: "#2D3748",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["azure"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <AzureIcon {...props} />,
			background: "#5aa7e6",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["postgres"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PostgreSQLIcon {...props} />,
			background: "#336791",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["better auth"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <BetterAuthIcon {...props} />,
			background: "#1F2937",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["tanstack"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TanStackIcon {...props} />,
			background: "#FFFFFF",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["transbank"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MoneyIcon {...props} />,
			background: "#6bf363",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["drizzle"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <DrizzleORMIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["recharts"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <RechartsIcon {...props} />,
			background: "#16A394",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["react pdf", "zod", "pdf"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PDFIcon {...props} />,
			background: "#ff7d89",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["zustand"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ZustandIcon {...props} />,
			background: "#B5651D",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["nestjs", "nest", "nest-js"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NestJSIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["turborepo"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <TurborepoIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["shadcn-ui", "shadcn", "shadcnui"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ShadcnuiIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["resend"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <ResendIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["gsap"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <GsapIcon {...props} />,
			background: "#000000",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["next-intl"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <NextIntlIcon {...props} />,
			background: "#FFFFFF",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["cloudinary"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <CloudinaryIcon {...props} />,
			background: "#FFFFFF",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["power bi"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerBiIcon {...props} />,
			background: "#F2C811",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["power automate"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerAutomateIcon {...props} />,
			background: "#0066FF",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["power apps"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerAppsIcon {...props} />,
			background: "#742774",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["power platform"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <PowerPlatformIcon {...props} />,
			background: "#742774",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["sharepoint"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftSharePoint {...props} />,
			background: "#038387",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["onedrive"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOneDrive {...props} />,
			background: "#0078D4",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["excel"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftExcel {...props} />,
			background: "#107C41",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["teams"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftTeams {...props} />,
			background: "#4B53BC",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["microsoft 365"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOffice {...props} />,
			background: "#D83B01",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["office"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <MicrosoftOffice {...props} />,
			background: "#D83B01",
			foreground: "#FFFFFF",
		},
	},
	{
		match: ["microsoft"],
		brand: {
			icon: (props: React.SVGProps<SVGSVGElement>) => <Microsoft {...props} />,
			background: "#00A4EF",
			foreground: "#FFFFFF",
		},
	},
]

function resolveBrand(name: string): TechBrand {
	const lower = name.toLowerCase()
	const match = TECH_BRANDS.find((b) => b.match.some((k) => lower.includes(k)))

	return match
		? match.brand
		: {
				icon: (props: React.SVGProps<SVGSVGElement>) => <TypeScriptIcon {...props} />,
				background: "#FFFFFF",
				foreground: "#FFFFFF",
			}
}

interface TechIconProps {
	name: string
	size?: "sm" | "md"
}

/**
 * The bare brand glyph (no colored tile), tinted by the parent's `color`.
 * Intended as a large low-opacity corner watermark; the tech name is shown as
 * text alongside, so the glyph is pure decoration.
 */
export function TechGlyph({ name, className }: { name: string; className?: string }) {
	const brand = resolveBrand(name)
	const Icon = brand.icon
	return (
		<Icon
			className={className}
			aria-hidden
			{...(brand.iconFill ? { fill: "currentColor" } : {})}
		/>
	)
}

export function TechIcon({ name, size = "md" }: TechIconProps) {
	const brand = resolveBrand(name)
	const Icon = brand.icon
	const dimensions = size === "sm" ? "h-9 w-9 rounded-md" : "h-11 w-11 rounded-lg"
	const iconSize = size === "sm" ? "h-6 w-6" : "h-7 w-7"

	return (
		<span
			className={`inline-flex shrink-0 items-center justify-center ${dimensions}`}
			style={{ backgroundColor: brand.background, color: brand.foreground }}
			aria-hidden
		>
			<Icon
				className={iconSize}
				strokeWidth={2}
				{...(brand.iconFill ? { fill: brand.foreground } : {})}
			/>
		</span>
	)
}
