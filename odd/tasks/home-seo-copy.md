# Clarify home-page SEO copy

## Objective

Make the home H1 describe the three prioritized services and replace unsupported generalizations and delivery-time ranges in the FAQ with accurate service scope and the client's collaborative delivery process. Preserve the existing visual system and the fourth service (training) in the supporting copy and service section. This is an intent-led copy change, not a claim about search volume or ranking.

## Authority and scope

The user selected “Aplicar primero los textos de inicio” and chose a three-service H1: “Power BI, automatización y desarrollo web para empresas en Chile”. The user said exact implementation times are not validated; the team builds reports and websites with clients, shows work from the beginning through completion and invites participation, so early visible progress must not be confused with a promised completion date. Earlier constraints: do not invent performance, traffic, clients, metrics or testimonials; defer hero visuals; do not push or deploy without explicit authorization. Work on `feat/home-seo-copy` from clean `main` at `098f7bc`. Do not touch other pages or published case data.

Allowed edit surfaces: `components/hero.tsx` (H1 only, supporting copy only if it improves clarity without duplicating the H1), `lib/home-faq.ts` (the company-fit and implementation-time answers only; adjust the associated question only if needed), `app/page.tsx` (home metadata only), `lib/seo/sitemap.ts` (manual content date per project convention), and narrow home/metadata/FAQ regression tests only if useful. Read `components/faq.tsx` and `lib/seo/json-ld.ts` without changing them: `HOME_FAQ` feeds both visible accordion and FAQPage JSON-LD.

## Work routing and checks

One bounded worker owns nontrivial multi-file source changes. The parent owns scope, artifact mirror, readback, risk assessment and independent verification as required by the native assessment plan. Strict TDD is not enabled; use ordinary focused tests and `pnpm test`, `pnpm typecheck`, scoped ESLint/Prettier, and `git diff --check`. Avoid builds or dev-server operations that disturb `.next/dev`. The SEO document says to bump `CONTENT_UPDATED_AT` after home copy changes; this is a coarse global sitemap date and must not be presented as per-page change evidence. The user separately authorized one local commit after verification; no push or deployment is authorized for this task.

## Work unit HOME-01

- [x] Set the exact user-selected three-service H1 and retain training in supporting text. Responsive classes are unchanged; narrow-screen rendering remains visually unverified.
- [x] Align home title/description to the same scope without fabricated claims or needless repetition.
- [x] Replace “all sizes/any industry” generalization and unvalidated implementation-time numbers with specific services and the user-confirmed collaborative, early-progress process. Preserve the separately documented contact-response promise and other FAQ answers.
- [x] Keep FAQ visible content and JSON-LD sourced from one `HOME_FAQ`; update the documented sitemap content date.
- [x] Verify focused behavior, full suite, typecheck, scoped lint/format and diff; parent and independent verifier read every changed phrase against source evidence, with mobile rendering explicitly unverified.
- [x] Ask for explicit commit permission before creating a local commit; the user authorized one local commit, not push/deployment.

## Acceptance and rollback

One descriptive home H1 prioritizes Power BI, automation and web development for companies in Chile; training remains discoverable in supporting copy/services. FAQ no longer promises fixed 1–2 week, 4–6 week or 1–3 month delivery times, but clearly says the client sees and participates in work from early stages. Home metadata and FAQ JSON-LD remain consistent with visible text. Only listed paths change; revert this work unit by restoring its scoped files if requested.

## Progress

- 2026-09-24: mapped home source and content conventions read-only; created branch and mirrored/read back this task document before source edits. The writer changed `components/hero.tsx`, `lib/home-faq.ts`, `app/page.tsx` and `lib/seo/sitemap.ts`. A first independent verifier rejected an unsupported formal-calendar claim and a dense supporting paragraph; a bounded correction removed the calendar sentence but the writer failed after leaving edits, so the parent verified manually and made only formatting and a final shorter paragraph edit. Final parent checks: `pnpm test` 193/193, `pnpm typecheck`, scoped ESLint/Prettier and `git diff --check` pass. Native read-only assessment is unassessable while the task document is untracked, so a final independent verifier is required. No suitable local dev server exists (ports 3000/3001 are unrelated projects); no mobile visual check, build, commit, push or deployment. The shared sitemap date now stamps other static/service routes too; do not interpret it as proof those pages changed. The final independent verifier returned PASS at source level: the hero supporting text is 21 words, equal to the old paragraph, with the chosen H1 unchanged; no formal calendar or numbered delivery promise remains. It independently passed focused Vitest 34/34, scoped ESLint/Prettier and `git diff --check`. Parent's final full suite and typecheck passed as recorded above. Mobile rendering remains unverified without starting a server; the global sitemap date is not per-page evidence. No push or deployment. The user reviewed the exact copy summary and explicitly authorized one local commit. Next: create that scoped commit.
