"use client"

import { Component, type ReactNode } from "react"

type ReliefBoundaryProps = {
	children: ReactNode
	/** Called once a child throws, e.g. the WebGL chunk fails to load. */
	onError?: () => void
}

type ReliefBoundaryState = { failed: boolean }

/**
 * Contains failures of the interactive relief (chunk load, WebGL setup) so they
 * never take the guide page down; the caller keeps showing its still instead.
 */
export class ReliefBoundary extends Component<ReliefBoundaryProps, ReliefBoundaryState> {
	state: ReliefBoundaryState = { failed: false }

	static getDerivedStateFromError(): ReliefBoundaryState {
		return { failed: true }
	}

	componentDidCatch(): void {
		this.props.onError?.()
	}

	render(): ReactNode {
		return this.state.failed ? null : this.props.children
	}
}
