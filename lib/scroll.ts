/**
 * Whether a route change has to be put back at the top of the new page.
 *
 * Lenis writes its own animated position to the document every frame, and while
 * it is still animating it ignores the native scroll events it would otherwise
 * use to notice that something else moved the page (see `onNativeScroll` in
 * lenis: the sync only happens while `isScrolling` is `false` or `"native"`).
 * Next resets the scroll for a new route, Lenis undoes it on its next frame and
 * then finishes animating to the position it was already heading for — so the
 * visitor lands part-way down a page they have never scrolled. Measured on
 * `/casos` scrolled to 1800px: six runs out of six landed at 1806px.
 *
 * Three cases are not a new route and must be left alone.
 *
 * - The pathname did not actually change. This also makes the check safe under
 *   Strict Mode, which re-runs effects, and on a reload, where the browser is
 *   restoring a position on purpose.
 * - The destination carries a hash. The point of `/servicios/x#incluye` is that
 *   section, not the top of the page.
 * - Back or forward. Returning to the position the visitor left is the whole
 *   reason those exist.
 *
 * Exported on its own because the decision is what can be asserted in a test;
 * the browser behaviour it encodes cannot be, from a node test environment.
 */
export function shouldResetScroll(options: {
	pathnameChanged: boolean
	isTraversal: boolean
	hash: string
}): boolean {
	if (!options.pathnameChanged) return false
	if (options.hash !== "") return false
	if (options.isTraversal) return false
	return true
}
