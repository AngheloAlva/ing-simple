import type { Shape } from "@/components/ascii-icon";
import {
  BarChart3,
  Code,
  GraduationCap,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for IngSimple's four service lines.
 * Consumed by the navbar dropdown (`nav.tsx`) and the home Features grid
 * (`features.tsx`) so the two never drift. Slugs are intentionally not
 * hardcoded elsewhere — reference `href`/`slug` from here.
 */
export type Service = {
  number: string;
  /** Short label used as the card meta and in compact contexts. */
  shortName: string;
  /** Full title shown in the navbar dropdown. */
  title: string;
  /** One-line description for the navbar dropdown. */
  desc: string;
  href: string;
  /** Lucide icon for the navbar dropdown. */
  icon: LucideIcon;
  /** Benefit-framed heading, reused as the Features card title. */
  featureTitle: string;
  /** Benefit-framed body, reused as the Features card body. */
  featureDesc: string;
  /** ASCII-icon shape for the Features card. */
  shape: Shape;
  /** Short "what's included" points shown in the home services showcase. */
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    number: "01",
    shortName: "Reportabilidad",
    title: "Reportabilidad, Dashboards y Analítica",
    desc: "Dashboards dinámicos y reportes automatizados para decidir con datos.",
    href: "/servicios/reportabilidad",
    icon: BarChart3,
    featureTitle: "Decisiones basadas en datos",
    featureDesc:
      "Centralizamos tus fuentes en dashboards claros y reportes automáticos que actualizan solos.",
    shape: "bars",
    bullets: [
      "Dashboards dinámicos e interactivos",
      "Reportes automatizados que se actualizan solos",
      "Métricas operativas y ejecutivas en un solo lugar",
    ],
  },
  {
    number: "02",
    shortName: "Capacitaciones",
    title: "Cursos y Capacitaciones",
    desc: "Formación en Power BI, Power Apps, Excel avanzado y más.",
    href: "/servicios/capacitaciones",
    icon: GraduationCap,
    featureTitle: "Equipos más autónomos",
    featureDesc:
      "Capacitaciones prácticas y a medida para que tu equipo domine sus herramientas.",
    shape: "plus",
    bullets: [
      "Power BI, Power Apps y Excel avanzado",
      "Ejercicios y casos prácticos reales",
      "Acompañamiento continuo post-capacitación",
    ],
  },
  {
    number: "03",
    shortName: "Soluciones Web",
    title: "Soluciones Web",
    desc: "Sitios y sistemas web modernos, rápidos y a medida.",
    href: "/servicios/soluciones-web",
    icon: Code,
    featureTitle: "Presencia digital a medida",
    featureDesc:
      "Sitios y sistemas web modernos, rápidos y pensados para tus procesos.",
    shape: "scan",
    bullets: [
      "Landing pages y sitios corporativos",
      "Portales y sistemas web a medida",
      "Enfoque en experiencia de usuario y performance",
    ],
  },
  {
    number: "04",
    shortName: "Automatizaciones",
    title: "Automatizaciones de procesos",
    desc: "Automatizamos tareas y flujos repetitivos para ganar eficiencia.",
    href: "/servicios/automatizaciones",
    icon: Workflow,
    featureTitle: "Menos tareas manuales",
    featureDesc:
      "Automatizamos flujos repetitivos para reducir errores y liberar tiempo del equipo.",
    shape: "bolt",
    bullets: [
      "Automatización de tareas y flujos repetitivos",
      "Integración de datos entre tus sistemas",
      "Menos errores y más tiempo para tu equipo",
    ],
  },
];
