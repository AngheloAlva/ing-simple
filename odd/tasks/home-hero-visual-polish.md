# Home hero visual polish — desktop

## Goal

Refine the desktop hero showcase so its service navigation uses the available chrome, its reportability panel communicates real plan-versus-actual structure, its training panel tells one coherent course story, and its automation panel demonstrates one readable end-to-end execution.

## Scope

- Desktop presentation only.
- Preserve the current mobile layouts and behavior unless a shared data/copy change requires a minimal parity update.
- Keep the existing frame, service order, palette, typography, and accessibility boundary around fabricated demo data.
- No changes to hero copy, background waves, service pages, or the Desarrollo web panel.

## Design direction

- **Intent:** a decision-maker should understand each service from one glance at a credible product-like demonstration; the showcase should feel precise, operational, and calm.
- **Hierarchy:** each panel gets one focal story — budget execution, one Power BI course, or one automation run — while secondary metadata supports rather than competes.
- **Palette:** reuse the existing background, foreground, brand blue, muted blue, and single green outcome accent. No new decorative color.
- **Depth:** quiet borders and flat technical surfaces; no new shadows beyond the established diagram cards.
- **Typography:** retain the project scale and tabular numerals; meaning comes from weight, alignment, and data shape.
- **Spacing:** retain the 4px-derived spacing rhythm and the 520px desktop panel budget.
- **Motion:** one sequential automation timeline, with a stable final hold and reduced-motion final state; no concurrent decorative pulses.

## Tasks

### T1 — Fill the desktop service chrome and clarify reportability

Status: **done** (uncommitted).

- The four service tabs share all desktop chrome width left of the pause control
  (246.5 px each over a 986 px strip at 1366 and 1512), and the strip still
  scrolls below `lg` with edge masks.
- Monthly execution keeps paired plan/actual bars for the five elapsed months and
  paints a distinct dashed-outline projected bar for each future month. The
  dashed trend line now starts at the actual/forecast boundary, not at the center
  of the last actual month.
- The month axis moved out of the vertically-scaled SVG into a 12-column HTML
  row, so the labels are legible; measured label-to-bar center offset is within
  ±0.02 px.
- The four KPI cards now carry four structurally different micro-visuals, each
  rendered at its own 96×32 viewBox with no distortion: twelve month cells lit up
  to the elapsed months, paired plan/gestión columns, zero-centered deviation
  columns on a fixed ±10 % clamped domain, and a bullet chart for the annual
  projection. All four carry a numeric annotation, including deviation.
- The waterfall tile no longer forces a minimum chart height, which was clipping
  its x-axis labels after the KPI row grew.

### T2 — Redesign training around one concrete course

Status: **done** (uncommitted).

- One course replaces the four-course route: "Power BI de básico a avanzado",
  with modality, duration, level and instructor.
- A single coherent column: course identity → focal progress (63 % · 5 de 8
  lecciones, derived from the module dataset) → a vertical module timeline with
  per-lesson status and the current lesson highlighted → the certificate.
- Green appears once, as the completion outcome.
- `PANEL_DESCRIPTION.capacitaciones` in `hero-showcase.tsx` describes the new
  demo.

### T3 — Turn automation into one sequential execution

Status: **done** (uncommitted).

- One ordered run driven by the existing `useStepLoop` convention replaces the
  five concurrent infinite pulses: trigger → validar → condición → taken branch →
  notify, then a hold and a restart. Measured maximum of one traveling packet.
- Traversed connectors and nodes stay marked as done for the rest of the cycle.
- The two validation inputs appear only after validation executes and stay
  visible afterwards (measured 0 → 2 sub-nodes).
- `Aprobado` and `Rechazado` are now first-class conditional outputs of the
  Condición card, aligned with their own ports; the floating labels are gone.
- Reduced motion renders the final, fully-executed frame with no loop.

### T4 — Verify desktop result

Status: **done** (uncommitted).

- `npx vitest run`: 30 files, 253 tests passed.
- `npm run typecheck`: clean. `npx eslint` on the eight touched files: clean.
- Browser verification at 1366×768 and 1512×900, light and dark: 12/12 month
  labels visible and aligned, 8/8 lessons visible, waterfall axis labels no longer
  clipped, four distinguishable KPI shapes, one traveling packet at a time.

## Second iteration (user review of the 2026-09 result)

### T5 — Branch expression and validation inputs (automation)

Status: **done** (uncommitted).

- The pills are gone. The Condición card is back to the standard height with its
  two spine-aligned output ports, and each branch wire carries a flow-chart
  diamond at its midpoint: `Sí` in the single green accent on the taken branch,
  `No` neutral on the alternative. Both labels sit clear of every card and wire,
  and the compact list still spells the outcomes out.
- The two validation inputs and their dashed connectors are revealed together the
  moment the run lands on `Validar datos` (measured at the same sample, offset
  0 ms), so a dashed connector can no longer render without its card.

### T6 — Automation motion polish

Status: **done** (uncommitted).

- Each step is travel plus dwell: the wire draws under the packet while it
  travels, the packet lands and rests, and the destination node lights up at the
  landing with a visible scale pop (measured peaks 1.029-1.030). The next
  connector starts 306-314 ms later, which is the dwell the reader sees.
- Reduced motion renders the finished frame: the traversed connectors done, no
  packet, no sub-node animation.

### T7 — Entrance stagger on every panel

Status: **done** (uncommitted).

- Reportabilidad (KPI cards -> chart tiles -> table tile -> rows), Capacitaciones
  (progress -> modules -> certificate) and Desarrollo web (stat cards and rows)
  reveal their items on mount with the site's entrance recipe at a 0.05-0.06 s
  offset; automation staggers its node cards in.
- At 120 ms after activating a tab each panel still has items entering; after 2 s
  no element is left below 0.98 opacity. Reduced motion renders everything
  immediately - the reportability row stagger was moved onto the same recipe so it
  is gated too.

### T8 — Verify the iteration

Status: **done**.

- `npx vitest run`: 30 files, 259 tests. `npm run typecheck`: clean.
- `npx eslint` on the ten changed files: exit 0, after fixing the one
  `react-hooks/set-state-in-effect` finding introduced by the arrival timer.
- Independent browser verification: dwell 306-314 ms per step, validation inputs
  revealed together with their step, one packet in flight at a time, both diamonds
  readable, entrances complete, no new overflow, reduced motion static.

## Known issues after this iteration

- `components/panels/web.tsx` (Desarrollo web) still truncates "Solicitudes de
  Levantamiento" and "Revestimiento de molino", and its nav/table are intentional
  scroll regions.
- A reduced-motion hydration mismatch is logged from `HowItWorks` / `CircuitTrace`
  (`components/circuit-trace.tsx`). It is outside the hero panels and was observed
  both before and after this iteration; it was not investigated here.
- Line-height rounding leaves 2-4 px of `scrollHeight` excess on some text nodes;
  no visible text is cut.
- Mobile was deliberately not reviewed in this iteration.

## Evidence

No work-unit commits were created; the user has not authorized commits for this
iteration.
