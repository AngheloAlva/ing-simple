/**
 * The still is the cover whenever the sculpture is not on screen: before it
 * finishes its reveal, and under reduced motion, where the sculpture is
 * unmounted even if it had already become ready.
 */
export function isStillVisible({
	sculptReady,
	reducedMotion,
}: {
	sculptReady: boolean
	reducedMotion: boolean
}): boolean {
	return reducedMotion || !sculptReady
}
