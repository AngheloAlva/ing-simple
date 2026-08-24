/* --------------------------------------------------------------------------
 * Shared timing and colour for the home service visuals.
 * ------------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1] as const

export const GREEN = "var(--brand-green)"
export const GREEN_TEXT = "var(--brand-green-text)"

/** Shared by everything that moves together when the data changes. */
export const DATA_TRANSITION = { duration: 0.7, ease: EASE }
