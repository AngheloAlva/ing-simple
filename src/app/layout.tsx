import { Geist, Geist_Mono } from "next/font/google"

import { SkipToContent } from "@/components/shared/skip-to-content"
import { ThemeSwitch } from "@/components/shared/theme-switch"
import { Providers } from "@/components/shared/providers"
import { baseMetadata } from "@/lib/metadata"

import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
})

export const metadata: Metadata = baseMetadata

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>): ReactNode {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground relative min-h-screen font-sans antialiased`}
			>
				<Providers>
					<SkipToContent />
					<ThemeSwitch />
					{children}
				</Providers>
			</body>
		</html>
	)
}
