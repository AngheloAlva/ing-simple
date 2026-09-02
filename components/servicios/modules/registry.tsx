import { ModuleAnatomy } from "@/components/servicios/modules/anatomy"
import { ModuleCalculator } from "@/components/servicios/modules/calculator"
import { ModuleProcessToSystem } from "@/components/servicios/modules/process-to-system"
import { ModuleQuiz } from "@/components/servicios/modules/quiz"
import type { ModuleProps } from "@/components/servicios/modules/types"
import type { ReactNode } from "react"

/**
 * Signature interactive module per service page, keyed by slug — mirrors the
 * `SERVICE_VISUALS` pattern so slugs stay configurable in `lib/services.ts`.
 */
export const SERVICE_MODULES: Record<string, (props: ModuleProps) => ReactNode> = {
	"reportabilidad": ModuleAnatomy,
	"capacitaciones": ModuleQuiz,
	"desarrollo-web": ModuleProcessToSystem,
	"automatizaciones": ModuleCalculator,
}

export type IncludesVariant = "cards" | "syllabus" | "browser"

/**
 * Visual dialect of the "Qué incluye" section per service, so the four pages
 * read as four different services instead of one template with new copy.
 */
export const SERVICE_INCLUDES_VARIANTS: Record<string, IncludesVariant> = {
	"reportabilidad": "cards",
	"capacitaciones": "syllabus",
	"desarrollo-web": "browser",
	"automatizaciones": "cards",
}
