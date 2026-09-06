# Cómo escribir una guía

Esta carpeta es el contenido de `/guias`. Cada archivo `.mdx` es una guía
publicada; el nombre del archivo (sin la extensión) es el slug de la URL.

## Crear una guía nueva

1. Copia `_template.mdx` y renómbralo con el slug que quieras usar como URL,
   por ejemplo `checklist-antes-de-automatizar.mdx`.
2. El nombre debe ser kebab-case, sin acentos ni mayúsculas:
   `como-elegir-tu-primera-automatizacion.mdx`, no
   `Cómo_elegir_tu_primera_Automatización.mdx`.
3. Completa el frontmatter (ver más abajo) y reemplaza cada sección del
   cuerpo siguiendo la estructura editorial del template.
4. Mientras escribes, deja `draft: true`. Bórralo (o pásalo a `false`) recién
   cuando la guía esté lista para publicarse.
5. Los archivos que empiezan con `_` (como `_template.mdx`) no aparecen en el
   listado de `/guias`: úsalos para plantillas o borradores que todavía no
   quieres considerar una guía real.

## Frontmatter

Todos los campos van entre `---` al inicio del archivo.

| Campo         | Obligatorio              | Tipo                          | Qué es                                                                                                                                                                                                            |
| ------------- | ------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Sí                       | texto, 1–90 caracteres        | Título de la guía. Aparece en la tarjeta del listado y como `<h1>`.                                                                                                                                               |
| `description` | Sí                       | texto, 1–200 caracteres       | Resumen de una o dos frases. Se usa en la tarjeta, en el meta description y en el JSON-LD.                                                                                                                        |
| `publishedAt` | Sí                       | fecha `YYYY-MM-DD`            | Fecha de publicación. Puede ir con o sin comillas en el YAML.                                                                                                                                                     |
| `updatedAt`   | No                       | fecha `YYYY-MM-DD`            | Solo si vuelves a editar la guía después de publicarla. Si no existe, no se muestra "Actualizado el...".                                                                                                          |
| `tema`        | Sí                       | uno de los temas configurados | Ver la lista en `lib/guias/temas.ts`. Ordena y etiqueta la guía en el listado.                                                                                                                                    |
| `servicio`    | No                       | slug de un servicio           | Uno de los slugs de `lib/services.ts` (`reportabilidad`, `capacitaciones`, `desarrollo-web`, `automatizaciones`). Si lo pones, el botón final de la guía preselecciona ese servicio en el formulario de contacto. |
| `tags`        | No                       | lista de texto                | Palabras clave libres, por ejemplo `["ia", "pymes"]`. Se usan como `keywords` en el JSON-LD.                                                                                                                      |
| `draft`       | No (por defecto `false`) | `true`/`false`                | Mientras es `true`, la guía **solo se ve en `pnpm dev`**. Nunca aparece en producción, ni en el listado ni en el sitemap.                                                                                         |
| `portada`         | Sí | ruta bajo `/img/guias/`         | Foto de portada de la guía. Toda guía necesita una: ver "La foto de portada" más abajo.                                                                                                                       |
| `portadaAlt`      | Sí | texto, 1–160 caracteres         | Texto alternativo de la portada. Describe lo que se ve en la foto, no repite el título.                                                                                                                       |
| `portadaCredito`  | No | texto                           | Crédito de la foto (fotógrafo, banco de imágenes), si corresponde. Se muestra como una etiqueta pequeña sobre la esquina de la portada.                                                                       |

Ejemplo completo:

```yaml
---
title: Cómo elegir tu primera automatización
description: Cinco preguntas para decidir qué proceso automatizar primero, sin quedarte pegado eligiendo herramienta.
publishedAt: "2026-09-06"
updatedAt: "2026-09-20"
tema: automatizacion
servicio: automatizaciones
tags: ["automatizacion", "pymes"]
draft: true
portada: /img/guias/como-elegir-tu-primera-automatizacion.jpg
portadaAlt: Persona revisando un panel de control en una planta de producción
portadaCredito: "Foto: Banco de imágenes interno"
---
```

## La foto de portada

Toda guía necesita una foto de portada real. La foto muestra de qué trata la
guía; la marca ya está en el marco que la rodea (borde, esquinas), así que la
portada **no lleva duotono ni ningún filtro de color**.

- Guarda el archivo en `public/img/guias/` (no en `public/img/about/` ni en
  ninguna otra carpeta) y apunta `portada` a esa ruta exacta, siempre
  empezando con `/img/guias/`.
- Tamaño recomendado: 2400×1350 o más grande, proporción 16:9, formato JPG
  y menos de ~400 KB. Una imagen más liviana carga más rápido sin perder
  nitidez en el tamaño en que se muestra.
- `portadaAlt` es obligatorio: describe lo que se ve en la foto (para quien
  usa lector de pantalla y para buscadores), no repite el título de la guía.
- `portadaCredito` es opcional: solo si la foto requiere dar crédito a su
  fuente.
- Si `next build` (o `pnpm dev`) falla con un error de "cover image" o
  "imagen de portada", es porque `portada` apunta a un archivo que no existe
  todavía bajo `public/img/guias/`: revisa la ruta.

## El flujo de borradores

