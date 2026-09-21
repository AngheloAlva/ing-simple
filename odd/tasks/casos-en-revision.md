# Casos en revisión interna — gating y cifras honestas

## Goal

Land the unfinished "editorial review case drafts" feature that was sitting unreviewed in the working tree, with its public exposure explicitly gated, and normalise the unrelated pending changes into reviewable work units.

## Context

The working tree on `main` carried 13 modified tracked files plus one untracked module. The change was initially misread as a formatting pass. It is actually four independent units: a case-review feature, a home hero-wave retune, a formatting normalisation, and loose layout tweaks.

The review feature added ten draft cases with placeholder clients and unvalidated metrics, then gated them in the `/casos` grid, the sitemap, and `noIndex`. Four shared selectors filter by `isFlagship && caseStudy` and were **not** gated, so drafts leaked to public service pages.

## Scope

- `components/servicios/related-cases.tsx`
- `components/case-study/detail-related.tsx`
- `components/case-study-feature.tsx`
- `components/casos/stats.tsx`
- Deletion of `components/react-bits/dither-wave.tsx`, `liquid-lines.tsx`, `mosaic.tsx`

## Constraints

- Gate every shared portfolio selector on `project.isProduction !== false` so draft visibility never depends on array order.
- Keep the intentional `"Casos de estudio"` label and its count of all published entries.
- Count only real clients in `UNIQUE_CLIENTS`; placeholder names such as `"Cliente por confirmar"` must never be presented as client companies.
- Preserve the intentional hero-wave retune (mask, saturation filter, and cursor interaction removals are deliberate).
- Do not revert the formatting normalisation or the deliberate copy changes in the casos hero and metadata.
- Keep unrelated work out of each commit; split into work units.

## Tasks

- [x] Gate `related-cases.tsx` on `isProduction !== false`.
- [x] Gate `detail-related.tsx` on `isProduction !== false`.
- [x] Gate `case-study-feature.tsx` on `isProduction !== false`.
- [x] Count only production clients in `casos/stats.tsx`.
- [x] Delete the three unused `react-bits` components.
- [x] Verify: typecheck, scoped lint, focused tests.
- [x] Commit the pending tree as ordered work units on a feature branch.
- [x] Correct the two inaccurate comments the delegated writer introduced.

## Decisions

- The `/casos` grid heading (`"Casos de producción"` over 19 chips, 10 of them drafts) and the mixed basis of the statistics panel (19 entries, 7 production clients, 2024) are **reviewed and deliberately left as they are**.
- Draft detail routes stay publicly served and `noIndex`, without the `"En revisión"` badge. The `Estado` field already reads `"Caso en revisión interna"`.
- The hero-wave retune is intentional, including the removal of the vertical mask gradient, the light-mode saturation filter, and cursor interaction.
- The three unused `react-bits` components are deleted rather than archived.

## Evidence

- Work-unit commits on `feat/casos-en-revision`: `0f9cc6f` (gitignore), `e822f76` (formatting + two layout values), `4e623e6` (hero waves + home spacing), `ec0c3c2` (the feature itself, and the review candidate).
- `pnpm exec tsc --noEmit`: clean, exit 0. Before deleting the orphans it reported exactly 23 errors, all inside `components/react-bits/{dither-wave,liquid-lines,mosaic}.tsx` (4 + 16 + 3).
- `pnpm exec vitest run`: 22 files / 200 tests passed, 0 failed, 0 skipped.
- `pnpm exec eslint` on the four edited files: 0 errors, 1 pre-existing `@next/next/no-img-element` warning in `components/case-study-feature.tsx` on a line this change did not touch (now line 71 of `components/casos/grid.tsx` after the comment edits).
- `git diff --check`: clean.
- Statistics reproduced by executing the real selectors: cases 19, clients 7, first year 2024. `portfolioProjects` holds 28 entries, 10 of them drafts.
- Per-category related cases after the gate: `reportabilidad` 0, `capacitaciones` 0, `power-platform` 0, `desarrollo-web` 3. Those three services now render the pre-existing empty state ("Tu proyecto podría ser el primer caso publicado").
- `gentle_review assess` over the writer's diff returned `risk: unassessable` (`native-assess-unavailable`, native assess produced empty output) and therefore demanded a separate independent verifier, which ran as `gentle-ai-verify`.
- Independent verification confirmed the statistics, the per-service counts, the clean typecheck, the 200 tests, and that the deleted components had no source importers. It **refuted** the claim that no draft reaches a public surface unbadged: `app/casos/[id]/page.tsx` `generateStaticParams` has no `isProduction` gate, so all ten draft pages are statically generated and served, and the `"En revisión"` badge exists only in `components/casos/grid.tsx`. It also found the grid heading and statistics-basis inconsistencies recorded under Decisions.
- Method caveat worth keeping: `grep` for the literal `"Casos de producción"` returns nothing because `grid.tsx` splits the heading with a `<span>`; read the JSX rather than trusting a single grep.
- Native review preflight: `inspect` blocked on the intended-untracked selection (only `odd/tasks/casos-en-revision.md`), resolved by excluding it. `START` with `baseRef` + `committedOnly` was then refused with `Judgment Day graph-v1 START requires lineageId`, and no lineage was created. The provider's declared transition stayed `collect`/`empty_candidate_base_ref_required`, whose single `external.select_base_ref` slot is only satisfiable through a lineage that the failed START never produced. No `lineageId` was invented and no further lifecycle call was made, so `ec0c3c2` remains unreviewed.
- Deployment note: `.next/dev/**` still holds chunks for the deleted modules. Purge `.next` before deploying, or a reused cache could serve components that no longer exist in source.
- Open item inherited from the formatting pass: `app/page.tsx` lost the comment explaining why the Challenge section watches a `margin: "0px 0px -30% 0px"` viewport. The rationale is no longer recorded anywhere.
