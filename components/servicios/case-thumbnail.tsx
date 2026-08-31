"use client"

import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry"
import type { ReactNode } from "react"

/**
 * The hand-built mockup of one case, as a thumbnail. It lives in its own
 * client module on purpose: the visuals are `"use client"` components, and a
 * server component that reaches into the registry only ever gets an opaque
 * client reference back, so `HeroMockup` would silently resolve to nothing.
 */
export function CaseThumbnail({ projectId }: { projectId: string }): ReactNode {
	const HeroMockup = getCaseStudyVisuals(projectId)?.HeroMockup ?? null
	if (HeroMockup === null) return null

	return (
		<div className="pointer-events-none absolute inset-0 [&>*]:h-full [&>*]:w-full [&>*]:!rounded-none">
			<HeroMockup />
		</div>
	)
}
