"use client";

import { motion, type Variants } from "motion/react";
import { Target, Eye, type LucideIcon } from "lucide-react";
import { softEase, useReducedMotion } from "@/lib/motion";
import { CornerPlus } from "@/components/corner-plus";

interface Pillar {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
}

const pillars: Pillar[] = [
  {
    icon: Target,
    label: "Misión",
    title: "Simplificar la tecnología",
    body: "Entregar soluciones tecnológicas simples y efectivas que permitan a las organizaciones optimizar sus procesos, tomar mejores decisiones y enfocarse en lo que realmente importa: su negocio.",
  },
  {
    icon: Eye,
    label: "Visión",
    title: "Potencia sin complejidad",
    body: "Ser el referente en transformación digital para organizaciones que buscan simplicidad sin sacrificar potencia. Que cada empresa pueda acceder a tecnología de primer nivel, sin complejidad innecesaria.",
  },
];

export function NosotrosMissionVision() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: softEase },
    },
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative border border-border"
      >
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {pillars.map(({ icon: Icon, label, title, body }) => (
            <motion.article
              key={label}
              variants={item}
              className="relative overflow-hidden p-8 sm:p-10"
            >
              {/* Single background watermark icon */}
              <Icon
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none absolute -right-5 -top-5 h-36 w-36 text-[#2f80ff]/[0.08]"
              />
              <div className="relative">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {label}
                </p>
                <h2 className="mt-3 font-serif text-2xl font-normal tracking-tight sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
