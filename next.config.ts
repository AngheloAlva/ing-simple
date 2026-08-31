import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// Disable source maps in production to protect code
	productionBrowserSourceMaps: false,

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
