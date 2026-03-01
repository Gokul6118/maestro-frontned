"use client";

import type { Todo } from "@repo/schemas";
import {
	SidebarInset,
	SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { useRouter } from "next/navigation";
import type React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { todoApi } from "../../lib/api-client";
/* ================= TYPES ================= */

/* ================= PAGE ================= */

export default function Page() {
	const _router = useRouter();

	const { data, isLoading, error } = todoApi.useQuery("get", "/api");

	const todos = (data ?? []) as Todo[];

	if (isLoading) {
		return <div className="p-6 text-center">Loading dashboard...</div>;
	}

	/* ================= ERROR ================= */

	if (error) {
		const err = error as Error;

		return (
			<div className="p-6 text-red-600">
				{err.message || "Failed to load dashboard"}
			</div>
		);
	}

	/* ================= TABLE DATA ================= */

	const tableData = todos.map((t) => ({
		id: t.id,
		header: t.text,
		description: t.description ?? "No description",
		type: "Task",
		status: t.status,
		target: t.startAt ? new Date(t.startAt).toLocaleDateString() : "-",
		limit: t.endAt ? new Date(t.endAt).toLocaleDateString() : "-",
	}));

	/* ================= UI ================= */

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<SidebarInset>
				{/* Header */}
				<SiteHeader />

				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							{/* Cards */}
							<SectionCards todos={todos} />

							{/* Chart */}
							<div className="px-4 lg:px-6">
								<ChartAreaInteractive todos={todos} />
							</div>

							{/* Table */}
							<DataTable data={tableData} />
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
