import { AutomationFlow } from "@/components/diagrams/flow/automation-flow"
import { TrainingProgram } from "@/components/diagrams/program/training-program"
import { ReportabilityReport } from "@/components/diagrams/report/reportability-report"
import { WebSolution } from "@/components/diagrams/site/web-solution"
import type { ReactNode } from "react"

/**
 * The interactive artefact of each service line, keyed by href. Shown in the
 * home services stack and in the hero of each service page: a report that
 * works, a programme that lifts a team, a site in production, a flow running.
 */
export const SERVICE_VISUALS: Record<string, () => ReactNode> = {
	"/servicios/reportabilidad": ReportabilityReport,
	"/servicios/capacitaciones": TrainingProgram,
	"/servicios/soluciones-web": WebSolution,
	"/servicios/automatizaciones": AutomationFlow,
}
