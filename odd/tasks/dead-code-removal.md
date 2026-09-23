# Dead code removal: five orphaned components and the second duotone

## Goal

Remove the component files in `components/` that no module references, and reduce
`components/duotone.tsx` to the one export that is actually live, so the repository
stops carrying unreachable code and stops violating its own colour contract in a
file nobody reads.

## Context

This started as a narrow question: the illustration-layer work recorded that
`DuotoneOverlay` and `DUOTONE_BASE` are reached only from
`components/coverage-grid.tsx`, which has zero consumers, and that the two duotone
implementations had silently diverged. Deciding to delete or keep that pair turned
up a wider pattern.

**A section is deleted from `app/page.tsx` and its component stays behind.** That
has happened at least twice:

- `cbc46bf` (`refactor: drop unused pricing, testimonials and features sections`)
  removed three home sections. Their components were left, and so was
  `ascii-portrait.tsx`, which only Testimonials rendered.
- `0a78947` (`feat: rebuild the home services section as a scroll stack`) removed
  `import { CoverageGrid }` and `<CoverageGrid />` from `app/page.tsx` and replaced
  that section with `scroll-stack.tsx` — while also modifying `coverage-grid.tsx`
  in the same commit, touching a component it was orphaning.

**Nothing in the toolchain notices.** An unreferenced module is invisible to
`tsc --noEmit` and to `vitest`, so both pass green with a thousand lines of
unreachable code in the tree. The same blind spot shows up in the documentation:
the README's "Page Sections" table describes a landing page that no longer exists
(see "Documentation debt found, not fixed" below).

## The verified dead list

Five files, **1,039 lines**, with zero references in any import form and no test
touching them:

| File | Lines | Died with |
| --- | --- | --- |
| `components/center-flow.tsx` | 489 | the process section rebuild, Aug 2026 |
| `components/coverage-grid.tsx` | 232 | `0a78947` |
| `components/ascii-portrait.tsx` | 204 | `cbc46bf` |
| `components/icons/animated/animated-x.tsx` | 98 | never registered |
| `components/icons/typescript.tsx` | 16 | never registered |

Plus, inside a live file:

- `components/duotone.tsx` — `DUOTONE_BASE` and `DuotoneOverlay` are dead;
  `DUOTONE_CONTAINER` is live because `illustration-plate.tsx` imports it.

## How the list was produced, and the two ways it went wrong first

The census has to search **every import form**, and this is not a detail — two
earlier attempts produced different, wrong lists:

1. **A pattern that assumed flat imports** marked the entire repository dead,
   including `illustration-plate.tsx` and `nav.tsx`. Components here live in
   subdirectories, so the specifier is `@/components/servicios/problem`, not
   `@/components/problem`. A control (`nav` must resolve to 9 consumers) is what
   exposed it.
2. **A pattern that only matched `from "..."`** reported
   `components/react-bits/pixel-sculpt.tsx` (943 lines) as dead, and it is not:
   `components/guias/cover-relief.tsx` loads it with
   `dynamic(() => import("@/components/react-bits/pixel-sculpt"))`. It also
   matched the word "typescript-config" inside a Spanish string as if it were an
   import, and flagged every `*.test.*` file, which nothing imports because
   `vitest` discovers them.

The working form is a quoted specifier whose last path segment is the file's
basename, counting both `from "…/name"` and `import("…/name")`, excluding the
file itself, and excluding `*.test.*` from the candidate list while still counting
test files as consumers:

```sh
for f in $(find components -name '*.tsx' -o -name '*.ts' | sed 's|^\./||' | sort); do
  case "$f" in *.test.*|*.spec.*) continue;; esac
  base=$(basename "$f"); base=${base%.tsx}; base=${base%.ts}
  n=$(rg -l "[\"'][^\"']*/$base[\"']" app components lib 2>/dev/null \
      | grep -v "^$f$" | wc -l | tr -d ' ')
  [ "$n" = "0" ] && echo "${f#components/}  $(wc -l < "$f" | tr -d ' ')"
done
```

Before deleting anything, re-run this and confirm each of the five still reports
zero. Nothing prevents a consumer appearing between the census and the deletion.

## Scope

