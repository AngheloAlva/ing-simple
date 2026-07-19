import { DetailArchitecture } from "@/components/case-study/detail-architecture";
import { DetailBeforeAfter } from "@/components/case-study/detail-before-after";
import { DetailContext } from "@/components/case-study/detail-context";
import { DetailFeatures } from "@/components/case-study/detail-features";
import { DetailHero } from "@/components/case-study/detail-hero";
import { DetailMetrics } from "@/components/case-study/detail-metrics";
import { DetailRelated } from "@/components/case-study/detail-related";
import { DetailSolution } from "@/components/case-study/detail-solution";
import { DetailTechStack } from "@/components/case-study/detail-tech-stack";
import { DetailTimeline } from "@/components/case-study/detail-timeline";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { createMetadata } from "@/lib/metadata";
import { InView } from "@/lib/motion";
import { portfolioProjects } from "@/lib/portfolio-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams(): { id: string }[] {
  return portfolioProjects
    .filter((project) => project.isFlagship && project.caseStudy)
    .map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = portfolioProjects.find((p) => p.id === id);

  if (!project || !project.caseStudy) {
    return createMetadata({
      title: "Caso no encontrado",
      path: `/casos/${id}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${project.title} — Caso de estudio`,
    description: project.caseStudy.pitch,
    path: `/casos/${id}`,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: PageProps): Promise<ReactNode> {
  const { id } = await params;
  const project = portfolioProjects.find((p) => p.id === id);

  if (!project || !project.caseStudy || !project.isFlagship) {
    notFound();
  }

  const caseStudy = project.caseStudy;
  // Template primary as fallback so accent-driven details stay on-brand.
  const accent = project.gradientColor ?? "#2f80ff";

  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <DetailHero project={project} caseStudy={caseStudy} accent={accent} />
        <DetailContext project={project} caseStudy={caseStudy} />
        <DetailSolution caseStudy={caseStudy} />
        <DetailArchitecture
          project={project}
          caseStudy={caseStudy}
          accent={accent}
        />
        <DetailTechStack caseStudy={caseStudy} accent={accent} />
        <DetailFeatures project={project} caseStudy={caseStudy} accent={accent} />
        <DetailTimeline caseStudy={caseStudy} accent={accent} />
        <DetailMetrics caseStudy={caseStudy} accent={accent} />
        <DetailBeforeAfter caseStudy={caseStudy} accent={accent} />
        <DetailRelated currentId={project.id} />
        <FinalCta />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
