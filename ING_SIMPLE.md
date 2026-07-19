# IngSimple

Soluciones simples para un mundo digital complejo

IngSimple es una empresa dedicada a acompañar a organizaciones en sus procesos de transformación digital. Nuestro enfoque combina tecnología, análisis, desarrollo y capacitación para entregar soluciones simples, efectivas y adaptadas a cada cliente. Creemos que la digitalización no debe ser compleja ni costosa, sino una herramienta accesible que impulse el crecimiento y la eficiencia de cualquier negocio.

## ¿Qué hacemos?

En IngSimple ayudamos a empresas a optimizar, automatizar y comprender mejor sus procesos mediante herramientas modernas y soluciones inteligentes. Nuestra propuesta se organiza en cuatro líneas de negocio, cada una pensada para abordar desafíos distintos dentro de una organización.

## 1. Reportabilidad, Dashboards y Analítica

Apoyamos a empresas a tomar decisiones informadas mediante indicadores claros, dashboards dinámicos y reportes automatizados. Transformamos datos dispersos en información útil que permite ver el desempeño real del negocio, identificar oportunidades de mejora y actuar rápidamente. Desde métricas operativas hasta análisis ejecutivos, entregamos reportabilidad estratégica alineada a tus objetivos.

## 2. Cursos y Capacitaciones

Formamos a equipos y profesionales en herramientas clave como Power BI, Power Apps, Excel avanzado, automatización y más. Nuestras capacitaciones se adaptan al nivel y necesidades de cada organización, integrando prácticas reales, ejercicios aplicados y acompañamiento continuo. Buscamos que cada persona pueda dominar la tecnología con confianza y aplicarla en su día a día.

## 3. Soluciones Web

Desarrollamos sitios web modernos, rápidos y funcionales que representan a tu empresa y se integran con tus procesos. Ya sea una landing informativa, un sitio corporativo o un portal para clientes, diseñamos soluciones enfocadas en experiencia de usuario, claridad y resultados. Nos aseguramos de que tu presencia digital sea sólida, profesional y aporte valor real.

## 4. Soluciones Power Platform

Creamos aplicaciones internas, automatizaciones y flujos inteligentes que reemplazan procesos manuales y mejoran la eficiencia operativa. Con Power Apps, Power Automate, SharePoint y la suite Microsoft, digitalizamos formularios, gestionamos operaciones, conectamos datos y simplificamos tareas repetitivas. Son soluciones rápidas de implementar, flexibles y escalables.

## Nuestro propósito

Más allá de crear herramientas, nuestro objetivo es hacer que la tecnología sea útil, comprensible y realmente aplicable. Acompañamos a nuestros clientes desde el inicio hasta la implementación final, siempre con un enfoque humano, transparente y orientado a resultados.

## ¿Colaboramos?

Buscamos construir relaciones estratégicas con empresas que compartan nuestra visión de innovación simple y efectiva.
Ya sea para desarrollar proyectos en conjunto, formar equipos o apoyar procesos internos, estamos listos para aportar valor.

---

# Migración a nuevo template — Manifiesto de contenido

Este documento sirve como guía para llevar el contenido de la web actual a un nuevo template. Acá NO está el contenido en sí, solo los punteros a dónde vive cada cosa en este repo. Ir marcando cada ítem a medida que se copia.

## Estructura de la web actual

Rutas públicas del sitio:

- `/` — Home
- `/servicios/reportabilidad` — Reportabilidad, Dashboards y Analítica
- `/servicios/soluciones-web` — Soluciones Web
- `/servicios/power-platform` — Soluciones Power Platform ⚠️ **va a cambiar** (ver Notas)
- `/servicios/capacitaciones` — Cursos y Capacitaciones
- `/portafolio` — Grilla de proyectos
- `/casos` — Casos de estudio detallados
- `/sobre-nosotros`
- `/contacto`
- `/privacidad`

## Archivos de datos a copiar

