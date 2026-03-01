import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { default: handler } = await import(
		"../../packages/server/dist/index.js"
	);

	return handler(req, res);
}
