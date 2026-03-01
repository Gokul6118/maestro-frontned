import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { account, getDb, session, user } from "./../db/src/index.js";

const db = getDb();

const AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const APP_URL = process.env.APP_URL;

if (!AUTH_SECRET) {
	throw new Error("❌ BETTER_AUTH_SECRET is missing.");
}

if (!APP_URL) {
	throw new Error("❌ APP_URL is missing.");
}

export const auth = betterAuth({
	plugins: [expo()],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			account,
		},
	}),

	trustedOrigins: [
		"http://localhost:3000",
		"http://localhost:3001",
		"http://192.168.1.18:3000",
		"https://maestro-done-baclend-web.vercel.app",
		"https://maestro-frontned-web.vercel.app", // ✅ IMPORTANT
		"coolapp://",
		"exp://",
	],

	secret: AUTH_SECRET,
	baseURL: APP_URL, // must be backend url + /api

	emailAndPassword: {
		enabled: true,
	},

	advanced: {
		crossOriginCookies: true,
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
			partitioned: true, // 🔥 THIS IS MISSING
		},
	},
});