- [ ] `src/lib/portfolio-data.ts` — **EL ARCHIVO MÁS IMPORTANTE.** Data completa del portafolio: 18 proyectos, de los cuales 9 tienen caso de estudio completo (problema, solución, stack técnico con justificación de cada decisión, features, métricas, timeline y before/after): **OTC 360, Bimakers, Busanc, TurismoChileTours (sitio corporativo), Tour San Pedro de Atacama (ecommerce), Dashboard TurismoChileTours, BZ Consulting, Grupo CAEMP y Desafío PEI — AIEP**. El archivo incluye los tipos TypeScript (`ProjectData`, `CaseStudy`, etc.) y `CATEGORY_LABELS`. Copiar el archivo entero tal cual — los casos de estudio ya están escritos y listos para reutilizar.
- [ ] `src/lib/config.ts` — Copy global del sitio: navegación, hero de home, "cómo funciona", features, stats, testimonios, pricing, FAQ, CTA final y footer.
- [ ] `src/lib/metadata.ts` — Metadata SEO base (título, descripción, OpenGraph).
- [ ] Copy de las páginas de servicio y home — **OJO: no está en ningún archivo de datos.** Está hardcodeado dentro de los componentes de sección en `src/components/sections/` (carpetas `home/`, `reportability/`, `web/`). Hay que extraer los textos de cada `.tsx` al rehacer esas páginas en el nuevo template.

## Assets a copiar

- [ ] `public/img/logos/` — 18 logos de clientes (svg/png/avif)
- [ ] `public/img/portfolio/` — imágenes del portafolio + subcarpetas por proyecto (`turismochiletours/`, `toursanpedroatacama/`, `bzconsulting/`, `caemp/`, `aiep-pei/`)
- [ ] `public/img/about/` — 4 imágenes de las líneas de negocio
- [ ] `public/img/reportability/` — 8 imágenes de la página de reportabilidad
- [ ] `public/img/about-us.jpg` y `public/img/services.jpg`
- [ ] `public/logo.svg`, `public/logo-mini.svg`, `public/nube.svg`, `public/nube-blank.svg`, `public/site.webmanifest` — identidad de marca

## Notas

- Los 9 casos de estudio completos son el activo de contenido más valioso del sitio: tienen narrativa de problema/solución, métricas reales de operación y justificación técnica de cada herramienta. Reutilizarlos tal cual.
- Los otros 9 proyectos del portafolio tienen descripción corta + larga, tecnologías, categoría y logo (sin caso de estudio detallado).
- Categorías del portafolio: Desarrollo Web, Power Platform, Capacitaciones, Reportabilidad.
- **IMPORTANTE para el desarrollo del nuevo template:** hoy TODO el contenido de portafolio y casos de estudio es de la categoría Desarrollo Web (los 18 proyectos). Power Platform, Capacitaciones y Reportabilidad están en 0, PERO van a tener contenido a futuro. El nuevo template tiene que contemplar las 4 categorías desde el diseño: filtros por categoría, estados vacíos ("aún no hay proyectos en esta categoría"), y secciones de casos de estudio que escalen a las otras áreas sin rediseñar. No hardcodear la grilla ni las páginas de casos asumiendo que todo es desarrollo web.
- **El servicio "Soluciones Power Platform" va a cambiar a "Automatizaciones de procesos":** el contenido será distinto — más general, no solo enfocado en el stack Microsoft (Power Apps, Power Automate, SharePoint). Implicancias para la migración:
  - NO migrar el copy de la página `/servicios/power-platform` como definitivo: se va a reescribir con el nuevo enfoque.
  - La ruta probablemente cambie (ej. `/servicios/automatizaciones`). No hardcodear slugs de servicios en el nuevo template.
  - La categoría `power-platform` del portafolio (`CATEGORY_LABELS` en `portfolio-data.ts`) probablemente también se renombre acorde. Mantener las categorías configurables, no escritas a fuego en el código.
  - En la descripción institucional de este documento (sección "4. Soluciones Power Platform") el texto queda desactualizado cuando se concrete el cambio — revisarla en ese momento.
- Todo el contenido del sitio está en español.
