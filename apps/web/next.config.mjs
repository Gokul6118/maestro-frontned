/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	// ✅ Add your workspace packages here
	transpilePackages: [
		"expo-modules-core",
		"expo-secure-store",
		"expo",
		"react-native",

		// 🔥 ADD THESE
		"@repo/schemas",
		"@repo/store",
		"@workspace/ui",
	],

	async rewrites() {
		const apiUrl = process.env.API_URL || "http://localhost:3000";
		return {
			beforeFiles: [
				{
					source: "/api/:path*",
					destination: `${apiUrl}/api/:path*`,
				},
			],
		};
	},

	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/auth",
	},
};

export default nextConfig;
