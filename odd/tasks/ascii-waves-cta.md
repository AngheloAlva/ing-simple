# ASCII Waves CTA

## Goal

Replace the shared final CTA's Ascii Ripple background with the React Bits Pro ASCII Waves treatment from the supplied reference, while keeping the normal brand blue on generic pages and inheriting each service accent on service pages.

## Scope

- `components/final-cta.tsx`
- `components/final-cta.test.tsx`
- `components/ascii-waves.tsx`
- Focused tests and browser verification only

## Constraints

- Preserve existing CTA copy, destination behavior, content width, footer spacing, scrims, and button clickability.
- Match the reference tuning: `characters=" .:-+*=%@#"`, `elementSize=9`, `noiseScale=5`, `speed=0.7`, `intensity=0.7`, `waveTension=0.5`, `waveTwist=0.2`, cursor interaction enabled, and interaction intensity `2`.
- Resolve `--primary` from the CTA's actual CSS scope so generic pages use brand blue and service pages use their configured accent.
- Respect reduced motion and avoid unnecessary offscreen WebGL rendering.
- Do not alter or include the unrelated working-tree changes already present on `main`.
- Do not commit unless the user explicitly asks.

## Tasks

- [x] Integrate ASCII Waves into the shared CTA and add CSS-token/reduced-motion support.
- [x] Update focused tests and verify behavior, types, and presentation.
- [x] Correct light-mode wave color to use the luminous brand/service tint instead of the text-safe primary token.
- [x] Test a full-width wave surface with a soft fade at both horizontal edges.
- [x] Remove the vertical gap between the final CTA and footer.
- [x] Make the CTA content reveal visibly on scroll with a staggered title, body, and button sequence.

## Evidence

- Work-unit commit: `6034438` (`feat(cta): add animated ASCII waves finale`) on `feat/ascii-waves-cta`.
- Focused tests: `pnpm exec vitest run components/final-cta.test.tsx` passed (8 tests).
- Scoped ESLint and `git diff --check` passed.
- Independent verification confirmed CSS-token resolution, safe color fallback, strict reduced-motion time freeze, disabled reduced-motion interaction, and offscreen frame pausing.
- `pnpm exec tsc --noEmit --incremental false` remains blocked by 23 errors exclusively in unrelated untracked `components/react-bits/{dither-wave,liquid-lines,mosaic}.tsx`; no candidate-file diagnostics.
- Browser/WebGL checks passed in installed Google Chrome on `/` and `/servicios/reportabilidad`, light and dark: one correctly sized canvas, blue versus reportabilidad accent tokens, successful CTA center hit-test, no horizontal overflow, and no console/page errors.
- Screenshots: `/var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/pi-playwright/landing-2/ascii-cta-{home,reportabilidad}-{light,dark}.png`.
- User follow-up fixed: light-mode waves now use `--brand-tint` because `--primary` is intentionally dark enough for text contrast.
- Follow-up checks: 8 focused tests, scoped ESLint, and diff check passed. Live Chrome verification on the existing `:3000` server confirmed blue home waves and gold/yellow Reportabilidad waves, one correctly sized CTA canvas per page, and no console/page errors.
- Follow-up screenshots: `/var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/pi-playwright/landing-2/ascii-cta-home-light-tint.png` and `ascii-cta-reportabilidad-light-tint.png`.
- Full-width trial implemented: the wave wrapper and canvas now span the section while CTA content remains constrained to `max-w-360`; a standard/WebKit horizontal mask fades 0→7% and 93→100%.
- Verification: 8 focused tests, scoped ESLint, and diff check passed. Chrome at 1920px measured section/wave/canvas at 1920px and content at 1440px centered with 40px gutters; no overflow or console errors.
- Screenshot: `/var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/pi-playwright/landing-2/ascii-cta-home-light-full-width-fade.png`.
- Final spacing follow-up completed: removed `mb-32 sm:mb-44` from the CTA section while preserving its internal padding.
- Verification measured a 0px section-to-footer gap and 0px CTA bottom margin at 1440×1000, with no overflow or console/page errors. Screenshot: `/var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/pi-playwright/landing-2/ascii-cta-footer-no-gap.png`.
- Animation follow-up completed: the viewport observer now watches a tight inner content group at 35% visibility. Title, body, and button reveal with 80ms initial delay, 140ms stagger, 500ms soft-eased opacity/12px/3px-blur transitions.
- Verification sampled all three elements before and after scroll: they remained hidden before entry, revealed progressively in order, and reached their final state by ~900ms. Nine tests, scoped ESLint, diff check, Chrome console, and overflow checks passed. Screenshot: `/var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/pi-playwright/landing-2/ascii-cta-stagger-revealed.png`.
- No commit created because the user did not request one.
