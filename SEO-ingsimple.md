# SEO — Ingeniería Simple (plan de acción)

> Estado del sitio: pre-lanzamiento (Next.js 16 / App Router). El SEO es el enfoque
> principal de esta nueva web, así que este documento ordena los arreglos por prioridad.
> Marca cada ítem `[x]` a medida que lo resuelves.

---

## 0. Resumen ejecutivo

Hoy el sitio tiene una base técnica muy buena, pero hay varios bugs que **anulan buena
parte del esfuerzo SEO**: el sitio declara idioma inglés, el sitemap solo incluye el home,
el dominio es un placeholder (`example.com`) y falta la imagen para compartir en redes.
Corregir esto es barato y de alto impacto. Después vienen las oportunidades que te hacen
rankear: datos estructurados (JSON-LD), páginas de servicio indexables (ver el otro
documento) y localización de títulos/keywords para Chile.

---

## 1. CRÍTICO — arreglar antes de publicar

Cada uno de estos hoy le manda una señal equivocada a Google o rompe algo visible.

### 1.1 Idioma del sitio en inglés
- **Archivo:** `app/layout.tsx`
- **Problema:** `<html lang="en">` en un sitio 100 % en español. Afecta señal de idioma
  en Google y accesibilidad (lectores de pantalla).
- **Fix:** cambiar a `lang="es"` (idealmente `es-CL`).

```tsx
// app/layout.tsx
<html lang="es-CL" suppressHydrationWarning className={...}>
```

### 1.2 OpenGraph con locale en inglés
- **Archivo:** `lib/metadata.ts`
- **Problema:** `openGraph.locale: "en_US"`.
- **Fix:** `locale: "es_CL"`.

### 1.3 Meta description del home mezclada con inglés
- **Archivo:** `app/page.tsx`
- **Problema:** la description se arma como `` `Welcome to ${siteConfig.name}. ...` `` →
  "Welcome to" se filtra al snippet en español.
- **Fix:** escribir una description propia en español, con keyword + ubicación. Ejemplo:
  `"Ingeniería Simple: transformación digital para empresas en Chile. Dashboards y
  reportabilidad, automatización de procesos, desarrollo web a medida y capacitaciones."`

### 1.4 Dominio placeholder (`example.com`)
- **Archivo:** `lib/metadata.ts` → `siteConfig.url`
- **Problema:** todas las URLs canónicas, OG y el sitemap apuntan a `https://example.com`.
  Si publicas así, el `<link rel="canonical">` le dice a Google que el contenido real vive
  en otro dominio → puede impedir que indexe tu sitio.
- **Fix:** poner el dominio final (ej. `https://ingsimple.cl`). Revisar también
  `siteConfig.authors[].url`, `creator`, y el `mailto`/dominio del footer para que todo sea
  consistente.

### 1.5 Sitemap solo contiene el home
- **Archivo:** `app/sitemap.ts`
- **Problema:** solo declara `baseUrl`. Ni `/casos`, ni cada caso `/casos/[id]`, ni
  `/sobre-nosotros`, ni `/contacto` están en el sitemap. Tus mejores páginas (los casos)
  quedan invisibles para el rastreo.
- **Fix:** generar el sitemap dinámicamente desde los datos. Debe incluir: home, `/casos`,
  cada caso de estudio flagship, `/sobre-nosotros`, `/contacto`, `/privacidad`, y (cuando
  existan) cada `/servicios/[slug]` y `/portafolio`.