- `draft: true` → la guía existe en el repo, pero **no** se lista en
  `/guias`, **no** tiene una página en producción y **no** entra al
  sitemap. Sí se ve en `pnpm dev`, para que puedas revisarla como se vería
  publicada.
- `draft: false` (o sin el campo) → la guía es pública apenas se despliega.
- No hay un estado intermedio de "revisión": si necesitas que alguien la
  revise antes de publicarla, compártele la rama o el preview con
  `draft: true` puesto.

## Componentes disponibles

Además de markdown normal (encabezados `##`/`###`, listas, tablas,
`> citas`, `` `código` ``, enlaces), tienes estos componentes:

### `Nota`

Para aclaraciones, advertencias o datos importantes que no son parte del
flujo principal del texto.

```mdx
<Nota tipo="importante" titulo="Antes de partir">
  Esto no reemplaza una asesoría legal. Si tu proceso maneja datos sensibles, valida el enfoque con
  quien lleve el tema de cumplimiento.
</Nota>
```

`tipo` acepta `"info"` (por defecto), `"importante"` o `"advertencia"`.
`titulo` es opcional: si no lo pones, se usa el nombre del tipo.

### `Pasos` y `Paso`

Para una secuencia de pasos numerados. `Pasos` envuelve, cada `Paso` es un
paso con su propio título.

```mdx
<Pasos>
  <Paso titulo="Mapea el proceso actual">
    Escribe, en orden, cada tarea que hace una persona hoy para completar el proceso. No lo
    optimices todavía: solo descríbelo tal como es.
  </Paso>
  <Paso titulo="Marca dónde se pierde más tiempo">
    De esa lista, identifica el paso que más se repite o el que más tiempo consume. Ese es tu
    candidato a automatizar primero.
  </Paso>
</Pasos>
```

### `Checklist`

Para una lista de verificación. Escribe una lista de markdown normal adentro:
se renderiza con un check en vez de una viñeta.

```mdx
<Checklist>

- El proceso se repite igual todas las veces
- Tienes acceso a los sistemas que hay que conectar
- Puedes describir la regla de negocio en una frase

</Checklist>
```

Deja una línea en blanco después de `<Checklist>` y otra antes de `</Checklist>`: sin
ellas, MDX no reconoce la lista y muestra todo como un solo párrafo.

### `Figura`

Una imagen con marco y pie de foto opcional, para una captura o foto de
apoyo dentro del cuerpo de la guía (distinta de la portada, que va en el
frontmatter).

```mdx
<Figura
  src="/img/guias/checklist-antes-de-automatizar-tablero.png"
  alt="Tablero con las solicitudes pendientes de aprobación"
  pie="Ejemplo de tablero después de automatizar las aprobaciones"
/>
```

- `src` es obligatorio y debe apuntar a un archivo bajo `/img/guias/`, igual
  que `portada`.
- `alt` es obligatorio.
- `pie` es opcional: el texto que aparece bajo la imagen, a modo de leyenda.
- `ancho` es opcional: `"texto"` (por defecto, el ancho de la columna de
  lectura) o `"ancha"` (se extiende un poco más allá del texto en pantallas
  grandes).

### `Diagrama`

Inserta uno de los diagramas animados que ya existen en el sitio (los mismos
que se usan en las páginas de servicios). No recibe más que el nombre: no hay
que configurar datos ni tamaños.

```mdx
<Diagrama nombre="flujo-automatizacion" />
```

Nombres disponibles hoy (ver `components/guias/diagramas.tsx` para la lista
autoritativa, que puede crecer):

- `flujo-automatizacion` — el flujo de una automatización corriendo.
- `reporte-gerencial` — un reporte de gestión con sus fuentes conectadas.
- `programa-capacitacion` — un programa de capacitación con sus sesiones.

Si escribes un nombre que no existe, en `pnpm dev` ves una advertencia en la
página; en producción esa guía simplemente no muestra nada ahí, así que
revisa el nombre antes de publicar.

### `Demo` (todavía no existe)

Cuando el sitio tenga demos interactivas propias, se van a insertar con el
mismo patrón que `Diagrama`: un componente registrado en
`components/guias/demos.tsx` y un bloque `<Demo nombre="..." />` en el MDX.
Por ahora no uses `Demo`: no está implementado.

## Comentarios y detalles de sintaxis

- Para dejar una nota que no se publique usa `{/* así */}`. Los comentarios HTML
  (`<!-- -->`) no funcionan en MDX y rompen la guía al compilar.
- Dentro de `Nota` y `Paso` escribe texto corrido. Si necesitas una lista o varios
  párrafos dentro de un componente, rodéalos con líneas en blanco como en `Checklist`.
- No pases estos archivos por Prettier: reordena el contenido de los componentes.

## Estructura editorial

Toda guía sigue el mismo orden (está detallado, con instrucciones, en
`_template.mdx`):

1. **El problema** — a quién le pasa esto y cómo se nota en el día a día.
2. **Lo que hay que saber** — la norma o el concepto, explicado simple.
3. **Por dónde empezar** — pasos concretos y accionables (usa `Pasos`).
4. **Errores comunes** — lo que la gente hace mal al intentarlo sola.
5. **Cuándo conviene pedir ayuda** — cierre que conecta el tema con el
   servicio correspondiente, sin sonar a venta forzada.
