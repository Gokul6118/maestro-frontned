import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
	baseURL: "https://maestro-done-baclend-web.vercel.app/api/auth",
	credentials: "include",
});
