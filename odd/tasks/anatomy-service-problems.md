# Anatomy visuals for the service problem sections

Objective: replace the raster `problemImage` in each service page's "El problema" section with a dedicated Anatomy scene. Branch `feat/anatomy-service-problems` (from `feat/anatomy-challenge-diagrams`). Delivery: ask-on-risk. Runner: Vitest (`pnpm exec vitest run`).

## Specs

S1. User request: "remplazar la imagen que acompana a la seccion del problema en cada servicio" with visuals made with the Anatomy skill. Scope: the left column rendered by `components/servicios/problem.tsx` for the four services in `lib/services.ts` (reportabilidad, capacitaciones, desarrollo-web, automatizaciones).

S2. User decision: "Escenas nuevas" — one new Anatomy scene per service, distinct from the four home challenge scenes, composed for the tall column (2:3 on mobile, full height on lg). Pilot one first (Reportabilidad); the remaining three start only after the user approves the pilot.

S3. Reportabilidad pilot, user choice "Mesa con calendario": a collation desk with three trays (Ventas, Finanzas, Operaciones), each holding a different total for the same figure; a desk calendar advances from day 1 to day 6 while the sheets are gathered into a binder; beside it a memo stamped "Decidido" already dated day 2. Live readout: "Día 6 · 3 versiones · decisión del día 2". Figures are illustrative, not business data.

S5. Capacitaciones, user choice "Cajón de herramientas": a tool cart with three drawers (Excel, Power BI, Power Apps); each opens in turn, one worn tool is used and the rest stay new with their tag. Live readout: "3 licencias pagadas · se usa una fracción".

S6. Desarrollo web, user choice "Casillero desbordado": a 12-cubby sorter; orders keep arriving week after week; once full, patches appear beside it: a "Planilla" box, a "Correo" tray and a phone with WhatsApp, and orders pile on top. Live readout: "Capacidad 12 · pedidos 30 · 3 parches".

S4. Preserve the section title, body copy, audience list and layout; other services keep their current image until their own scene is approved. Light/dark, reduced motion (final state), accessible description, readable at 390px. Rollback path to the raster image documented.

Assumption (A1): with no card hover target on the service page, the story plays once when the figure first enters the viewport; leaving does not reset it.

## Tasks

- T1 (S1–S4) Reportabilidad pilot: scene, model + tests, builder, component, integration via `PROBLEM_VISUALS` keyed by slug; route inline (no writer trigger). Status: done, awaiting user approval. RED: model module missing; GREEN: 5 model + 2 integration tests, full suite 320/320.
- T2 (S2, S5) Capacitaciones tool cart; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 4 model tests + integration test.
- T3 (S2, S6) Desarrollo web sorter; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 5 model tests + integration test (one test timing bug fixed: +0.31 s overlapped the next arrival).
- T4 (S2) Automatizaciones scene — blocked on pilot approval.

## Log

L1 (2026-10-13) User: "Hola me ayudas a continuar con lo que estabamos de remplazar las iimagenes con visuales hechos con la skill de Anatomy, pero quedamos a medias por un error del provedor" — then: "habiamos hecho una investigacion de donde mas se podria integrar este tipo de visuales y el primer lugar fue remplazar la imagen que acompana a la seccion del problema en cada servicio".
L2 (2026-10-13) Found the four home challenge visuals committed and green (29 tests). Each service problem overlaps a home scene; user chose new scenes (S2) and the calendar desk for the pilot (S3).
L3 (2026-10-13) Composition change within S3: three trays stacked as a letter rack instead of a row, because a row projects ~1.3:1 and wastes the tall column. Verified in browser: desktop 1440 dark/light, mobile 390 (no horizontal scroll), reduced motion final pose, stamp contact on day 2, sheets in flight. Fixes after review: stamp text overflowed its outline (smaller type), camera elevation 34→40 to fill the column, arc lift 22→34 so the top-tier sheet does not read as sitting in the middle tier, legend value on its own line at 390. Section height still set by the text column (811 px both).
L4 (2026-10-13) User approved the pilot: "Me gusta como se ve, vamos con el siguiente nomas". Chose the tool cart for Capacitaciones (S5).
L5 (2026-10-13) Tool cart review fixes: tall drawer fronts hid the tools at 34°, so drawers became short with thick foam, a storage cabinet fills the lower half and the camera rose to 40°; fit box limited the drawer reach to drawer height. One drawer open at a time because an open drawer covers the ones below. Verified desktop light (final and Power Apps open), mobile 390 dark, no horizontal scroll.
L6 (2026-10-13) User: "Me gusta igualmente, vamos con desarrollo web". Chose the overflowing sorter (S6). Readout wording follows the model ("Capacidad 12 · 30 pedidos · 3 parches"). Verified desktop light final and mid-story (first patch), mobile 390 dark, no horizontal scroll.
