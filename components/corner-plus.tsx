import type { ReactNode } from "react"

export function PlusSvg({ className }: { className: string }): ReactNode {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
			<path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	)
}

export function CornerPlus({ className }: { className: string }): ReactNode {
	return (
		<PlusSvg
			className={`text-brand-blue pointer-events-none absolute z-10 h-3.5 w-3.5 ${className}`}
		/>
	)
}

export function Kicker({ children }: { children: ReactNode }): ReactNode {
	return <p className="text-muted-foreground text-sm font-medium">{children}</p>
}
