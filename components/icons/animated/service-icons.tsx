"use client"

import { ChartColumnIncreasingIcon } from "@/components/icons/animated/animated-chart-column-increasing"
import { CodeIcon } from "@/components/icons/animated/animated-code"
import { GraduationCapIcon } from "@/components/icons/animated/animated-graduation-cap"
import { WorkflowIcon } from "@/components/icons/animated/animated-workflow"

/**
 * Animated counterpart of each service's static Lucide icon, keyed by slug.
 * `lib/services.ts` keeps the static one for server-rendered surfaces; this
 * map is only for places that can react to hover.
 */
export const SERVICE_ICONS = {
	reportabilidad: ChartColumnIncreasingIcon,
	capacitaciones: GraduationCapIcon,
	"soluciones-web": CodeIcon,
	automatizaciones: WorkflowIcon,
} as const

export type ServiceSlug = keyof typeof SERVICE_ICONS
