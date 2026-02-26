import { ThemeSwitch } from "@/components/shared/theme-switch"
import { Header } from "@/components/header/header"
import { Footer } from "@/components/footer/footer"

import type { ReactNode } from "react"

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>): ReactNode {
	return (
		<>
			<Header />
			<ThemeSwitch />
			{children}
			<Footer />
		</>
	)
}
