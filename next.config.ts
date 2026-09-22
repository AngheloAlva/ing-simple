import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// Disable source maps in production to protect code
	productionBrowserSourceMaps: false,

	// Serve AVIF wherever the browser accepts it, WebP otherwise. These
	// illustrations are high-frequency line art on a transparent ground, which is
	// the content WebP handles worst: measured through this optimizer at 1080px,
	// the four story assets cost 107-125 KB as WebP against 39-47 KB as AVIF. With
	// AVIF on, the illustration swap becomes weight-neutral against the rasters it
	// replaced, and every other image on the site shrinks too. WebP stays as the
	// fallback: it is still far smaller than PNG and every current browser takes it.
	images: {
		formats: ["image/avif", "image/webp"],
	},

	async redirects() {
		return [
			// The service was renamed to match how we actually talk about it, and to
			// match the `desarrollo-web` case category. Kept permanent so any link
			// already pointing at the old slug still lands.
			{
				source: "/servicios/soluciones-web",
				destination: "/servicios/desarrollo-web",
				permanent: true,
			},
		]
	},
}

export default nextConfig
