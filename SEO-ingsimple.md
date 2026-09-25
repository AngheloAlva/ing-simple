# SEO — Ingeniería Simple

> Estado al 2026-09-06. El plan original (escrito contra una versión anterior del
> repo) se ejecutó por completo en esta pasada; lo que queda es post-lanzamiento
> y depende de tener el dominio apuntando a producción.

---

## 1. Cómo está resuelto (referencia rápida)

| Tema | Dónde vive |
|---|---|
| Dominios | `ingenieriasimple.cl` es el sitio; `ingsimple.cl` es el correo. Ambos son de la empresa (confirmado 2026-09-06), no hay que unificarlos. |
| Dominio y canonicals | `lib/metadata.ts` → `resolveSiteUrl()`: `NEXT_PUBLIC_SITE_URL` → producción en Vercel = `https://ingenieriasimple.cl` → URL de preview → localhost. |
| Indexación por entorno | `isIndexable` en `lib/metadata.ts`; `app/robots.ts` bloquea todo salvo producción (escape: `NEXT_PUBLIC_ALLOW_INDEXING=true`). |
| Idioma | `<html lang="es-CL">`, `openGraph.locale: "es_CL"`, `inLanguage: "es-CL"` en JSON-LD. |
| Metadata por página | `createMetadata()` en `lib/metadata.ts`. Restata `openGraph`/`twitter` completos en cada página porque Next reemplaza esos objetos por clave, no los fusiona. El home usa `absoluteTitle`. |
| Imagen OG / Twitter | `app/opengraph-image.tsx` y `app/twitter-image.tsx` (1200×630, `ImageResponse`, sin `sharp`). Se generan en build y se aplican a todas las rutas. |
| Íconos | `app/icon.svg` (vector), `app/icon.tsx` (PNG 32), `app/apple-icon.tsx` (PNG 180). Baldosa azul de marca con el isotipo en blanco. Fuente del isotipo: `public/isotipo.svg`. `public/site.webmanifest` apunta a ellos. |
| Sitemap | `app/sitemap.ts` → `buildSitemap()` en `lib/seo/sitemap.ts`. `lastModified`: constante `CONTENT_UPDATED_AT` para páginas estáticas y servicios (**subirla cuando cambie la copy**); último hito parseado para casos. |
| JSON-LD | Builders puros en `lib/seo/json-ld.ts`, montados con `components/json-ld.tsx`. Layout: `ProfessionalService` + `WebSite`. Home: `FAQPage` (datos en `lib/home-faq.ts`). Servicios: `Service` + `FAQPage` + `BreadcrumbList`. Casos: `Article` + `BreadcrumbList`. Nosotros y Contacto: `BreadcrumbList`. |
| Search Console | `verification.google` se lee de `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` y se omite si no está. |
| Tests | Vitest (`pnpm test`). Cubre `createMetadata`, sitemap, builders JSON-LD, parseo de fechas y el escape del script JSON-LD. |

Un solo `<h1>` por página (el mockup de ERP del showcase usaba uno decorativo; ya no).

### Reglas de copy (revisión del 2026-09-06)

- **Marca en títulos y JSON-LD: "Ingeniería Simple"**. "IngSimple" es `siteConfig.shortName`, `alternateName` y etiqueta junto al logo.
- **La promesa de contacto es una respuesta humana por correo en menos de 24 horas hábiles.** Es un compromiso operativo, no una garantía programática. El backend intenta enviar una confirmación automática, pero la interfaz no afirma que se haya enviado. No escribir "agenda", "llamada" ni "30 minutos" mientras no exista un calendario real.
- **Etiquetas de CTA:** "Hablemos de tu proyecto" en el hero del inicio y el hero de detalle de casos publicados; "Conversemos" en el resto de sus ubicaciones (nav y tarjetas); "Pide tu diagnóstico gratis" al final de página. Enlaces a servicios: "Ver {servicio}", nunca "Ver más".
- **Títulos en sentence case.** Los nombres de módulos de producto y de clientes se respetan.
- **Title por página:** keyword primero, "en Chile" en servicios, sufijo de marca. Rondan 50–70 caracteres; Google recorta el sufijo, no la keyword.
- Los títulos de casos usan `seoLabel` (qué es el sistema) vía `caseStudyTitle()` en `lib/seo/titles.ts`.

---

## 2. Post-lanzamiento (requiere el dominio en producción)

- [ ] Verificar `ingenieriasimple.cl` en **Google Search Console**: crear la propiedad, poner el token en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Vercel → producción), redeploy, y enviar `/sitemap.xml`.
- [ ] Confirmar indexación a las semanas: `site:ingenieriasimple.cl`.
- [ ] Validar JSON-LD con la prueba de resultados enriquecidos de Google en home, un servicio y un caso.
- [ ] Probar la tarjeta social con el Post Inspector de LinkedIn y un mensaje de WhatsApp a uno mismo.
- [ ] Medir Core Web Vitals en móvil con PageSpeed Insights. Ojo con el `.mp4` del hero (textura WebGL en `components/ascii-waves.tsx`) y con Three.js: candidatos si el LCP sale mal.
- [ ] Decidir si se agrega analytics (`@vercel/analytics` es lo natural en Vercel; hoy no hay ninguno).

---

## 3. Decisiones abiertas

- **Guías (blog).** La autoridad en temas sin caso publicado (IA en procesos, ley 21.719) hoy no tiene dónde vivir. Es la siguiente palanca de SEO real, y es contenido, no técnica. Falta decidir MDX vs CMS.
- **Títulos con ángulo geográfico.** Los `seoTitle` de servicios son buenos pero ninguno menciona Chile. Cambio de copy, no de código: se edita en `lib/services.ts`.
