"use client"

import { ArrowRightIcon } from "@/components/icons/animated/animated-arrow-right"
import { SendIcon } from "@/components/icons/animated/animated-send"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useCallback, useRef } from "react"

/**
 * Site button.
 *
 * `solid` and `outline` are the same control in opposite states: solid is
 * filled blue with a white icon capsule, outline is its inverse. Hovering
 * either one swaps the two, so a primary and a secondary sitting side by
 * side trade places rather than both lighting up.
 *
 * Corner brackets snap outward on hover, echoing the CornerPlus marks that
 * frame the section headers.
 */

const RADIUS = "rounded-sm"

type Variant = "solid" | "outline"

type IconKind = "arrow" | "send"

/** Both animated icons expose the same imperative handle. */
type IconHandle = { startAnimation: () => void; stopAnimation: () => void }

const ICONS: Record<IconKind, typeof ArrowRightIcon | typeof SendIcon> = {
	arrow: ArrowRightIcon,
	send: SendIcon,
}

type BaseProps = {
	variant?: Variant
	/** Trailing icon tile. `arrow` for anything that navigates, `send` for
	 *  anything that opens a conversation. Omitted for form submits, which
	 *  go nowhere, and for plain secondary actions. */
	icon?: IconKind
	iconOnly?: boolean
	fullWidth?: boolean
	className?: string
	children: ReactNode
}

type ButtonProps = BaseProps &
	Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
		href?: undefined
	}

type AnchorProps = BaseProps &
	Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & {
		href: string
	}

type CutButtonProps = ButtonProps | AnchorProps

const BASE =
	"group relative inline-flex items-center justify-center gap-2.5 border text-sm font-medium tracking-wide transition-colors duration-300 ease-out focus-ring"

const SURFACE: Record<Variant, string> = {
	solid:
		"border-brand-blue bg-brand-blue text-brand-blue-foreground hover:bg-transparent hover:text-brand-blue",
	outline:
		"border-brand-blue bg-transparent text-brand-blue hover:bg-brand-blue hover:text-brand-blue-foreground",
}

const ICON_BOX: Record<Variant, string> = {
	solid:
		"bg-brand-blue-foreground text-brand-blue group-hover:bg-brand-blue group-hover:text-brand-blue-foreground",
	outline:
		"bg-brand-blue text-brand-blue-foreground group-hover:bg-brand-blue-foreground group-hover:text-brand-blue",
}

const CORNER =
	"pointer-events-none absolute h-2.5 w-2.5 border-brand-blue opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"

function Corners(): ReactNode {
	return (
		<>
			<span
				aria-hidden="true"
				className={`${CORNER} top-0 left-0 border-t border-l group-hover:-top-1.5 group-hover:-left-1.5`}
			/>
			<span
				aria-hidden="true"
				className={`${CORNER} top-0 right-0 border-t border-r group-hover:-top-1.5 group-hover:-right-1.5`}
			/>
			<span
				aria-hidden="true"
				className={`${CORNER} bottom-0 left-0 border-b border-l group-hover:-bottom-1.5 group-hover:-left-1.5`}
			/>
			<span
				aria-hidden="true"
				className={`${CORNER} right-0 bottom-0 border-r border-b group-hover:-right-1.5 group-hover:-bottom-1.5`}
			/>
		</>
	)
}

export function CutButton({
	variant = "solid",
	icon,
	iconOnly = false,
	fullWidth = false,
	className = "",
	children,
	...props
}: CutButtonProps): ReactNode {
	const iconRef = useRef<IconHandle>(null)

	// The pointer never touches the icon itself, so the button drives it.
	// Focus mirrors hover to keep the cue for keyboard users.
	const play = useCallback(() => iconRef.current?.startAnimation(), [])
	const rest = useCallback(() => iconRef.current?.stopAnimation(), [])

	const Icon = icon && !iconOnly ? ICONS[icon] : null

	const size = iconOnly
		? "h-10 w-10"
		: `h-10 ${Icon ? "pl-5 pr-2" : "px-5"} ${fullWidth ? "w-full" : ""}`

	const cls = `${BASE} ${size} ${RADIUS} ${SURFACE[variant]} ${className}`

	const handlers = Icon
		? { onMouseEnter: play, onMouseLeave: rest, onFocus: play, onBlur: rest }
		: {}

	const content = (
		<>
			{!iconOnly && <Corners />}
			{children}
			{Icon && (
				<span
					aria-hidden="true"
					className={`grid h-6 w-6 shrink-0 place-items-center rounded-sm transition-colors duration-300 ease-out ${ICON_BOX[variant]}`}
				>
					<Icon ref={iconRef} size={14} className="flex" />
				</span>
			)}
		</>
	)

	if ("href" in props && props.href !== undefined) {
		const { href, ...anchorRest } = props as AnchorProps
		return (
			<a href={href} className={cls} {...handlers} {...anchorRest}>
				{content}
			</a>
		)
	}

	return (
		<button className={cls} {...handlers} {...(props as ButtonProps)}>
			{content}
		</button>
	)
}
