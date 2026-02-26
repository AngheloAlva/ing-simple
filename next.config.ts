import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	productionBrowserSourceMaps: false,
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.dribbble.com",
			},
		],
	},
}

export default nextConfig
