import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen w-screen">
			{/* Sidebar */}
			<aside className="w-[200px] min-w-[200px] max-w-[200px] border-r bg-white">
				<AppSidebar />
			</aside>

			{/* Main Content */}
			<main className="min-w-0 flex-1 overflow-auto bg-gray-50 p-4">
				{children}
			</main>
		</div>
	);
}
