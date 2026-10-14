# Anatomy visuals for the service problem sections

Objective: replace the raster `problemImage` in each service page's "El problema" section with a dedicated Anatomy scene. Branch `feat/anatomy-service-problems` (from `feat/anatomy-challenge-diagrams`). Delivery: ask-on-risk. Runner: Vitest (`pnpm exec vitest run`).

## Specs

S1. User request: "remplazar la imagen que acompana a la seccion del problema en cada servicio" with visuals made with the Anatomy skill. Scope: the left column rendered by `components/servicios/problem.tsx` for the four services in `lib/services.ts` (reportabilidad, capacitaciones, desarrollo-web, automatizaciones).

S2. User decision: "Escenas nuevas" — one new Anatomy scene per service, distinct from the four home challenge scenes, composed for the tall column (2:3 on mobile, full height on lg). Pilot one first (Reportabilidad); the remaining three start only after the user approves the pilot.

S3. Reportabilidad pilot, user choice "Mesa con calendario": a collation desk with three trays (Ventas, Finanzas, Operaciones), each holding a different total for the same figure; a desk calendar advances from day 1 to day 6 while the sheets are gathered into a binder; beside it a memo stamped "Decidido" already dated day 2. Live readout: "Día 6 · 3 versiones · decisión del día 2". Figures are illustrative, not business data.

S5. Capacitaciones, user choice "Cajón de herramientas": a tool cart with three drawers (Excel, Power BI, Power Apps); each opens in turn, one worn tool is used and the rest stay new with their tag. Live readout: "3 licencias pagadas · se usa una fracción".

S6. Desarrollo web, user choice "Casillero desbordado": a 12-cubby sorter; orders keep arriving week after week; once full, patches appear beside it: a "Planilla" box, a "Correo" tray and a phone with WhatsApp, and orders pile on top. Live readout: "Capacidad 12 · pedidos 30 · 3 parches".

S7. Automatizaciones, user choice "Copiadora a manivela": a hand-cranked duplicator; each turn produces the same document, a copy counter and an hour meter advance, and now and then a copy comes out wrong and drops into the reject bin. Option text readout: "40 copias · 5 h de manivela · 3 con error" (illustrative; implemented as 10 · 2,5 h · 2 with 0.75 s per turn, see L7–L8).

S4. Preserve the section title, body copy, audience list and layout; other services keep their current image until their own scene is approved. Light/dark, reduced motion (final state), accessible description, readable at 390px. Rollback path to the raster image documented.

Assumption (A1): with no card hover target on the service page, the story starts when the figure first enters the viewport. Superseded by S8 (loop).

S8. User correction (2026-10-13): "Si me gustaria el mismo ciclo en las escenas de los servicios" — same loop as the guide card index: hold the final pose ~3 s, then restart; reduced motion keeps the final pose without looping.

## Tasks

- T1 (S1–S4) Reportabilidad pilot: scene, model + tests, builder, component, integration via `PROBLEM_VISUALS` keyed by slug; route inline (no writer trigger). Status: done, awaiting user approval. RED: model module missing; GREEN: 5 model + 2 integration tests, full suite 320/320.
- T2 (S2, S5) Capacitaciones tool cart; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 4 model tests + integration test.
- T3 (S2, S6) Desarrollo web sorter; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 5 model tests + integration test (one test timing bug fixed: +0.31 s overlapped the next arrival).
- T4 (S2, S7) Automatizaciones duplicator; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 5 model tests + integration test; fallback test now uses a slug without a scene.

## Log

L1 (2026-10-13) User: "Hola me ayudas a continuar con lo que estabamos de remplazar las iimagenes con visuales hechos con la skill de Anatomy, pero quedamos a medias por un error del provedor" — then: "habiamos hecho una investigacion de donde mas se podria integrar este tipo de visuales y el primer lugar fue remplazar la imagen que acompana a la seccion del problema en cada servicio".
L2 (2026-10-13) Found the four home challenge visuals committed and green (29 tests). Each service problem overlaps a home scene; user chose new scenes (S2) and the calendar desk for the pilot (S3).
L3 (2026-10-13) Composition change within S3: three trays stacked as a letter rack instead of a row, because a row projects ~1.3:1 and wastes the tall column. Verified in browser: desktop 1440 dark/light, mobile 390 (no horizontal scroll), reduced motion final pose, stamp contact on day 2, sheets in flight. Fixes after review: stamp text overflowed its outline (smaller type), camera elevation 34→40 to fill the column, arc lift 22→34 so the top-tier sheet does not read as sitting in the middle tier, legend value on its own line at 390. Section height still set by the text column (811 px both).
L4 (2026-10-13) User approved the pilot: "Me gusta como se ve, vamos con el siguiente nomas". Chose the tool cart for Capacitaciones (S5).
L5 (2026-10-13) Tool cart review fixes: tall drawer fronts hid the tools at 34°, so drawers became short with thick foam, a storage cabinet fills the lower half and the camera rose to 40°; fit box limited the drawer reach to drawer height. One drawer open at a time because an open drawer covers the ones below. Verified desktop light (final and Power Apps open), mobile 390 dark, no horizontal scroll.
L6 (2026-10-13) User: "Me gusta igualmente, vamos con desarrollo web". Chose the overflowing sorter (S6). Readout wording follows the model ("Capacidad 12 · 30 pedidos · 3 parches"). Verified desktop light final and mid-story (first patch), mobile 390 dark, no horizontal scroll.
L7 (2026-10-13) User: "Si, vamos con esa". Chose the duplicator (S7). Numbers reduced to 16 copies · 4 h · 2 errors so each crank turn stays readable (40 turns in 6 s ≈ 7 turns/s); reported to the user. Review fixes: drum lowered and feed tray raised so the blanks are visible, crank 11→19, paper layers 0.6→0.35, nameplate moved clear of the output tray. Verified desktop light final and error-sheet moment, mobile 390 dark, no horizontal scroll.
L8 (2026-10-13) User correction: "haria que la manilla vaya mas lento porque va muy rapido". Turn length 0.375 s → 0.75 s; copies 16 → 10 (errors at copies 4 and 8) so the story stays ~8.9 s; readout "10 copias · 2,5 h de manivela · 2 con error". Model tests rewritten RED first (4 failing), then GREEN.
L9 (2026-10-13) User: "podriamos arreglar el numero que se ve por encima del cuadro". Counter digits overflowed the window top (baseline z 83.9, window 81.2–84.8) and used the paper colour, unreadable in dark. Baseline 82.1, size 2.8, fill foreground; verified inside the window in both themes.
L10 (2026-10-13) S8 applied to the four scenes. RED: 4 loop tests failing; GREEN: full suite 349/349. Browser timing (complete → restart): report desk 7.5 → 10.5 s, tool cart 7.1 → 10.1 s, sorter 7.3 → 10.2 s, duplicator 9.0 → 12.0 s (counter back to 000). Lint: 8 pre-existing set-state-in-effect errors in other diagrams (challenge/*, interactive-diagram, use-step-loop, audit-scan), none in changed files.
