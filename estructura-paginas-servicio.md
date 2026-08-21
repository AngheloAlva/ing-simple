# Estructura de páginas de servicio — Ingeniería Simple

> Recomendación: **sí conviene crear páginas dedicadas por servicio**, y además hoy es
> obligatorio hacerlo porque la navegación ya las enlaza y esos enlaces dan 404.
> Este documento define el problema, la arquitectura de ruteo y la plantilla de contenido.

---

## 1. Por qué conviene (y por qué es urgente)

**Urgente:** el nav (dropdown "Servicios"), el footer y los botones "Ver más" del home
**ya enlazan** a rutas de servicio que **no existen** en `app/`. Hoy eso son 404.

Enlaces rotos detectados:

| Origen | Enlaza a | Estado |
|---|---|---|
| `components/nav.tsx` (dropdown desktop y móvil) | `/servicios/reportabilidad`, `/servicios/capacitaciones`, `/servicios/soluciones-web`, `/servicios/automatizaciones` | ❌ 404 (no hay rutas) |
| `components/services.tsx` (botón "Ver más") | mismas rutas `service.href` | ❌ 404 |
| `components/nav.tsx` + `components/footer.tsx` | `/portafolio` | ❌ 404 (no existe la ruta) |
| `components/footer.tsx` | `/servicios/power-platform` | ❌ 404 + slug viejo (en `lib/services.ts` ya es `/servicios/automatizaciones`) |

**SEO (la razón de fondo):** con los servicios solo como secciones del home, compites por
todas las keywords desde una sola URL. Con una página por servicio, cada una puede rankear
por su propio cluster de forma independiente:

- `/servicios/reportabilidad` → "dashboards Power BI Chile"
- `/servicios/automatizaciones` → "automatización de procesos"
- `/servicios/soluciones-web` → "desarrollo web a medida"
- `/servicios/capacitaciones` → "capacitación Power BI / Excel"

Además te da URLs que puedes enlazar en propuestas, campañas y LinkedIn, y páginas donde
insertar `Service` schema y FAQ propias.

---

## 2. Arquitectura de ruteo recomendada

Seguí el mismo patrón que ya usas para casos (`app/casos/[id]/page.tsx` con
`generateStaticParams` + `generateMetadata`), alimentado por datos. Tu propio
`ING_SIMPLE.md` lo pide explícitamente: **no hardcodear slugs**, mantener categorías/servicios
configurables.

```
app/
  servicios/
    [slug]/
      page.tsx        ← ruta dinámica, una plantilla para los 4 servicios
```

- `generateStaticParams()` → deriva los slugs desde `lib/services.ts` (ya existen los
  `href`; extrae el slug del `href`).
- `generateMetadata()` → título, description y canonical por servicio + `Service` JSON-LD.
- El contenido de cada servicio vive en el archivo de datos, no en el `.tsx`.

### Extender `lib/services.ts` con el contenido de la página

Hoy `SERVICES` tiene lo justo para el nav y la tarjeta del home. Agrega los campos que la
página necesita (todo opcional para no romper lo existente):

```ts
export type Service = {
  // ...campos actuales (number, shortName, title, desc, href, icon, featureTitle,
  // featureDesc, shape, bullets)...

  /** slug limpio, derivado del href, para params y sitemap */
  slug: string;

  /** SEO por página */
  seoTitle: string;
  seoDescription: string;

  /** Hero de la página de servicio */
  pageTitle: string;      // el H1 (con keyword)
  pageSubtitle: string;

  /** Bloque "problema / a quién le sirve" */
  problem: string;
  audience: string[];     // ["Gerencias que necesitan...", ...]

  /** "Qué incluye" — versión extendida de bullets */
  includes: { title: string; desc: string }[];

  /** "Cómo trabajamos" */
  process: { step: string; title: string; desc: string }[];

  /** Herramientas/stack mostradas en la página */
  tools: string[];

  /** categoría del portafolio para filtrar casos relacionados */
  caseCategory: "web" | "reportabilidad" | "power-platform" | "capacitaciones";

  /** FAQ por servicio (sirve para FAQPage schema) */
  faq: { q: string; a: string }[];
};
```

> `caseCategory` es la llave que conecta el servicio con los casos: en la página filtras
> `portfolioProjects` por esa categoría y muestras los relacionados. Esto crea *internal
> linking* servicio → caso, que reparte autoridad hacia tus mejores páginas.

---

