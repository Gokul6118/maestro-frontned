"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function DashboardPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-6 text-center">
				<h1 className="font-bold text-4xl">Work Track</h1>

				<p className="text-gray-500 text-lg">This is a work tracker</p>

				<div className="flex justify-center gap-4 pt-4">
					<Link href="/work">
						<Button>Work</Button>
					</Link>

					<Link href="/dashboard">
						<Button variant="outline">Dashboard</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
