/**
 * Every animated icon in this folder exposes the same imperative handle, so
 * a parent that owns the hover surface can drive the icon inside it. The
 * pointer usually never touches the icon itself — it touches the button,
 * link or row that contains it.
 */
export type AnimatedIconHandle = {
	startAnimation: () => void
	stopAnimation: () => void
}
