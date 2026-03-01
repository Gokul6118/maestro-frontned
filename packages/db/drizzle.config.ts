import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: "../../.env" });
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("❌ DATABASE_URL is missing.");
}
export default defineConfig({
	schema: "./src/schema.ts",
	out: "./drizzle",

	// ✅ New syntax
	dialect: "postgresql",

	dbCredentials: {
		url: databaseUrl,
	},
});
