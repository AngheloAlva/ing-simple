/**
 * Whether `href` points deeper into this site.
 *
 * `CutButton` and the nav rows pick between `next/link` and a plain `<a>` with
 * this. The difference is not cosmetic: a plain anchor triggers a full document
 * load, and a view transition only runs on a client-side navigation, so routing
 * an internal destination through an anchor silently removes its animation.
 *
 * A single leading `/` is the entire test. `//cdn.example.com/x` is a
 * protocol-relative absolute URL rather than a path, and `#servicios`, `mailto:`
 * and `tel:` are navigation the browser already handles on its own, so all of
 * them stay anchors.
 */
export function isInternalHref(href: string): boolean {
	return href.startsWith("/") && !href.startsWith("//")
}
