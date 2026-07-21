import { DiagramAutomationInteractive } from "@/components/diagrams/automation-interactive";
import { DiagramReportabilityInteractive } from "@/components/diagrams/reportability-interactive";
import { DiagramTrainingInteractive } from "@/components/diagrams/training-interactive";
import { DiagramWebInteractive } from "@/components/diagrams/web-interactive";
import type { ReactNode } from "react";

/**
 * Interactive "build it on hover" diagram per service line, keyed by href.
 * Each one starts empty and assembles itself as the visitor explores it.
 */
export const SERVICE_DIAGRAMS: Record<string, () => ReactNode> = {
  "/servicios/reportabilidad": DiagramReportabilityInteractive,
  "/servicios/capacitaciones": DiagramTrainingInteractive,
  "/servicios/soluciones-web": DiagramWebInteractive,
  "/servicios/automatizaciones": DiagramAutomationInteractive,
};

/**
 * Diagrams that render their own chrome and should be shown without the outer
 * "cut" frame that static diagrams would sit inside. All current diagrams are
 * self-framed, but the flag is kept so static ones can be mixed back in.
 */
export const SELF_FRAMED_DIAGRAMS = new Set<string>([
  "/servicios/reportabilidad",
  "/servicios/capacitaciones",
  "/servicios/soluciones-web",
  "/servicios/automatizaciones",
]);
