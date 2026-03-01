import createClient from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";

import type { paths } from "./api-types";

const client = createClient<paths>({
	baseUrl: "https://maestro-done-server.vercel.app",
	credentials: "include",
});

export const todoApi = createReactQueryClient(client);
