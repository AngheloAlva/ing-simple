import type { ComponentType, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import type { MagicTransformResult } from "@/components/sections/case-study/magic-transformation"

export interface ArchNode {
	id: string
	x: number
	y: number
	w: number
	h: number
	label: string
	sub?: string
	tone: "primary" | "neutral" | "accent"
}

export interface ArchEdge {
	from: string
	to: string
	label?: string
}

export interface FeatureVisual {
	visual: ReactNode
	span: "full" | "wide" | "narrow"
	icon?: LucideIcon
}

export interface ContextConfig {
	modules: MagicTransformResult[]
	bannerLeft: string
	bannerRight: string
	footerText: string
	axisColor: string
	centerContent?: ReactNode
}

export interface ArchitectureConfig {
	nodes: ArchNode[]
	edges: ArchEdge[]
	viewBox: { width: number; height: number }
	ariaLabel: string
	diagramTitle?: string
}

export interface CaseStudyVisuals {
	HeroMockup: ComponentType<{ label?: string }>
	/** Optional. When omitted, section 01 renders only the problem copy (no magic-transform block). */
	context?: ContextConfig
	architecture: ArchitectureConfig
	features: Record<string, FeatureVisual>
}

import { otcVisuals } from "./otc"
import { busancVisuals } from "./busanc"
import { turismoChileToursVisuals } from "./turismochiletours"
import { tourSanPedroAtacamaVisuals } from "./toursanpedroatacama"
import { dashboardTurismoVisuals } from "./dashboard-turismo"
import { cuadrillasVisuals } from "./cuadrillas"

const REGISTRY: Record<string, CaseStudyVisuals> = {
	"otc-360": otcVisuals,
	"busanc": busancVisuals,
	"turismochiletours": turismoChileToursVisuals,
	"toursanpedroatacama": tourSanPedroAtacamaVisuals,
	"dashboard-turismo": dashboardTurismoVisuals,
	"bimakers": cuadrillasVisuals,
}

export function getCaseStudyVisuals(projectId: string): CaseStudyVisuals | null {
	return REGISTRY[projectId] ?? null
}
