/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	transpilePackages: [
		"expo-modules-core",
		"expo-secure-store",
		"expo",
		"react-native",
		"@repo/schemas",
		"@repo/store",
		"@workspace/ui",
	],

	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL ||
			"https://maestro-done-baclend-web.vercel.app/api/auth",
	},
};

export default nextConfig;
