/** The site-wide highlight gradient. Keep every highlighted phrase on this
 * exact ramp so the treatment reads as one signature, not per-section decor.
 *
 * Lives here, not in gradient-text.tsx: that file is `"use client"`, and a value
 * exported from a client module becomes a client reference that a Server
 * Component (challenge.tsx) cannot read to pass as a prop.
 */
export const brandGradient = ["var(--color-blue-400)", "var(--brand-blue)"]

/** Green variant, for the outcomes/case-study section. Deliberate trade-off:
 * on a light surface these stops are 1.8:1 and 2.6:1, so the phrase fails WCAG
 * even for large text. Chosen for brand identity; swap the first stop for
 * `--brand-green-text` (5.2:1) if legibility wins. Dark mode is fine (11.2 / 7.6). */
export const brandGradientGreen = ["var(--brand-green)", "var(--color-green-600)"]
