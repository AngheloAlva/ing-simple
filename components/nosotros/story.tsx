"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { softEase, useReducedMotion } from "@/lib/motion";
import { CutButton } from "@/components/cut-button";
import { Kicker } from "@/components/corner-plus";

interface Chapter {
  year: string;
  title: string;
  detail: string;
  image: string;
  imageAlt: string;
}

// The 4 real milestones of IngSimple, migrated from the previous site.
const chapters: Chapter[] = [
  {
    year: "2023",
    title: "Power BI",
    detail:
      "Comenzamos transformando datos en decisiones. Nuestros primeros dashboards y reportes en Power BI ayudaron a empresas a visualizar su información de forma clara y accionable.",
    image: "/img/about/power-bi.png",
    imageAlt: "Dashboards y reportes en Power BI",
  },
  {
    year: "2024",
    title: "Power Platform",
    detail:
      "Escalamos hacia Power Apps, Power Automate y SharePoint. Empezamos a digitalizar formularios, automatizar flujos y reemplazar procesos manuales con soluciones rápidas y escalables.",
    image: "/img/about/power-platform.png",
    imageAlt: "Automatización de procesos con Power Platform",
  },
  {
    year: "2024",
    title: "Capacitaciones",
    detail:
      "Abrimos nuestra línea de formación. Cursos prácticos de Power BI, Power Apps y Excel avanzado adaptados al nivel de cada equipo, con ejercicios reales y acompañamiento continuo.",
    image: "/img/about/training.png",
    imageAlt: "Capacitación de equipos",
  },
  {
    year: "2025",
    title: "Desarrollo Web",
    detail:
      "Incorporamos el desarrollo de sitios web modernos y funcionales. Landing pages, sitios corporativos y portales enfocados en experiencia de usuario y resultados concretos.",
    image: "/img/about/web.png",
    imageAlt: "Desarrollo web moderno",
  },
];

const meta = [
  { value: "18", label: "Proyectos entregados" },
  { value: "4", label: "Líneas de negocio" },
];

export function NosotrosStory() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const timeline: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: softEase },
    },
  };

  const railVariant: Variants = {
    hidden: { scaleY: reduce ? 1 : 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.1, ease: softEase },
    },
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Left column — hero intro, sticky */}
        <div className="lg:sticky lg:top-24">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={item}>
              <Kicker>Sobre Nosotros</Kicker>
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-balance font-serif text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]"
            >
              Hacemos lo complejo,{" "}
              <span className="text-brand-blue">simple</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Somos un equipo de ingenieros y consultores apasionados por la
              tecnología. Acompañamos a organizaciones en su transformación
              digital con soluciones que realmente funcionan.
            </motion.p>
            <motion.div variants={item} className="mt-8">
              <CutButton variant="solid" icon="arrow" href="/contacto">
                Conversemos
              </CutButton>
            </motion.div>
            <motion.dl
              variants={item}
              className="mt-10 flex gap-10 border-t border-dotted border-border pt-6"
            >
              {meta.map((entry) => (
                <div key={entry.label}>
                  <dt className="sr-only">{entry.label}</dt>
                  <dd className="font-serif text-3xl font-normal tracking-tight tabular-nums sm:text-4xl">
                    {entry.value}
                  </dd>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.label}
                  </p>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

        {/* Right column — history timeline */}
        <motion.div
          variants={timeline}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          <motion.div
            variants={railVariant}
            className="absolute bottom-1.5 left-[5px] top-1.5 w-px origin-top bg-border"
          />
          <div className="space-y-14 sm:space-y-16">
            {chapters.map((chapter, i) => (
              <motion.article
                key={`${chapter.year}-${chapter.title}`}
                variants={item}
                className="relative pl-10 sm:pl-14"
              >
                <span className="absolute left-0 top-0.5 h-[11px] w-[11px] bg-foreground ring-4 ring-background" />
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {chapter.year}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                  {chapter.title}
                </h2>
                <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                  {chapter.detail}
                </p>
                <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden border border-border bg-muted">
                  <Image
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
