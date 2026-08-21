"use client";

import { CornerPlus } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Question = {
  q: string;
  options: { label: string; score: number }[];
};

const QUESTIONS: Question[] = [
  {
    q: "¿Cómo arma tu equipo los reportes hoy?",
    options: [
      { label: "Copiando y pegando entre planillas", score: 0 },
      { label: "Con tablas dinámicas y fórmulas", score: 1 },
      { label: "Con Power BI u otra herramienta de BI", score: 2 },
    ],
  },
  {
    q: "Si la persona que sabe “del informe” se toma vacaciones…",
    options: [
      { label: "El informe no sale", score: 0 },
      { label: "Sale, pero tarda el doble", score: 1 },
      { label: "Cualquiera del equipo lo saca igual", score: 2 },
    ],
  },
  {
    q: "¿Qué les gustaría lograr después de capacitarse?",
    options: [
      { label: "Dominar Excel de verdad", score: 0 },
      { label: "Construir sus propios dashboards", score: 1 },
      { label: "Automatizar reportes y crear apps internas", score: 2 },
    ],
  },
];

type Program = {
  name: string;
  headline: string;
  desc: string;
  topics: string[];
};

const PROGRAMS: Program[] = [
  {
    name: "Programa Base",
    headline: "Fundamentos sólidos primero",
    desc: "Tu equipo va a ganar más partiendo por dominar la herramienta que ya usa todos los días: Excel a nivel profesional, con datos ordenados y reportes que no se rompen.",
    topics: [
      "Excel avanzado",
      "Tablas dinámicas",
      "Power Query inicial",
      "Buenas prácticas de datos",
    ],
  },
  {
    name: "Programa Intermedio",
    headline: "Del Excel al dashboard",
    desc: "El equipo ya tiene base: el siguiente salto es dejar el reporte estático y construir dashboards en Power BI que se actualizan solos.",
    topics: [
      "Power BI desde cero",
      "Power Query",
      "Modelado de datos",
      "Publicación y permisos",
    ],
  },
  {
    name: "Programa Avanzado",
    headline: "Autonomía total del equipo",
    desc: "Tu equipo está listo para el nivel donde el conocimiento se multiplica: métricas avanzadas, apps internas y flujos automatizados construidos por ustedes mismos.",
    topics: ["DAX avanzado", "Modelado", "Power Apps", "Power Automate"],
  },
];

function programFor(score: number): Program {
  if (score <= 2) return PROGRAMS[0] as Program;
  if (score <= 4) return PROGRAMS[1] as Program;
  return PROGRAMS[2] as Program;
}

export function ModuleQuiz(): ReactNode {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step >= QUESTIONS.length;
  const question = QUESTIONS[step];
  const score = answers.reduce((total, value) => total + value, 0);
  const program = programFor(score);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="text-sm font-medium text-muted-foreground">
          Diagnóstico exprés
        </p>
        <h2 className="mt-4 text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          ¿Qué programa le calza{" "}
          <span className="font-sans font-semibold tracking-tight">
            a tu equipo?
          </span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Tres preguntas, quince segundos. Sin correo de por medio.
        </p>
      </div>

      <div className="relative mx-auto max-w-2xl border-y border-border">
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <div className="px-5 py-10 sm:px-10 sm:py-12">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {done
                ? "Resultado"
                : `Pregunta ${step + 1} de ${QUESTIONS.length}`}
            </p>
            <div className="flex gap-1.5" aria-hidden="true">
              {QUESTIONS.map((entry, i) => (
                <span
                  key={entry.q}
                  className={`h-1 w-8 transition-colors duration-300 ${
                    i < step || done ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 min-h-[260px] sm:min-h-[240px]">
            <AnimatePresence mode="wait">
              {!done && question ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {question.q}
                  </h3>
                  <div className="mt-6 flex flex-col gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => [...prev, option.score])
                        }
                        className="focus-ring group flex items-center justify-between gap-4 border border-dotted border-border px-5 py-4 text-left text-sm font-medium transition-colors hover:border-solid hover:border-primary hover:bg-primary/5 hover:text-primary"
                      >
                        {option.label}
                        <span
                          aria-hidden="true"
                          className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                        >
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    {program.name}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    {program.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {program.desc}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {program.topics.map((topic) => (
                      <li
                        key={topic}
                        className="border border-dotted border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <CutButton variant="solid" icon="arrow" href="/contacto">
                      Arma este programa con nosotros
                    </CutButton>
                    <button
                      type="button"
                      onClick={() => setAnswers([])}
                      className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Repetir
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
        Es una orientación inicial: el programa definitivo se diseña con el
        diagnóstico de nivel real de tu equipo.
      </p>
    </section>
  );
}
