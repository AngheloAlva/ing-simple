# Hide unapproved case studies from public routes

## Objective and reason

Keep editorial-review cases in source data for future approval, but do not expose them in the public `/casos` listing, its numbers/category chips, page metadata, or directly requested `/casos/[id]` pages. `noindex` is not access control: the previous detail route served drafts containing unvalidated text and metrics.

## Authorization and scope

The user explicitly chose to hide review cases and then selected “Aplicarlo ahora”. Work on `feat/hide-unapproved-case-studies`, branched from clean `main` at `0c5231a`. This supersedes the earlier public-visibility decision in the completed historical `odd/tasks/casos-en-revision.md`; do not overwrite that document.

In scope: `components/casos/grid.tsx`, `components/casos/stats.tsx`, `components/casos/hero.tsx`, `components/case-study/detail-related.tsx` (correct one stale comment only), `app/casos/[id]/page.tsx`, `app/casos/page.tsx`, `lib/portfolio-data.ts` (remove only the draft import/spread), and narrow tests/helpers needed to prove this public boundary. The sitemap, home showcase, and related-case selectors already exclude `isProduction === false`; preserve their existing behavior. Keep every draft record in `lib/case-studies-under-review.ts` unchanged, and preserve all published entries in `lib/portfolio-data.ts`. Do not change published-case content, services, guides, deployment settings, or the older Astro site.

## Execution and routing

One coherent behavior unit (forecast ~150–250 authored diff lines, below the ~400-line advisory slice): one bounded `gentle-ai-worker` owns all nontrivial code/test writes. Parent owns task state, readback, assessment, and delivery. No SDD was selected. Delivery strategy: ask-on-risk; no PR or push authorized. The user later explicitly authorized one local commit; this grants no push or deployment.

Effective strict-TDD mode: off by absence of any enabling project/session setting or user instruction; test runner is `pnpm test` (`vitest run`). The worker should add focused regression tests and run ordinary checks. This is not a claim of observed RED/GREEN strict-TDD evidence.

## Work unit HIDE-01 — remove public draft exposure

- [x] Make `/casos` grid and category counts include only flagship case studies with `isProduction !== false`.
- [x] Make the cases statistics count the same published set, while preserving real-client and first-production-year semantics.
- [x] Remove the cases hero and listing metadata claims that internal-review drafts are public; retain accurate published-case copy.
- [x] Exclude review cases from `generateStaticParams`; return 404 for direct draft detail requests, including those not pre-generated, and never emit their title, description, or Article JSON-LD. Preserve 200 behavior for published cases and 404 for unknown IDs.
- [x] Keep draft records out of the client-side `portfolioProjects` import graph by removing the import/spread from `lib/portfolio-data.ts`; preserve draft data separately for editorial work.
- [x] Add focused regression coverage for the public listing predicate/counts and detail availability/metadata, including a real draft ID absent from the public registry; keep or check the sitemap exclusion of drafts.
- [x] Correct the stale comment in `detail-related.tsx` that claims draft pages are statically generated; no behavior change.
- [x] Run focused tests, typecheck, scoped lint/Prettier, `git diff --check`, and a route-function harness. Live HTTP and production-bundle checks were not run: do not disturb the user's dev server or `.next/dev`, and no build/deployment was authorized.
- [x] Parent reviews the diff and records exact outcomes.
- [x] Obtain explicit commit permission before any commit; the user authorized one local commit, not a push or deployment.

## Acceptance and rollback

A review draft ID never appears in the public portfolio registry, client bundle import graph, `/casos` cards, counts, or sitemap, and requesting `/casos/<draft-id>` returns 404 without draft metadata/content. A published case still appears and is accessible. No private preview route is added. Roll back only the files changed for HIDE-01; the old draft records remain untouched.

## Progress and next step

- 2026-09-24: mapped public selectors; branch created; found an additional draft-visibility claim in `components/casos/hero.tsx` and added it to scope before source edits.
- 2026-09-24: writer changed the five planned public surfaces plus a shared pure predicate and two test files. Writer reports focused Vitest 19 passed, full Vitest 192 passed, `pnpm typecheck` passed after correcting an initial type-guard error, scoped ESLint 0 errors/1 pre-existing img warning, and `git diff --check` passed. Parent inspected the diff and source tests. Route evidence is a function-level Vitest harness, not live HTTP. `gentle_review assess` returned unassessable because intended untracked files were not declared. The independent verifier returned PARTIAL: `components/casos/grid.tsx` and other client components import `portfolioProjects`, which spreads the review dataset, so hiding DOM cards alone does not prove draft text stays out of client JS. Scope now includes removing only that draft registration in `lib/portfolio-data.ts` and adjusting tests. The same writer removed only the review import/spread from `lib/portfolio-data.ts`, preserved 18 published records, and updated focused tests with a real draft ID. Writer reports focused Vitest 20 passed, full Vitest 193 passed, typecheck/ESLint/scoped Prettier/git diff check passed. Only source-level client import isolation is proven; no production bundle or HTTP E2E was run. The parent corrected the one stale comment in `detail-related.tsx` without changing behavior. The independent verifier inspected all ten draft IDs and found none in runtime app/components/lib sources or public registry, with no runtime import of the editorial dataset; focused Vitest 20/20 and full Vitest 193/193 passed. It found four introduced formatting failures, which the parent corrected mechanically. Final parent checks: scoped Prettier passes all 11 changed TS/TSX paths; `pnpm typecheck` passes; `pnpm test` passes 193 tests in 22 files; scoped ESLint has 0 errors and one pre-existing `<img>` warning in `components/casos/grid.tsx:67`; `git diff --check` passes. The route harness does not prove HTTP status or emitted JSON-LD, and no production bundle was built or inspected, so byte-level client distribution remains unverified. Source graph shows no import path from the editorial dataset into public code. The published older Astro site has not changed. The user explicitly authorized one local commit after these checks; no push or deployment was authorized. Next: create the scoped local commit.
