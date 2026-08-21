import { ModuleAnatomy } from "@/components/servicios/modules/anatomy";
import { ModuleBeforeAfter } from "@/components/servicios/modules/before-after";
import { ModuleCalculator } from "@/components/servicios/modules/calculator";
import { ModuleQuiz } from "@/components/servicios/modules/quiz";
import type { ReactNode } from "react";

/**
 * Signature interactive module per service page, keyed by slug — mirrors the
 * `SERVICE_DIAGRAMS` pattern so slugs stay configurable in `lib/services.ts`.
 */
export const SERVICE_MODULES: Record<string, () => ReactNode> = {
  reportabilidad: ModuleAnatomy,
  capacitaciones: ModuleQuiz,
  "soluciones-web": ModuleBeforeAfter,
  automatizaciones: ModuleCalculator,
};

export type IncludesVariant = "dashboard" | "syllabus" | "browser" | "flow";

/**
 * Visual dialect of the "Qué incluye" section per service, so the four pages
 * read as four different services instead of one template with new copy.
 */
export const SERVICE_INCLUDES_VARIANTS: Record<string, IncludesVariant> = {
  reportabilidad: "dashboard",
  capacitaciones: "syllabus",
  "soluciones-web": "browser",
  automatizaciones: "flow",
};
