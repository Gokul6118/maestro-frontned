/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	transpilePackages: [
		"@workspace/ui",
		"@repo/schemas",
		"@repo/store",
		"expo",
		"expo-modules-core",
		"expo-secure-store",
		"react-native",
	],
};

export default nextConfig;