```ts
// app/sitemap.ts (esquema)
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { portfolioProjects } from "@/lib/portfolio-data";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes = [
    { url: `${base}`,               priority: 1.0,  changeFrequency: "weekly"  },
    { url: `${base}/casos`,         priority: 0.9,  changeFrequency: "weekly"  },
    { url: `${base}/sobre-nosotros`,priority: 0.6,  changeFrequency: "monthly" },
    { url: `${base}/contacto`,      priority: 0.7,  changeFrequency: "yearly"  },
    { url: `${base}/privacidad`,    priority: 0.2,  changeFrequency: "yearly"  },
  ] as const;

  const servicePages = SERVICES.map((s) => ({
    url: `${base}${s.href}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const casePages = portfolioProjects
    .filter((p) => p.isFlagship && p.caseStudy)
    .map((p) => ({
      url: `${base}/casos/${p.id}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));

  return [
    ...staticRoutes.map((r) => ({ ...r, lastModified: new Date() })),
    ...servicePages.map((r) => ({ ...r, lastModified: new Date() })),
    ...casePages.map((r) => ({ ...r, lastModified: new Date() })),
  ];
}
```
> Nota: mientras las páginas de servicio no existan, no las incluyas en el sitemap (o crea
> primero las rutas). Un sitemap que apunta a 404 es contraproducente.

### 1.6 Imagen OG y favicons faltantes
- **Archivos:** `public/` + `lib/metadata.ts`
- **Problema:** `lib/metadata.ts` referencia `og-image.png`, `favicon-16x16.png` y
  `apple-icon.png`, pero **ninguno existe** en `public/`. Al compartir el sitio en
  WhatsApp/LinkedIn sale sin imagen, y hay 404 silenciosos de íconos.
- **Fix:**
  - Crear `public/og-image.png` (1200×630) con logo + tagline sobre fondo de marca.
  - Alinear los íconos: o generas los `.png` referenciados, o cambias la metadata para
    apuntar a los `.svg` que ya tienes (`app/icon.svg`, `app/apple-icon.svg`). En App
    Router, dejar `app/icon.svg` y `app/apple-icon.svg` es suficiente y puedes quitar la
    sección manual `icons` de `metadata.ts`.

### 1.7 Enlaces rotos (afectan rastreo y UX)
> Detalle completo y solución en el documento de estructura de servicios, pero se listan
> acá porque son también un problema SEO (Google penaliza enlaces internos a 404).
- Nav (dropdown) y footer enlazan a `/servicios/*` → **no existen** → 404.
- Nav y footer enlazan a `/portafolio` → **no existe** → 404.
- El footer aún usa el slug viejo `/servicios/power-platform` (inconsistente con
  `/servicios/automatizaciones` en `lib/services.ts`).

### 1.8 `robots.ts`
- **Archivo:** `app/robots.ts`
- **Observación menor:** usa `host`, que ya no es estándar (Google lo ignora; solo Yandex
  lo usaba). No molesta, pero puedes quitarlo. Lo importante (allow `/`, `sitemap`) está OK.
  Verifica que `disallow: ["/api/", "/private/"]` sea correcto — `/private/` no parece
  existir; no hace daño, pero mantenlo solo si lo vas a usar.

---

## 2. ALTO IMPACTO — datos estructurados (JSON-LD)

Para una consultora con oficina en Santiago, el structured data es de lo que mejor
relación esfuerzo/resultado tiene. Google lo usa para rich results, panel de marca y
búsqueda local.

### 2.1 Organization + LocalBusiness (global, en el layout)
Inyéctalo una vez (ej. en `app/layout.tsx` o un componente `<JsonLd>`), como `<script
type="application/ld+json">`.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Ingeniería Simple SpA",
  "alternateName": "IngSimple",
  "url": "https://ingsimple.cl",
  "logo": "https://ingsimple.cl/logo.svg",
  "image": "https://ingsimple.cl/og-image.png",
  "email": "contacto@ingsimple.cl",
  "description": "Transformación digital para empresas: reportabilidad y dashboards, automatización de procesos, desarrollo web y capacitaciones.",
  "areaServed": { "@type": "Country", "name": "Chile" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Santiago",
    "addressCountry": "CL"
  },
  "sameAs": [
    "https://www.linkedin.com/company/ingenieria-simple/"
  ]
}
```

### 2.2 Service (una por página de servicio)
En cada `/servicios/[slug]`:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Reportabilidad, Dashboards y Analítica",
  "provider": { "@type": "Organization", "name": "Ingeniería Simple SpA" },
  "areaServed": { "@type": "Country", "name": "Chile" },
  "description": "Dashboards dinámicos y reportes automatizados para decidir con datos."
}
```

### 2.3 BreadcrumbList (páginas internas)
Ayuda a que Google muestre la miga de pan en los resultados. Aplícalo en casos y servicios.

### 2.4 Article / CreativeWork (casos de estudio)
Cada caso en `/casos/[id]` puede marcarse como `Article` o `CreativeWork` (con `headline`,
`about`, `datePublished`). Refuerza que son contenido sustancial, no thin content.

### 2.5 FAQPage (home y por servicio)
Ya tienes un componente FAQ. Marcarlo con `FAQPage` puede ganar espacio extra en el
resultado de búsqueda (acordeón de preguntas).

---

## 3. ON-PAGE — títulos, descripciones y keywords localizadas

El `meta keywords` ya no lo usa Google, pero el ángulo geográfico + intención sí importa en
**títulos, H1 y descriptions**. Hoy las keywords son genéricas ("dashboards", "Power BI").

Clusters sugeridos por página (ajusta a tu realidad):

| Página | Keyword principal | Título sugerido (`<title>`) |
|---|---|---|
| Home | transformación digital Chile | `Ingeniería Simple — Transformación digital simple para tu empresa` |
| Reportabilidad | dashboards Power BI Chile | `Dashboards y Reportabilidad con Power BI \| IngSimple` |
| Automatizaciones | automatización de procesos | `Automatización de procesos para empresas \| IngSimple` |
| Soluciones Web | desarrollo web a medida | `Desarrollo web a medida y sitios corporativos \| IngSimple` |
| Capacitaciones | capacitación Power BI / Excel | `Capacitaciones en Power BI, Power Apps y Excel \| IngSimple` |
| Casos | casos de éxito software | `Casos de estudio: plataformas a medida en producción \| IngSimple` |

Buenas prácticas:
- Un solo `<h1>` por página, con la keyword principal (revisa que las secciones internas
  usen `<h2>`/`<h3>`, no múltiples `<h1>`).
- Description de 140–160 caracteres, en español, con beneficio + keyword + (a veces)
  ubicación. Sin "Welcome to".
- `title` de ~55–60 caracteres para que no se corte en el SERP.
- Actualiza `siteConfig.keywords` con variantes locales: "Power BI Chile", "automatización
  de procesos Santiago", "desarrollo web Chile", "Power Apps", "capacitación Excel avanzado".

---

## 4. Post-lanzamiento (no bloquea, pero hazlo)

- [ ] Verificar el dominio en **Google Search Console** y enviar el sitemap.
- [ ] Confirmar indexación de casos y servicios (`site:ingsimple.cl` en Google).
- [ ] Probar las tarjetas sociales (LinkedIn Post Inspector, validador de OG).
- [ ] Validar el JSON-LD con la prueba de resultados enriquecidos de Google.
- [ ] Medir Core Web Vitals (tienes video `.mp4` y librerías de animación pesadas —
      Three.js, GSAP en algunos componentes; revisar que no afecten LCP en móvil).
- [ ] Comprimir/lazy-load los `.mp4` de `public/` si se usan above the fold.

---

## Checklist rápido de lanzamiento

- [ ] `lang="es-CL"` en `<html>`
- [ ] `locale: "es_CL"` en OpenGraph
- [ ] Description del home reescrita (sin inglés)
- [ ] `siteConfig.url` con el dominio real
- [ ] Sitemap dinámico con todas las rutas
- [ ] `og-image.png` (1200×630) creado
- [ ] Favicons alineados (o usar los `.svg` del App Router)
- [ ] Sin enlaces internos a 404 (`/servicios/*`, `/portafolio`, slug `power-platform`)
- [ ] JSON-LD Organization/LocalBusiness en el layout
- [ ] JSON-LD Service + BreadcrumbList en páginas internas
- [ ] Títulos/descriptions localizados por página
- [ ] Search Console + sitemap enviado
