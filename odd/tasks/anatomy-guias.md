# Anatomy figures for the guides

Objective: add Anatomy figures to the guides (`content/guias/*.mdx`) where a physical object explains a rule the text only describes. Branch `feat/anatomy-service-problems` (continues the Anatomy series). Delivery: ask-on-risk. Runner: Vitest.

## Specs

S1. User request: "Vamos con las guias primero a ver como quedan" (after the recommendation: one lead figure per guide that explains, never decorates). Pilot one guide first; the others after the user sees it.

S2. Pilot, Ley 21.719 guide, user choice "Agregar como figura nueva": a card index (fichero) with one card per processing activity; each card gets a tab with its legal basis (Contrato, Obligación legal, Interés legítimo, Consentimiento); one card has none and moves to a "Justificar o eliminar" tray. Live readout: "5 tratamientos · 4 con base · 1 por justificar". Existing diagrams `ley-linea-de-tiempo` and `ley-inventario` stay unchanged.

S3. Bases must match the existing `ley-inventario` table (cotizaciones → Interés legítimo, facturar y despachar → Contrato, sueldos → Obligación legal). Examples are illustrative, not legal advice (the guide already carries that note).

S5. User correction: "agregaria que despues de unos 3 segundos la animacion se reinicie". The card index holds the final pose ~3 s and restarts; reduced motion keeps the final pose without looping. Scope: this figure only.

S6. IA guide, user choice "Sí, clasificador": invoices under a reader, a dial gauge with the threshold (0,85) marked, a diverter to "Sistema" or "Revisión"; placed after the `confianza` paragraph; the JSON and both existing diagrams stay. First invoice is the guide's JSON example (Suministros del Sur SpA, 0,93). Loops like the card index.

S4. Light/dark, reduced motion (final pose), accessible description, readable at 390px, registered in `components/guias/diagramas.tsx` and used through `<Diagrama nombre="..." />`.

Assumption (A1): placement is right after the "cuatro cosas" paragraph in "Lo que hay que saber", because a `Diagrama` inside `<Pasos>` would be numbered as a step.

## Tasks

- T1 (S2–S4) Ley 21.719 card index; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 5 model tests + 2 registry/placement tests.
- T2 (S1, S6) IA guide invoice gate; route inline. Status: done, awaiting user review. RED: model module missing; GREEN: 6 model tests + 2 registry/placement tests.
- T3 (S1) Informe del mes guide figure — after pilot review; must not duplicate the Reportabilidad report desk.

## Log

L1 (2026-10-13) User: "Vamos con las guias primero a ver como quedan". Chose to add the card index as a new figure (S2). Placement adjusted from "after step 2" to the "cuatro cosas" paragraph (A1).
L2 (2026-10-13) Review fixes: tab labels overflowed (uppercase at 2.1 in 22-wide tabs) → sentence case, 26-wide tabs, verified each label inside its tab in the browser; card text unreadable at 390 px → HTML list with each card's live status. Verified desktop light final and the no-basis card asking, mobile 390 dark, no horizontal scroll. One test instant moved off a float boundary (1.7 → 1.75 s).
L3 (2026-10-13) User approved the card index and asked for the loop (S5). RED: loop test failing (loopTime missing); GREEN: 6 model tests. Browser timing: complete 9.1 s → restart 12.1 s, second cycle 21.1 s → 24.1 s. The restart snaps the parked card back into the drawer (no reverse animation).
L4 (2026-10-13) User: "SI porfavor" (next guide). Chose the invoice gate (S6). Review fixes: hydration mismatch from unrounded dial tick coordinates (server/client last-digit difference) → rounded to 2 decimals, verified 0 console errors; bench trimmed and pad reduced so the figure fills the frame; "1" dial label dropped (collided with "0,85"); shorter header for 390 px. Verified desktop light final and the low-confidence invoice routed to review, mobile 390 dark looping, no horizontal scroll.