## 3. Plantilla de la página de servicio (orden de secciones)

Pensada para conversión **y** SEO. De arriba hacia abajo:

1. **Hero**
   - `<h1>` con keyword principal (beneficio + servicio). Un solo H1 por página.
   - Subtítulo (1–2 líneas) + CTA a `/contacto`.
   - Breadcrumb visible (Home / Servicios / [Servicio]) → refuerza `BreadcrumbList`.

2. **Problema / a quién le sirve**
   - Enmarca el dolor que resuelve y para qué perfil de empresa. Ayuda a la relevancia
     semántica y a que el visitante se identifique.

3. **Qué incluye**
   - Los `bullets` actuales, expandidos a `includes[]` (título + descripción corta). Aquí
     va el grueso del contenido indexable con las keywords secundarias.

4. **Cómo trabajamos** (proceso)
   - 3–5 pasos. Da confianza y suma contenido único por servicio.

5. **Casos relacionados**
   - Filtra los casos por `caseCategory` y muestra 2–3 con link a `/casos/[id]`.
   - Si la categoría aún no tiene casos (Reportabilidad, Automatizaciones, Capacitaciones),
     usa un estado alternativo: testimonio corto, o "cuéntanos tu caso" → evita el hueco.

6. **Herramientas / stack**
   - Chips o íconos (ya tienes muchos en `components/icons/`). Refuerza expertise.

7. **FAQ del servicio**
   - 4–6 preguntas reales. Reutiliza el patrón de `components/faq.tsx`. Marca con
     `FAQPage` JSON-LD.

8. **CTA final**
   - Reusa `components/final-cta.tsx`. Cierra siempre con acción a contacto.

9. **Footer** (el global).

**Metadata + schema de la página:** `generateMetadata` con `seoTitle`/`seoDescription` +
canonical `/servicios/[slug]`, más JSON-LD `Service` y `BreadcrumbList` (ver documento SEO,
sección 2).

---

## 4. Táctica de contenido: no todas al mismo nivel al inicio

Hoy **todo el portafolio y los 9 casos son de Desarrollo Web**. Reportabilidad,
Automatizaciones y Capacitaciones aún no tienen casos. Recomendación:

- **Soluciones Web:** página completa, con casos relacionados reales (tienes 9). Es tu
  página más fuerte, priorízala.
- **Reportabilidad:** página completa si tienes material; los casos relacionados pueden
  esperar (usa estado alternativo).
- **Automatizaciones** y **Capacitaciones:** páginas reales pero más acotadas (hero,
  problema, qué incluye, proceso, FAQ, CTA). Lo importante es que **existan, tengan
  contenido indexable y no den 404**. Las completas a medida que sumes casos.

> Ojo con "Automatizaciones de procesos": tu `ING_SIMPLE.md` indica que reemplaza al viejo
> "Power Platform" y que el enfoque será **más general, no solo stack Microsoft**. Escribe
> el copy nuevo desde ahí, no migres el texto viejo. Y renombra el slug/categoría del
> portafolio `power-platform` acorde, manteniéndolo configurable.

---

## 5. Correcciones de enlaces a hacer junto con esto

- [ ] Crear `app/servicios/[slug]/page.tsx` (resuelve los 404 de nav, footer y "Ver más").
- [ ] Footer: cambiar `/servicios/power-platform` → `/servicios/automatizaciones` y el
      label "Power Platform" → "Automatizaciones" (idealmente que el footer lea de
      `lib/services.ts` para no volver a desincronizarse).
- [ ] Decidir sobre `/portafolio`: o creas la página (grilla completa de 18 proyectos,
      distinta de `/casos` que son los 9 detallados) o quitas el enlace del nav y footer.
      Recomiendo crearla: es contenido indexable adicional y tienes la data lista en
      `lib/portfolio-data.ts`.
- [ ] Agregar `/servicios/[slug]` (y `/portafolio` si se crea) al sitemap dinámico.

---

## 6. Orden sugerido de implementación

1. Extender `lib/services.ts` con los campos de contenido (sección 2).
2. Crear `app/servicios/[slug]/page.tsx` con la plantilla (sección 3) + metadata + schema.
3. Escribir el contenido de los 4 servicios en los datos (empezando por Web).
4. Arreglar footer (slug + labels desde `lib/services.ts`).
5. Decidir/crear `/portafolio`.
6. Actualizar el sitemap.
7. Verificar que ningún enlace interno quede en 404.
