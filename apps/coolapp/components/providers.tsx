"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = React.useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				disableTransitionOnChange
				enableColorScheme
				enableSystem
			>
				<SidebarProvider>{children}</SidebarProvider>
			</NextThemesProvider>
		</QueryClientProvider>
	);
}