- Delete the five files listed above.
- Reduce `components/duotone.tsx` to `DUOTONE_CONTAINER` alone.
- Move the `useTransform` lesson out of the doomed file before it is lost (below).
- Correct the README references that point at what is being deleted.

## Non-goals

- **No dead-code check in the toolchain.** Considered and declined for now: the
  user chose to record the cause rather than add `knip` or a custom script. The
  consequence is explicit — the next deleted section will orphan its component the
  same way.
- **No rewrite of the README's "Page Sections" table.** It is wrong in far more
  rows than this change touches, and fixing it is a documentation task with its
  own review, not part of a code deletion. See the debt section below.
- **No touching of `react-bits/pixel-sculpt.tsx`, `ascii-waves.tsx`,
  `react-bits/ascii-ripple.tsx` or `case-study/visuals/*`.** All were suspected
  at some point during the census and all are live.

## The knowledge that would be lost

`components/coverage-grid.tsx:153` carries a comment worth keeping: the
keyframe-array form of `useTransform` does not hold its end value once a scroll pin
completes, which made that panel snap to invisible in a single scroll step, and the
callback form does hold it. Live code still uses the keyframe-array form in
`components/case-study/detail-timeline.tsx` and
`components/diagrams/process/rollout-gantt.tsx`, so the lesson is still pertinent
and moves to `DESIGN.md` §7 (Motion).

`ramp()` in the same file is a three-line clamped interpolation and is not worth
preserving.

## Why the duotone pair must go, beyond being dead

It is a **diverged duplicate of a live effect**. `DuotoneOverlay` puts `opacity-25`
on its white layer where the plate uses `opacity-15`, and it carries an extra blue
screen layer in dark mode that the plate does not have. Two versions of one effect,
and nobody noticed, because one of them stopped being rendered.

It also hardcodes `#3b76ff`, `#9bc0ff`, `#1466ff` and `#0a235c`. Those are exactly
the violation `globals.css:119` forbids ("never a hard-coded blue") and that the
accent fix removed from the live path. Deleting the pair closes the last remaining
instance of that violation, with no user-facing change.

`DUOTONE_CONTAINER` stays, and its hexes (`#e6eeff`, `#05122e`) appear nowhere else
in the repository, so it is the single source for the ground and must survive.

## Documentation debt found, not fixed

The README's "Page Sections" table lists 14 sections for the landing page. Eight of
those rows name component files that no longer exist, and five sections that the
home actually renders are absent from the table.

Rows pointing at nonexistent files: `window-mockup.tsx`, `features.tsx`,
`value-prop.tsx`, `curtain-image.tsx`, `testimonials.tsx`, `stats.tsx`,
`case-study.tsx` (the real one is `case-study-feature.tsx`), `pricing.tsx`.

Sections on the home that the table omits: `HeroShowcase`, `Challenge`,
`ServicesStack`, `HowItWorks`, `case-study-feature`.

The "Signature Components" list is stale in the same way, and its project-structure
tree lists a `public/grid/` directory that does not exist.

## Tasks

- [ ] Re-run the census and confirm the five files still report zero consumers.
- [ ] Move the `useTransform` lesson into `DESIGN.md` §7.
- [ ] Reduce `components/duotone.tsx` to `DUOTONE_CONTAINER`.
- [ ] Delete the five orphaned files.
- [ ] Correct the README references to the deleted files and to `duotone.tsx`.
- [ ] Record this finding, the cause, and the declined prevention in the Engram
      mirror.
- [ ] Verify: typecheck, scoped lint, full tests, build, and the four service
      routes still carrying their plate.

## Risks

- **Deleting something live.** Mitigated by the pre-deletion census, and caught
  anyway by typecheck and build: a deleted module with a live consumer is a
  compile error, not a silent break.
- **Silent breakage by string reference.** A component reached through a string key
  or a registry map would not fail to compile. Checked explicitly: the tech icons
  and animated icons are imported by explicit path in
  `components/case-study/tech-icon.tsx` and friends, with no barrel or name map, so
  the two orphaned icons are genuinely unregistered rather than unreferenced by
  accident.
- **Losing the motion lesson.** Mitigated by moving it before the file is deleted.
